-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to business_gallery" ON business_gallery;
DROP POLICY IF EXISTS "Allow business owners to manage their gallery" ON business_gallery;

-- Create business_gallery table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_gallery (
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

-- Enable RLS if not already enabled
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

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_business') THEN
    CREATE INDEX idx_business_gallery_business ON business_gallery(business_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_order') THEN
    CREATE INDEX idx_business_gallery_order ON business_gallery("order");
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_type') THEN
    CREATE INDEX idx_business_gallery_type ON business_gallery(type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_folder') THEN
    CREATE INDEX idx_business_gallery_folder ON business_gallery(folder);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_created') THEN
    CREATE INDEX idx_business_gallery_created ON business_gallery(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_business_gallery_updated') THEN
    CREATE INDEX idx_business_gallery_updated ON business_gallery(updated_at);
  END IF;
END $$;

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
WITH CHECK (bucket_id = 'business-media');

-- Create policy for business media deletions
CREATE POLICY "Allow users to delete business media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'business-media');