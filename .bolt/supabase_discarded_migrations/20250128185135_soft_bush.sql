-- First create business_articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE business_articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to business_articles" ON business_articles;
DROP POLICY IF EXISTS "Allow business owners to manage their articles" ON business_articles;

-- Add policies
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_business_articles_business ON business_articles(business_id);
CREATE INDEX IF NOT EXISTS idx_business_articles_category ON business_articles(category);
CREATE INDEX IF NOT EXISTS idx_business_articles_featured ON business_articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_business_articles_created ON business_articles(created_at);

-- Insert sample articles for specific businesses
INSERT INTO business_articles (business_id, title, content, category, image_url, tags, is_featured)
SELECT 
  b.id,
  CASE b.name
    WHEN 'Howell Main Street Diner' THEN 'Top 10 Comfort Food Dishes You Need to Try'
    WHEN 'Michigan Elite Fitness' THEN 'How to Start Your Fitness Journey: A Beginner''s Guide'
    WHEN 'Howell Tech Solutions' THEN 'Essential Tech Maintenance Tips for Small Businesses'
    WHEN 'Clean & Green Services' THEN 'Eco-Friendly Cleaning: A Guide to Sustainable Home Care'
    WHEN 'Howell Home Designs' THEN 'Interior Design Trends for 2024: What''s Hot and What''s Not'
  END,
  CASE b.name
    WHEN 'Howell Main Street Diner' THEN E'Discover the heartwarming comfort foods that have made our diner a local favorite.\n\nFrom our signature mac and cheese to our homestyle meatloaf, these dishes are crafted with love and tradition. Each recipe has been perfected over generations, using only the finest local ingredients.\n\nOur top dishes include:\n1. Classic Mac & Cheese with crispy breadcrumb topping\n2. Homestyle Meatloaf with garlic mashed potatoes\n3. Country Fried Steak with sawmill gravy\n4. Chicken Pot Pie with flaky crust\n5. Grilled Cheese & Tomato Soup combo\n\nCome visit us and experience these comforting classics for yourself!'
    WHEN 'Michigan Elite Fitness' THEN E'Starting your fitness journey can seem overwhelming, but it doesn''t have to be.\n\nThis comprehensive guide will walk you through the essential steps to begin your fitness journey on the right foot. We''ll cover everything from setting realistic goals to creating a sustainable workout routine.\n\nKey topics include:\n- Setting achievable fitness goals\n- Basic workout routines for beginners\n- Proper nutrition fundamentals\n- The importance of rest and recovery\n- Building healthy habits that last\n\nRemember, every fitness journey starts with a single step. Let us help you take that first step today.'
    WHEN 'Howell Tech Solutions' THEN E'Keep your business technology running smoothly with these essential maintenance tips.\n\nRegular tech maintenance is crucial for any modern business. This guide covers the fundamental practices that will help prevent costly downtime and ensure your systems are always operating at peak efficiency.\n\nKey areas we''ll cover:\n- Regular software updates and security patches\n- Data backup best practices\n- Hardware maintenance schedules\n- Network security essentials\n- Employee training recommendations\n\nImplementing these practices can save your business time and money in the long run.'
    WHEN 'Clean & Green Services' THEN E'Learn how to keep your home clean while protecting the environment.\n\nSustainable cleaning isn''t just about using eco-friendly products – it''s about adopting practices that reduce waste and minimize environmental impact while maintaining a healthy home.\n\nIn this guide, we''ll explore:\n- Natural cleaning solutions you can make at home\n- Sustainable cleaning tools and materials\n- Water conservation techniques\n- Reducing cleaning product waste\n- Safe alternatives to harsh chemicals\n\nDiscover how small changes in your cleaning routine can make a big difference for the environment.'
    WHEN 'Howell Home Designs' THEN E'Stay ahead of the curve with our comprehensive guide to this year''s interior design trends.\n\nThe world of interior design is constantly evolving, and 2024 brings exciting new trends along with some surprising comebacks. We''ll explore what''s trending and what''s fading in home design.\n\nHighlights include:\n- Sustainable materials and biophilic design\n- Bold color combinations and patterns\n- Multifunctional spaces\n- Smart home integration\n- Vintage and artisanal elements\n\nLearn how to incorporate these trends into your home while maintaining timeless appeal.'
  END,
  CASE b.name
    WHEN 'Howell Main Street Diner' THEN 'Food & Dining'
    WHEN 'Michigan Elite Fitness' THEN 'Health & Wellness'
    WHEN 'Howell Tech Solutions' THEN 'Technology'
    WHEN 'Clean & Green Services' THEN 'Home & Living'
    WHEN 'Howell Home Designs' THEN 'Interior Design'
  END,
  b.image_url,
  CASE b.name
    WHEN 'Howell Main Street Diner' THEN ARRAY['comfort food', 'local dining', 'recipes', 'restaurant']
    WHEN 'Michigan Elite Fitness' THEN ARRAY['fitness', 'workout', 'health', 'beginners']
    WHEN 'Howell Tech Solutions' THEN ARRAY['technology', 'maintenance', 'business', 'IT']
    WHEN 'Clean & Green Services' THEN ARRAY['cleaning', 'eco-friendly', 'sustainability', 'home care']
    WHEN 'Howell Home Designs' THEN ARRAY['interior design', 'trends', 'home decor', '2024']
  END,
  CASE b.name
    WHEN 'Michigan Elite Fitness' THEN true
    WHEN 'Howell Home Designs' THEN true
    ELSE false
  END
FROM businesses b
WHERE b.city = 'Howell' 
AND b.state = 'Michigan'
AND b.name IN (
  'Howell Main Street Diner',
  'Michigan Elite Fitness',
  'Howell Tech Solutions',
  'Clean & Green Services',
  'Howell Home Designs'
);