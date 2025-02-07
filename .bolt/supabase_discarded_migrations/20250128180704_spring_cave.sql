-- Create business_deals table
CREATE TABLE business_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  discount_amount numeric NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  terms_conditions text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_discount CHECK (
    (discount_type = 'percentage' AND discount_amount BETWEEN 0 AND 100) OR
    (discount_type = 'fixed' AND discount_amount > 0)
  )
);

-- Create business_articles table
CREATE TABLE business_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_articles ENABLE ROW LEVEL SECURITY;

-- Add policies for business_deals
CREATE POLICY "Allow public read access to business_deals"
  ON business_deals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow business owners to manage their deals"
  ON business_deals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_deals.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_deals.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Add policies for business_articles
CREATE POLICY "Allow public read access to business_articles"
  ON business_articles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow business owners to manage their articles"
  ON business_articles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_articles.business_id 
      AND businesses.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE businesses.id = business_articles.business_id 
      AND businesses.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_business_deals_business ON business_deals(business_id);
CREATE INDEX idx_business_deals_dates ON business_deals(start_date, end_date);
CREATE INDEX idx_business_deals_featured ON business_deals(is_featured);
CREATE INDEX idx_business_articles_business ON business_articles(business_id);
CREATE INDEX idx_business_articles_category ON business_articles(category);
CREATE INDEX idx_business_articles_featured ON business_articles(is_featured);
CREATE INDEX idx_business_articles_tags ON business_articles USING gin(tags);

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