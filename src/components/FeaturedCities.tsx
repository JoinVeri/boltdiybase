import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BusinessCount from './BusinessCount';
import type { City } from '../types/database';

interface CityWithStats extends City {
  business_count: number;
  avg_rating: number | null;
}

const FeaturedCities = () => {
  const [cities, setCities] = useState<CityWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCities = async () => {
      // First get cities, ordered by ranking (nulls last)
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('ranking', { ascending: true, nullsLast: true })
        .order('population', { ascending: false })
        .limit(15);

      if (citiesError) {
        console.error('Error fetching cities:', citiesError);
        return;
      }

      // Then get business stats for each city
      const citiesWithStats = await Promise.all(
        citiesData.map(async (city) => {
          // Get businesses in this city
          const { data: businesses, error: businessError } = await supabase
            .from('businesses')
            .select('id, rating')
            .eq('city', city.name)
            .eq('state', city.state);

          if (businessError) {
            console.error('Error fetching businesses:', businessError);
            return {
              ...city,
              business_count: 0,
              avg_rating: null
            };
          }

          // Calculate stats
          const businessCount = businesses?.length || 0;
          const avgRating = businesses?.length 
            ? businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
            : null;

          return {
            ...city,
            business_count: businessCount,
            avg_rating: avgRating
          };
        })
      );

      setCities(citiesWithStats);
      setLoading(false);
    };

    fetchFeaturedCities();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-14">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Cities</h2>
          <p className="mt-2 text-gray-600">Discover the best businesses in top US cities</p>
        </div>
        <Link 
          to="/cities" 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <span>View all cities</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Link
            key={city.id}
            to={`/city/${city.id}`}
            className="group relative h-64 overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={city.image_url || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600'}
              alt={`${city.name}, ${city.state}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                  {city.name}
                  <span className="block text-sm font-normal mt-1 text-gray-300">
                    {city.state}
                  </span>
                </h3>

                {city.avg_rating && (
                  <div className="flex items-center space-x-1 bg-green-500/20 backdrop-blur-sm text-green-400 px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">{city.avg_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{city.population?.toLocaleString() || 'N/A'} people</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Building2 className="h-4 w-4" />
                  <span><BusinessCount cityId={city.id} /> businesses</span>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCities;