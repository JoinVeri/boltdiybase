import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  Search,
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import BusinessCount from './BusinessCount';
import SEO from './SEO';

interface City {
  id: string;
  name: string;
  state: string;
  population: number | null;
  image_url: string | null;
  ranking: number | null;
}

const Cities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('ranking', { ascending: true, nullsLast: true })
          .order('population', { ascending: false });

        if (error) throw error;
        setCities(data || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Get unique states for filter
  const states = Array.from(new Set(cities.map(city => city.state))).sort();

  // Filter cities based on search and state
  const filteredCities = cities.filter(city => {
    const matchesSearch = 
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = !selectedState || city.state === selectedState;

    return matchesSearch && matchesState;
  });

  // Separate featured and regular cities
  const featuredCities = filteredCities.filter(city => city.ranking !== null);
  const regularCities = filteredCities.filter(city => city.ranking === null);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <SEO 
        title="Local Cities"
        description="Discover and connect with local businesses in cities across the country. Find verified businesses and services in your area."
        type="website"
      />

      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://hiiqznjqvlirpptknglm.supabase.co/storage/v1/object/public/Cities//Detroit-josh-garcia-iqa83PdCO1A-unsplash.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold text-white mb-4">
                Explore Local Business Communities
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Discover trusted businesses and services in cities across the country
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
              </div>

              {/* State Filter */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedState(null)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    !selectedState
                      ? 'bg-white text-blue-600'
                      : 'bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm'
                  }`}
                >
                  All States
                </button>
                {states.map(state => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state === selectedState ? null : state)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedState === state
                        ? 'bg-white text-blue-600'
                        : 'bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Cities */}
        {featuredCities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              Featured Cities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCities.map((city) => (
                <Link
                  key={city.id}
                  to={`/city/${city.id}`}
                  className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src={city.image_url || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600'}
                    alt={`${city.name}, ${city.state}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                        {city.name}
                        <span className="block text-sm font-normal mt-1 text-gray-300">
                          {city.state}
                        </span>
                      </h3>
                    </div>

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
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Cities */}
        <section>
          <h2 className="text-2xl font-bold mb-8">All Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                </div>
              ))
            ) : regularCities.length > 0 ? (
              regularCities.map((city) => (
                <Link
                  key={city.id}
                  to={`/city/${city.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    <img
                      src={city.image_url || 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800'}
                      alt={`${city.name}, ${city.state}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-gray-500">{city.state}</p>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span><BusinessCount cityId={city.id} /> businesses</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <span>View City</span>
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cities;