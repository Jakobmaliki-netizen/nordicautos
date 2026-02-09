-- Row Level Security policies for cars table
-- Run this in Supabase Dashboard > SQL Editor

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read cars (public access)
CREATE POLICY "Anyone can view cars" ON cars
    FOR SELECT USING (true);

-- Policy: Allow anonymous users to insert cars (for demo purposes)
-- In production, you might want to restrict this to authenticated users
CREATE POLICY "Anyone can insert cars" ON cars
    FOR INSERT WITH CHECK (true);

-- Policy: Allow anonymous users to update cars (for demo purposes)  
-- In production, you might want to restrict this to authenticated users
CREATE POLICY "Anyone can update cars" ON cars
    FOR UPDATE USING (true);

-- Policy: Allow anonymous users to delete cars (for demo purposes)
-- In production, you might want to restrict this to authenticated users  
CREATE POLICY "Anyone can delete cars" ON cars
    FOR DELETE USING (true);

-- Alternative: More restrictive policies for production
-- Uncomment these and comment out the above policies for production use

/*
-- Policy: Only authenticated users can insert cars
CREATE POLICY "Authenticated users can insert cars" ON cars
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update cars
CREATE POLICY "Authenticated users can update cars" ON cars
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete cars
CREATE POLICY "Authenticated users can delete cars" ON cars
    FOR DELETE USING (auth.role() = 'authenticated');
*/