-- Slet Mercedes A200 fra databasen
-- Kør denne SQL i Supabase SQL Editor

-- Find og slet Mercedes A200
DELETE FROM cars 
WHERE model ILIKE '%A200%' 
AND brand ILIKE '%Mercedes%';

-- Vis resultat
SELECT 'Mercedes A200 er slettet!' as result;
