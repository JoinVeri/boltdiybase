/*
  # Fix Business Categories and Services

  1. Changes
    - Drop and recreate business_categories table with proper constraints
    - Add missing indexes for performance
    - Update RLS policies
    - Add data validation
  
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated user management
*/

-- First drop existing table if it exists
DROP TABLE IF EXISTS business_categories;

-- Recreate business_categories table
CREATE TABLE business_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(business_id, category_id)
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
CREATE INDEX idx_business_categories_primary ON business_categories(is_primary);

-- Add constraint to ensure only one primary category per business
ALTER TABLE business_categories
  ADD CONSTRAINT business_categories_one_primary
  EXCLUDE (business_id WITH =)
  WHERE (is_primary = true);

-- Add data validation
ALTER TABLE business_categories
  ADD CONSTRAINT business_categories_valid_dates
  CHECK (created_at <= CURRENT_TIMESTAMP);

-- Add function to maintain one primary category per business
CREATE OR REPLACE FUNCTION maintain_one_primary_category()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary THEN
    UPDATE business_categories
    SET is_primary = false
    WHERE business_id = NEW.business_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to maintain one primary category
CREATE TRIGGER maintain_one_primary_category_trigger
  BEFORE INSERT OR UPDATE ON business_categories
  FOR EACH ROW
  EXECUTE FUNCTION maintain_one_primary_category();