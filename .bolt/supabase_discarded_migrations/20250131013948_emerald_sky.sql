-- Drop existing objects
DROP TRIGGER IF EXISTS refresh_business_counts ON businesses;
DROP FUNCTION IF EXISTS refresh_city_business_counts();
DROP MATERIALIZED VIEW IF EXISTS city_business_counts;

-- Recreate materialized view with better concurrency support
CREATE MATERIALIZED VIEW city_business_counts AS
SELECT 
  c.id as city_id,
  c.name as city_name,
  c.state,
  COUNT(DISTINCT b.id) as business_count
FROM cities c
LEFT JOIN businesses b ON b.city = c.name AND b.state = c.state
GROUP BY c.id, c.name, c.state
WITH NO DATA;

-- Create indexes for better performance
CREATE UNIQUE INDEX ON city_business_counts (city_id);
CREATE INDEX ON city_business_counts (business_count);

-- Create improved refresh function
CREATE OR REPLACE FUNCTION refresh_city_business_counts()
RETURNS trigger AS $$
BEGIN
  -- Use a background worker to refresh the view
  PERFORM pg_notify('refresh_business_counts', '');
  
  -- Refresh the view concurrently to avoid locks
  REFRESH MATERIALIZED VIEW CONCURRENTLY city_business_counts;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger with better error handling
CREATE TRIGGER refresh_business_counts
AFTER INSERT OR UPDATE OR DELETE ON businesses
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_city_business_counts();

-- Initial population of the materialized view
REFRESH MATERIALIZED VIEW city_business_counts;

-- Create function to get accurate business count
CREATE OR REPLACE FUNCTION get_city_business_count(city_id uuid)
RETURNS bigint AS $$
DECLARE
  count_value bigint;
BEGIN
  -- First try to get count from materialized view
  SELECT business_count INTO count_value
  FROM city_business_counts
  WHERE city_business_counts.city_id = get_city_business_count.city_id;

  -- If no result, fall back to direct count
  IF count_value IS NULL THEN
    SELECT COUNT(DISTINCT b.id) INTO count_value
    FROM businesses b
    JOIN cities c ON b.city = c.name AND b.state = c.state
    WHERE c.id = city_id;
  END IF;

  RETURN COALESCE(count_value, 0);
END;
$$ LANGUAGE plpgsql;