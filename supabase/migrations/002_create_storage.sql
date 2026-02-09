-- Create storage bucket for car images
-- Run this in Supabase Dashboard > SQL Editor

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');

-- Create policy to allow authenticated uploads
CREATE POLICY "Authenticated users can upload car images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated updates
CREATE POLICY "Authenticated users can update car images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated deletes
CREATE POLICY "Authenticated users can delete car images" ON storage.objects 
FOR DELETE USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');