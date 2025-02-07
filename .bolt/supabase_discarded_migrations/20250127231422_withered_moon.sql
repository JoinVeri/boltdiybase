/*
  # Pro Services and Cities Schema Update

  1. New Tables
    - `pro_services` - Services offered by pro users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `price_range` (text)
      - `created_at` (timestamptz)

    - `pro_service_cities` - Cities where services are offered
      - `pro_service_id` (uuid, references pro_services)
      - `city_id` (uuid, references cities)
      - `is_primary` (boolean)
      - `service_radius` (integer) - Distance in miles
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access

  3. Changes
    - Add indexes for better query performance
*/

-- Create pro_services table
CREATE TABLE pro_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_range text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create pro_service_cities junction table
CREATE TABLE pro_service_cities (
  pro_service_id uuid REFERENCES pro_services(id) ON DELETE CASCADE,
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  service_radius integer,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (pro_service_id, city_id)
);

-- Enable RLS
ALTER TABLE pro_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_service_cities ENABLE ROW LEVEL SECURITY;

-- Policies for pro_services
CREATE POLICY "Allow public read access to pro_services"
  ON pro_services
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their pro_services"
  ON pro_services
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for pro_service_cities
CREATE POLICY "Allow public read access to pro_service_cities"
  ON pro_service_cities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage their pro_service_cities"
  ON pro_service_cities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pro_services
      WHERE pro_services.id = pro_service_cities.pro_service_id
      AND pro_services.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pro_services
      WHERE pro_services.id = pro_service_cities.pro_service_id
      AND pro_services.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_pro_services_user ON pro_services(user_id);
CREATE INDEX idx_pro_service_cities_city ON pro_service_cities(city_id);
CREATE INDEX idx_pro_service_cities_service ON pro_service_cities(pro_service_id);