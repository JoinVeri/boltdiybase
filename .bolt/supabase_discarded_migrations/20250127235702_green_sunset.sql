/*
  # Combine services and business_services tables

  1. Changes
    - Create new combined business_services table
    - Migrate data from old tables
    - Drop old tables
    - Add new indexes and policies

  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for authenticated users to manage their services
*/

-- Create new combined business_services table
CREATE TABLE IF NOT EXISTS new_business_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE GENERATED ALWAYS AS (
    lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
  ) STORED,
  description text,
  price_range text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Migrate data from old tables
INSERT INTO new_business_services (business_id, name, price_range, is_verified, created_at)
SELECT 
  bs.business_id,
  s.name,
  bs.price_range,
  bs.is_verified,
  COALESCE(bs.created_at, s.created_at)
FROM services s
LEFT JOIN business_services bs ON bs.service_id = s.id;

-- Drop old tables and constraints
DROP TABLE IF EXISTS business_services;
DROP TABLE IF EXISTS services;

-- Rename new table to business_services
ALTER TABLE new_business_services RENAME TO business_services;

-- Enable RLS
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;

-- Add policies
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
CREATE INDEX idx_business_services_business ON business_services(business_id);
CREATE INDEX idx_business_services_slug ON business_services(slug);
CREATE INDEX idx_business_services_name ON business_services(name);