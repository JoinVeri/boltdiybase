-- Create business_categories junction table
CREATE TABLE business_categories (
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (business_id, category_id)
);

-- Enable RLS
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to business_categories"
  ON business_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their business categories"
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
CREATE INDEX idx_business_categories_business ON business_categories(business_id);
CREATE INDEX idx_business_categories_category ON business_categories(category_id);