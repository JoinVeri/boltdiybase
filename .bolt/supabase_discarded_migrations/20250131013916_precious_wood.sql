-- Create materialized view for business counts
CREATE MATERIALIZED VIEW city_business_counts AS
SELECT 
  c.id as city_id,
  c.name as city_name,
  c.state,
  COUNT(b.id) as business_count
FROM cities c
LEFT JOIN businesses b ON b.city = c.name AND b.state = c.state
GROUP BY c.id, c.name, c.state;

-- Create index on the materialized view
CREATE UNIQUE INDEX idx_city_business_counts_city_id ON city_business_counts(city_id);
CREATE INDEX idx_city_business_counts_count ON city_business_counts(business_count);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_city_business_counts()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY city_business_counts;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh counts when businesses change
CREATE TRIGGER refresh_business_counts
AFTER INSERT OR UPDATE OR DELETE ON businesses
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_city_business_counts();

-- Drop old function if it exists
DROP FUNCTION IF EXISTS get_city_business_count(uuid);

-- Create new function that uses materialized view
CREATE OR REPLACE FUNCTION get_city_business_count(city_id uuid)
RETURNS bigint AS $$
BEGIN
  RETURN (
    SELECT business_count
    FROM city_business_counts
    WHERE city_business_counts.city_id = get_city_business_count.city_id
  );
END;
$$ LANGUAGE plpgsql;

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW city_business_counts;