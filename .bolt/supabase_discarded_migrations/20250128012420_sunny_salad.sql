/*
  # Update Business Categories

  1. Changes
    - Add is_verified flag to business_categories
    - Add description field for category-specific details
    - Add indexes for performance
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new fields to business_categories
ALTER TABLE business_categories
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS description text;

-- Add index for is_verified flag
CREATE INDEX IF NOT EXISTS idx_business_categories_verified 
ON business_categories(is_verified);

-- Update the maintain_one_primary_category function to handle new fields
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