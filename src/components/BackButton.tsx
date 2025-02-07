import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;