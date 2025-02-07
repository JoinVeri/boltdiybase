import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Tag, 
  Building2, 
  Calendar,
  ArrowRight,
  Bookmark
} from 'lucide-react';

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

interface SavedDealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  onUnsave?: (dealId: string) => void;
}

const SavedDealsModal = ({ isOpen, onClose, deals, onUnsave }: SavedDealsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Saved Deals</h2>
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
          {deals.length > 0 ? (
            <div className="space-y-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">
                          {deal.discount_type === 'percentage' 
                            ? `${deal.discount_amount}% OFF`
                            : `$${deal.discount_amount} OFF`}
                        </span>
                      </div>
                      <Link
                        to={`/deals/${deal.id}`}
                        onClick={onClose}
                        className="block group"
                      >
                        <h3 className="font-medium mb-1 group-hover:text-blue-600">
                          {deal.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{deal.business.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Valid until {new Date(deal.end_date).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {onUnsave && (
                        <button
                          onClick={() => onUnsave(deal.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from saved"
                        >
                          <Bookmark className="h-5 w-5" fill="currentColor" />
                        </button>
                      )}
                      <Link
                        to={`/deals/${deal.id}`}
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
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved deals</h3>
              <p className="text-gray-600 mb-6">You haven't saved any deals yet</p>
              <Link
                to="/deals"
                onClick={onClose}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <Tag className="h-5 w-5" />
                <span>Browse Deals</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedDealsModal;