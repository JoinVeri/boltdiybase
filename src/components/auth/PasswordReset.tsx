import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use Supabase's default password reset flow
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending reset instructions');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-8">
              We've sent password reset instructions to {email}. Please check your email to continue.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Make sure to check your spam folder if you don't see the email in your inbox.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span>{loading ? 'Sending...' : 'Send Reset Instructions'}</span>
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/signin"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;