/*
  # Add more services

  1. Changes
    - Add additional services to business_services table
    - Services are added as templates with NULL business_id
    - Each service gets a unique slug via the GENERATED ALWAYS AS clause

  2. Notes
    - Services can be used as templates for businesses to add to their offerings
    - Descriptions provide clear explanation of each service
*/

-- Insert additional services
INSERT INTO business_services (business_id, name, description)
VALUES 
  (NULL, 'Fireplace Remodeling', 'Complete fireplace renovation and modernization services'),
  (NULL, 'Fireplace Repair', 'Expert fireplace repair and maintenance services'),
  (NULL, 'Fireplaces', 'Fireplace sales, installation, and service'),
  (NULL, 'Flat Roof Repair', 'Professional flat roof maintenance and repair'),
  (NULL, 'Flat Roofing Companies', 'Specialized flat roof installation and repair'),
  (NULL, 'Flea Control', 'Professional flea extermination services'),
  (NULL, 'Floor Cleaners', 'Professional floor cleaning and maintenance'),
  (NULL, 'Floor Installers', 'Expert flooring installation services'),
  (NULL, 'Floor Painters', 'Professional floor painting and finishing'),
  (NULL, 'Floor Polishers', 'Floor polishing and restoration services'),
  (NULL, 'Floor Sanding', 'Hardwood floor sanding and refinishing'),
  (NULL, 'Floor Waxing', 'Professional floor waxing services'),
  (NULL, 'Flooring', 'Comprehensive flooring sales and installation'),
  (NULL, 'Flooring Repair', 'Expert floor repair and restoration'),
  (NULL, 'Foundation Drain Installation', 'Professional drainage system installation'),
  (NULL, 'Foundation Installation', 'New foundation construction services'),
  (NULL, 'Foundation Repair', 'Expert foundation repair and stabilization'),
  (NULL, 'Fountain Repair', 'Water feature repair and maintenance'),
  (NULL, 'Fountains', 'Water feature design and installation'),
  (NULL, 'Freezer Repair Services', 'Professional freezer repair and maintenance'),
  (NULL, 'French Drains', 'Drainage system installation services'),
  (NULL, 'Fumigation Companies', 'Professional pest control fumigation'),
  (NULL, 'Furnace Cleaning', 'Professional furnace maintenance services'),
  (NULL, 'Furnace Installation', 'Expert furnace installation services'),
  (NULL, 'Furnace Maintenance', 'Regular furnace maintenance and tune-ups'),
  (NULL, 'Furnace Repair', 'Professional furnace repair services'),
  (NULL, 'Furnace Tune-Up', 'Preventive furnace maintenance services'),
  (NULL, 'Furniture Assembly', 'Professional furniture assembly services'),
  (NULL, 'Furniture Cleaning', 'Upholstery and furniture cleaning'),
  (NULL, 'Furniture Moving', 'Professional furniture moving services'),
  (NULL, 'Furniture Painting Services', 'Custom furniture finishing services'),
  (NULL, 'Furniture Refinishers', 'Professional furniture restoration'),
  (NULL, 'Furniture Removal Services', 'Furniture disposal and hauling'),
  (NULL, 'Furniture Repair', 'Expert furniture repair services'),
  (NULL, 'Furniture Restoration', 'Antique and furniture restoration'),
  (NULL, 'Furniture Upholstery', 'Professional reupholstery services'),
  (NULL, 'Garage Builders', 'Custom garage construction services'),
  (NULL, 'Garage Cleaning Services', 'Professional garage cleaning'),
  (NULL, 'Garage Door Installers', 'Expert garage door installation'),
  (NULL, 'Garage Door Opener Repair', 'Opener repair and maintenance'),
  (NULL, 'Garage Door Opener Services', 'Opener installation and repair'),
  (NULL, 'Garage Door Repair', 'Professional door repair services'),
  (NULL, 'Garage Door Spring Repair', 'Spring replacement and repair'),
  (NULL, 'Garage Doors', 'Door sales and installation'),
  (NULL, 'Garage Floor Epoxy & Coating', 'Floor finishing services'),
  (NULL, 'Garage Organization', 'Storage and organization solutions'),
  (NULL, 'Garage Remodeling', 'Complete garage renovation services'),
  (NULL, 'Garbage Collection', 'Waste collection services'),
  (NULL, 'Garbage Disposal Companies', 'Waste management services'),
  (NULL, 'Garbage Disposal Repair', 'Disposal repair and maintenance'),
  (NULL, 'Garbage Removal', 'Waste removal and hauling'),
  (NULL, 'Garden Design', 'Professional landscape design'),
  (NULL, 'Gardening Services', 'Garden maintenance and care'),
  (NULL, 'Gas Appliance Repair', 'Gas appliance maintenance'),
  (NULL, 'Gas Fireplace Installation', 'Gas fireplace installation services'),
  (NULL, 'Gas Fireplace Repair', 'Gas fireplace maintenance'),
  (NULL, 'Gas Grill Installers', 'Gas grill installation services'),
  (NULL, 'Gas Grill Repair', 'Grill repair and maintenance'),
  (NULL, 'Gas Leak Repair', 'Emergency gas line repair'),
  (NULL, 'Gas Logs', 'Gas log installation and service'),
  (NULL, 'Gas Plumbers', 'Gas line installation and repair'),
  (NULL, 'Gas Stove Repair', 'Gas stove maintenance services'),
  (NULL, 'Gas Water Heater Repair', 'Water heater repair services'),
  (NULL, 'Gate Installers', 'Custom gate installation'),
  (NULL, 'Gate Repair Companies', 'Gate repair and maintenance'),
  (NULL, 'Gazebo Builders', 'Custom gazebo construction'),
  (NULL, 'GE Appliance Repair', 'GE appliance service and repair'),
  (NULL, 'GE Dishwasher Repair', 'GE dishwasher maintenance'),
  (NULL, 'GE Dryer Repair', 'GE dryer service and repair'),
  (NULL, 'GE Microwave Repair', 'GE microwave maintenance'),
  (NULL, 'GE Refrigerator Repair', 'GE refrigerator service'),
  (NULL, 'GE Washing Machine Repair', 'GE washer maintenance'),
  (NULL, 'General Contractors', 'General construction services'),
  (NULL, 'Generator', 'Generator sales and service'),
  (NULL, 'Generator Installation', 'Generator installation services'),
  (NULL, 'Geothermal Installation', 'Geothermal system installation'),
  (NULL, 'Geothermal Repair', 'Geothermal system maintenance'),
  (NULL, 'Glass and Mirrors', 'Glass installation and repair'),
  (NULL, 'Glass Block', 'Glass block installation'),
  (NULL, 'Glass Block Companies', 'Glass block construction'),
  (NULL, 'Glass Contractors', 'Professional glass services'),
  (NULL, 'Glass Door Installation', 'Glass door installation services'),
  (NULL, 'Glass Door Repair', 'Glass door repair services'),
  (NULL, 'Glaziers', 'Professional glass installation'),
  (NULL, 'Grab Bar Installation', 'Safety bar installation services'),
  (NULL, 'Grading & Hauling Services', 'Land grading services'),
  (NULL, 'Grading Companies', 'Professional grading services'),
  (NULL, 'Granite Countertop Companies', 'Granite installation services'),
  (NULL, 'Granite Countertop Repair', 'Granite repair and maintenance'),
  (NULL, 'Granite Restoration', 'Granite refinishing services'),
  (NULL, 'Gravel Delivery', 'Gravel and aggregate delivery'),
  (NULL, 'Gravel Driveway Installation', 'Driveway construction services'),
  (NULL, 'Gravel Driveway Repair', 'Driveway maintenance services'),
  (NULL, 'Greenhouse Companies', 'Greenhouse construction services'),
  (NULL, 'Greenhouses and Nurseries', 'Plant nursery services'),
  (NULL, 'Grill Assembly', 'Grill assembly services'),
  (NULL, 'Groundhog Removal', 'Wildlife removal services'),
  (NULL, 'Grout Repair Services', 'Tile grout repair and restoration'),
  (NULL, 'Gutter Cleaning', 'Professional gutter maintenance'),
  (NULL, 'Gutter Guard Installation', 'Gutter protection systems'),
  (NULL, 'Gutter Installers', 'Gutter installation services'),
  (NULL, 'Gutter Repair', 'Gutter repair and maintenance'),
  (NULL, 'Gutters', 'Gutter sales and installation'),
  (NULL, 'Hail Damage Repair', 'Storm damage restoration'),
  (NULL, 'Handrail Installers', 'Handrail installation services'),
  (NULL, 'Handyman Services', 'General repair and maintenance'),
  (NULL, 'Handymen Plumbers', 'Basic plumbing services'),
  (NULL, 'Hardscape Contractor', 'Hardscape design and installation'),
  (NULL, 'Hardwood Floor Installation', 'Hardwood flooring services'),
  (NULL, 'Hardwood Floor Repair', 'Floor repair and restoration'),
  (NULL, 'Hardwood Flooring Sales and Installation', 'Flooring retail and installation'),
  (NULL, 'Hauling', 'Debris removal services'),
  (NULL, 'Heat Pump Companies', 'Heat pump sales and service'),
  (NULL, 'Heat Pump Repair', 'Heat pump maintenance'),
  (NULL, 'Heating & Cooling', 'HVAC services'),
  (NULL, 'Heating Oil', 'Heating oil delivery'),
  (NULL, 'Heating Oil Services', 'Oil heating maintenance'),
  (NULL, 'Heating Repair', 'Heating system repair'),
  (NULL, 'Hedge Trimming', 'Hedge maintenance services'),
  (NULL, 'Holiday Decorating', 'Seasonal decoration services'),
  (NULL, 'Holiday Decorators', 'Professional holiday decorating'),
  (NULL, 'Home Addition Companies', 'Home expansion services'),
  (NULL, 'Home Air Quality Testing', 'Air quality assessment'),
  (NULL, 'Home and Garage Organization', 'Organization services'),
  (NULL, 'Home Audio Companies', 'Audio system installation'),
  (NULL, 'Home Audio Equipment Repair', 'Audio system repair'),
  (NULL, 'Home Automation', 'Smart home installation'),
  (NULL, 'Home Energy Auditors', 'Energy efficiency assessment'),
  (NULL, 'Home Generator Repair', 'Generator maintenance'),
  (NULL, 'Home Inspection', 'Property inspection services'),
  (NULL, 'Home Maintenance', 'General maintenance services'),
  (NULL, 'Home Organizers', 'Professional organization services'),
  (NULL, 'Home Remodeling Contractors', 'Renovation services'),
  (NULL, 'Home Renovations', 'Complete home renovation'),
  (NULL, 'Home Security Services', 'Security system installation'),
  (NULL, 'Home Speaker Installation', 'Audio system installation'),
  (NULL, 'Home Staging', 'Real estate staging services'),
  (NULL, 'Home Theater Companies', 'Theater system sales'),
  (NULL, 'Home Theater Installation', 'Theater system installation'),
  (NULL, 'Home Theater Repair', 'Theater system maintenance'),
  (NULL, 'Home Warranty', 'Home warranty services'),
  (NULL, 'Home Window Repair', 'Window repair services'),
  (NULL, 'Home Window Tinting', 'Window tinting services'),
  (NULL, 'Hot Tub Companies', 'Hot tub sales and service'),
  (NULL, 'Hot Tub Repair', 'Hot tub maintenance'),
  (NULL, 'House Appraisers', 'Property appraisal services'),
  (NULL, 'House Cleaning Services', 'Residential cleaning'),
  (NULL, 'House Framing Companies', 'Structural framing services'),
  (NULL, 'House Leveling', 'Foundation leveling services'),
  (NULL, 'House Painters', 'Professional painting services'),
  (NULL, 'Housekeeper Agencies', 'Cleaning service providers'),
  (NULL, 'Housekeeping Services', 'Regular cleaning services'),
  (NULL, 'Humidifier Installation', 'Humidifier system installation'),
  (NULL, 'Hurricane Film', 'Window protection installation'),
  (NULL, 'Hurricane Shutter Repair', 'Shutter repair services'),
  (NULL, 'Hurricane Shutters', 'Hurricane protection systems'),
  (NULL, 'HVAC Companies', 'HVAC sales and service'),
  (NULL, 'HVAC Repairs', 'HVAC repair services'),
  (NULL, 'HVAC Technicians', 'HVAC maintenance services'),
  (NULL, 'Ice Maker Repair', 'Ice maker maintenance'),
  (NULL, 'Inground Pool Companies', 'Pool construction services'),
  (NULL, 'Inground Pool Repair Companies', 'Pool repair services'),
  (NULL, 'Insulation', 'Insulation installation'),
  (NULL, 'Insulation Installers', 'Professional insulation services'),
  (NULL, 'Interior Decorating', 'Interior design services'),
  (NULL, 'Interior Design', 'Professional design services'),
  (NULL, 'Interior Design and Decorating', 'Complete design services'),
  (NULL, 'Interior Painters', 'Interior painting services'),
  (NULL, 'Invisible Fence', 'Pet containment systems'),
  (NULL, 'iPhone Repair', 'Mobile device repair'),
  (NULL, 'Irrigation Pump Repair', 'Irrigation system maintenance'),
  (NULL, 'Jacuzzi Repair', 'Spa repair services'),
  (NULL, 'Junk Haulers', 'Junk removal services'),
  (NULL, 'Kenmore Appliance Repair', 'Kenmore appliance service'),
  (NULL, 'Kenmore Dishwasher Repair', 'Dishwasher repair services'),
  (NULL, 'Kenmore Dryer Repair', 'Dryer repair services'),
  (NULL, 'Kenmore Refrigerator Repair', 'Refrigerator maintenance'),
  (NULL, 'Kenmore Vacuum Repair', 'Vacuum repair services'),
  (NULL, 'Kenmore Washer Repair', 'Washer repair services'),
  (NULL, 'Kitchen and Bath Remodeling', 'Kitchen and bath renovation'),
  (NULL, 'Kitchen Design', 'Kitchen design services'),
  (NULL, 'Kitchen Hood Cleaning', 'Hood maintenance services'),
  (NULL, 'Kitchen Refacing', 'Cabinet refacing services'),
  (NULL, 'Kitchen Remodeling', 'Complete kitchen renovation'),
  (NULL, 'Kitchen Renovations', 'Kitchen remodeling services'),
  (NULL, 'Kitchenaid Appliance Repair', 'Kitchenaid service and repair'),
  (NULL, 'Kitchenaid Dishwasher Repair Services', 'Dishwasher repair'),
  (NULL, 'Kitchenaid Mixer Repair', 'Mixer repair services'),
  (NULL, 'Kitchenaid Oven Repair', 'Oven repair services'),
  (NULL, 'Kitchenaid Refrigerator Repair', 'Refrigerator repair'),
  (NULL, 'Koi Pond Services', 'Pond maintenance services'),
  (NULL, 'Laminate Countertop Installation', 'Countertop installation'),
  (NULL, 'Laminate Floor Cleaning Services', 'Floor cleaning services'),
  (NULL, 'Laminate Floor Installation', 'Flooring installation'),
  (NULL, 'Laminate Flooring Repair', 'Floor repair services'),
  (NULL, 'Lamp Repair', 'Lighting repair services'),
  (NULL, 'Land Clearing Services', 'Land preparation services'),
  (NULL, 'Land Surveying', 'Property surveying services'),
  (NULL, 'Landline Phone Service', 'Phone system services'),
  (NULL, 'Landscape Architects', 'Landscape design services'),
  (NULL, 'Landscape Design', 'Landscape planning services'),
  (NULL, 'Landscape Rock & Sand Delivery', 'Material delivery services'),
  (NULL, 'Landscape Rock Removal', 'Rock removal services'),
  (NULL, 'Landscapers', 'Landscaping services'),
  (NULL, 'Landscaping - Lighting', 'Landscape lighting services'),
  (NULL, 'Lawn Aeration', 'Lawn care services'),
  (NULL, 'Lawn and Yard Work', 'Yard maintenance services'),
  (NULL, 'Lawn Care', 'Professional lawn services'),
  (NULL, 'Lawn Cutting Services', 'Lawn mowing services'),
  (NULL, 'Lawn Dethatching Services', 'Lawn maintenance services'),
  (NULL, 'Lawn Fertilization & Treatment', 'Lawn treatment services'),
  (NULL, 'Lawn Irrigation', 'Irrigation system services'),
  (NULL, 'Lawn Mower Repair', 'Equipment repair services'),
  (NULL, 'Lawn Pest Control Services', 'Pest control services'),
  (NULL, 'Lawn Repair Services', 'Lawn restoration services'),
  (NULL, 'Lawn Seeding Companies', 'Lawn seeding services'),
  (NULL, 'Lawn Sprinkler Repair', 'Sprinkler maintenance'),
  (NULL, 'Lawn Treatment', 'Lawn care services'),
  (NULL, 'Lead Removal', 'Lead abatement services'),
  (NULL, 'Lead Testing', 'Lead detection services'),
  (NULL, 'Lead Testing and Removal', 'Lead remediation services'),
  (NULL, 'Leaf Removal Services', 'Yard cleanup services'),
  (NULL, 'Leak Detection', 'Leak detection services'),
  (NULL, 'Leaky Roof Repair', 'Roof repair services'),
  (NULL, 'Leather & Vinyl Repair', 'Material repair services'),
  (NULL, 'Leather Furniture Repair', 'Furniture repair services'),
  (NULL, 'LED Light Installation', 'Lighting installation'),
  (NULL, 'LG Appliance Repair Services', 'LG appliance maintenance'),
  (NULL, 'LG Refrigerator Repair', 'Refrigerator repair services'),
  (NULL, 'Light Fixture Installation', 'Lighting installation'),
  (NULL, 'Lighting', 'Lighting sales and service'),
  (NULL, 'Lighting Design', 'Lighting design services'),
  (NULL, 'Local Architects', 'Architectural services'),
  (NULL, 'Local Greenhouses', 'Plant nursery services'),
  (NULL, 'Local Movers', 'Moving services'),
  (NULL, 'Locksmiths', 'Lock and key services'),
  (NULL, 'Mailbox Installation', 'Mailbox installation services'),
  (NULL, 'Mailbox Repair', 'Mailbox repair services'),
  (NULL, 'Main Drain Camera Companies', 'Drain inspection services'),
  (NULL, 'Marble and Granite', 'Stone installation services'),
  (NULL, 'Marble Restoration & Repair', 'Stone restoration services'),
  (NULL, 'Marine Services', 'Marine maintenance services'),
  (NULL, 'Masonry', 'Masonry construction services'),
  (NULL, 'Masonry Repair', 'Masonry repair services'),
  (NULL, 'Mattress Cleaners', 'Mattress cleaning services'),
  (NULL, 'Maytag Appliance Repair', 'Maytag service and repair'),
  (NULL, 'Maytag Dishwasher Repair', 'Dishwasher repair services'),
  (NULL, 'Maytag Dryer Repair', 'Dryer repair services'),
  (NULL, 'Maytag Refrigerator Repair', 'Refrigerator repair services'),
  (NULL, 'Maytag Washer Repair', 'Washer repair services'),
  (NULL, 'Metal Fabrication & Restoration', 'Metal work services'),
  (NULL, 'Metal Fabricators', 'Custom metal fabrication'),
  (NULL, 'Metal Roof Installation', 'Roofing installation services'),
  (NULL, 'Metal Roof Repair', 'Roof repair services'),
  (NULL, 'Metal Roofing', 'Metal roofing services'),
  (NULL, 'Metal Siding Contractors', 'Siding installation services'),
  (NULL, 'Microwave Installation', 'Appliance installation'),
  (NULL, 'Microwave Repair', 'Appliance repair services'),
  (NULL, 'Mini Split Installation', 'HVAC installation services'),
  (NULL, 'Mirror Installation', 'Mirror installation services'),
  (NULL, 'Mirror Repair', 'Mirror repair services'),
  (NULL, 'Modern Architects', 'Contemporary design services'),
  (NULL, 'Modular Homes', 'Modular home construction'),
  (NULL, 'Mold Removal', 'Mold remediation services'),
  (NULL, 'Mold Testing', 'Mold inspection services'),
  (NULL, 'Mold Testing and Remediation', 'Complete mold services'),
  (NULL, 'Mosquito Control Companies', 'Pest control services'),
  (NULL, 'Move Out Cleaners', 'Move-out cleaning services'),
  (NULL, 'Moving Companies', 'Professional moving services'),
  (NULL, 'Moving Labor', 'Moving assistance services'),
  (NULL, 'Moving Services', 'Relocation services'),
  (NULL, 'Mulch and Topsoil', 'Landscaping materials'),
  (NULL, 'Mulch Delivery Services', 'Material delivery services'),
  (NULL, 'Mulching Companies', 'Mulch installation services'),
  (NULL, 'Muralists', 'Mural painting services'),
  (NULL, 'Nest Installation', 'Smart thermostat installation'),
  (NULL, 'Odor Removal Services', 'Odor elimination services'),
  (NULL, 'Opossum Control', 'Wildlife control services'),
  (NULL, 'Oriental Rug Cleaning', 'Specialty rug cleaning'),
  (NULL, 'Outdoor Kitchen Builders', 'Outdoor kitchen construction'),
  (NULL, 'Outdoor Landscape Lighting', 'Landscape lighting services'),
  (NULL, 'Outdoor Light Repair', 'Lighting repair services'),
  (NULL, 'Outdoor Plant Watering', 'Plant maintenance services'),
  (NULL, 'Oven Repair', 'Appliance repair services'),
  (NULL, 'Overhead Door Repair', 'Door repair services'),
  (NULL, 'Packing Services', 'Moving preparation services'),
  (NULL, 'Paint Stripping', 'Paint removal services'),
  (NULL, 'Palm Tree Specialists', 'Tree care services'),
  (NULL, 'Parking Lot Paving', 'Asphalt paving services'),
  (NULL, 'Patio Companies', 'Patio construction services'),
  (NULL, 'Patio Cover Companies', 'Patio cover installation'),
  (NULL, 'Patio Furniture Repair', 'Furniture repair services'),
  (NULL, 'Patio Repair', 'Patio maintenance services'),
  (NULL, 'Patios', 'Patio design and construction'),
  (NULL, 'Paver Install Companies', 'Paver installation services'),
  (NULL, 'Pavers and Hardscaping', 'Hardscape installation services');