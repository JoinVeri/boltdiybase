import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  Calendar,
  Youtube,
  Facebook,
  Instagram,
  Pointer as Pinterest,
  Search as Google,
  Plus,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Business } from '../../types/database';
import BusinessGallery from '../BusinessGallery';
import BackButton from '../BackButton';

const BusinessEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    description: '',
    city: '',
    state: '',
    website: '',
    employee_count: null,
    founded_year: null,
    image_url: '',
    youtube_url: '',
    facebook_url: '',
    instagram_url: '',
    pinterest_url: '',
    google_url: '',
  });

  useEffect(() => {
    const fetchBusiness = async () => {
      if (isNew) return;

      try {
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();

        if (businessError) throw businessError;
        setFormData(business);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load business');
        console.error('Error fetching business:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id, isNew]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `business-hero/${id || 'new'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-media')
        .getPublicUrl(filePath);

      // Update form data with new image URL
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to save a business');
      }

      // Validate required fields
      if (!formData.name || !formData.city || !formData.state) {
        throw new Error('Business name, city, and state are required');
      }

      if (isNew) {
        // Create new business
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .insert([{ 
            ...formData,
            user_id: user.id,
            rating: 0,
            review_count: 0,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (businessError) throw businessError;
        navigate('/dashboard/business');
      } else {
        // Update existing business
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (updateError) throw updateError;
        navigate('/dashboard/business');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isNew ? 'Add New Business' : 'Edit Business'}</h1>
        <p className="text-gray-600 mt-2">Update your business information and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Featured Image */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Featured Image</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Business Image
            </label>
            <div
              className={`relative h-48 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.image_url ? (
                <>
                  <img
                    src={formData.image_url}
                    alt="Business preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500">
                    Drag and drop an image here, or{' '}
                    <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      <span>browse</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white">Uploading...</div>
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              This image will be displayed as your main business photo across the platform.
            </p>
          </div>
        </section>

        {/* Basic Information */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your business, services, and what makes you unique..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Count
                </label>
                <input
                  type="number"
                  name="employee_count"
                  value={formData.employee_count || ''}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Founded Year
                </label>
                <input
                  type="number"
                  name="founded_year"
                  value={formData.founded_year || ''}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Social Media</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Youtube className="h-5 w-5" />
                <span>YouTube Channel</span>
              </label>
              <input
                type="url"
                name="youtube_url"
                value={formData.youtube_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/@your-channel"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Facebook className="h-5 w-5" />
                <span>Facebook Page</span>
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/your-page"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Instagram className="h-5 w-5" />
                <span>Instagram Profile</span>
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/your-profile"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Pinterest className="h-5 w-5" />
                <span>Pinterest Profile</span>
              </label>
              <input
                type="url"
                name="pinterest_url"
                value={formData.pinterest_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://pinterest.com/your-profile"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                <Google className="h-5 w-5" />
                <span>Google Business Profile</span>
              </label>
              <input
                type="url"
                name="google_url"
                value={formData.google_url || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://business.google.com/your-profile"
              />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Photo Gallery</h2>
          <BusinessGallery 
            businessId={id || ''} 
            mainImage={formData.image_url || null}
            editable={true}
            onMainImageUpdate={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          />
        </section>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/business')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Saving...' : isNew ? 'Create Business' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessEditForm;