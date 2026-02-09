// Supabase Configuration for Nordic Autos
const supabaseConfig = {
    url: 'https://gfbsuydsquixhrrarjab.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYnN1eWRzcXVpeGhycmFyamFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjE5NDcsImV4cCI6MjA4NTU5Nzk0N30.M4nA8itsVSpcZb4l1w3cHtl_86KV89BHyt7xNE0hdSY'
};

let supabase;

async function initializeSupabase() {
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
        
        console.log('🚀 Supabase initialized successfully!');
        
        const { data, error } = await supabase.from('cars').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116') throw error;
        
        console.log('✅ Supabase connection verified!');
        return true;
    } catch (error) {
        console.error('❌ Supabase initialization failed:', error);
        console.log('📝 Falling back to localStorage mode');
        return false;
    }
}

// Car Database Functions
class SupabaseCarManager {
    constructor() {
        this.isSupabaseReady = false;
        this.fallbackToLocalStorage = false;
    }

    async initialize() {
        this.isSupabaseReady = await initializeSupabase();
        if (!this.isSupabaseReady) {
            this.fallbackToLocalStorage = true;
            console.log('🔄 Using localStorage fallback mode');
        }
        return this.isSupabaseReady;
    }

    // Get all cars
    async getCars() {
        if (this.fallbackToLocalStorage) {
            return this.getLocalStorageCars();
        }

        try {
            const { data: cars, error } = await supabase
                .from('cars')
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                throw error;
            }
            
            console.log(`🚗 Loaded ${cars.length} cars from Supabase`);
            return cars || [];
        } catch (error) {
            console.error('❌ Error loading cars from Supabase:', error);
            return this.getLocalStorageCars();
        }
    }

    // Save car to Supabase
    async saveCar(car) {
        if (this.fallbackToLocalStorage) {
            return this.saveLocalStorageCar(car);
        }

        try {
            // Ensure car has a valid numeric ID
            let numericId = car.id;
            
            // If ID is a string, try to parse it
            if (typeof car.id === 'string') {
                numericId = parseInt(car.id, 10);
            }
            
            // If ID is missing, invalid, or NaN, generate a new numeric ID
            if (!numericId || isNaN(numericId)) {
                const { data: existingCars } = await supabase
                    .from('cars')
                    .select('id')
                    .order('id', { ascending: false })
                    .limit(1);
                
                numericId = existingCars && existingCars.length > 0 ? existingCars[0].id + 1 : 1;
            }

            // Remove fields that don't exist in Supabase schema
            const { imageUrl, icon, ...cleanCarData } = car;

            const carData = {
                ...cleanCarData,
                id: numericId, // Ensure ID is numeric
                updated_at: new Date().toISOString()
            };

            console.log('📤 Sending to Supabase:', carData);

            // Use upsert with correct syntax
            const { data, error } = await supabase
                .from('cars')
                .upsert(carData, { 
                    onConflict: 'id'
                })
                .select();

            if (error) {
                throw error;
            }
            
            console.log(`✅ Car ${car.brand} ${car.model} saved to Supabase with ID: ${numericId}`);
            return data && data.length > 0 ? data[0] : true;
        } catch (error) {
            console.error('❌ Error saving car to Supabase:', error);
            return this.saveLocalStorageCar(car);
        }
    }

    // Delete car from Supabase
    async deleteCar(carId) {
        if (this.fallbackToLocalStorage) {
            return this.deleteLocalStorageCar(carId);
        }

        try {
            // Ensure carId is numeric
            const numericId = typeof carId === 'string' ? parseInt(carId, 10) : carId;
            
            if (isNaN(numericId)) {
                throw new Error(`Invalid car ID: ${carId}`);
            }

            const { error } = await supabase
                .from('cars')
                .delete()
                .eq('id', numericId);

            if (error) {
                throw error;
            }
            
            console.log(`🗑️ Car ${carId} deleted from Supabase`);
            return true;
        } catch (error) {
            console.error('❌ Error deleting car from Supabase:', error);
            return this.deleteLocalStorageCar(carId);
        }
    }

    // Upload image to Supabase Storage
    async uploadImage(file, carId, imageIndex = 0) {
        if (this.fallbackToLocalStorage) {
            return this.convertToBase64(file);
        }

        try {
            // Optimize image before upload
            const optimizedFile = await this.optimizeImage(file);
            
            // Generate unique filename
            const fileName = `cars/${carId}/image_${imageIndex}_${Date.now()}.jpg`;
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('car-images')
                .upload(fileName, optimizedFile, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('car-images')
                .getPublicUrl(fileName);
            
            console.log(`📸 Image uploaded to Supabase Storage: ${publicUrl}`);
            return publicUrl;
        } catch (error) {
            console.error('❌ Error uploading image to Supabase:', error);
            return this.convertToBase64(file);
        }
    }

    // Optimize image before upload
    async optimizeImage(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                // Set target dimensions
                const maxWidth = 1200;
                const maxHeight = 800;
                
                let { width, height } = img;
                
                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Enable high-quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(resolve, 'image/jpeg', 0.85);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // Listen for real-time updates
    subscribeToCarUpdates(callback) {
        if (this.fallbackToLocalStorage) {
            // For localStorage, we'll use storage events
            window.addEventListener('storage', (e) => {
                if (e.key === 'nordic-autos-cars') {
                    callback();
                }
            });
            return;
        }

        try {
            // Subscribe to real-time changes
            const subscription = supabase
                .channel('cars-changes')
                .on('postgres_changes', 
                    { 
                        event: '*', 
                        schema: 'public', 
                        table: 'cars' 
                    }, 
                    (payload) => {
                        console.log('🔄 Real-time update received from Supabase:', payload);
                        callback();
                    }
                )
                .subscribe();

            return subscription;
        } catch (error) {
            console.error('❌ Error setting up real-time listener:', error);
        }
    }

    // Fallback localStorage functions
    getLocalStorageCars() {
        const savedCars = localStorage.getItem('nordic-autos-cars');
        if (savedCars) {
            try {
                return JSON.parse(savedCars);
            } catch (e) {
                console.error('Error parsing localStorage cars:', e);
            }
        }
        return [];
    }

    saveLocalStorageCar(car) {
        try {
            let cars = this.getLocalStorageCars();
            const existingIndex = cars.findIndex(c => c.id === car.id);
            
            if (existingIndex >= 0) {
                cars[existingIndex] = car;
            } else {
                cars.push(car);
            }
            
            localStorage.setItem('nordic-autos-cars', JSON.stringify(cars));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    deleteLocalStorageCar(carId) {
        try {
            let cars = this.getLocalStorageCars();
            cars = cars.filter(c => c.id !== carId);
            localStorage.setItem('nordic-autos-cars', JSON.stringify(cars));
            return true;
        } catch (error) {
            console.error('Error deleting from localStorage:', error);
            return false;
        }
    }

    convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Create cars table if it doesn't exist
    async createCarsTable() {
        if (this.fallbackToLocalStorage) {
            return false;
        }

        try {
            // This will be handled by Supabase migrations
            // But we can check if table exists
            const { data, error } = await supabase
                .from('cars')
                .select('count', { count: 'exact', head: true });

            return !error;
        } catch (error) {
            console.error('❌ Error checking cars table:', error);
            return false;
        }
    }
}

// Global Supabase Car Manager instance
window.supabaseCarManager = new SupabaseCarManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Supabase Car Manager...');
    await window.supabaseCarManager.initialize();
});

// Export for compatibility
window.firebaseCarManager = window.supabaseCarManager;