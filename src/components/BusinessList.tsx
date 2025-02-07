import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Calendar, 
  Building2, 
  MapPin
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/database';
import SEO from './SEO';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<(Business & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fall back to default location (e.g., New York City)
          setUserLocation({
            lat: 40.7128,
            lng: -74.0060
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setError(null);
        
        // Get all businesses
        const { data, error: fetchError } = await supabase
          .from('businesses')
          .select('*')
          .order('rating', { ascending: false });

        if (fetchError) throw fetchError;

        // Add distance calculation if user location is available
        let businessesWithDistance = data || [];
        if (userLocation && data) {
          const businessPromises = data.map(async (business) => {
            // Get city coordinates from our cities data
            const { data: cityData } = await supabase
              .from('cities')
              .select('latitude, longitude')
              .eq('name', business.city)
              .eq('state', business.state)
              .single();

            if (cityData) {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                cityData.latitude,
                cityData.longitude
              );
              return { ...business, distance };
            }
            return business;
          });

          businessesWithDistance = await Promise.all(businessPromises);

          // Sort by distance
          businessesWithDistance.sort((a, b) => {
            if (a.distance && b.distance) {
              return a.distance - b.distance;
            }
            return 0;
          });
        }

        setBusinesses(businessesWithDistance);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError('Unable to load businesses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [userLocation]);

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO 
        title="Local Businesses"
        description="Discover and connect with trusted local businesses in your area. Browse verified businesses, read reviews, and find the services you need."
        type="website"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white py-16" style={{
        backgroundImage: "url('https://hiiqznjqvlirpptknglm.supabase.co/storage/v1/object/public/Cities//Detroit-josh-garcia-iqa83PdCO1A-unsplash.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Find Local Businesses Near You
            </h1>
            <p className="text-xl text-gray-200">
              Discover and connect with trusted businesses in your area
            </p>
          </div>
        </div>
      </div>

      {/* Business List */}
      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={business.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800'}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{business.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{business.rating.toFixed(1)} ({business.review_count})</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{business.employee_count || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{business.founded_year || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {business.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {business.city}, {business.state}
                        {business.distance && ` • ${Math.round(business.distance)} mi`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessList;