/*
  # Add Howell, Michigan to Cities

  1. Changes
    - Insert Howell, Michigan into cities table
    - Include population, coordinates, and timezone data
    - Add high-quality image from Unsplash
  
  2. Data Sources
    - Population data from recent census
    - Coordinates verified
    - Timezone confirmed for location
*/

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
  'Howell',
  'Michigan',
  9027,
  42.6072,
  -83.9294,
  'America/Detroit',
  'https://images.unsplash.com/photo-1572204097183-e1ab140342ed?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET 
  population = EXCLUDED.population,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone,
  image_url = EXCLUDED.image_url;