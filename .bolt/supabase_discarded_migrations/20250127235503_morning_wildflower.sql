/*
  # Add Categories Table

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique, generated)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policy for public read access
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE GENERATED ALWAYS AS (
    lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
  ) STORED,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX idx_categories_slug ON categories(slug);

-- Insert categories
INSERT INTO categories (name) VALUES
  ('Air Duct Cleaning'),
  ('Animal Removal'),
  ('Antenna Repair'),
  ('Appliance Repair'),
  ('Architect'),
  ('Asbestos Removal'),
  ('Awnings'),
  ('Basement Remodeling'),
  ('Basement Waterproofing'),
  ('Basketball Hoop Installation'),
  ('Bathtub Refinishing'),
  ('Biohazard Cleanup'),
  ('Blind Cleaning'),
  ('Cabinet Makers'),
  ('Cabinet Refacing'),
  ('Carpet Cleaning'),
  ('Carpet Installation'),
  ('Ceiling Fan Installation'),
  ('Central Vacuum Cleaning'),
  ('Childproofing'),
  ('Chimney Cap Repair'),
  ('Chimney Repair'),
  ('Chimney Sweep'),
  ('Cleaning Services'),
  ('Closet Design'),
  ('Computer Repair'),
  ('Concrete Driveways'),
  ('Concrete Repair'),
  ('Countertop Installation'),
  ('Deck Cleaning'),
  ('Decks & Porches'),
  ('Dock Building'),
  ('Dog Fencing'),
  ('Door Installation'),
  ('Drain Cleaning'),
  ('Drain Pipe Installation'),
  ('Drapery Cleaning'),
  ('Driveway Gate Installation'),
  ('Driveway Pavers'),
  ('Dryer Vent Cleaning'),
  ('Drywall'),
  ('Dumpster Rental'),
  ('Earthquake Retrofitting'),
  ('Egress Window'),
  ('Electrician'),
  ('Epoxy Flooring'),
  ('Excavating'),
  ('Fence Company'),
  ('Fireplace Services'),
  ('Floor Buffing'),
  ('Floor Cleaning'),
  ('Flooring'),
  ('Foundation Repair'),
  ('Fountains'),
  ('Furniture Refinishing'),
  ('Garage Building'),
  ('Garage Doors'),
  ('Gas Fireplace Repair'),
  ('Gas Leak Repair'),
  ('General Contractors'),
  ('Generator Service'),
  ('Glass Block'),
  ('Glass Repair'),
  ('Grill Repair'),
  ('Gutter Cleaning'),
  ('Gutter Repair'),
  ('Handyman'),
  ('Hardscaping'),
  ('Hardwood Floors'),
  ('Hauling'),
  ('Heating Oil Company'),
  ('Holiday Decorating'),
  ('Home Automation'),
  ('Home Builder'),
  ('Home Energy Audit'),
  ('Home Inspection'),
  ('Home Remodeling'),
  ('Home Security Systems'),
  ('Home Staging'),
  ('Home Theater Installation'),
  ('Home Warranty'),
  ('House Cleaning'),
  ('House Painting'),
  ('Hurricane Shutters'),
  ('HVAC Companies'),
  ('Insulation'),
  ('Interior Decorators'),
  ('Interior Painting'),
  ('Iron Work'),
  ('Irrigation System'),
  ('Jewelry Appraising'),
  ('Land Surveyors'),
  ('Landscape Lighting'),
  ('Large Appliances'),
  ('Lawn & Landscaping'),
  ('Lawn Care'),
  ('Lawn Mower Repair'),
  ('Lawn Treatment'),
  ('Lead Paint Removal'),
  ('Leaf Removal'),
  ('Leather Repair'),
  ('Lighting'),
  ('Locksmith'),
  ('Mailbox Repair'),
  ('Marble & Granite'),
  ('Masonry'),
  ('Metal Fabrication'),
  ('Mobile Home Remodeling'),
  ('Mold Removal'),
  ('Movers'),
  ('Mudjacking'),
  ('Mulch Delivering'),
  ('Nurseries'),
  ('Oriental Rug Cleaning'),
  ('Outdoor Kitchens'),
  ('Patio Enclosures'),
  ('Patios'),
  ('Pest Control'),
  ('Phone Company'),
  ('Phone Repair'),
  ('Piano Movers'),
  ('Plastering'),
  ('Playground Equipment Installation'),
  ('Plumbers'),
  ('Pool Cleaning'),
  ('Pool Installers'),
  ('Pressure Washing'),
  ('Professional Organizers'),
  ('Radon Mitigation'),
  ('Real Estate Agent'),
  ('Real Estate Appraising'),
  ('Roof Cleaning'),
  ('Roof Snow Removal'),
  ('Roofing'),
  ('Rototilling'),
  ('Satellite Tv'),
  ('Screen Repair'),
  ('Septic Tank Service'),
  ('Sewer Cleaning'),
  ('Siding Companies'),
  ('Skylight Installation'),
  ('Small Appliance Repair'),
  ('Snow Removal'),
  ('Solar Companies'),
  ('Stamped Concrete'),
  ('Stone & Gravel'),
  ('Structural Engineering'),
  ('Stucco'),
  ('Tile Installation'),
  ('Trash Removal'),
  ('Tree Service'),
  ('Upholstery'),
  ('Upholstery Cleaning'),
  ('Wallpaper Hanger'),
  ('Wallpaper Removal'),
  ('Water Damage Restoration'),
  ('Water Heaters'),
  ('Water Softeners'),
  ('Welding'),
  ('Well & Water Pump Repair'),
  ('Window Cleaning'),
  ('Window Replacement'),
  ('Window Security Film'),
  ('Window Tinting'),
  ('Window Treatment'),
  ('Woodworking');

-- Add category_id to businesses table
ALTER TABLE businesses ADD COLUMN category_id uuid REFERENCES categories(id);

-- Create index for the foreign key
CREATE INDEX idx_businesses_category ON businesses(category_id);