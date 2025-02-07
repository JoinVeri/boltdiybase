import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second
const MAX_DELAY = 10000; // 10 seconds
const TIMEOUT = 10000; // 10 seconds

// Check if we're offline
const isOffline = () => !navigator.onLine;

// Add network status event listeners
window.addEventListener('online', () => {
  console.log('Network connection restored');
  window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { online: true } }));
});

window.addEventListener('offline', () => {
  console.log('Network connection lost');
  window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { online: false } }));
});

// Custom fetch with timeout
const fetchWithTimeout = async (resource: RequestInfo, options: RequestInit = {}, timeout = TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Exponential backoff with jitter
const getBackoffDelay = (retryCount: number) => {
  const delay = Math.min(
    BASE_DELAY * Math.pow(2, retryCount) * (1 + Math.random() * 0.1),
    MAX_DELAY
  );
  return delay;
};

const retryWithBackoff = async (fn: () => Promise<any>, retries = 0): Promise<any> => {
  try {
    // Check network status first
    if (isOffline()) {
      throw new Error('No internet connection');
    }
    
    return await fn();
  } catch (error) {
    // Don't retry on certain errors
    if (
      error instanceof Error && (
        // Don't retry on auth errors
        error.message.includes('401') ||
        error.message.includes('403') ||
        // Don't retry on not found
        error.message.includes('404') ||
        // Don't retry on validation errors
        error.message.includes('422')
      )
    ) {
      throw error;
    }

    if (retries >= MAX_RETRIES) {
      throw error;
    }
    
    const delay = getBackoffDelay(retries);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Check if we're back online before retrying
    if (isOffline()) {
      throw new Error('No internet connection');
    }
    
    return retryWithBackoff(fn, retries + 1);
  }
};

// Create Supabase client with enhanced error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: localStorage,
    storageKey: 'verilocal-auth',
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    onAuthStateChange: (event, session) => {
      try {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // Clear auth-specific storage
          const authKeys = [
            'verilocal-auth',
            'supabase.auth.token',
            'supabase.auth.expires_at',
            'supabase.auth.refresh_token'
          ];
          
          authKeys.forEach(key => {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.warn(`Failed to remove ${key}:`, e);
            }
          });

          // Use replaceState to avoid network requests
          window.history.replaceState({}, '', '/');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during auth state change:', error);
      }
    }
  },
  global: {
    fetch: async (...args) => {
      return retryWithBackoff(async () => {
        try {
          const response = await fetchWithTimeout(args[0], args[1]);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response;
        } catch (err) {
          if (err.name === 'AbortError') {
            throw new Error('Request timeout');
          }
          // Only log network errors if we're not signing out
          if (!window.location.pathname.includes('signout')) {
            console.error('Supabase fetch error:', {
              message: err instanceof Error ? err.message : 'Unknown error',
              url: args[0],
              stack: err instanceof Error ? err.stack : undefined
            });
          }
          throw err;
        }
      });
    },
    headers: {
      'x-client-info': 'verilocal-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Export a function to check connection status
export const checkConnection = () => ({
  isOnline: navigator.onLine,
  hasInternet: async () => {
    try {
      await fetch(supabaseUrl, { method: 'HEAD' });
      return true;
    } catch {
      return false;
    }
  }
});