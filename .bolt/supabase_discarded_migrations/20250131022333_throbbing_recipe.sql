-- Drop existing materialized view and related objects
DROP TRIGGER IF EXISTS refresh_business_counts ON businesses;
DROP FUNCTION IF EXISTS refresh_city_business_counts();
DROP MATERIALIZED VIEW IF EXISTS city_business_counts;

-- Recreate materialized view with proper permissions
CREATE MATERIALIZED VIEW city_business_counts AS
SELECT 
  c.id as city_id,
  c.name as city_name,
  c.state,
  COUNT(b.id) as business_count
FROM cities c
LEFT JOIN businesses b ON b.city = c.name AND b.state = c.state
GROUP BY c.id, c.name, c.state;

-- Create indexes
CREATE UNIQUE INDEX idx_city_business_counts_city_id ON city_business_counts(city_id);
CREATE INDEX idx_city_business_counts_count ON city_business_counts(business_count);

-- Grant permissions
GRANT SELECT ON city_business_counts TO authenticated;
GRANT SELECT ON city_business_counts TO anon;

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_city_business_counts()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW city_business_counts;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to refresh counts when businesses change
CREATE TRIGGER refresh_business_counts
AFTER INSERT OR UPDATE OR DELETE ON businesses
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_city_business_counts();

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW city_business_counts;