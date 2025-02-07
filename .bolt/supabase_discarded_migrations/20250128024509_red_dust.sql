-- Add policy for hero image uploads
CREATE POLICY "Allow users to upload hero images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] = 'business-hero' AND
  (storage.foldername(name))[2] = (
    SELECT id::text 
    FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.foldername(name))[2]
  )
);

-- Add policy for hero image deletions
CREATE POLICY "Allow users to delete hero images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] = 'business-hero' AND
  (storage.foldername(name))[2] = (
    SELECT id::text 
    FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.foldername(name))[2]
  )
);