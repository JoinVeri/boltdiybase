-- Add Daphne, Alabama
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
  'Daphne',
  'Alabama',
  27462,
  30.6035,
  -87.9036,
  'America/Chicago',
  'https://images.unsplash.com/photo-1572204097183-e1ab140342ed?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET 
  population = EXCLUDED.population,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone,
  image_url = EXCLUDED.image_url;

-- Add ZIP codes for Daphne
INSERT INTO city_zipcodes (city_id, zipcode, type) VALUES
  ((SELECT id FROM cities WHERE name = 'Daphne' AND state = 'Alabama'), '36526', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Daphne' AND state = 'Alabama'), '36527', 'primary');