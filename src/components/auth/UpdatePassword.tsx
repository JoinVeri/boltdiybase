import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      try {
        // Get query parameters from the URL fragment
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token'); // ✅ Get refresh token

        console.log('Recovery type:', type);
        console.log('Access token exists:', !!accessToken);
        console.log('Refresh token exists:', !!refreshToken);

        if (type !== 'recovery' || !accessToken || !refreshToken) {
          console.log('Invalid recovery parameters');
          navigate('/signin');
          return;
        }

        // ✅ Set session using access and refresh tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        console.log('Session established successfully.');
      } catch (err) {
        console.error('Recovery setup error:', err);
        setError('Unable to process recovery token. Please try resetting your password again.');
        navigate('/forgot-password');
      }
    };

    handlePasswordRecovery();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate password match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Updating password...');

      // ✅ Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        throw updateError;
      }

      console.log('Password updated successfully!');

      // ✅ Get the current user session
      const { data: { session } } = await supabase.auth.getSession();

      // ✅ Redirect user based on their type (business or customer)
      const userType = session?.user?.user_metadata?.user_type;
      const redirectPath = userType === 'business' ? '/dashboard/business' : '/dashboard/customer';

      // ✅ Navigate to the correct dashboard
      navigate(redirectPath);
    } catch (err) {
      console.error('Password update error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating your password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Update Password</h2>
          <p className="text-gray-600">Please enter your new password below.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your new password"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your new password"
              minLength={6}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Key className="h-5 w-5" />
              <span>{loading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;