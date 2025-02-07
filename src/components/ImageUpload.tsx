import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
  businessId?: string;
  folder: 'business-hero' | 'gallery' | 'avatars';
  currentImage?: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
  onRemove?: () => void;
  maxSize?: number; // in MB
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  businessId,
  folder,
  currentImage,
  onUploadComplete,
  onUploadError,
  onRemove,
  maxSize = 5, // Default max size is 5MB
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }

    // Check image dimensions (optional)
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 200 || img.height < 200) {
          resolve('Image dimensions must be at least 200x200 pixels');
        }
        resolve(null);
      };
      img.onerror = () => resolve('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // Validate file
      const error = await validateFile(file);
      if (error) {
        onUploadError(error);
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${businessId || 'temp'}/${fileName}`;

      // If updating, delete old file first
      if (currentImage) {
        const oldPath = currentImage.split('/').slice(-3).join('/');
        try {
          await supabase.storage
            .from('business-media')
            .remove([oldPath]);
        } catch (err) {
          console.warn('Failed to delete old image:', err);
          // Continue with upload even if delete fails
        }
      }

      // Upload new file
      const { error: uploadError, data } = await supabase.storage
        .from('business-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-media')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      onUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div
        className={`relative h-48 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-2"></div>
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
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
                  PNG, JPG up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;