// Check database schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('🔍 Checking database schema...');
    
    // Try to get one car to see the structure
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('❌ Error:', error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('📊 Database columns:', Object.keys(data[0]));
    } else {
        console.log('📊 No cars in database, trying to insert minimal car...');
        
        const testCar = {
            brand: 'Test',
            model: 'Test',
            year: 2023,
            price: 100000
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('cars')
            .insert([testCar])
            .select();
        
        if (insertError) {
            console.error('❌ Insert error:', insertError);
        } else {
            console.log('✅ Minimal car inserted');
            console.log('📊 Columns:', Object.keys(insertData[0]));
        }
    }
}

checkSchema();
