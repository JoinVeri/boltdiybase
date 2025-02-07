import React, { useState, useCallback } from 'react';
import { X, Save, Tag, Calendar, DollarSign, FileText, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
}

const DealModal = ({ isOpen, onClose, businessId }: DealModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountAmount: '',
    discountType: 'percentage',
    startDate: '',
    endDate: '',
    termsConditions: '',
    dealImage: null as File | null,
    dealImagePreview: null as string | null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      dealImage: file,
      dealImagePreview: previewUrl
    }));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        throw new Error('End date must be after start date');
      }

      // Validate discount amount
      const amount = parseFloat(formData.discountAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid discount amount');
      }
      if (formData.discountType === 'percentage' && amount > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }

      let dealImageUrl = null;

      // Upload image if provided
      if (formData.dealImage) {
        const fileExt = formData.dealImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `deals/${businessId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-media')
          .upload(filePath, formData.dealImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('business-media')
          .getPublicUrl(filePath);

        dealImageUrl = publicUrl;
      }

      // Create the deal
      const { error: dealError } = await supabase
        .from('business_deals')
        .insert({
          business_id: businessId,
          title: formData.title,
          description: formData.description,
          discount_amount: amount,
          discount_type: formData.discountType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          terms_conditions: formData.termsConditions,
          deal_img_url: dealImageUrl
        });

      if (dealError) throw dealError;

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the deal');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Tag className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Create New Deal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Image
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
              {formData.dealImagePreview ? (
                <>
                  <img
                    src={formData.dealImagePreview}
                    alt="Deal preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, dealImage: null, dealImagePreview: null }))}
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Summer Special: 20% Off All Services"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the details of your deal..."
            />
          </div>

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: e.target.value }))}
                  required
                  min="0"
                  max={formData.discountType === 'percentage' ? "100" : undefined}
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terms & Conditions
            </label>
            <div className="relative">
              <textarea
                value={formData.termsConditions}
                onChange={(e) => setFormData(prev => ({ ...prev, termsConditions: e.target.value }))}
                rows={4}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any terms, conditions, or restrictions that apply to this deal..."
              />
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Actions */}
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
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Creating...' : 'Create Deal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealModal;