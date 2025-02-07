-- Drop and recreate functions with updated logic
DROP FUNCTION IF EXISTS get_nearby_businesses;
DROP FUNCTION IF EXISTS get_nearby_deals;
DROP FUNCTION IF EXISTS get_nearby_articles;

-- Create function to get nearby businesses
CREATE OR REPLACE FUNCTION get_nearby_businesses(
  lat double precision,
  lng double precision,
  radius_miles int DEFAULT 25
)
RETURNS TABLE (
  id uuid,
  name text,
  distance double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    (
      3959 * acos(
        cos(radians(lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(c.latitude))
      )
    ) AS distance
  FROM businesses b
  JOIN cities c ON b.city = c.name AND b.state = c.state
  WHERE c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
  GROUP BY b.id, b.name, c.latitude, c.longitude
  HAVING (
    3959 * acos(
      cos(radians(lat)) * 
      cos(radians(c.latitude)) * 
      cos(radians(c.longitude) - radians(lng)) + 
      sin(radians(lat)) * 
      sin(radians(c.latitude))
    )
  ) <= radius_miles
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Create function to get nearby deals
CREATE OR REPLACE FUNCTION get_nearby_deals(
  lat double precision,
  lng double precision,
  radius_miles int DEFAULT 25
)
RETURNS TABLE (
  deal_id uuid,
  business_id uuid,
  business_name text,
  title text,
  description text,
  discount_amount numeric,
  discount_type text,
  distance double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as deal_id,
    b.id as business_id,
    b.name as business_name,
    d.title,
    d.description,
    d.discount_amount,
    d.discount_type,
    (
      3959 * acos(
        cos(radians(lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(c.latitude))
      )
    ) AS distance
  FROM business_deals d
  JOIN businesses b ON d.business_id = b.id
  JOIN cities c ON b.city = c.name AND b.state = c.state
  WHERE 
    c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    AND d.start_date <= CURRENT_TIMESTAMP
    AND d.end_date >= CURRENT_TIMESTAMP
  GROUP BY d.id, b.id, b.name, d.title, d.description, d.discount_amount, d.discount_type, c.latitude, c.longitude
  HAVING (
    3959 * acos(
      cos(radians(lat)) * 
      cos(radians(c.latitude)) * 
      cos(radians(c.longitude) - radians(lng)) + 
      sin(radians(lat)) * 
      sin(radians(c.latitude))
    )
  ) <= radius_miles
  ORDER BY distance, d.is_featured DESC, d.discount_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get nearby articles
CREATE OR REPLACE FUNCTION get_nearby_articles(
  lat double precision,
  lng double precision,
  radius_miles int DEFAULT 25
)
RETURNS TABLE (
  article_id uuid,
  business_id uuid,
  business_name text,
  title text,
  category text,
  image_url text,
  distance double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id as article_id,
    b.id as business_id,
    b.name as business_name,
    a.title,
    a.category,
    a.image_url,
    (
      3959 * acos(
        cos(radians(lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(c.latitude))
      )
    ) AS distance
  FROM business_articles a
  JOIN businesses b ON a.business_id = b.id
  JOIN cities c ON b.city = c.name AND b.state = c.state
  WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
  GROUP BY a.id, b.id, b.name, a.title, a.category, a.image_url, c.latitude, c.longitude
  HAVING (
    3959 * acos(
      cos(radians(lat)) * 
      cos(radians(c.latitude)) * 
      cos(radians(c.longitude) - radians(lng)) + 
      sin(radians(lat)) * 
      sin(radians(c.latitude))
    )
  ) <= radius_miles
  ORDER BY distance, a.is_featured DESC, a.created_at DESC;
END;
$$ LANGUAGE plpgsql;