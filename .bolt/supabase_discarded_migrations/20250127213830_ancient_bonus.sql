/*
  # Add business photos and seed data

  1. New Tables
    - `business_photos`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `url` (text)
      - `caption` (text)
      - `order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `business_photos` table
    - Add policies for authenticated users to manage their business photos
    - Add policies for public to view photos

  3. Seed Data
    - Add 10 service businesses in New York
    - Add sample photos for each business
*/

-- Create business_photos table
CREATE TABLE business_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;

-- Policies for business_photos
CREATE POLICY "Allow public read access to business_photos"
  ON business_photos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their business photos"
  ON business_photos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_photos.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_photos.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX idx_business_photos_business ON business_photos(business_id);
CREATE INDEX idx_business_photos_order ON business_photos("order");

-- Seed businesses in New York
INSERT INTO businesses (name, description, city, state, category, website, employee_count, founded_year, rating, review_count, image_url)
VALUES
  ('Elite Fitness Studio', 'Premium fitness studio offering personalized training and group classes', 'New York', 'New York', 'Fitness', 'https://elitefitness.example.com', 25, 2015, 4.8, 156, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600'),
  ('Zen Spa & Wellness', 'Luxury spa offering massage therapy and wellness treatments', 'New York', 'New York', 'Spa & Wellness', 'https://zenspa.example.com', 30, 2012, 4.9, 243, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600'),
  ('Digital Solutions NYC', 'Full-service digital marketing and web development agency', 'New York', 'New York', 'Digital Services', 'https://digitalsolutionsnyc.example.com', 45, 2010, 4.7, 178, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600'),
  ('Manhattan Pet Care', 'Premium pet grooming and daycare services', 'New York', 'New York', 'Pet Services', 'https://manhattanpets.example.com', 15, 2018, 4.6, 92, 'https://images.unsplash.com/photo-1516734212186-65266f46771f?auto=format&fit=crop&w=1600'),
  ('Creative Photography Studio', 'Professional photography services for events and portraits', 'New York', 'New York', 'Photography', 'https://creativephoto.example.com', 8, 2016, 4.9, 134, 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1600'),
  ('Urban Interior Design', 'Contemporary interior design and decoration services', 'New York', 'New York', 'Interior Design', 'https://urbaninterior.example.com', 12, 2014, 4.8, 87, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600'),
  ('Tech Repair Pros', 'Expert repair services for phones, computers, and tablets', 'New York', 'New York', 'Tech Repair', 'https://techrepairpros.example.com', 20, 2013, 4.7, 312, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1600'),
  ('Gourmet Catering Co', 'High-end catering services for events and celebrations', 'New York', 'New York', 'Catering', 'https://gourmetcatering.example.com', 35, 2011, 4.8, 167, 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600'),
  ('Manhattan Music School', 'Professional music education for all ages and skill levels', 'New York', 'New York', 'Music Education', 'https://manhattanmusic.example.com', 18, 2009, 4.9, 245, 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1600'),
  ('Green Clean Services', 'Eco-friendly cleaning services for homes and offices', 'New York', 'New York', 'Cleaning Services', 'https://greenclean.example.com', 40, 2017, 4.6, 198, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600');

-- Add sample photos for each business
INSERT INTO business_photos (business_id, url, caption, "order")
SELECT 
  b.id,
  CASE (random() * 3)::int
    WHEN 0 THEN 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1497366216548-37526070297c'
    ELSE 'https://images.unsplash.com/photo-1516734212186-65266f46771f'
  END || '?auto=format&fit=crop&w=1600',
  'Sample photo ' || generate_series,
  generate_series
FROM businesses b
CROSS JOIN generate_series(1, 5)
WHERE b.city = 'New York' AND b.state = 'New York';