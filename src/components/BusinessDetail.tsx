import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Building2, 
  MapPin, 
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
  Image as ImageIcon,
  Globe,
  Phone,
  Mail,
  Star,
  Users,
  Heart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from './SEO';
import BusinessGallery from './BusinessGallery';
import BackButton from './BackButton';

interface Business {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  category: string;
  website: string | null;
  employee_count: number | null;
  founded_year: number | null;
  rating: number;
  review_count: number;
  image_url: string | null;
}

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Business not found');

        setBusiness(data);
      } catch (err) {
        console.error('Error fetching business:', err);
        setError(err instanceof Error ? err.message : 'Failed to load business');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();

    // Check if business is saved
    const checkIfSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !id) return;

      try {
        const { data } = await supabase
          .from('saved_businesses')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('business_id', id);

        setIsSaved(Boolean(data?.length));
      } catch (err) {
        console.error('Error checking saved status:', err);
      }
    };

    checkIfSaved();
  }, [id]);

  const handleSaveToggle = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate('/signin');
      return;
    }

    if (!business) return;

    setSavingState('saving');

    try {
      if (isSaved) {
        await supabase
          .from('saved_businesses')
          .delete()
          .eq('user_id', session.user.id)
          .eq('business_id', business.id);

        setIsSaved(false);
      } else {
        await supabase
          .from('saved_businesses')
          .insert({
            user_id: session.user.id,
            business_id: business.id
          });

        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSavingState('idle');
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = business?.name || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
      default:
        setShowShareMenu(!showShareMenu);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <SEO 
          title="Loading Business"
          description="Loading business details..."
        />
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <SEO 
          title="Business Not Found"
          description="The business you're looking for doesn't exist or has been removed."
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
        <p className="text-gray-600 mb-8">The business you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/businesses"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Browse Businesses</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-4">
        <BackButton />
      </div>

      <SEO 
        title={business.name}
        description={business.description || `${business.name} in ${business.city}, ${business.state}`}
        type="business"
        image={business.image_url || undefined}
        business={{
          name: business.name,
          description: business.description || '',
          image: business.image_url || '',
          address: {
            city: business.city,
            state: business.state
          },
          rating: business.rating,
          reviewCount: business.review_count
        }}
      />

      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 text-sm text-blue-600 mb-4">
            <Tag className="h-4 w-4" />
            <Link to={`/services/${business.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-800">
              {business.category}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{business.name}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">{business.rating.toFixed(1)}</span>
                <span className="text-gray-500">({business.review_count} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="h-5 w-5" />
                <span>{business.city}, {business.state}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveToggle}
                disabled={savingState === 'saving'}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'text-blue-600 hover:bg-blue-50' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Heart className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <div className="relative">
                <button
                  onClick={() => handleShare()}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <div
                      role="button"
                      onClick={() => handleShare('facebook')}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Facebook className="h-5 w-5 mr-3" />
                      <span>Facebook</span>
                    </div>
                    <div
                      role="button"
                      onClick={() => handleShare('twitter')}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Twitter className="h-5 w-5 mr-3" />
                      <span>Twitter</span>
                    </div>
                    <div
                      role="button"
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Linkedin className="h-5 w-5 mr-3" />
                      <span>LinkedIn</span>
                    </div>
                    <div
                      role="button"
                      onClick={() => handleShare('copy')}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <Copy className="h-5 w-5 mr-3" />
                      <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Featured Image */}
            <div className="rounded-xl overflow-hidden">
              <img
                src={business.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600'}
                alt={business.name}
                className="w-full h-[400px] object-cover"
              />
            </div>



            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {business.name}</h2>
              <p className="text-gray-700 leading-relaxed">
                {business.description || `${business.name} is a local business located in ${business.city}, ${business.state}.`}
              </p>
            </section>
                        {/* Photo Gallery */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                  <span>Photo Gallery</span>
                </div>
              </h2>
              <BusinessGallery 
                businessId={business.id} 
                mainImage={business.image_url}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <div className="space-y-4">
                {business.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {business.city}, {business.state}
                  </span>
                </div>
                {business.employee_count && (
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      {business.employee_count} employees
                    </span>
                  </div>
                )}
                {business.founded_year && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">
                      Founded in {business.founded_year}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>Call Business</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;