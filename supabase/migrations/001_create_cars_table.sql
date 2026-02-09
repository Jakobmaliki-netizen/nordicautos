-- Create cars table for Nordic Autos
-- Run this in Supabase Dashboard > SQL Editor

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars("fuelType");
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);

-- Create updated_at trigger
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