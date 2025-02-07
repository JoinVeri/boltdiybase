import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Briefcase, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type UserType = 'customer' | 'business';

const SignUp = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
        },
      },
    });

    if (signUpError) {
      // Handle "user already exists" error with a more friendly message
      if (signUpError.message === 'User already registered') {
        setError(
          <span>
            This email is already registered.{' '}
            <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in instead
            </Link>
          </span>
        );
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
    } else {
      // Route based on user type
      if (userType === 'business') {
        navigate('/onboarding/business');
      } else {
        navigate('/signup-success');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('customer')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                userType === 'customer'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <User className="h-8 w-8 mb-2" />
              <span className="font-medium">Customer</span>
              <span className="text-sm text-gray-500">Find local services</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType('business')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                userType === 'business'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <Briefcase className="h-8 w-8 mb-2" />
              <span className="font-medium">Business Owner</span>
              <span className="text-sm text-gray-500">List your services</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-5 w-5" />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;