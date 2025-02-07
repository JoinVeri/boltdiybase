-- Add Fairhope, Alabama
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Fairhope',
  'Alabama',
  22477,
  30.5220,
  -87.9033,
  'America/Chicago',
  'https://images.unsplash.com/photo-1625179853340-45b1b4cc690c?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Foley, Alabama
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Foley',
  'Alabama',
  20335,
  30.4065,
  -87.6836,
  'America/Chicago',
  'https://images.unsplash.com/photo-1571989569011-0aa1b35b3aae?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Gulf Shores, Alabama
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Gulf Shores',
  'Alabama',
  15014,
  30.2460,
  -87.7008,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Orange Beach, Alabama
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Orange Beach',
  'Alabama',
  8095,
  30.2697,
  -87.5867,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Tuscaloosa, Alabama
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Tuscaloosa',
  'Alabama',
  100618,
  33.2098,
  -87.5692,
  'America/Chicago',
  'https://images.unsplash.com/photo-1580037056323-47fe6e5e3b0f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Chandler, Arizona
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Chandler',
  'Arizona',
  275987,
  33.3062,
  -111.8413,
  'America/Phoenix',
  'https://images.unsplash.com/photo-1590751329824-a5ac2a710f44?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Beulah, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Beulah',
  'Florida',
  7122,
  30.4702,
  -87.3047,
  'America/Chicago',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Destin, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Destin',
  'Florida',
  13931,
  30.3935,
  -86.4958,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Fort Myers, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Fort Myers',
  'Florida',
  86395,
  26.6406,
  -81.8723,
  'America/New_York',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add Fort Walton Beach, Florida
INSERT INTO cities (name, state, population, latitude, longitude, timezone, image_url)
VALUES (
  'Fort Walton Beach',
  'Florida',
  21335,
  30.4058,
  -86.6187,
  'America/Chicago',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1600'
)
ON CONFLICT (name, state) DO UPDATE
SET population = EXCLUDED.population,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    timezone = EXCLUDED.timezone,
    image_url = EXCLUDED.image_url;

-- Add ZIP codes for all cities
INSERT INTO city_zipcodes (city_id, zipcode, type) VALUES
  -- Fairhope, AL
  ((SELECT id FROM cities WHERE name = 'Fairhope' AND state = 'Alabama'), '36532', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Fairhope' AND state = 'Alabama'), '36533', 'primary'),
  
  -- Foley, AL
  ((SELECT id FROM cities WHERE name = 'Foley' AND state = 'Alabama'), '36535', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Foley' AND state = 'Alabama'), '36536', 'primary'),
  
  -- Gulf Shores, AL
  ((SELECT id FROM cities WHERE name = 'Gulf Shores' AND state = 'Alabama'), '36542', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Gulf Shores' AND state = 'Alabama'), '36547', 'primary'),
  
  -- Orange Beach, AL
  ((SELECT id FROM cities WHERE name = 'Orange Beach' AND state = 'Alabama'), '36561', 'primary'),
  
  -- Tuscaloosa, AL
  ((SELECT id FROM cities WHERE name = 'Tuscaloosa' AND state = 'Alabama'), '35401', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Tuscaloosa' AND state = 'Alabama'), '35404', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Tuscaloosa' AND state = 'Alabama'), '35405', 'primary'),
  
  -- Chandler, AZ
  ((SELECT id FROM cities WHERE name = 'Chandler' AND state = 'Arizona'), '85224', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chandler' AND state = 'Arizona'), '85225', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Chandler' AND state = 'Arizona'), '85226', 'primary'),
  
  -- Beulah, FL
  ((SELECT id FROM cities WHERE name = 'Beulah' AND state = 'Florida'), '32526', 'primary'),
  
  -- Destin, FL
  ((SELECT id FROM cities WHERE name = 'Destin' AND state = 'Florida'), '32541', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Destin' AND state = 'Florida'), '32550', 'primary'),
  
  -- Fort Myers, FL
  ((SELECT id FROM cities WHERE name = 'Fort Myers' AND state = 'Florida'), '33901', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Fort Myers' AND state = 'Florida'), '33902', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Fort Myers' AND state = 'Florida'), '33903', 'primary'),
  
  -- Fort Walton Beach, FL
  ((SELECT id FROM cities WHERE name = 'Fort Walton Beach' AND state = 'Florida'), '32547', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Fort Walton Beach' AND state = 'Florida'), '32548', 'primary'),
  ((SELECT id FROM cities WHERE name = 'Fort Walton Beach' AND state = 'Florida'), '32549', 'primary');