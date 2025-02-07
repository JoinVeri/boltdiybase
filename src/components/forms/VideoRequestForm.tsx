import React, { useState } from 'react';
import { Video, Calendar, MapPin, AlertCircle, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FormData {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  preferredDates: string[];
  preferredTimes: string[];
  locationAddress: string;
  parkingInfo: string;
  specialInstructions: string;
  keyFeatures: string[];
  teamMembers: string;
  interviewTopics: string[];
  hasLogo: boolean;
  hasPhotos: boolean;
  businessHours: string;
  websiteUrl: string;
  socialMediaUrls: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

const initialFormData: FormData = {
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  preferredDates: [],
  preferredTimes: [],
  locationAddress: '',
  parkingInfo: '',
  specialInstructions: '',
  keyFeatures: [],
  teamMembers: '',
  interviewTopics: [],
  hasLogo: false,
  hasPhotos: false,
  businessHours: '',
  websiteUrl: '',
  socialMediaUrls: {}
};

interface VideoRequestFormProps {
  onClose?: () => void;
}

const VideoRequestForm = ({ onClose }: VideoRequestFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleArrayInput = (name: keyof FormData, value: string) => {
    if (Array.isArray(formData[name])) {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim()).filter(Boolean)
      }));
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMediaUrls: {
        ...prev.socialMediaUrls,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user's business ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to submit a video request');

      // Get business ID
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!business) throw new Error('No business found for this user');

      // Submit video request
      const { error: submitError } = await supabase
        .from('video_requests')
        .insert([{
          business_id: business.id,
          contact_name: formData.contactName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          preferred_dates: formData.preferredDates,
          preferred_times: formData.preferredTimes,
          location_address: formData.locationAddress,
          parking_info: formData.parkingInfo,
          special_instructions: formData.specialInstructions,
          key_features: formData.keyFeatures,
          team_members: formData.teamMembers,
          interview_topics: formData.interviewTopics,
          has_logo: formData.hasLogo,
          has_photos: formData.hasPhotos,
          business_hours: formData.businessHours,
          website_url: formData.websiteUrl,
          social_media_urls: formData.socialMediaUrls,
          status: 'pending'
        }]);

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error submitting video request:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Video Request Submitted!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for your request. Our team will review your submission and contact you shortly to discuss the details.
        </p>
        <button
          onClick={onClose}
          className="inline-flex items-center space-x-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <span>Close</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name *
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Scheduling */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Scheduling</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Dates (comma-separated) *
            </label>
            <input
              type="text"
              value={formData.preferredDates.join(', ')}
              onChange={(e) => handleArrayInput('preferredDates', e.target.value)}
              placeholder="e.g., 2024-02-15, 2024-02-16"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Times (comma-separated) *
            </label>
            <input
              type="text"
              value={formData.preferredTimes.join(', ')}
              onChange={(e) => handleArrayInput('preferredTimes', e.target.value)}
              placeholder="e.g., Morning, Afternoon"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Location Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filming Location Address *
            </label>
            <input
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parking Information
            </label>
            <textarea
              name="parkingInfo"
              value={formData.parkingInfo}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe parking availability and instructions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions or requirements..."
            />
          </div>
        </section>

        {/* Content Details */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Content Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Features to Highlight (comma-separated) *
            </label>
            <input
              type="text"
              value={formData.keyFeatures.join(', ')}
              onChange={(e) => handleArrayInput('keyFeatures', e.target.value)}
              placeholder="e.g., Product Quality, Customer Service"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Members to Feature
            </label>
            <input
              type="text"
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Names and roles of team members to include..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Topics (comma-separated)
            </label>
            <input
              type="text"
              value={formData.interviewTopics.join(', ')}
              onChange={(e) => handleArrayInput('interviewTopics', e.target.value)}
              placeholder="e.g., Company History, Future Plans"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Business Assets */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Business Assets</h3>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasLogo"
                checked={formData.hasLogo}
                onChange={handleCheckboxChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Have Logo</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="hasPhotos"
                checked={formData.hasPhotos}
                onChange={handleCheckboxChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Have Photos</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Hours
            </label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mon-Fri 9am-5pm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        {/* Social Media */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
          
          {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {platform.charAt(0).toUpperCase() + platform.slice(1)} URL
              </label>
              <input
                type="url"
                value={formData.socialMediaUrls[platform as keyof typeof formData.socialMediaUrls] || ''}
                onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </section>

        {/* Submit Button - Now sticky to bottom */}
        <div className="sticky bottom-0 pt-4 pb-2 bg-white border-t border-gray-200">
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
              <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VideoRequestForm;