/*
  # Clean up redundant tables

  1. Changes
    - Drop unused tables:
      - services
      - business_services
      - pro_services
      - pro_service_cities
      - business_cities
    
  2. Notes
    - All data in these tables is either unused or can be handled by the businesses table directly
    - City relationships are handled by city/state fields in businesses table
    - Service categories are handled by the category field in businesses table
*/

-- Drop junction tables first to maintain referential integrity
DROP TABLE IF EXISTS business_services;
DROP TABLE IF EXISTS pro_service_cities;
DROP TABLE IF EXISTS business_cities;

-- Drop main tables
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS pro_services;

-- Add service_radius to businesses table if needed
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'service_radius'
  ) THEN
    ALTER TABLE businesses ADD COLUMN service_radius integer;
  END IF;
END $$;