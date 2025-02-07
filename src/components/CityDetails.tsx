import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Building2, TrendingUp, Globe, Users, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business, City } from '../types/database';
import BackButton from './BackButton';

interface CityDetails extends City {
  businesses: Business[];
}

const CityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState<CityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityDetails = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        // First get the city details
        const { data: cityData, error: cityError } = await supabase
          .from('cities')
          .select('*')
          .eq('id', id)
          .single();

        if (cityError) {
          if (cityError.code === 'PGRST116') {
            navigate('/');
            return;
          }
          throw cityError;
        }

        if (!cityData) {
          navigate('/');
          return;
        }

        // Then get all businesses in this city/state
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('city', cityData.name)
          .eq('state', cityData.state)
          .order('rating', { ascending: false });

        if (businessError) {
          throw businessError;
        }

        setCity({
          ...cityData,
          businesses: businessData || []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching city details');
      } finally {
        setLoading(false);
      }
    };

    fetchCityDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">City Not Found</h2>
          <p className="text-yellow-600">The city you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* City Hero Section */}
      <div className="relative h-64 rounded-xl overflow-hidden mb-8">
        <img
          src={city.image_url || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600'}
          alt={`${city.name}, ${city.state}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-4xl font-bold">{city.name}</h1>
            <p className="text-xl text-gray-300 mt-2">{city.state}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{city.population?.toLocaleString() || 'N/A'} people</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{city.businesses.length} businesses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Businesses Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Top Businesses in {city.name}</h2>
        {city.businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {city.businesses.map((business) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group relative h-48 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Business Image/Logo */}
                <img
                  src={business.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600'}
                  alt={business.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                      {business.name}
                      <span className="block text-sm font-normal mt-1 text-gray-300">
                        {business.category}
                      </span>
                    </h3>

                    <div className="flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm text-green-400 px-3 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">{business.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>{business.employee_count || 'N/A'} employees</span>
                    </div>
                    {business.founded_year && (
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>Since {business.founded_year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300"></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Be the first to list your business in {city.name}!</p>
            <Link
              to="/onboarding/business"
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Building2 className="h-5 w-5" />
              <span>Add Your Business</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetails;