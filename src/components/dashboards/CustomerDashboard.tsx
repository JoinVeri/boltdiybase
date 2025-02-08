import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Settings, 
  Heart,
  Building2,
  MapPin,
  Tag,
  BookOpen,
  ArrowRight,
  User,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfileModal from '../modals/ProfileModal';
import SavedDealsModal from '../modals/SavedDealsModal';
import SavedArticlesModal from '../modals/SavedArticlesModal';
import BusinessReviews from '../BusinessReviews';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  created_at: string;
  business: {
    id: string;
    name: string;
  };
}

interface Business {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  rating: number;
  review_count: number;
  image_url: string | null;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  start_date: string;
  end_date: string;
  business: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

const CustomerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [savedDeals, setSavedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'favorites' | 'deals' | 'articles'>('favorites');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSavedDealsModal, setShowSavedDealsModal] = useState(false);
  const [showSavedArticlesModal, setShowSavedArticlesModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  useEffect(() => {
    // Get initial user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch saved businesses
        const { data: savedData, error: savedError } = await supabase
          .from('saved_businesses')
          .select(`
            business_id,
            businesses (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedError) throw savedError;

        const businesses = savedData
          ?.map(item => item.businesses)
          .filter((business): business is Business => business !== null);

        setSavedBusinesses(businesses || []);

        // Fetch featured articles
        const { data: articlesData, error: articlesError } = await supabase
          .from('business_articles')
          .select(`
            id,
            title,
            content,
            category,
            image_url,
            created_at,
            business:business_id (
              id,
              name
            )
          `)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (articlesError) throw articlesError;
        setArticles(articlesData || []);

        // Fetch active deals
        const { data: dealsData, error: dealsError } = await supabase
          .from('business_deals')
          .select(`
            id,
            title,
            description,
            discount_amount,
            discount_type,
            start_date,
            end_date,
            business:business_id (
              id,
              name,
              image_url
            )
          `)
          .gte('end_date', new Date().toISOString())
          .lte('start_date', new Date().toISOString())
          .order('is_featured', { ascending: false })
          .order('discount_amount', { ascending: false })
          .limit(5);

        if (dealsError) throw dealsError;
        setDeals(dealsData || []);

        // Fetch saved deals
        const { data: savedDealsData, error: savedDealsError } = await supabase
          .from('saved_deals')
          .select(`
            deal_id,
            business_deals (
              id,
              title,
              description,
              discount_amount,
              discount_type,
              start_date,
              end_date,
              business:business_id (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedDealsError) throw savedDealsError;

        const userSavedDeals = savedDealsData
          ?.map(item => item.business_deals)
          .filter((deal): deal is Deal => deal !== null);

        setSavedDeals(userSavedDeals || []);

        // Fetch saved articles
        const { data: savedArticlesData, error: savedArticlesError } = await supabase
          .from('saved_articles')
          .select(`
            article_id,
            business_articles (
              id,
              title,
              content,
              category,
              image_url,
              created_at,
              business:business_id (
                id,
                name
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (savedArticlesError) throw savedArticlesError;

        const userSavedArticles = savedArticlesData
          ?.map(item => item.business_articles)
          .filter((article): article is Article => article !== null);

        setSavedArticles(userSavedArticles || []);

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUnsaveDeal = async (dealId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_deals')
        .delete()
        .eq('user_id', user.id)
        .eq('deal_id', dealId);

      if (error) throw error;

      // Update saved deals list
      setSavedDeals(prev => prev.filter(deal => deal.id !== dealId));
    } catch (err) {
      console.error('Error unsaving deal:', err);
    }
  };

  const handleUnsaveArticle = async (articleId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);

      if (error) throw error;

      // Update saved articles list
      setSavedArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (err) {
      console.error('Error unsaving article:', err);
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'favorites':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))
            ) : savedBusinesses.length > 0 ? (
              savedBusinesses.slice(0, 4).map((business) => (
                <Link
                  key={business.id}
                  to={`/business/${business.id}`}
                  className="group relative h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={business.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800'}
                    alt={business.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                        {business.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span>{business.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{business.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No favorites yet</h3>
                <p className="text-gray-600 mb-4">Save businesses you like to find them easily later</p>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                >
                  <Building2 className="h-5 w-5" />
                  <span>Discover Businesses</span>
                </Link>
              </div>
            )}
          </div>
        );

      case 'deals':
        return (
          <div className="space-y-4">
            {/* Featured Deal */}
            {deals[0] && (
              <Link
                to={`/deals/${deals[0].id}`}
                className="relative h-48 rounded-lg overflow-hidden"
              >
                <img
                  src={deals[0].business.image_url || 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1600'}
                  alt={deals[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-semibold">
                        {deals[0].discount_type === 'percentage' 
                          ? `${deals[0].discount_amount}% OFF`
                          : `$${deals[0].discount_amount} OFF`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{deals[0].title}</h3>
                    <p className="text-gray-200">{deals[0].description}</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Deal List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ))
              ) : deals.length > 1 ? (
                deals.slice(1).map((deal) => (
                  <Link
                    key={deal.id}
                    to={`/deals/${deal.id}`}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-medium">
                            {deal.discount_type === 'percentage' 
                              ? `${deal.discount_amount}% OFF`
                              : `$${deal.discount_amount} OFF`}
                          </span>
                        </div>
                        <h4 className="font-medium mb-1">{deal.title}</h4>
                        <p className="text-sm text-gray-600">
                          Valid until {new Date(deal.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No active deals</h3>
                  <p className="text-gray-600">Check back later for new deals from local businesses</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'articles':
        return (
          <div className="space-y-6">
            {/* Featured Article */}
            {articles[0] && (
              <Link
                to={`/articles/${articles[0].id}`}
                className="relative h-64 rounded-lg overflow-hidden block"
              >
                <img
                  src={articles[0].image_url || "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1600"}
                  alt={articles[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full mb-3">
                      Featured
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {articles[0].title}
                    </h3>
                    <p className="text-gray-200">
                      By {articles[0].business.name}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Article List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.slice(1).map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={article.image_url || `https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800`}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-2">
                      {article.category}
                    </span>
                    <h4 className="font-medium mb-2">{article.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {new Date(article.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        Read More
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Find and manage your local services all in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section Tabs */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveSection('favorites')}
                  className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm ${
                    activeSection === 'favorites'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Favorites</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('deals')}
                  className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm ${
                    activeSection === 'deals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Deals</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveSection('articles')}
                  className={`flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm ${
                    activeSection === 'articles'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Articles</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {renderSectionContent()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                  <h3 className="font-medium">
                    {user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : user?.email?.split('@')[0]}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  sclassName="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Member since {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setShowSavedDealsModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 text-left rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Bookmark className="h-5 w-5 text-blue-500" />
                  <span>Saved Deals</span>
                </div>
                {savedDeals.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    {savedDeals.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowSavedArticlesModal(true)}
                className="w-full flex items-center justify-between px-4 py-2 text-left rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Bookmark className="h-5 w-5 text-blue-500" />
                  <span>Saved Articles</span>
                </div>
                {savedArticles.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    {savedArticles.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-5 w-5 text-blue-500" />
                <span>Edit Profile</span>
              </button>
              <button 
                onClick={() => setShowReviewsModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg hover:bg-gray-50"
              >
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <span>Review Business</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>You viewed Elite Fitness Studio</p>
                <p className="text-gray-400">2 hours ago</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>You saved Green Clean Services</p>
                <p className="text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />

      <SavedDealsModal
        isOpen={showSavedDealsModal}
        onClose={() => setShowSavedDealsModal(false)}
        deals={savedDeals}
        onUnsave={handleUnsaveDeal}
      />

      <SavedArticlesModal
        isOpen={showSavedArticlesModal}
        onClose={() => setShowSavedArticlesModal(false)}
        articles={savedArticles}
        onUnsave={handleUnsaveArticle}
      />

      {/* Add Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] m-4 overflow-hidden flex flex-col bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Business Reviews</h2>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <BusinessReviews />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;