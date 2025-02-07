-- Create business_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, category_name)
);

-- Enable RLS
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to business_categories"
  ON business_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow business owners to manage their categories"
  ON business_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_categories.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_categories.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_categories_business ON business_categories(business_id);
CREATE INDEX IF NOT EXISTS idx_business_categories_primary ON business_categories(is_primary);

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