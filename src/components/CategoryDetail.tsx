import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Users, Calendar, Building2, MapPin, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/database';

// Category metadata with images and descriptions
const CATEGORY_META = {
  'home-services': {
    title: 'Home Services',
    description: 'Find trusted professionals for all your home maintenance and improvement needs',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600',
    subcategories: ['Cleaning', 'Repairs', 'Renovations', 'Landscaping', 'Plumbing', 'Electrical']
  },
  'professional-services': {
    title: 'Professional Services',
    description: 'Connect with expert consultants and service providers for your business needs',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600',
    subcategories: ['Legal', 'Accounting', 'Marketing', 'IT Services', 'Business Consulting', 'Design']
  },
  'health-wellness': {
    title: 'Health & Wellness',
    description: 'Discover local health practitioners and wellness services',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600',
    subcategories: ['Fitness', 'Spa', 'Therapy', 'Nutrition', 'Yoga', 'Alternative Medicine']
  }
};

const CategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const category = slug ? CATEGORY_META[slug as keyof typeof CATEGORY_META] : null;

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!category) return;

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('category', category.title)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching businesses:', error);
      } else {
        setBusinesses(data || []);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, [category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
            <p className="mt-2 text-gray-600">The category you're looking for doesn't exist.</p>
            <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredBusinesses = selectedSubcategory
    ? businesses.filter(b => b.category === selectedSubcategory)
    : businesses;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="relative h-96">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">{category.title}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Subcategories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !selectedSubcategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {category.subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Businesses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
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
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {business.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {business.city}, {business.state}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;