-- Add foreign key reference from businesses to cities
ALTER TABLE businesses
ADD COLUMN city_id uuid REFERENCES cities(id);

-- Create index for better performance
CREATE INDEX idx_businesses_city ON businesses(city_id);

-- Update existing businesses with city_id
UPDATE businesses b
SET city_id = c.id
FROM cities c
WHERE b.city = c.name AND b.state = c.state;

-- Create function to get business count by city
CREATE OR REPLACE FUNCTION get_city_business_count(city_id uuid)
RETURNS bigint AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM businesses
    WHERE businesses.city_id = get_city_business_count.city_id
  );
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy for the new column
CREATE POLICY "Allow public read access to business city_id"
  ON businesses
  FOR SELECT
  USING (true);