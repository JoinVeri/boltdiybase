/*
  # Enhanced Business Directory Schema with Many-to-Many Relationships

  1. Schema Updates
    - Add user_id to businesses table
    - Create cities and services tables
    - Create junction tables for many-to-many relationships
  
  2. New Tables
    - cities: Stores city information
    - services: Stores service categories
    - business_cities: Links businesses to cities
    - business_services: Links businesses to services
  
  3. Security
    - RLS enabled on all tables
    - Public read access
    - Protected write access for authenticated users
*/

-- Add user_id to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create cities table
CREATE TABLE cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  population integer,
  latitude decimal(9,6),
  longitude decimal(9,6),
  timezone text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, state)
);

-- Create services table with hierarchical structure
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  parent_id uuid REFERENCES services(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, category)
);

-- Create junction table for businesses and cities
CREATE TABLE business_cities (
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  primary_location boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (business_id, city_id)
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
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;

-- Policies for cities
CREATE POLICY "Allow public read access to cities"
  ON cities
  FOR SELECT
  TO public
  USING (true);

-- Policies for services
CREATE POLICY "Allow public read access to services"
  ON services
  FOR SELECT
  TO public
  USING (true);

-- Policies for business_cities
CREATE POLICY "Allow public read access to business_cities"
  ON business_cities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage business_cities"
  ON business_cities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_cities.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_cities.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Policies for business_services
CREATE POLICY "Allow public read access to business_services"
  ON business_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage business_services"
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

-- Create indexes for better query performance
CREATE INDEX idx_cities_name_state ON cities(name, state);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_parent ON services(parent_id);
CREATE INDEX idx_business_cities_city ON business_cities(city_id);
CREATE INDEX idx_business_cities_business ON business_cities(business_id);
CREATE INDEX idx_business_services_service ON business_services(service_id);
CREATE INDEX idx_business_services_business ON business_services(business_id);