-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow users to upload business media" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete business media" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Create public read access policy
CREATE POLICY "Give public read-only access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Create policy for business media uploads
CREATE POLICY "Allow users to upload business media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  (
    -- Allow business-hero uploads with proper path validation
    CASE 
      WHEN (storage.foldername(name))[1] = 'business-hero' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      ELSE true
    END
  )
);

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  (
    -- Allow business-hero deletions with proper path validation
    CASE 
      WHEN (storage.foldername(name))[1] = 'business-hero' THEN
        EXISTS (
          SELECT 1 
          FROM businesses 
          WHERE businesses.user_id = auth.uid() 
          AND businesses.id::text = (storage.foldername(name))[2]
        )
      ELSE true
    END
  )
);

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-media', 'business-media', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;