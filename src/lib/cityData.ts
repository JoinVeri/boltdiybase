import { supabase } from './supabase';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function getCityData(cityName: string, stateName: string) {
  try {
    // Format the search query
    const searchQuery = `${cityName}, ${stateName}, USA`;
    const encodedQuery = encodeURIComponent(searchQuery);

    // Get coordinates from Nominatim
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&addressdetails=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'VeriLocal/1.0'
        }
      }
    );

    if (!nominatimRes.ok) {
      throw new Error('Failed to fetch city data');
    }

    const nominatimData: NominatimResponse[] = await nominatimRes.json();
    
    if (!nominatimData.length) {
      throw new Error('City not found');
    }

    const { lat, lon: lng } = nominatimData[0];

    // Get timezone based on coordinates
    const tzRes = await fetch(
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`
    );

    const tzData = await tzRes.json();
    const timezone = tzData.timeZone || 'America/New_York';

    // Get a random but relevant Unsplash image
    const unsplashRes = await fetch(
      `https://api.unsplash.com/photos/random?query=${cityName}+city+downtown&orientation=landscape`,
      {
        headers: {
          'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY'
        }
      }
    );

    let imageUrl = '';
    if (unsplashRes.ok) {
      const imageData = await unsplashRes.json();
      imageUrl = `${imageData.urls.raw}&auto=format&fit=crop&w=1600`;
    }

    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      timezone,
      image_url: imageUrl
    };
  } catch (error) {
    console.error('Error fetching city data:', error);
    throw error;
  }
}