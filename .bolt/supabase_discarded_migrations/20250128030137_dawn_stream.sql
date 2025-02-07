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
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on business_gallery
ALTER TABLE business_gallery ENABLE ROW LEVEL SECURITY;

-- Add policies for business_gallery
CREATE POLICY "Allow public read access to business_gallery"
  ON business_gallery
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their gallery"
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

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-media', 'business-media', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies
CREATE POLICY "Allow public read access to business media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'business-media');

CREATE POLICY "Allow authenticated users to manage their business media"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'business-media' AND
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.foldername(name))[2]
  )
)
WITH CHECK (
  bucket_id = 'business-media' AND
  EXISTS (
    SELECT 1 FROM businesses 
    WHERE businesses.user_id = auth.uid() 
    AND businesses.id::text = (storage.foldername(name))[2]
  )
);