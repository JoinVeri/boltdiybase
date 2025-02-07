import React, { useState } from 'react';
import { Star, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BusinessReviewFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface FormData {
  businessName: string;
  projectName: string;
  projectCompleted: string;
  projectCompletedExplanation: string;
  onTimeCompletion: string;
  onTimeCompletionExplanation: string;
  businessCommunication: string;
  businessCommunicationExplanation: string;
  businessPunctualityAndCleanliness: string;
  businessPunctualityExplanation: string;
  costCommunication: string;
  costCommunicationExplanation: string;
  projectQuality: string;
  projectQualityExplanation: string;
  overallRating: number;
  overallRatingExplanation: string;
}

const initialFormData: FormData = {
  businessName: '',
  projectName: '',
  projectCompleted: '',
  projectCompletedExplanation: '',
  onTimeCompletion: '',
  onTimeCompletionExplanation: '',
  businessCommunication: '',
  businessCommunicationExplanation: '',
  businessPunctualityAndCleanliness: '',
  businessPunctualityExplanation: '',
  costCommunication: '',
  costCommunicationExplanation: '',
  projectQuality: '',
  projectQualityExplanation: '',
  overallRating: 0,
  overallRatingExplanation: ''
};

const BusinessReviewForm = ({ onClose, onSuccess }: BusinessReviewFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('business_reviews')
        .insert([{
          business_name: formData.businessName,
          project_name: formData.projectName,
          project_completed: formData.projectCompleted,
          project_completed_explanation: formData.projectCompletedExplanation,
          on_time_completion: formData.onTimeCompletion,
          on_time_completion_explanation: formData.onTimeCompletionExplanation,
          business_communication: formData.businessCommunication,
          business_communication_explanation: formData.businessCommunicationExplanation,
          business_punctuality_and_cleanliness: formData.businessPunctualityAndCleanliness,
          business_punctuality_explanation: formData.businessPunctualityExplanation,
          cost_communication: formData.costCommunication,
          cost_communication_explanation: formData.costCommunicationExplanation,
          project_quality: formData.projectQuality,
          project_quality_explanation: formData.projectQualityExplanation,
          overall_rating: formData.overallRating,
          overall_rating_explanation: formData.overallRatingExplanation
        }]);

      if (submitError) throw submitError;

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your review');
    } finally {
      setLoading(false);
    }
  };

  const renderYesNoOtherField = (
    label: string,
    name: string,
    explanationName: string,
    required = true
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        name={name}
        value={formData[name as keyof FormData]}
        onChange={handleInputChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select an option</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        <option value="Other">Other</option>
      </select>
      {formData[name as keyof FormData] && (
        <textarea
          name={explanationName}
          value={formData[explanationName as keyof FormData]}
          onChange={handleInputChange}
          placeholder="Please explain..."
          required={required}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business and Project Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name/Number *
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the project name or number"
            />
          </div>
        </div>

        {/* Project Completion */}
        {renderYesNoOtherField(
          'Was the project completed?',
          'projectCompleted',
          'projectCompletedExplanation'
        )}

        {/* On-time Completion */}
        {renderYesNoOtherField(
          'Was the project completed on time?',
          'onTimeCompletion',
          'onTimeCompletionExplanation'
        )}

        {/* Business Communication */}
        {renderYesNoOtherField(
          'Was the business communicative?',
          'businessCommunication',
          'businessCommunicationExplanation'
        )}

        {/* Punctuality and Cleanliness */}
        {renderYesNoOtherField(
          'Was the business clean and on time?',
          'businessPunctualityAndCleanliness',
          'businessPunctualityExplanation'
        )}

        {/* Cost Communication */}
        {renderYesNoOtherField(
          'Was the project cost communicated clearly and match?',
          'costCommunication',
          'costCommunicationExplanation'
        )}

        {/* Project Quality */}
        {renderYesNoOtherField(
          'Was the project completed with good quality?',
          'projectQuality',
          'projectQualityExplanation'
        )}

        {/* Overall Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Overall Rating (1.1-10) *
          </label>
          <input
            type="number"
            name="overallRating"
            value={formData.overallRating}
            onChange={handleInputChange}
            required
            min="1.1"
            max="10"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="overallRatingExplanation"
            value={formData.overallRatingExplanation}
            onChange={handleInputChange}
            placeholder="Please explain your rating..."
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessReviewForm;