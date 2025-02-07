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
  Bookmark
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from './SEO';
import BackButton from './BackButton';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  start_date: string;
  end_date: string;
  terms_conditions: string;
  business: {
    id: string;
    name: string;
    city: string;
    state: string;
    image_url: string | null;
    category: string;
    rating: number;
    review_count: number;
  };
}

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const fetchDeal = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('business_deals')
          .select(`
            *,
            business:business_id (
              id,
              name,
              city,
              state,
              image_url,
              category,
              rating,
              review_count
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Deal not found');

        setDeal(data);
      } catch (err) {
        console.error('Error fetching deal:', err);
        setError(err instanceof Error ? err.message : 'Failed to load deal');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();

    const checkIfSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !id) return;

      try {
        const { data } = await supabase
          .from('saved_deals')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('deal_id', id);

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

    if (!deal) return;

    setSavingState('saving');

    try {
      if (isSaved) {
        await supabase
          .from('saved_deals')
          .delete()
          .eq('user_id', session.user.id)
          .eq('deal_id', deal.id);

        setIsSaved(false);
      } else {
        await supabase
          .from('saved_deals')
          .insert({
            user_id: session.user.id,
            deal_id: deal.id,
            business_id: deal.business.id
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
    const title = deal?.title || '';

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

  if (error || !deal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Deal Not Found</h1>
        <p className="text-gray-600 mb-8">The deal you're looking for doesn't exist or has expired.</p>
        <Link
          to="/deals"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Browse Deals</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-4">
        <BackButton />
      </div>

      {deal && (
        <SEO 
          title={deal.title}
          description={deal.description}
          type="product"
          image={deal.business.image_url || undefined}
          business={{
            name: deal.business.name,
            description: deal.description,
            image: deal.business.image_url || '',
            address: {
              city: deal.business.city,
              state: deal.business.state
            }
          }}
        />
      )}

      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 text-sm text-blue-600 mb-4">
            <Tag className="h-4 w-4" />
            <Link to={`/deals?category=${deal.business.category}`} className="hover:text-blue-800">
              {deal.business.category}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{deal.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/business/${deal.business.id}`} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                  {deal.business.image_url ? (
                    <img
                      src={deal.business.image_url}
                      alt={deal.business.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 m-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{deal.business.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{deal.business.city}, {deal.business.state}</span>
                  </div>
                </div>
              </Link>
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
                <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
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

          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Valid until {new Date(deal.end_date).toLocaleDateString()}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Posted {new Date(deal.start_date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={deal.business.image_url || 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1600'}
            alt={deal.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                {deal.discount_type === 'percentage' 
                  ? `${deal.discount_amount}% OFF`
                  : `$${deal.discount_amount} OFF`}
              </h2>
              <p className="text-green-700">
                Limited time offer - Don't miss out!
              </p>
            </div>
            <button
              onClick={handleSaveToggle}
              disabled={savingState === 'saving'}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Deal'}</span>
            </button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">About This Deal</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{deal.description}</p>

          {deal.terms_conditions && (
            <>
              <h3 className="text-xl font-bold mb-4">Terms & Conditions</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {deal.terms_conditions.split('\n').map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default DealDetail;