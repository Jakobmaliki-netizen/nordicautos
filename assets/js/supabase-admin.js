// Supabase Admin System for Nordic Autos
// This replaces the Firebase-based admin system with Supabase

class SupabaseAdmin {
    constructor() {
        this.cars = [];
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Supabase Admin System...');
        
        // Wait for Supabase to be ready
        if (window.supabaseCarManager) {
            await window.supabaseCarManager.initialize();
            await this.loadCars();
            this.setupRealTimeUpdates();
            this.isInitialized = true;
            console.log('✅ Supabase Admin System ready!');
        } else {
            console.error('❌ Supabase Car Manager not found');
        }
    }

    // Load cars from Supabase
    async loadCars() {
        try {
            this.cars = await window.supabaseCarManager.getCars();
            console.log(`📊 Loaded ${this.cars.length} cars from database`);
            return this.cars;
        } catch (error) {
            console.error('❌ Error loading cars:', error);
            this.cars = [];
            return [];
        }
    }

    // Get available cars (not deleted)
    getAvailableCars() {
        return this.cars.filter(car => car.status === 'available');
    }

    // Add new car
    async addCar(carData) {
        try {
            // Generate new ID
            const newId = this.cars.length > 0 ? Math.max(...this.cars.map(c => c.id)) + 1 : 1;
            
            const newCar = {
                id: newId,
                ...carData,
                status: 'available',
                created_at: new Date().toISOString()
            };

            // Upload images to Supabase Storage
            if (carData.imageFiles && carData.imageFiles.length > 0) {
                console.log(`📸 Uploading ${carData.imageFiles.length} images...`);
                const imageUrls = [];
                
                for (let i = 0; i < carData.imageFiles.length; i++) {
                    const file = carData.imageFiles[i];
                    const imageUrl = await window.supabaseCarManager.uploadImage(file, newId, i);
                    imageUrls.push(imageUrl);
                }
                
                newCar.images = imageUrls;
                newCar.imageUrl = imageUrls[0]; // Primary image
            }

            // Save to Supabase
            const success = await window.supabaseCarManager.saveCar(newCar);
            
            if (success) {
                this.cars.push(newCar);
                console.log(`✅ Car added: ${newCar.brand} ${newCar.model}`);
                return { success: true, car: newCar };
            } else {
                throw new Error('Failed to save car to database');
            }
        } catch (error) {
            console.error('❌ Error adding car:', error);
            return { success: false, error: error.message };
        }
    }

    // Update existing car
    async updateCar(carId, carData) {
        try {
            const carIndex = this.cars.findIndex(c => c.id === carId);
            if (carIndex === -1) {
                throw new Error('Car not found');
            }

            const existingCar = this.cars[carIndex];
            const updatedCar = {
                ...existingCar,
                ...carData,
                updated_at: new Date().toISOString()
            };

            // Handle new image uploads
            if (carData.imageFiles && carData.imageFiles.length > 0) {
                console.log(`📸 Uploading ${carData.imageFiles.length} new images...`);
                const newImageUrls = [];
                
                for (let i = 0; i < carData.imageFiles.length; i++) {
                    const file = carData.imageFiles[i];
                    const imageUrl = await window.supabaseCarManager.uploadImage(file, carId, Date.now() + i);
                    newImageUrls.push(imageUrl);
                }
                
                // Combine existing and new images
                const existingImages = updatedCar.images || [];
                updatedCar.images = [...existingImages, ...newImageUrls];
                updatedCar.imageUrl = updatedCar.images[0]; // Update primary image
            }

            // Save to Supabase
            const success = await window.supabaseCarManager.saveCar(updatedCar);
            
            if (success) {
                this.cars[carIndex] = updatedCar;
                console.log(`✅ Car updated: ${updatedCar.brand} ${updatedCar.model}`);
                return { success: true, car: updatedCar };
            } else {
                throw new Error('Failed to update car in database');
            }
        } catch (error) {
            console.error('❌ Error updating car:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete car
    async deleteCar(carId) {
        try {
            const success = await window.supabaseCarManager.deleteCar(carId);
            
            if (success) {
                this.cars = this.cars.filter(c => c.id !== carId);
                console.log(`🗑️ Car deleted: ${carId}`);
                return { success: true };
            } else {
                throw new Error('Failed to delete car from database');
            }
        } catch (error) {
            console.error('❌ Error deleting car:', error);
            return { success: false, error: error.message };
        }
    }

    // Setup real-time updates
    setupRealTimeUpdates() {
        if (window.supabaseCarManager) {
            window.supabaseCarManager.subscribeToCarUpdates(async () => {
                console.log('🔄 Received real-time update, refreshing cars...');
                await this.loadCars();
                
                // Notify other parts of the app
                window.dispatchEvent(new CustomEvent('carsUpdated', { 
                    detail: { cars: this.cars } 
                }));
            });
        }
    }

    // Export car data (for backup/migration)
    exportCarData() {
        const exportData = {
            cars: this.cars,
            exportDate: new Date().toISOString(),
            version: '2.0-supabase'
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // Import car data (for migration from Firebase/localStorage)
    async importCarData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            const importedCars = data.cars || data; // Handle different formats
            
            console.log(`📥 Importing ${importedCars.length} cars...`);
            
            let successCount = 0;
            let errorCount = 0;
            
            for (const car of importedCars) {
                try {
                    // Ensure car has required fields
                    const carToImport = {
                        ...car,
                        status: car.status || 'available',
                        created_at: car.created_at || car.createdAt || new Date().toISOString()
                    };
                    
                    const success = await window.supabaseCarManager.saveCar(carToImport);
                    if (success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error) {
                    console.error(`❌ Error importing car ${car.id}:`, error);
                    errorCount++;
                }
            }
            
            // Reload cars after import
            await this.loadCars();
            
            console.log(`📊 Import complete: ${successCount} success, ${errorCount} errors`);
            return { success: true, imported: successCount, errors: errorCount };
            
        } catch (error) {
            console.error('❌ Error importing car data:', error);
            return { success: false, error: error.message };
        }
    }
}

// Global Supabase Admin instance
window.supabaseAdmin = new SupabaseAdmin();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for Supabase to initialize
    setTimeout(async () => {
        await window.supabaseAdmin.initialize();
    }, 1000);
});

// Listen for cars updated events
window.addEventListener('carsUpdated', (event) => {
    console.log('🔄 Cars updated event received');
    
    // Update admin dashboard if it's open
    if (typeof loadAdminCarsList === 'function') {
        loadAdminCarsList();
    }
    
    // Update main page car display
    if (typeof updateCarDisplay === 'function') {
        updateCarDisplay();
    }
});

// Export for compatibility
window.firebaseAdmin = window.supabaseAdmin;