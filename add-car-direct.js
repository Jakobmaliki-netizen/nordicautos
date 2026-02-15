// Direct test to add a car to Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestCar() {
    console.log('🚀 Adding test car to Supabase...');
    console.log('URL:', supabaseUrl);
    
    const carData = {
        id: 10, // ADD ID
        brand: 'Audi',
        model: 'A4',
        variant: 'S-Line',
        year: 2022,
        mileage: 15000,
        price: 450000,
        fuelType: 'Benzin',
        bodyType: 'Sedan',
        horsepower: 190,
        status: 'available',
        description: 'Test bil tilføjet direkte',
        features: ['Læder', 'Navigation'],
        images: ['https://via.placeholder.com/800x600'],
        isNew: false,
        specifications: {
            engine: 'N/A',
            transmission: 'N/A',
            drivetrain: 'N/A',
            acceleration: 'N/A',
            topSpeed: 'N/A',
            fuelConsumption: 'N/A'
        },
        history: {
            previousOwners: 1,
            serviceHistory: true,
            accidents: false
        }
    };

    try {
        const { data, error } = await supabase
            .from('cars')
            .insert([carData])
            .select();

        if (error) {
            console.error('❌ Error:', error);
            return;
        }

        console.log('✅ Car added successfully!');
        console.log('📊 Data:', data);
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

addTestCar();
