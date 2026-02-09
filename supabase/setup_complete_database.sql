-- COMPLETE SUPABASE SETUP FOR NORDIC AUTOS
-- Copy and paste this entire script into Supabase Dashboard > SQL Editor
-- This will create everything you need in one go

-- =====================================================
-- 1. CREATE CARS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS cars (
    id BIGINT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
    mileage INTEGER NOT NULL CHECK (mileage >= 0),
    price INTEGER NOT NULL CHECK (price > 0),
    "fuelType" TEXT NOT NULL CHECK ("fuelType" IN ('Benzin', 'Diesel', 'El', 'Hybrid')),
    "bodyType" TEXT,
    horsepower INTEGER CHECK (horsepower > 0),
    images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
    "isNew" BOOLEAN DEFAULT false,
    specifications JSONB DEFAULT '{}'::jsonb,
    history JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars("fuelType");
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);

-- =====================================================
-- 3. CREATE UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at 
    BEFORE UPDATE ON cars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Allow everyone to read cars (public access)
CREATE POLICY "Anyone can view cars" ON cars
    FOR SELECT USING (true);

-- Allow everyone to insert cars (for demo - restrict in production)
CREATE POLICY "Anyone can insert cars" ON cars
    FOR INSERT WITH CHECK (true);

-- Allow everyone to update cars (for demo - restrict in production)
CREATE POLICY "Anyone can update cars" ON cars
    FOR UPDATE USING (true);

-- Allow everyone to delete cars (for demo - restrict in production)
CREATE POLICY "Anyone can delete cars" ON cars
    FOR DELETE USING (true);

-- =====================================================
-- 6. CREATE STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true) 
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. CREATE STORAGE POLICIES
-- =====================================================

CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Anyone can upload car images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Anyone can update car images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'car-images');

CREATE POLICY "Anyone can delete car images" ON storage.objects 
FOR DELETE USING (bucket_id = 'car-images');

-- =====================================================
-- 8. INSERT SAMPLE DATA
-- =====================================================

INSERT INTO cars (id, brand, model, variant, year, mileage, price, "fuelType", "bodyType", horsepower, images, features, description, status, "isNew", specifications, history) VALUES

(1, 'Porsche', '911 Carrera S', '3.0 Turbo PDK', 2022, 15000, 1895000, 'Benzin', 'Coupe', 450, 
'["https://lh3.googleusercontent.com/aida-public/AB6AXuDksibLrJ7HkhzUCgofsn55oxY07JdlTjmqKrmAZquxdBnpB8ZUPPYYmzgxG-cd0H04_jPcFixTuFmUaObppFKJseamsrcxUfMNxyyFKyL9MZDFaZ0G1ZdBQDRmteSUe5ab-BaN_XzwJdZ-5mWCyTnNFf984m-S39S3g2GPVgMeM2i5qQOZ7wiDvrm4pez4N0RtmoxdYwtNHl1x_My17U-_OgaR0Hq36EFv5ok8IIKRdIra2Jz5ht8m_POzHlqpaDwNXkse9D1ov8kj"]'::jsonb,
'["Sport Chrono Package", "PASM Sport Suspension", "Sport Exhaust System", "LED Matrix Headlights", "Porsche Communication Management"]'::jsonb,
'En fantastisk Porsche 911 Carrera S med kun 15.000 km på tælleren. Bilen er udstyret med Sport Chrono Package og mange andre eksklusive features.',
'available', true,
'{"engine": "3.0L Twin-Turbo H6", "transmission": "8-speed PDK", "drivetrain": "Baghjulstræk", "acceleration": "3.7 sekunder (0-100 km/t)", "topSpeed": "308 km/t", "fuelConsumption": "9.0L/100km"}'::jsonb,
'{"previousOwners": 1, "serviceHistory": true, "accidents": false}'::jsonb),

(2, 'Mercedes-Benz', 'EQA 250', 'Electric Art', 2023, 12000, 485000, 'El', 'SUV', 190,
'["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format"]'::jsonb,
'["MBUX Infotainment", "LED High Performance", "Keyless-Go", "Klimaautomatik", "Parkeringspakke"]'::jsonb,
'Mercedes-Benz EQA 250 - kompakt elektrisk SUV med moderne design og avanceret teknologi.',
'available', false,
'{"engine": "Electric Motor", "transmission": "Single-Speed", "drivetrain": "Forhjulstræk", "acceleration": "8.9 sekunder (0-100 km/t)", "topSpeed": "160 km/t", "fuelConsumption": "17.7 kWh/100km"}'::jsonb,
'{"previousOwners": 1, "serviceHistory": true, "accidents": false}'::jsonb),

(3, 'Mercedes-Benz', 'EQB 300', '4MATIC Electric Art', 2023, 8500, 625000, 'El', 'SUV', 228,
'["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format"]'::jsonb,
'["MBUX Infotainment", "4MATIC Firehjulstræk", "LED High Performance", "Panoramatag", "Avanceret Parkeringspakke"]'::jsonb,
'Mercedes-Benz EQB 300 4MATIC - rummelig elektrisk SUV med firehjulstræk og plads til 7 personer.',
'available', true,
'{"engine": "Dual Electric Motors", "transmission": "Single-Speed", "drivetrain": "4MATIC AWD", "acceleration": "8.0 sekunder (0-100 km/t)", "topSpeed": "160 km/t", "fuelConsumption": "19.8 kWh/100km"}'::jsonb,
'{"previousOwners": 1, "serviceHistory": true, "accidents": false}'::jsonb),

(4, 'Volkswagen', 'ID.3 Pro', '58 kWh', 2023, 15000, 385000, 'El', 'Hatchback', 204,
'["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format"]'::jsonb,
'["ID.Light", "Discover Pro Navigation", "Keyless Access", "Klimaautomatik", "App-Connect"]'::jsonb,
'Volkswagen ID.3 Pro - moderne elektrisk bil med god rækkevidde og avanceret teknologi.',
'available', false,
'{"engine": "Electric Motor", "transmission": "Single-Speed", "drivetrain": "Baghjulstræk", "acceleration": "7.3 sekunder (0-100 km/t)", "topSpeed": "160 km/t", "fuelConsumption": "16.3 kWh/100km"}'::jsonb,
'{"previousOwners": 1, "serviceHistory": true, "accidents": false}'::jsonb),

(5, 'Mercedes-Benz', 'AMG G 63', '4.0 V8 Bi-Turbo 4MATIC+', 2021, 35000, 3195000, 'Benzin', 'SUV', 585,
'["https://lh3.googleusercontent.com/aida-public/AB6AXuC2fLD02i5Uz4oBg1eFTEEqhIihhAH4VyZTZdCN8UadVTAl2-7ZV8L07ouxjL3ErbCIqFk02QPUmOlgALeOQ2Amo3jAc2kUFiNbf2ekimtaAWttGbqfKLSmx4DgChYF11b7k_NZyhDuxnEFXXNy"]'::jsonb,
'["AMG Performance Package", "Carbon Fiber Package", "Burmester High-End 3D Surround Sound", "AMG Night Package", "Exclusive Interior Package"]'::jsonb,
'Mercedes-AMG G 63 - den ikoniske G-Wagon med 585 hk V8 motor og legendarisk off-road kapacitet.',
'available', false,
'{"engine": "4.0L Twin-Turbo V8", "transmission": "9-speed AMG Speedshift", "drivetrain": "4MATIC+ AWD", "acceleration": "4.5 sekunder (0-100 km/t)", "topSpeed": "220 km/t", "fuelConsumption": "13.1L/100km"}'::jsonb,
'{"previousOwners": 2, "serviceHistory": true, "accidents": false}'::jsonb),

(6, 'Volkswagen', 'ID.Buzz Pro', '77 kWh', 2023, 5000, 685000, 'El', 'Van', 204,
'["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop&auto=format"]'::jsonb,
'["ID.Light", "Discover Pro Navigation", "Keyless Access", "3-zone Klimaautomatik", "Panoramatag"]'::jsonb,
'Volkswagen ID.Buzz Pro - den elektriske genfødte VW Bus med moderne teknologi og nostalgisk design.',
'available', true,
'{"engine": "Electric Motor", "transmission": "Single-Speed", "drivetrain": "Baghjulstræk", "acceleration": "10.2 sekunder (0-100 km/t)", "topSpeed": "145 km/t", "fuelConsumption": "21.4 kWh/100km"}'::jsonb,
'{"previousOwners": 1, "serviceHistory": true, "accidents": false}'::jsonb)

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE! 
-- =====================================================
-- Your Nordic Autos database is now ready to use!
-- You should see 6 cars in your cars table.
-- The car-images storage bucket is created and ready.
-- All policies are set for public access (demo mode).
-- =====================================================