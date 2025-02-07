import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Users, Calendar, Building2, MapPin, Search, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/database';
import SEO from './SEO';
import BackButton from './BackButton';

const CATEGORY_META: Record<string, {
  title: string;
  description: string;
  image: string;
  subcategories: string[];
}> = {
  'cleaning': {
    title: 'Cleaning Services',
    description: 'Professional cleaning services for homes and businesses',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600',
    subcategories: ['House Cleaning', 'Commercial Cleaning', 'Carpet Cleaning', 'Window Cleaning']
  },
  'plumbing': {
    title: 'Plumbing Services',
    description: 'Expert plumbing solutions for all your needs',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1600',
    subcategories: ['Repairs', 'Installation', 'Emergency Services', 'Maintenance']
  },
  'electrical': {
    title: 'Electrical Services',
    description: 'Licensed electricians for residential and commercial projects',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1600',
    subcategories: ['Wiring', 'Repairs', 'Installation', 'Maintenance']
  },
  'landscaping': {
    title: 'Landscaping Services',
    description: 'Transform your outdoor space with professional landscaping',
    image: 'https://images.unsplash.com/photo-1600698279077-3cfa604d740f?auto=format&fit=crop&w=1600',
    subcategories: ['Lawn Care', 'Garden Design', 'Tree Service', 'Hardscaping']
  },
  'hvac': {
    title: 'HVAC Services',
    description: 'Heating, ventilation, and air conditioning solutions',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1600',
    subcategories: ['Installation', 'Repairs', 'Maintenance', 'Emergency Service']
  },
  'fitness': {
    title: 'Fitness Services',
    description: 'Professional fitness training and wellness programs',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600',
    subcategories: ['Personal Training', 'Group Classes', 'Yoga', 'Nutrition']
  },
  'tech-repair': {
    title: 'Tech Repair Services',
    description: 'Expert repair services for all your devices',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1600',
    subcategories: ['Phone Repair', 'Computer Repair', 'Tablet Repair', 'Console Repair']
  },
  'pet-services': {
    title: 'Pet Services',
    description: 'Professional care services for your beloved pets',
    image: 'https://images.unsplash.com/photo-1516734212186-65266f46771f?auto=format&fit=crop&w=1600',
    subcategories: ['Grooming', 'Training', 'Pet Sitting', 'Veterinary']
  },
  'home-improvement': {
    title: 'Home Improvement',
    description: 'Professional home renovation and improvement services',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600',
    subcategories: ['Remodeling', 'Painting', 'Flooring', 'Carpentry']
  },
  'auto-services': {
    title: 'Auto Services',
    description: 'Professional automotive repair and maintenance',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1600',
    subcategories: ['Repairs', 'Maintenance', 'Detailing', 'Towing']
  },
  'beauty-services': {
    title: 'Beauty Services',
    description: 'Professional beauty and personal care services',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600',
    subcategories: ['Hair Styling', 'Nail Care', 'Skincare', 'Makeup']
  },
  'professional-services': {
    title: 'Professional Services',
    description: 'Expert business and professional services',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600',
    subcategories: ['Legal', 'Accounting', 'Consulting', 'Marketing']
  },
  'moving-services': {
    title: 'Moving Services',
    description: 'Professional moving and relocation services',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600',
    subcategories: ['Local Moving', 'Long Distance', 'Packing', 'Storage']
  },
  'photography': {
    title: 'Photography Services',
    description: 'Professional photography and videography services',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1600',
    subcategories: ['Events', 'Portraits', 'Commercial', 'Wedding']
  },
  'catering': {
    title: 'Catering Services',
    description: 'Professional food and beverage catering services',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600',
    subcategories: ['Events', 'Corporate', 'Wedding', 'Private Parties']
  },
  'interior-design': {
    title: 'Interior Design',
    description: 'Professional interior design and decoration services',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600',
    subcategories: ['Residential', 'Commercial', 'Staging', 'Consulting']
  },
  'accounting': {
    title: 'Accounting Services',
    description: 'Professional accounting and financial services for businesses and individuals',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600',
    subcategories: [
      'Tax Preparation',
      'Bookkeeping',
      'Financial Planning',
      'Business Accounting',
      'Payroll Services',
      'Audit Services'
    ]
  },
  'spa': {
    title: 'Spa Services',
    description: 'Luxurious spa treatments and relaxation services for your wellbeing',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600',
    subcategories: [
      'Massage Therapy',
      'Facials',
      'Body Treatments',
      'Aromatherapy',
      'Hot Stone Therapy',
      'Couples Treatments'
    ]
  },
  'salon': {
    title: 'Salon Services',
    description: 'Professional hair, nail, and beauty services by expert stylists',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600',
    subcategories: [
      'Hair Styling',
      'Hair Coloring',
      'Nail Care',
      'Waxing',
      'Makeup Services',
      'Hair Extensions'
    ]
  },
  'wellness': {
    title: 'Wellness Services',
    description: 'Holistic wellness services for mind, body, and spirit',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600',
    subcategories: [
      'Meditation',
      'Yoga',
      'Nutrition Counseling',
      'Acupuncture',
      'Holistic Healing',
      'Wellness Coaching'
    ]
  },
  'therapy': {
    title: 'Therapy Services',
    description: 'Professional therapeutic services for physical and mental wellbeing',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600',
    subcategories: [
      'Physical Therapy',
      'Occupational Therapy',
      'Speech Therapy',
      'Mental Health Counseling',
      'Family Therapy',
      'Art Therapy'
    ]
  },
  'auto-repair': {
    title: 'Auto Repair Services',
    description: 'Professional automotive repair services from certified mechanics',
    image: 'https://images.unsplash.com/photo-1632823471406-4477499ae0e0?auto=format&fit=crop&w=1600',
    subcategories: [
      'Engine Repair',
      'Transmission Service',
      'Brake Service',
      'Electrical Systems',
      'Suspension & Steering',
      'AC & Heating Repair'
    ]
  },
  'auto-maintenance': {
    title: 'Auto Maintenance Services',
    description: 'Regular maintenance services to keep your vehicle running smoothly',
    image: 'https://images.unsplash.com/photo-1507977800156-054b4f0c37c6?auto=format&fit=crop&w=1600',
    subcategories: [
      'Oil Changes',
      'Tune-Ups',
      'Filter Replacement',
      'Fluid Services',
      'Tire Rotation',
      'Battery Service'
    ]
  },
  'auto-detailing': {
    title: 'Auto Detailing Services',
    description: 'Professional car detailing services for interior and exterior perfection',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600',
    subcategories: [
      'Interior Detailing',
      'Exterior Detailing',
      'Paint Correction',
      'Ceramic Coating',
      'Paint Protection Film',
      'Upholstery Cleaning'
    ]
  },
  'towing': {
    title: 'Towing Services',
    description: '24/7 professional towing and roadside assistance services',
    image: 'https://images.unsplash.com/photo-1562920618-5e6f0ae41d5d?auto=format&fit=crop&w=1600',
    subcategories: [
      'Emergency Towing',
      'Flatbed Towing',
      'Long Distance Towing',
      'Motorcycle Towing',
      'Heavy Duty Towing',
      'Roadside Assistance'
    ]
  },
  'tire-service': {
    title: 'Tire Services',
    description: 'Complete tire sales, installation, and repair services',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600',
    subcategories: [
      'Tire Sales',
      'Tire Installation',
      'Tire Repair',
      'Wheel Balancing',
      'Wheel Alignment',
      'TPMS Service'
    ]
  }
};

const ServiceCategoryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const categoryKey = slug?.toLowerCase().replace(/\s+/g, '-');
  const category = categoryKey ? CATEGORY_META[categoryKey] : null;

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
      <div className="container mx-auto px-4 py-4">
        <BackButton />
      </div>

      <SEO 
        title={category.title}
        description={category.description}
        type="website"
        image={category.image}
      />

      <div className="relative h-96">
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">{category.title}</h1>
          <p className="text-xl text-gray-200 max-w-2xl">{category.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
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

export default ServiceCategoryDetail;