/*
  # Add major US cities

  1. New Data
    - Adds 15 major US cities with their population data
    - Cities selected match our featured cities in the UI
  
  2. Notes
    - Population data is from recent estimates
    - Timezone data uses IANA timezone names
    - Coordinates are approximate city centers
*/

INSERT INTO cities (name, state, population, latitude, longitude, timezone)
VALUES
  ('New York', 'New York', 8804190, 40.7128, -74.0060, 'America/New_York'),
  ('Los Angeles', 'California', 3898747, 34.0522, -118.2437, 'America/Los_Angeles'),
  ('Chicago', 'Illinois', 2746388, 41.8781, -87.6298, 'America/Chicago'),
  ('Houston', 'Texas', 2313000, 29.7604, -95.3698, 'America/Chicago'),
  ('Phoenix', 'Arizona', 1608139, 33.4484, -112.0740, 'America/Phoenix'),
  ('Philadelphia', 'Pennsylvania', 1603797, 39.9526, -75.1652, 'America/New_York'),
  ('San Antonio', 'Texas', 1547253, 29.4241, -98.4936, 'America/Chicago'),
  ('San Diego', 'California', 1386932, 32.7157, -117.1611, 'America/Los_Angeles'),
  ('Dallas', 'Texas', 1304379, 32.7767, -96.7970, 'America/Chicago'),
  ('San Jose', 'California', 1013240, 37.3382, -121.8863, 'America/Los_Angeles'),
  ('Austin', 'Texas', 961855, 30.2672, -97.7431, 'America/Chicago'),
  ('Jacksonville', 'Florida', 949611, 30.3322, -81.6557, 'America/New_York'),
  ('San Francisco', 'California', 873965, 37.7749, -122.4194, 'America/Los_Angeles'),
  ('Seattle', 'Washington', 737015, 47.6062, -122.3321, 'America/Los_Angeles'),
  ('Denver', 'Colorado', 727211, 39.7392, -104.9903, 'America/Denver')
ON CONFLICT (name, state) DO UPDATE
SET 
  population = EXCLUDED.population,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  timezone = EXCLUDED.timezone;