/*
  # Add Adrian, Michigan

  1. New Data
    - Add Adrian, MI to cities table
    - Add ZIP codes for Adrian
*/

-- Add Adrian, Michigan
INSERT INTO cities (
  name,
  state,
  population,
  latitude,
  longitude,
  timezone,
  image_url
)
VALUES (
  'Adrian',
  'Michigan',
  20645,
  41.8977,
  -84.0372,
  'America/Detroit',
  'https://images.unsplash.com/photo-1625628308547-36780c2e5843?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET 
  population = EXCLUDED.population,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone,
  image_url = EXCLUDED.image_url;

-- Add ZIP codes for Adrian
INSERT INTO city_zipcodes (city_id, zipcode, type) VALUES
  ((SELECT id FROM cities WHERE name = 'Adrian' AND state = 'Michigan'), '49221', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Adrian' AND state = 'Michigan'), '49229', 'primary');