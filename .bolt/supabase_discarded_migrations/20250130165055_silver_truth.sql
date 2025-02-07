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
  bucket_id = 'business-media'
);

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media'
);