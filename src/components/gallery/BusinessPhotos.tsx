import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload,
  Image as ImageIcon,
  X,
  Star,
  StarOff,
  Plus,
  Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BusinessPhotosProps {
  businessId: string;
  currentImage: string | null;
  onMainImageUpdate: (newUrl: string) => void;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  is_main: boolean;
}

const BusinessPhotos = ({ businessId, currentImage, onMainImageUpdate }: BusinessPhotosProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Fetch existing photos
  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('business_gallery')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        setPhotos(data || []);
      }
    };

    fetchPhotos();
  }, [businessId]);

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
      handleImageUpload(file);
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    // Validate file
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
      const filePath = `business-hero/${businessId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-media')
        .getPublicUrl(filePath);

      // Update business image_url
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ image_url: publicUrl })
        .eq('id', businessId);

      if (updateError) throw updateError;

      // Call the callback
      onMainImageUpdate(publicUrl);

      // Add to gallery
      const { error: galleryError } = await supabase
        .from('business_gallery')
        .insert({
          business_id: businessId,
          url: publicUrl,
          caption: 'Main business photo',
          type: 'image'
        });

      if (galleryError) throw galleryError;

      // Refresh photos
      const { data: newPhotos } = await supabase
        .from('business_gallery')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      setPhotos(newPhotos || []);

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

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Main Business Image */}
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
          {currentImage ? (
            <img
              src={currentImage}
              alt="Business"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="flex items-center space-x-2 bg-white/90 px-4 py-2 rounded-lg text-gray-700 hover:bg-white transition-colors">
                <Upload className="h-5 w-5" />
                <span>{uploading ? 'Uploading...' : 'Change Image'}</span>
              </div>
            </label>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Drag and drop an image here, or click to select a file. This image will be displayed as your main business photo across the platform.
        </p>
      </div>

      {/* Photo Gallery */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Photo Gallery</h3>
          <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            <Plus className="h-5 w-5" />
            <span>Add Photos</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              multiple
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Business photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={async () => {
                      const { error } = await supabase
                        .from('business_gallery')
                        .delete()
                        .eq('id', photo.id);

                      if (!error) {
                        setPhotos(photos.filter(p => p.id !== photo.id));
                      }
                    }}
                    className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessPhotos;