-- Drop ALL existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete business media" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Ensure bucket configuration is correct
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

-- Create upload policy for business owners
CREATE POLICY "Business Owner Upload Access"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  (
    CASE 
      -- Allow business-hero uploads
      WHEN (storage.foldername(name))[1] = 'business-hero' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      -- Allow gallery uploads
      WHEN (storage.foldername(name))[1] = 'gallery' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      -- Allow other uploads in business-media bucket
      ELSE true
    END
  )
);

-- Create delete policy for business owners
CREATE POLICY "Business Owner Delete Access"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  (
    CASE 
      -- Allow business-hero deletions
      WHEN (storage.foldername(name))[1] = 'business-hero' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      -- Allow gallery deletions
      WHEN (storage.foldername(name))[1] = 'gallery' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      -- Allow other deletions in business-media bucket
      ELSE true
    END
  )
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;