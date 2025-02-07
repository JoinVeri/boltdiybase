-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow users to upload business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete media" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Ensure storage bucket exists with proper configuration
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
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Create upload policy
CREATE POLICY "Upload Access"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  auth.role() = 'authenticated'
);

-- Create delete policy
CREATE POLICY "Delete Access"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- Create function to update business image_url
CREATE OR REPLACE FUNCTION update_business_image()
RETURNS TRIGGER AS $$
DECLARE
  business_id text;
BEGIN
  -- Only update if it's a business-hero image
  IF (storage.foldername(NEW.name))[1] = 'business-hero' THEN
    business_id := (storage.foldername(NEW.name))[2];
    
    IF business_id IS NOT NULL THEN
      UPDATE businesses 
      SET 
        image_url = storage.storage_public_url('business-media', NEW.name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id::text = business_id
      AND EXISTS (
        SELECT 1 FROM businesses b
        WHERE b.id::text = business_id
        AND b.user_id = auth.uid()
      );
    END IF;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the transaction
  RAISE NOTICE 'Error in update_business_image: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for image uploads
DROP TRIGGER IF EXISTS update_business_image_trigger ON storage.objects;

CREATE TRIGGER update_business_image_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'business-media')
  EXECUTE FUNCTION update_business_image();