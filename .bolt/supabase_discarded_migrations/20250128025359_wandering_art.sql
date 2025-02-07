/*
  # Fix Storage Policies for Business Images

  1. Changes
    - Create helper function for path handling
    - Set up storage policies for business images
    - Add trigger for updating business image_url
  
  2. Security
    - Maintain public read access
    - Restrict uploads/deletes to business owners
    - Ensure proper path validation
*/

-- Create helper function to get path parts
CREATE OR REPLACE FUNCTION storage.get_path_parts(path text)
RETURNS text[] AS $$
BEGIN
  RETURN string_to_array(path, '/');
END;
$$ LANGUAGE plpgsql;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete hero images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Give public read-only access" ON storage.objects;

-- Create public read access policy
CREATE POLICY "Give public read-only access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

-- Create policy for business image uploads
CREATE POLICY "Allow users to upload business images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-media' AND
  EXISTS (
    SELECT 1 
    FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.get_path_parts(name))[2]
  )
);

-- Create policy for business image deletions
CREATE POLICY "Allow users to delete business images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  EXISTS (
    SELECT 1 
    FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.get_path_parts(name))[2]
  )
);

-- Create function to update business image_url
CREATE OR REPLACE FUNCTION storage.update_business_image()
RETURNS TRIGGER AS $$
DECLARE
  business_id text;
BEGIN
  -- Get business ID from path
  business_id := (storage.get_path_parts(NEW.name))[2];
  
  -- Update business image_url if business exists
  IF business_id IS NOT NULL THEN
    UPDATE businesses 
    SET image_url = storage.storage_public_url('business-media', NEW.name),
        updated_at = CURRENT_TIMESTAMP
    WHERE id::text = business_id
    AND EXISTS (
      SELECT 1 
      FROM businesses b
      WHERE b.id::text = business_id
      AND b.user_id = auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for image uploads
DROP TRIGGER IF EXISTS update_business_image_trigger ON storage.objects;

CREATE TRIGGER update_business_image_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'business-media')
  EXECUTE FUNCTION storage.update_business_image();