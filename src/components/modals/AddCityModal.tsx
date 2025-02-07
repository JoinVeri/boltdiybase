import React, { useState, useCallback } from 'react';
import { X, Save, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCityData } from '../../lib/cityData';

interface AddCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCityModal = ({ isOpen, onClose, onSuccess }: AddCityModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    population: '',
    zipCodes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cityImage, setCityImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  }, []);

  const handleImageSelect = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setCityImage(file);
    setImagePreview(previewUrl);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;

      // Upload image if provided
      if (cityImage) {
        const fileExt = cityImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `cities/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-media')
          .upload(filePath, cityImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('business-media')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Get city data from external APIs
      const cityData = await getCityData(formData.name, formData.state);

      // Insert city
      const { data: city, error: cityError } = await supabase
        .from('cities')
        .insert({
          name: formData.name,
          state: formData.state,
          population: parseInt(formData.population) || null,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          timezone: cityData.timezone,
          image_url: imageUrl || cityData.image_url
        })
        .select()
        .single();

      if (cityError) throw cityError;

      // Insert ZIP codes
      if (formData.zipCodes.trim()) {
        const zipCodes = formData.zipCodes.split(',').map(zip => zip.trim());
        const { error: zipError } = await supabase
          .from('city_zipcodes')
          .insert(
            zipCodes.map(zipcode => ({
              city_id: city.id,
              zipcode,
              type: 'primary'
            }))
          );

        if (zipError) throw zipError;
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error adding city:', err);
      setError(err instanceof Error ? err.message : 'Failed to add city');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Add New City</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City Photo
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
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="City preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCityImage(null);
                      setImagePreview(null);
                    }}
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
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Ann Arbor"
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
              placeholder="e.g., Michigan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Population
            </label>
            <input
              type="number"
              name="population"
              value={formData.population}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 120000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Codes (comma-separated)
            </label>
            <input
              type="text"
              name="zipCodes"
              value={formData.zipCodes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 48104, 48105, 48106"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Adding...' : 'Add City'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCityModal;