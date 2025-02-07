import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SignUpSuccess = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Account created!</h2>
          <p className="mt-2 text-gray-600">
            Please check your email to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button className="text-blue-600 hover:text-blue-500">
              click here to resend
            </button>
          </p>

          <Link
            to="/signin"
            className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;