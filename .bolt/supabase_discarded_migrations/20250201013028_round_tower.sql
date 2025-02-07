-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow users to upload business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete business media" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-media',
  'business-media',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Create public read access policy
CREATE POLICY "Give public read-only access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Create simple policy for business media uploads
CREATE POLICY "Allow authenticated users to upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] IN ('business-hero', 'gallery')
);

-- Create simple policy for business media deletions
CREATE POLICY "Allow authenticated users to delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] IN ('business-hero', 'gallery')
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- Create function to update business image_url
CREATE OR REPLACE FUNCTION update_business_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if it's a business-hero image
  IF (storage.foldername(NEW.name))[1] = 'business-hero' THEN
    UPDATE businesses 
    SET 
      image_url = storage.storage_public_url('business-media', NEW.name),
      updated_at = CURRENT_TIMESTAMP
    WHERE id::text = (storage.foldername(NEW.name))[2]
    AND EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id::text = (storage.foldername(NEW.name))[2]
      AND b.user_id = auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for image uploads
DROP TRIGGER IF EXISTS update_business_image_trigger ON storage.objects;

CREATE TRIGGER update_business_image_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'business-media')
  EXECUTE FUNCTION update_business_image();

-- Fix business_categories table
ALTER TABLE business_categories
ADD COLUMN IF NOT EXISTS category_name text,
ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'business_categories_business_id_category_name_key'
  ) THEN
    ALTER TABLE business_categories 
    ADD CONSTRAINT business_categories_business_id_category_name_key 
    UNIQUE (business_id, category_name);
  END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_categories' 
    AND indexname = 'idx_business_categories_business'
  ) THEN
    CREATE INDEX idx_business_categories_business 
    ON business_categories(business_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'business_categories' 
    AND indexname = 'idx_business_categories_primary'
  ) THEN
    CREATE INDEX idx_business_categories_primary 
    ON business_categories(is_primary);
  END IF;
END $$;