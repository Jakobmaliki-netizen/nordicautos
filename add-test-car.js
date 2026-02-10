// Add a test car to Supabase database
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestCar() {
    console.log('➕ Adding test car to database...');
    
    const testCar = {
        brand: 'Porsche',
        model: '911',
        variant: 'Carrera S',
        year: 2023,
        price: 1850000,
        mileage: 5000,
        fuel_type: 'Benzin',
        transmission: 'Automatisk',
        horsepower: 450,
        body_type: 'Coupé',
        color: 'Sort',
        interior_color: 'Sort læder',
        doors: 2,
        seats: 4,
        description: 'Test bil - Smuk Porsche 911 Carrera S',
        features: ['Sportspakke', 'Panoramatag', 'Sportssæder'],
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70'],
        status: 'available',
        is_new: true
    };
    
    const { data, error } = await supabase
        .from('cars')
        .insert([testCar])
        .select();
    
    if (error) {
        console.error('❌ Error adding car:', error);
        process.exit(1);
    }
    
    console.log('✅ Test car added successfully!');
    console.log('📊 Car ID:', data[0].id);
    console.log('🚗 Car:', data[0].brand, data[0].model);
}

addTestCar();
