/*
  # Business Directory Schema

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `name` (text) - Business name
      - `description` (text) - Business description
      - `city` (text) - City location
      - `state` (text) - State location
      - `category` (text) - Business category
      - `website` (text) - Business website
      - `employee_count` (int) - Number of employees
      - `founded_year` (int) - Year founded
      - `rating` (decimal) - Average rating
      - `review_count` (int) - Number of reviews
      - `image_url` (text) - Business image
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `rating` (int) - Rating 1-5
      - `comment` (text) - Review text
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for businesses
    - Authenticated users can create reviews
*/

-- Create businesses table
CREATE TABLE businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  city text NOT NULL,
  state text NOT NULL,
  category text NOT NULL,
  website text,
  employee_count int,
  founded_year int,
  rating decimal DEFAULT 0,
  review_count int DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for businesses
CREATE POLICY "Allow public read access to businesses"
  ON businesses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for reviews
CREATE POLICY "Allow public read access to reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update business rating
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE business_id = NEW.business_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE business_id = NEW.business_id
    )
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update business rating when a review is added
CREATE TRIGGER update_business_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_business_rating();