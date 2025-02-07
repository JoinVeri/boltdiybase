/*
  # Update City Rankings
  
  1. Changes
    - Set ranking = 1 for Howell and Adrian, Michigan
    - Reset all other city rankings to NULL
*/

-- First reset all rankings
UPDATE cities SET ranking = NULL;

-- Set rankings for Howell and Adrian to 1
UPDATE cities 
SET ranking = 1
WHERE name IN ('Howell', 'Adrian') 
AND state = 'Michigan';