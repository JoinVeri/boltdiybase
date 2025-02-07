import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Building2, 
  MapPin, 
  Tag,
  Share2,
  Bookmark,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import BackButton from './BackButton';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  article_url?: string; // <-- note this field
  tags: string[];
  created_at: string;
  business: {
    id: string;
    name: string;
    city: string;
    state: string;
    image_url: string | null;
  };
}

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        // Fetch the main article
        const { data: articleData, error: articleError } = await supabase
          .from('business_articles')
          .select(`
            *,
            business:business_id (
              id,
              name,
              city,
              state,
              image_url
            )
          `)
          .eq('id', id)
          .single();

        if (articleError) throw articleError;
        if (!articleData) throw new Error('Article not found');

        setArticle(articleData);

        // Fetch related articles
        const { data: relatedData } = await supabase
          .from('business_articles')
          .select(`
            *,
            business:business_id (
              id,
              name,
              city,
              state,
              image_url
            )
          `)
          .eq('category', articleData.category)
          .neq('id', id)
          .limit(3);

        setRelatedArticles(relatedData || []);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    // Check if article is saved
    const checkIfSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !id) return;

      try {
        const { data } = await supabase
          .from('saved_articles')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('article_id', id);

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

    if (!article) return;

    setSavingState('saving');

    try {
      if (isSaved) {
        // Remove from saved articles
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', session.user.id)
          .eq('article_id', article.id);

        setIsSaved(false);
      } else {
        // Add to saved articles
        await supabase
          .from('saved_articles')
          .insert({
            user_id: session.user.id,
            article_id: article.id,
            business_id: article.business.id
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
    const title = article?.title || '';

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          '_blank'
        );
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

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/articles"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ChevronRight className="h-5 w-5" />
          <span>Browse Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Add BackButton at the top */}
      <div className="container mx-auto px-4 py-4">
        <BackButton />
      </div>

      {/* Article Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 text-sm text-blue-600 mb-4">
            <Tag className="h-4 w-4" />
            <Link
              to={`/articles/category/${article.category}`}
              className="hover:text-blue-800"
            >
              {article.category}
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/business/${article.business.id}`}
                className="flex items-center space-x-3"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                  {article.business.image_url ? (
                    <img
                      src={article.business.image_url}
                      alt={article.business.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 m-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {article.business.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {article.business.city}, {article.business.state}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleShare()}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
              >
                <Share2 className="h-5 w-5" />
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Facebook className="h-5 w-5 mr-3" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Twitter className="h-5 w-5 mr-3" />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Linkedin className="h-5 w-5 mr-3" />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="h-5 w-5 mr-3" />
                      <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </button>

              <button
                onClick={handleSaveToggle}
                disabled={savingState === 'saving'}
                className={`p-2 hover:bg-blue-50 rounded-full transition-colors ${
                  isSaved
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Bookmark
                  className="h-5 w-5"
                  fill={isSaved ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-8">
          <img
            src={
              article.image_url ||
              'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1600'
            }
            alt={article.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/articles/tag/${tag}`}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  <span className="text-sm">{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-100 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        relatedArticle.image_url ||
                        'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800'
                      }
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <time dateTime={relatedArticle.created_at}>
                        {new Date(relatedArticle.created_at).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Link to the original article (article_url) */}
      {article.article_url && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <a
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <span>Read the original article here</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
