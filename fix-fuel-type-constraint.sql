-- Fix fuel type constraint to include "Plug-in Hybrid"
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Drop the old constraint
ALTER TABLE cars DROP CONSTRAINT IF EXISTS cars_fuelType_check;

-- Step 2: Add new constraint with "Plug-in Hybrid" included
ALTER TABLE cars ADD CONSTRAINT cars_fuelType_check 
CHECK ("fuelType" IN ('Benzin', 'Diesel', 'El', 'Hybrid', 'Plug-in Hybrid'));

-- Done! Now "Plug-in Hybrid" is allowed
