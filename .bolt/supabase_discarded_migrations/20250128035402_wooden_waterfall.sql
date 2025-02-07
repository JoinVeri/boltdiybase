-- Add sample businesses for Howell, Michigan
INSERT INTO businesses (
  name,
  description,
  city,
  state,
  category,
  website,
  employee_count,
  founded_year,
  rating,
  review_count,
  image_url
)
VALUES
  (
    'Howell Main Street Diner',
    'Classic American diner serving homestyle breakfast and lunch in downtown Howell',
    'Howell',
    'Michigan',
    'Restaurant',
    'https://howellmainstreetdiner.example.com',
    15,
    1995,
    4.7,
    128,
    'https://images.unsplash.com/photo-1555992336-fb0d29498b13?auto=format&fit=crop&w=1600'
  ),
  (
    'Michigan Elite Fitness',
    'Full-service fitness center with personal training and group classes',
    'Howell',
    'Michigan',
    'Fitness',
    'https://mielitefit.example.com',
    12,
    2010,
    4.8,
    95,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600'
  ),
  (
    'Howell Tech Solutions',
    'Professional computer repair and IT services for homes and businesses',
    'Howell',
    'Michigan',
    'Tech Repair',
    'https://howelltech.example.com',
    8,
    2015,
    4.9,
    67,
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1600'
  ),
  (
    'Clean & Green Services',
    'Eco-friendly cleaning services for residential and commercial properties',
    'Howell',
    'Michigan',
    'Cleaning Services',
    'https://cleangreen.example.com',
    25,
    2012,
    4.6,
    156,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600'
  ),
  (
    'Howell Home Designs',
    'Interior design and home staging services',
    'Howell',
    'Michigan',
    'Interior Design',
    'https://howellhomedesigns.example.com',
    6,
    2018,
    4.8,
    42,
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600'
  );

-- Add business photos
INSERT INTO business_photos (business_id, url, caption, "order")
SELECT 
  b.id,
  b.image_url,
  'Main photo of ' || b.name,
  1
FROM businesses b
WHERE b.city = 'Howell' AND b.state = 'Michigan';