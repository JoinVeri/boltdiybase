import React, { useState, useEffect, useCallback } from 'react';
import { 
  Upload,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessGalleryProps {
  businessId: string;
  mainImage: string | null;
  editable?: boolean;
  onMainImageUpdate?: (url: string) => void;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
  created_at: string;
}

const BusinessGallery = ({ businessId, mainImage, editable = false, onMainImageUpdate }: BusinessGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const { data: items, error: itemsError } = await supabase
        .from('business_photos')
        .select('*')
        .eq('business_id', businessId)
        .order('order', { ascending: true });

      if (itemsError) throw itemsError;

      // Include main image if it exists
      const allPhotos = mainImage 
        ? [{ 
            id: 'main', 
            url: mainImage, 
            caption: 'Main business photo',
            order: 0,
            created_at: new Date().toISOString()
          }, ...(items || [])]
        : items || [];

      setPhotos(allPhotos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err instanceof Error ? err.message : 'Error fetching photos');
    } finally {
      setLoading(false);
    }
  }, [businessId, mainImage]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

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

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be less than 5MB';
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }

    return null;
  };

  const handleImageUpload = async (files: File[]) => {
    if (!businessId) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `business-photos/${businessId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('business-media')
          .getPublicUrl(filePath);

        // Create photo record
        const { data: photo, error: insertError } = await supabase
          .from('business_photos')
          .insert({
            business_id: businessId,
            url: publicUrl,
            caption: 'Business photo',
            order: photos.length + 1
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return photo;
      });

      const newPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...prev, ...newPhotos.filter(Boolean)]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(err instanceof Error ? err.message : 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, photoId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (photoId === 'main') {
        // Delete main image
        const { error: updateError } = await supabase
          .from('businesses')
          .update({ image_url: null })
          .eq('id', businessId);

        if (updateError) throw updateError;
        onMainImageUpdate?.('');
      } else {
        // Get photo URL before deletion
        const photo = photos.find(p => p.id === photoId);
        if (!photo) return;

        // Delete from storage first
        const filePath = photo.url.split('/').slice(-3).join('/');
        await supabase.storage
          .from('business-media')
          .remove([filePath]);

        // Then delete database record
        const { error: deleteError } = await supabase
          .from('business_photos')
          .delete()
          .eq('id', photoId);

        if (deleteError) throw deleteError;
      }

      // Update local state
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Error deleting photo');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {editable && (
        <div
          className={`relative h-48 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {uploading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
                <p className="text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">
                  Drag and drop images here, or{' '}
                  <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    <span>browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      multiple
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Gallery image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedPhoto(index)}
            />
            {editable && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleDeletePhoto(e, photo.id)}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSelectedPhoto(prev => prev === 0 ? photos.length - 1 : prev! - 1)}
            className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => setSelectedPhoto(prev => prev === photos.length - 1 ? 0 : prev! + 1)}
            className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="max-w-7xl mx-auto px-4">
            <div className="relative aspect-[16/9] max-h-[80vh]">
              <img
                src={photos[selectedPhoto].url}
                alt={photos[selectedPhoto].caption || 'Gallery image'}
                className="w-full h-full object-contain"
              />
            </div>
            {photos[selectedPhoto].caption && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                <p className="text-lg">{photos[selectedPhoto].caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessGallery;