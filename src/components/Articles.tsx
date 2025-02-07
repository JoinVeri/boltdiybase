import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Building2,
  ChevronRight,
  Search,
  Tag,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from './SEO';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  tags: string[];
  created_at: string;
  business: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  distance?: number;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Home Improvement',
      subcategories: ['Kitchen', 'Bathroom', 'Basement', 'Outdoor', 'Windows & Doors']
    },
    {
      title: 'Maintenance & Repair',
      subcategories: ['Plumbing', 'Electrical', 'HVAC', 'Appliances', 'Roofing']
    },
    {
      title: 'Cleaning',
      subcategories: ['House Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Air Duct Cleaning']
    },
    {
      title: 'Outdoor Services',
      subcategories: ['Landscaping', 'Lawn Care', 'Tree Service', 'Pest Control']
    }
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch featured articles
        const { data: featured } = await supabase
          .from('business_articles')
          .select(`
            *,
            business:business_id (
              id,
              name,
              city,
              state
            )
          `)
          .eq('is_featured', true)
          .limit(3);

        // Fetch regular articles
        const { data: regular } = await supabase
          .from('business_articles')
          .select(`
            *,
            business:business_id (
              id,
              name,
              city,
              state
            )
          `)
          .order('created_at', { ascending: false })
          .limit(12);

        setFeaturedArticles(featured || []);
        setArticles(regular || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO 
        title="Business Articles & Insights"
        description="Read expert articles, guides, and insights from local business owners. Stay informed about business trends, tips, and success stories."
        type="website"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Articles</h1>

        {/* Featured Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {featuredArticles.map((article, index) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[16/9]">
                <img
                  src={article.image_url || `https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800`}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-orange-400 text-sm font-medium mb-2">
                    {article.category}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-gray-300 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 pb-2 border-b border-gray-200">
                {category.title}
              </h2>
              <ul className="space-y-3">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      to={`/articles/category/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between text-gray-600 hover:text-orange-500 group"
                    >
                      <span>{sub}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Latest Articles */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="group"
              >
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <img
                    src={article.image_url || `https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800`}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-orange-500 text-sm font-medium">
                    {article.category}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;