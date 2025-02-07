-- Add gutter installation category
INSERT INTO categories (name, description)
VALUES (
  'Gutter Installation',
  'Professional gutter system installation services including seamless gutters, downspouts, and gutter guards'
)
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;