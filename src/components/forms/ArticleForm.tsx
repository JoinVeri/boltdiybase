import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  Image as ImageIcon,
  Tag as TagIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BackButton from '../BackButton';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    image: null as File | null,
    imagePreview: null as string | null,
    subtitle: '',
    article_url: ''
  });

  const [currentBusiness, setCurrentBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'Business Tips',
    'Industry News',
    'How-to Guides',
    'Success Stories',
    'Expert Advice',
    'Local Insights'
  ];

  // Fetch existing article if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/signin');
          return;
        }

        // Fetch business by user
        const { data: business } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!business) {
          throw new Error('No business found');
        }

        setCurrentBusiness(business);

        // If editing, fetch article
        if (!isNew) {
          const { data: article, error: articleError } = await supabase
            .from('business_articles')
            .select('*')
            .eq('id', id)
            .single();

          if (articleError) throw articleError;
          if (!article) throw new Error('Article not found');

          // Check ownership
          if (article.business_id !== business.id) {
            throw new Error('Unauthorized');
          }

          // Set form data from fetched article
          setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            tags: article.tags || [],
            image: null,
            imagePreview: article.image_url,
            subtitle: article.subtitle || '',
            article_url: article.article_url || ''
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isNew, navigate]);

  // Handle drag state for image
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  }, []);

  // Validate & preview selected file
  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
  };

  // Handle file input via click
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  // Handle tags
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      input.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;

    setSaving(true);
    setError(null);

    try {
      let imageUrl = formData.imagePreview;

      // Handle image upload if new image is selected
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-media')
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-media')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Construct article data
      const articleData = {
        business_id: currentBusiness.id,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        image_url: imageUrl,
        subtitle: formData.subtitle,
        article_url: formData.article_url,
        updated_at: new Date().toISOString()
      };

      // Insert or update
      if (isNew) {
        const { error: createError } = await supabase
          .from('business_articles')
          .insert([articleData]);

        if (createError) throw createError;
      } else {
        const { error: updateError } = await supabase
          .from('business_articles')
          .update(articleData)
          .eq('id', id);

        if (updateError) throw updateError;
      }

      navigate('/dashboard/business');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Add BackButton at the top */}
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isNew ? 'Create New Article' : 'Edit Article'}</h1>
        <p className="text-gray-600 mt-2">Share your expertise and insights with your community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <div
            className={`relative h-48 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.imagePreview ? (
              <>
                <img
                  src={formData.imagePreview}
                  alt="Article preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null }))}
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
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a descriptive title for your article"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Subtitle</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add a subtitle (optional)"
          />
        </div>

        {/* Article URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article URL</label>
          <input
            type="text"
            value={formData.article_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, article_url: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add a direct link (optional)"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={handleTagInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Type a tag and press Enter or comma to add"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Write your article content here..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/business')}
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
            <span>{saving ? 'Saving...' : isNew ? 'Create Article' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;