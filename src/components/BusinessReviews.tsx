import React, { useState, useEffect } from 'react';
import { Star, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BusinessReviewForm from './forms/BusinessReviewForm';

interface BusinessReview {
  id: string;
  business_name: string;
  project_name: string;
  project_completed: string;
  project_completed_explanation: string;
  on_time_completion: string;
  on_time_completion_explanation: string;
  business_communication: string;
  business_communication_explanation: string;
  business_punctuality_and_cleanliness: string;
  business_punctuality_explanation: string;
  cost_communication: string;
  cost_communication_explanation: string;
  project_quality: string;
  project_quality_explanation: string;
  overall_rating: number;
  overall_rating_explanation: string;
  created_at: string;
}

const BusinessReviews = () => {
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('business_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Business Reviews</h2>
        <button
          onClick={() => setShowReviewForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Review</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.business_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Project: {review.project_name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">{review.overall_rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewDetail
                  label="Project Completion"
                  value={review.project_completed}
                  explanation={review.project_completed_explanation}
                />
                <ReviewDetail
                  label="On-time Completion"
                  value={review.on_time_completion}
                  explanation={review.on_time_completion_explanation}
                />
                <ReviewDetail
                  label="Communication"
                  value={review.business_communication}
                  explanation={review.business_communication_explanation}
                />
                <ReviewDetail
                  label="Punctuality & Cleanliness"
                  value={review.business_punctuality_and_cleanliness}
                  explanation={review.business_punctuality_explanation}
                />
                <ReviewDetail
                  label="Cost Communication"
                  value={review.cost_communication}
                  explanation={review.cost_communication_explanation}
                />
                <ReviewDetail
                  label="Project Quality"
                  value={review.project_quality}
                  explanation={review.project_quality_explanation}
                />
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Overall Rating Explanation</h4>
                <p className="text-gray-700">{review.overall_rating_explanation}</p>
              </div>

              <div className="text-sm text-gray-500">
                Reviewed on {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600">Be the first to review a business</p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh] m-4 overflow-hidden flex flex-col bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add Business Review</h2>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <BusinessReviewForm
                onClose={() => setShowReviewForm(false)}
                onSuccess={handleReviewSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewDetail = ({ label, value, explanation }: { 
  label: string;
  value: string;
  explanation: string;
}) => (
  <div>
    <h4 className="font-medium text-gray-900 mb-1">{label}</h4>
    <div className="space-y-1">
      <div className={`inline-block px-2 py-1 rounded text-sm ${
        value === 'Yes' ? 'bg-green-100 text-green-800' :
        value === 'No' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </div>
      <p className="text-gray-700 text-sm">{explanation}</p>
    </div>
  </div>
);

export default BusinessReviews;