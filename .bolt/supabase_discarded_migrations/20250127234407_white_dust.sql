/*
  # Create storage bucket for business media

  1. New Storage
    - Create 'business-media' bucket for storing business photos and media
  
  2. Security
    - Enable public read access to all files
    - Allow authenticated users to upload files to their own business folders
    - Allow authenticated users to delete their own files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-media', 'business-media', true);

-- Allow public read access to files
CREATE POLICY "Give public read-only access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] = 'business-photos' AND
  (storage.foldername(name))[2] = (
    SELECT id::text 
    FROM businesses 
    WHERE user_id = auth.uid() 
    LIMIT 1
  )
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow users to delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  (storage.foldername(name))[1] = 'business-photos' AND
  (storage.foldername(name))[2] = (
    SELECT id::text 
    FROM businesses 
    WHERE user_id = auth.uid() 
    LIMIT 1
  )
);