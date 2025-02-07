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
WITH CHECK (bucket_id = 'business-media');

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'business-media');

-- Create policy for business media updates
CREATE POLICY "Allow users to update business media"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'business-media');

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-media', 'business-media', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create function to update business image_url with better error handling
CREATE OR REPLACE FUNCTION update_business_image()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract business ID from path
  IF (storage.foldername(NEW.name))[1] = 'business-hero' THEN
    -- Get the business ID from the path
    DECLARE
      business_id text := (storage.foldername(NEW.name))[2];
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE NOTICE 'Error updating business image: %', SQLERRM;
    END;
  END IF;
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

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;