// Delete all cars from Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gfbsuydsquixhrrarjab.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYnN1eWRzcXVpeGhycmFyamFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDAyMTk0NywiZXhwIjoyMDg1NTk3OTQ3fQ.JahzSAjQs7HkEHaNjSlckq4dHTJ3DN4chXY8H67zlJI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function deleteAllCars() {
    console.log('🗑️  Deleting all cars from database...');
    
    try {
        // First, check how many cars exist
        const { data: cars, error: countError } = await supabase
            .from('cars')
            .select('id');
        
        if (countError) {
            console.error('❌ Error counting cars:', countError);
            return;
        }
        
        console.log(`📊 Found ${cars?.length || 0} cars in database`);
        
        if (!cars || cars.length === 0) {
            console.log('✅ Database is already empty!');
            return;
        }
        
        // Delete all cars
        const { error: deleteError } = await supabase
            .from('cars')
            .delete()
            .neq('id', 0); // This deletes all rows
        
        if (deleteError) {
            console.error('❌ Error deleting cars:', deleteError);
            return;
        }
        
        console.log('✅ All cars deleted successfully!');
        console.log('✅ Database is now empty (0 cars)');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

deleteAllCars();
