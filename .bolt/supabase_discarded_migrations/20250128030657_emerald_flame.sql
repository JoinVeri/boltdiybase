/*
  # Add ZIP Codes Support

  1. New Tables
    - `city_zipcodes`
      - `id` (uuid, primary key)
      - `city_id` (uuid, references cities)
      - `zipcode` (text)
      - `type` (text) - 'primary', 'commercial', 'po_box', etc.
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on city_zipcodes table
    - Add policy for public read access
*/

-- Create city_zipcodes table
CREATE TABLE city_zipcodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  zipcode text NOT NULL,
  type text DEFAULT 'primary',
  created_at timestamptz DEFAULT now(),
  UNIQUE(city_id, zipcode)
);

-- Enable RLS
ALTER TABLE city_zipcodes ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to city_zipcodes"
  ON city_zipcodes
  FOR SELECT
  TO public
  USING (true);

-- Create indexes
CREATE INDEX idx_city_zipcodes_city ON city_zipcodes(city_id);
CREATE INDEX idx_city_zipcodes_zipcode ON city_zipcodes(zipcode);

-- Insert ZIP codes for existing cities
INSERT INTO city_zipcodes (city_id, zipcode, type) VALUES
  -- New York, NY
  ((SELECT id FROM cities WHERE name = 'New York' AND state = 'New York'), '10001', 'primary'),
  ((SELECT id FROM cities WHERE name = 'New York' AND state = 'New York'), '10002', 'primary'),
  ((SELECT id FROM cities WHERE name = 'New York' AND state = 'New York'), '10003', 'primary'),
  ((SELECT id FROM cities WHERE name = 'New York' AND state = 'New York'), '10004', 'primary'),
  ((SELECT id FROM cities WHERE name = 'New York' AND state = 'New York'), '10005', 'primary'),
  
  -- Los Angeles, CA
  ((SELECT id FROM cities WHERE name = 'Los Angeles' AND state = 'California'), '90001', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Los Angeles' AND state = 'California'), '90002', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Los Angeles' AND state = 'California'), '90003', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Los Angeles' AND state = 'California'), '90004', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Los Angeles' AND state = 'California'), '90005', 'primary'),
  
  -- Chicago, IL
  ((SELECT id FROM cities WHERE name = 'Chicago' AND state = 'Illinois'), '60601', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chicago' AND state = 'Illinois'), '60602', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chicago' AND state = 'Illinois'), '60603', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chicago' AND state = 'Illinois'), '60604', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chicago' AND state = 'Illinois'), '60605', 'primary'),
  
  -- Houston, TX
  ((SELECT id FROM cities WHERE name = 'Houston' AND state = 'Texas'), '77001', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Houston' AND state = 'Texas'), '77002', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Houston' AND state = 'Texas'), '77003', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Houston' AND state = 'Texas'), '77004', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Houston' AND state = 'Texas'), '77005', 'primary'),
  
  -- Phoenix, AZ
  ((SELECT id FROM cities WHERE name = 'Phoenix' AND state = 'Arizona'), '85001', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Phoenix' AND state = 'Arizona'), '85002', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Phoenix' AND state = 'Arizona'), '85003', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Phoenix' AND state = 'Arizona'), '85004', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Phoenix' AND state = 'Arizona'), '85005', 'primary'),
  
  -- Philadelphia, PA
  ((SELECT id FROM cities WHERE name = 'Philadelphia' AND state = 'Pennsylvania'), '19101', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Philadelphia' AND state = 'Pennsylvania'), '19102', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Philadelphia' AND state = 'Pennsylvania'), '19103', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Philadelphia' AND state = 'Pennsylvania'), '19104', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Philadelphia' AND state = 'Pennsylvania'), '19105', 'primary'),
  
  -- San Antonio, TX
  ((SELECT id FROM cities WHERE name = 'San Antonio' AND state = 'Texas'), '78201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Antonio' AND state = 'Texas'), '78202', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Antonio' AND state = 'Texas'), '78203', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Antonio' AND state = 'Texas'), '78204', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Antonio' AND state = 'Texas'), '78205', 'primary'),
  
  -- San Diego, CA
  ((SELECT id FROM cities WHERE name = 'San Diego' AND state = 'California'), '92101', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Diego' AND state = 'California'), '92102', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Diego' AND state = 'California'), '92103', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Diego' AND state = 'California'), '92104', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Diego' AND state = 'California'), '92105', 'primary'),
  
  -- Dallas, TX
  ((SELECT id FROM cities WHERE name = 'Dallas' AND state = 'Texas'), '75201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Dallas' AND state = 'Texas'), '75202', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Dallas' AND state = 'Texas'), '75203', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Dallas' AND state = 'Texas'), '75204', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Dallas' AND state = 'Texas'), '75205', 'primary'),
  
  -- San Jose, CA
  ((SELECT id FROM cities WHERE name = 'San Jose' AND state = 'California'), '95101', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Jose' AND state = 'California'), '95102', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Jose' AND state = 'California'), '95103', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Jose' AND state = 'California'), '95104', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Jose' AND state = 'California'), '95105', 'primary'),
  
  -- Austin, TX
  ((SELECT id FROM cities WHERE name = 'Austin' AND state = 'Texas'), '78701', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Austin' AND state = 'Texas'), '78702', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Austin' AND state = 'Texas'), '78703', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Austin' AND state = 'Texas'), '78704', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Austin' AND state = 'Texas'), '78705', 'primary'),
  
  -- Jacksonville, FL
  ((SELECT id FROM cities WHERE name = 'Jacksonville' AND state = 'Florida'), '32201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Jacksonville' AND state = 'Florida'), '32202', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Jacksonville' AND state = 'Florida'), '32203', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Jacksonville' AND state = 'Florida'), '32204', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Jacksonville' AND state = 'Florida'), '32205', 'primary'),
  
  -- San Francisco, CA
  ((SELECT id FROM cities WHERE name = 'San Francisco' AND state = 'California'), '94101', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Francisco' AND state = 'California'), '94102', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Francisco' AND state = 'California'), '94103', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Francisco' AND state = 'California'), '94104', 'primary'),
  ((SELECT id FROM cities WHERE name = 'San Francisco' AND state = 'California'), '94105', 'primary'),
  
  -- Seattle, WA
  ((SELECT id FROM cities WHERE name = 'Seattle' AND state = 'Washington'), '98101', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Seattle' AND state = 'Washington'), '98102', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Seattle' AND state = 'Washington'), '98103', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Seattle' AND state = 'Washington'), '98104', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Seattle' AND state = 'Washington'), '98105', 'primary'),
  
  -- Denver, CO
  ((SELECT id FROM cities WHERE name = 'Denver' AND state = 'Colorado'), '80201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Denver' AND state = 'Colorado'), '80202', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Denver' AND state = 'Colorado'), '80203', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Denver' AND state = 'Colorado'), '80204', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Denver' AND state = 'Colorado'), '80205', 'primary'),
  
  -- Howell, MI
  ((SELECT id FROM cities WHERE name = 'Howell' AND state = 'Michigan'), '48843', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Howell' AND state = 'Michigan'), '48844', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Howell' AND state = 'Michigan'), '48855', 'primary');