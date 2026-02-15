-- Add monthlyLeasing column to cars table
-- This column stores the monthly leasing payment in DKK

ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS "monthlyLeasing" INTEGER;

-- Add comment to explain the column
COMMENT ON COLUMN cars."monthlyLeasing" IS 'Monthly leasing payment in DKK (Danish Kroner)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cars' AND column_name = 'monthlyLeasing';
