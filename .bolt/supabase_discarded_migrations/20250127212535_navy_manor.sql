/*
  # Add image URLs to cities table

  1. Changes
    - Add image_url column to cities table
    - Update existing cities with high-quality Unsplash images
  
  2. Notes
    - Using curated Unsplash images for major cities
    - Images are optimized for display quality and loading speed
*/

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cities' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE cities ADD COLUMN image_url text;
  END IF;
END $$;

-- Update cities with high-quality Unsplash images
UPDATE cities 
SET image_url = CASE name
  WHEN 'New York' THEN 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600'
  WHEN 'Los Angeles' THEN 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=1600'
  WHEN 'Chicago' THEN 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1600'
  WHEN 'Houston' THEN 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?auto=format&fit=crop&w=1600'
  WHEN 'Phoenix' THEN 'https://images.unsplash.com/photo-1558645836-e44122a743ee?auto=format&fit=crop&w=1600'
  WHEN 'Philadelphia' THEN 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3?auto=format&fit=crop&w=1600'
  WHEN 'San Antonio' THEN 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1600'
  WHEN 'San Diego' THEN 'https://images.unsplash.com/photo-1538097304804-2a1b932466a9?auto=format&fit=crop&w=1600'
  WHEN 'Dallas' THEN 'https://images.unsplash.com/photo-1545194445-dddb8f4487c6?auto=format&fit=crop&w=1600'
  WHEN 'San Jose' THEN 'https://images.unsplash.com/photo-1564604761388-83eafc96f668?auto=format&fit=crop&w=1600'
  WHEN 'Austin' THEN 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=1600'
  WHEN 'Jacksonville' THEN 'https://images.unsplash.com/photo-1490309465502-86c3ea58c9c9?auto=format&fit=crop&w=1600'
  WHEN 'San Francisco' THEN 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600'
  WHEN 'Seattle' THEN 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=1600'
  WHEN 'Denver' THEN 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?auto=format&fit=crop&w=1600'
END
WHERE name IN (
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'San Francisco', 'Seattle', 'Denver'
);