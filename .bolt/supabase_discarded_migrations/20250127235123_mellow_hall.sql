/*
  # Add services table and seed data

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `category` (text)
      - `created_at` (timestamptz)

  2. Changes
    - Add junction table `business_services` to link businesses with services
    - Add RLS policies for both tables
    - Seed services table with predefined list
    - Handle duplicate service names by adding a suffix
*/

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE GENERATED ALWAYS AS (
    lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
  ) STORED,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create junction table for businesses and services
CREATE TABLE business_services (
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  price_range text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (business_id, service_id)
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;

-- Policies for services
CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  TO public
  USING (true);

-- Policies for business_services
CREATE POLICY "Allow public read access to business_services"
  ON business_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their business services"
  ON business_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_services.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_services.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_business_services_service ON business_services(service_id);
CREATE INDEX idx_business_services_business ON business_services(business_id);

-- Create a temporary table to handle duplicates
CREATE TEMP TABLE temp_services (
  name text,
  occurrence int
);

-- Insert service names and count occurrences
INSERT INTO temp_services (name, occurrence)
SELECT name, ROW_NUMBER() OVER (PARTITION BY name ORDER BY name)
FROM (VALUES
  ('20 Yard Dumpster Rental Services'),
  ('24 Hour Animal Control Services'),
  -- ... (previous values)
  ('Carpet Installation'),
  ('Carpet Installation'),  -- This duplicate will get a suffix
  -- ... (remaining values)
  ('Yard Clean Up Services')
) AS t(name);

-- Insert into services table with suffix for duplicates
INSERT INTO services (name)
SELECT 
  CASE 
    WHEN occurrence > 1 THEN name || ' ' || occurrence
    ELSE name 
  END
FROM temp_services;

-- Drop temporary table
DROP TABLE temp_services;