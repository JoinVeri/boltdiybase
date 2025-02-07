-- Drop existing table if it exists
DROP TABLE IF EXISTS business_gallery CASCADE;

-- Create business_gallery table
CREATE TABLE business_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  tags text[] DEFAULT '{}',
  folder text,
  type text DEFAULT 'image',
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_gallery ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to business_gallery"
  ON business_gallery
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow business owners to manage their gallery"
  ON business_gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_gallery.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_gallery.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_gallery_business ON business_gallery(business_id);
CREATE INDEX IF NOT EXISTS idx_business_gallery_order ON business_gallery("order");
CREATE INDEX IF NOT EXISTS idx_business_gallery_type ON business_gallery(type);
CREATE INDEX IF NOT EXISTS idx_business_gallery_folder ON business_gallery(folder);
CREATE INDEX IF NOT EXISTS idx_business_gallery_created ON business_gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_business_gallery_updated ON business_gallery(updated_at);

-- Update storage policies
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
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.user_id = auth.uid()
  )
);

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-media' AND
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.user_id = auth.uid()
  )
);