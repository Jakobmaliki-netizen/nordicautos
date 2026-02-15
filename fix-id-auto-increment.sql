-- Fix cars table to auto-generate IDs
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Create a sequence for the ID
CREATE SEQUENCE IF NOT EXISTS cars_id_seq;

-- Step 2: Set the sequence to start from the highest existing ID + 1
SELECT setval('cars_id_seq', COALESCE((SELECT MAX(id) FROM cars), 0) + 1, false);

-- Step 3: Alter the id column to use the sequence as default
ALTER TABLE cars ALTER COLUMN id SET DEFAULT nextval('cars_id_seq');

-- Step 4: Make the sequence owned by the column (so it gets deleted if column is deleted)
ALTER SEQUENCE cars_id_seq OWNED BY cars.id;

-- Done! Now IDs will be auto-generated
-- You can test by inserting without specifying an ID:
-- INSERT INTO cars (brand, model, year, mileage, price, "fuelType") 
-- VALUES ('Test', 'Car', 2023, 10000, 100000, 'Benzin');
