-- Add Gulf Breeze, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Gulf Breeze',
  'Florida',
  6466,
  30.3571,
  -87.1638,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Miramar Beach, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Miramar Beach',
  'Florida',
  6146,
  30.3744,
  -86.3590,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Navarre, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Navarre',
  'Florida',
  42300,
  30.4099,
  -86.8593,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Niceville, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Niceville',
  'Florida',
  15480,
  30.5169,
  -86.4822,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Panama City Beach, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Panama City Beach',
  'Florida',
  12457,
  30.1766,
  -85.8055,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Pensacola, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Pensacola',
  'Florida',
  54312,
  30.4213,
  -87.2169,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Sarasota, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Sarasota',
  'Florida',
  57738,
  27.3364,
  -82.5307,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Shalimar, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Shalimar',
  'Florida',
  834,
  30.4427,
  -86.5797,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Tampa, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Tampa',
  'Florida',
  384959,
  27.9506,
  -82.4572,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add The Villages, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'The Villages',
  'Florida',
  79077,
  28.9005,
  -82.0100,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Atlanta, Georgia
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Atlanta',
  'Georgia',
  498715,
  33.7490,
  -84.3880,
  'America/New_York',
  'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Louisville, Kentucky
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Louisville',
  'Kentucky',
  633045,
  38.2527,
  -85.7585,
  'America/Kentucky/Louisville',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Birmingham, Michigan
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Birmingham',
  'Michigan',
  21813,
  42.5467,
  -83.2154,
  'America/Detroit',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Chelsea, Michigan
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Chelsea',
  'Michigan',
  5467,
  42.3181,
  -84.0205,
  'America/Detroit',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Detroit, Michigan
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Detroit',
  'Michigan',
  674841,
  42.3314,
  -83.0458,
  'America/Detroit',
  'https://images.unsplash.com/photo-1562515798-f7d6e0017459?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Cincinnati, Ohio
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Cincinnati',
  'Ohio',
  309317,
  39.1031,
  -84.5120,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Charleston, South Carolina
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Charleston',
  'South Carolina',
  150227,
  32.7765,
  -79.9311,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Chattanooga, Tennessee
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Chattanooga',
  'Tennessee',
  182799,
  35.0456,
  -85.3097,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Nashville, Tennessee
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Nashville',
  'Tennessee',
  689447,
  36.1627,
  -86.7816,
  'America/Chicago',
  'https://images.unsplash.com/photo-1545147986-a9d6f2ab03b5?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add ZIP codes for all cities
INSERT INTO city_zipcodes (city_id, zipcode, type) VALUES
  -- Gulf Breeze, FL
  ((SELECT id FROM cities WHERE name = 'Gulf Breeze' AND state = 'Florida'), '32561', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Gulf Breeze' AND state = 'Florida'), '32563', 'primary'),

  -- Miramar Beach, FL
  ((SELECT id FROM cities WHERE name = 'Miramar Beach' AND state = 'Florida'), '32550', 'primary'),

  -- Navarre, FL
  ((SELECT id FROM cities WHERE name = 'Navarre' AND state = 'Florida'), '32566', 'primary'),

  -- Niceville, FL
  ((SELECT id FROM cities WHERE name = 'Niceville' AND state = 'Florida'), '32578', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Niceville' AND state = 'Florida'), '32588', 'primary'),

  -- Panama City Beach, FL
  ((SELECT id FROM cities WHERE name = 'Panama City Beach' AND state = 'Florida'), '32407', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Panama City Beach' AND state = 'Florida'), '32413', 'primary'),

  -- Pensacola, FL
  ((SELECT id FROM cities WHERE name = 'Pensacola' AND state = 'Florida'), '32501', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Pensacola' AND state = 'Florida'), '32502', 'primary'),

  -- Sarasota, FL
  ((SELECT id FROM cities WHERE name = 'Sarasota' AND state = 'Florida'), '34231', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Sarasota' AND state = 'Florida'), '34232', 'primary'),

  -- Shalimar, FL
  ((SELECT id FROM cities WHERE name = 'Shalimar' AND state = 'Florida'), '32579', 'primary'),

  -- Tampa, FL
  ((SELECT id FROM cities WHERE name = 'Tampa' AND state = 'Florida'), '33601', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Tampa' AND state = 'Florida'), '33602', 'primary'),

  -- The Villages, FL
  ((SELECT id FROM cities WHERE name = 'The Villages' AND state = 'Florida'), '32162', 'primary'),
  ((SELECT id FROM cities WHERE name = 'The Villages' AND state = 'Florida'), '32163', 'primary'),

  -- Atlanta, GA
  ((SELECT id FROM cities WHERE name = 'Atlanta' AND state = 'Georgia'), '30301', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Atlanta' AND state = 'Georgia'), '30302', 'primary'),

  -- Louisville, KY
  ((SELECT id FROM cities WHERE name = 'Louisville' AND state = 'Kentucky'), '40201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Louisville' AND state = 'Kentucky'), '40202', 'primary'),

  -- Birmingham, MI
  ((SELECT id FROM cities WHERE name = 'Birmingham' AND state = 'Michigan'), '48009', 'primary'),

  -- Chelsea, MI
  ((SELECT id FROM cities WHERE name = 'Chelsea' AND state = 'Michigan'), '48118', 'primary'),

  -- Detroit, MI
  ((SELECT id FROM cities WHERE name = 'Detroit' AND state = 'Michigan'), '48201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Detroit' AND state = 'Michigan'), '48202', 'primary'),

  -- Cincinnati, OH
  ((SELECT id FROM cities WHERE name = 'Cincinnati' AND state = 'Ohio'), '45201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Cincinnati' AND state = 'Ohio'), '45202', 'primary'),

  -- Charleston, SC
  ((SELECT id FROM cities WHERE name = 'Charleston' AND state = 'South Carolina'), '29401', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Charleston' AND state = 'South Carolina'), '29402', 'primary'),

  -- Chattanooga, TN
  ((SELECT id FROM cities WHERE name = 'Chattanooga' AND state = 'Tennessee'), '37401', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chattanooga' AND state = 'Tennessee'), '37402', 'primary'),

  -- Nashville, TN
  ((SELECT id FROM cities WHERE name = 'Nashville' AND state = 'Tennessee'), '37201', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Nashville' AND state = 'Tennessee'), '37202', 'primary');