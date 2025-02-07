import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  BookOpen, 
  Building2, 
  Clock,
  ArrowRight,
  Bookmark,
  Tag
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  created_at: string;
  business: {
    id: string;
    name: string;
  };
}

interface SavedArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onUnsave?: (articleId: string) => void;
}

const SavedArticlesModal = ({ isOpen, onClose, articles, onUnsave }: SavedArticlesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Saved Articles</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {articles.length > 0 ? (
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-500 font-medium">
                          {article.category}
                        </span>
                      </div>
                      <Link
                        to={`/articles/${article.id}`}
                        onClick={onClose}
                        className="block group"
                      >
                        <h3 className="font-medium mb-1 group-hover:text-blue-600">
                          {article.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{article.business.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Posted {new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {onUnsave && (
                        <button
                          onClick={() => onUnsave(article.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from saved"
                        >
                          <Bookmark className="h-5 w-5" fill="currentColor" />
                        </button>
                      )}
                      <Link
                        to={`/articles/${article.id}`}
                        onClick={onClose}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved articles</h3>
              <p className="text-gray-600 mb-6">You haven't saved any articles yet</p>
              <Link
                to="/articles"
                onClick={onClose}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <BookOpen className="h-5 w-5" />
                <span>Browse Articles</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedArticlesModal;