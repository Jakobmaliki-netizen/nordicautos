// Admin Dashboard functionality for Nordic Autos

class AdminDashboard {
    constructor() {
        this.cars = [];
        this.contacts = [];
        this.currentEditingCar = null;
        
        this.init();
    }

    /**
     * Initialize dashboard
     */
    async init() {
        this.setupEventListeners();
        this.displayCurrentUser();
        await this.loadData();
        this.updateStats();
        this.renderCarsTable();
        this.loadContacts();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Logout button
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            if (window.adminAuth) {
                window.adminAuth.logout();
            }
        });

        // Add car button
        document.getElementById('add-car-btn')?.addEventListener('click', () => {
            this.openCarModal();
        });

        // View contacts button
        document.getElementById('view-contacts-btn')?.addEventListener('click', () => {
            this.toggleContactsView();
        });

        // Modal controls
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeCarModal();
        });

        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            this.closeCarModal();
        });

        // Car form
        document.getElementById('car-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCarFormSubmit();
        });

        // Search and filter
        document.getElementById('search-cars')?.addEventListener('input', (e) => {
            this.filterCars(e.target.value, document.getElementById('filter-status').value);
        });

        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.filterCars(document.getElementById('search-cars').value, e.target.value);
        });
    }

    /**
     * Display current user
     */
    displayCurrentUser() {
        const userElement = document.getElementById('current-user');
        if (userElement && window.adminAuth) {
            const user = window.adminAuth.getCurrentUser();
            userElement.textContent = `Logget ind som: ${user.username}`;
        }
    }

    /**
     * Load car data from Supabase ONLY - no localStorage fallback
     */
    async loadData() {
        try {
            // ONLY load from Supabase - no fallbacks
            if (window.supabaseCarManager) {
                await window.supabaseCarManager.initialize();
                this.cars = await window.supabaseCarManager.getCars();
                console.log(`📊 Loaded ${this.cars.length} cars from Supabase`);
                
                // Clear any old localStorage data
                localStorage.removeItem('nordicAutoCarsData');
                localStorage.removeItem('nordic-autos-cars');
            } else {
                console.error('❌ Supabase Car Manager not available');
                this.cars = [];
            }
        } catch (error) {
            console.error('❌ Error loading cars data:', error);
            this.cars = [];
        }
    }

    /**
     * Update dashboard statistics
     */
    updateStats() {
        const totalCars = this.cars.length;
        const availableCars = this.cars.filter(car => car.status === 'available').length;
        const reservedCars = this.cars.filter(car => car.status === 'reserved').length;
        const soldCars = this.cars.filter(car => car.status === 'sold').length;

        document.getElementById('total-cars').textContent = totalCars;
        document.getElementById('available-cars').textContent = availableCars;
        document.getElementById('reserved-cars').textContent = reservedCars;
        document.getElementById('sold-cars').textContent = soldCars;
    }

    /**
     * Render cars table
     */
    renderCarsTable(carsToRender = null) {
        const tbody = document.getElementById('cars-table-body');
        if (!tbody) return;

        const cars = carsToRender || this.cars;
        
        if (cars.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        Ingen biler fundet
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = cars.map(car => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-3">
                            <span class="material-symbols-outlined text-slate-400">directions_car</span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-slate-900 dark:text-white">${car.brand} ${car.model}</div>
                            <div class="text-sm text-slate-500 dark:text-slate-400">${car.variant || ''}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">${car.year}</td>
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">${car.mileage?.toLocaleString('da-DK')} km</td>
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">${car.price?.toLocaleString('da-DK')} DKK</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${this.getStatusBadgeClass(car.status)}">
                        ${this.getStatusText(car.status)}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-2">
                        <button onclick="adminDashboard.editCar('${car.id}')" 
                                class="text-primary hover:text-primary-dark">
                            <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onclick="adminDashboard.deleteCar('${car.id}')" 
                                class="text-red-600 hover:text-red-800">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                        <a href="../bil-detaljer.html?id=${car.id}" target="_blank"
                           class="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
                            <span class="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Get status badge CSS class
     */
    getStatusBadgeClass(status) {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
            case 'sold':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
        }
    }

    /**
     * Get status text in Danish
     */
    getStatusText(status) {
        switch (status) {
            case 'available':
                return 'Tilgængelig';
            case 'reserved':
                return 'Reserveret';
            case 'sold':
                return 'Solgt';
            default:
                return 'Ukendt';
        }
    }

    /**
     * Filter cars based on search and status
     */
    filterCars(searchTerm, statusFilter) {
        let filteredCars = this.cars;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredCars = filteredCars.filter(car => 
                car.brand.toLowerCase().includes(term) ||
                car.model.toLowerCase().includes(term) ||
                (car.variant && car.variant.toLowerCase().includes(term))
            );
        }

        // Apply status filter
        if (statusFilter) {
            filteredCars = filteredCars.filter(car => car.status === statusFilter);
        }

        this.renderCarsTable(filteredCars);
    }

    /**
     * Open car modal for adding/editing
     */
    openCarModal(car = null) {
        const modal = document.getElementById('car-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('car-form');
        
        if (!modal || !title || !form) return;

        this.currentEditingCar = car;
        
        if (car) {
            title.textContent = 'Rediger bil';
            this.populateCarForm(car);
        } else {
            title.textContent = 'Tilføj ny bil';
            form.reset();
            document.getElementById('car-id').value = '';
        }

        modal.classList.remove('hidden');
    }

    /**
     * Close car modal
     */
    closeCarModal() {
        const modal = document.getElementById('car-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditingCar = null;
    }

    /**
     * Populate car form with existing data
     */
    populateCarForm(car) {
        document.getElementById('car-id').value = car.id;
        document.getElementById('car-brand').value = car.brand;
        document.getElementById('car-model').value = car.model;
        document.getElementById('car-variant').value = car.variant || '';
        document.getElementById('car-year').value = car.year;
        document.getElementById('car-mileage').value = car.mileage;
        document.getElementById('car-horsepower').value = car.horsepower || '';
        document.getElementById('car-price').value = car.price;
        document.getElementById('car-fuel-type').value = car.fuelType;
        document.getElementById('car-body-type').value = car.bodyType || '';
        document.getElementById('car-status').value = car.status;
        document.getElementById('car-description').value = car.description || '';
        
        // Handle features array
        if (car.features && Array.isArray(car.features)) {
            document.getElementById('car-features').value = car.features.join('\n');
        } else {
            document.getElementById('car-features').value = '';
        }
        
        // Handle images array
        if (car.images && Array.isArray(car.images)) {
            document.getElementById('car-images').value = car.images.join('\n');
        } else {
            document.getElementById('car-images').value = '';
        }
    }

    /**
     * Handle car form submission
     */
    async handleCarFormSubmit() {
        const formData = new FormData(document.getElementById('car-form'));
        
        // Get ID - use existing ID if editing, otherwise generate new
        const existingId = formData.get('id');
        const carId = (existingId && existingId !== '') ? 
            (typeof existingId === 'string' ? parseInt(existingId, 10) : existingId) : 
            this.generateCarId();
        
        // Parse features from textarea (one per line)
        const featuresText = formData.get('features') || '';
        const features = featuresText.split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);
        
        // Parse images from textarea (one per line)
        const imagesText = formData.get('images') || '';
        const images = imagesText.split('\n')
            .map(img => img.trim())
            .filter(img => img.length > 0);
        
        const carData = {
            id: carId,
            brand: formData.get('brand'),
            model: formData.get('model'),
            variant: formData.get('variant') || '',
            year: parseInt(formData.get('year')),
            mileage: parseInt(formData.get('mileage')),
            horsepower: parseInt(formData.get('horsepower')) || 0,
            price: parseInt(formData.get('price')),
            fuelType: formData.get('fuelType'),
            bodyType: formData.get('bodyType') || 'Sedan',
            status: formData.get('status'),
            description: formData.get('description') || '',
            features: features,
            images: images,
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

        console.log('💾 Saving car data:', carData);

        try {
            if (this.currentEditingCar) {
                console.log('✏️ Updating existing car with ID:', carId);
                // Update existing car via Supabase
                if (window.supabaseCarManager) {
                    const result = await window.supabaseCarManager.saveCar(carData);
                    console.log('📡 Supabase save result:', result);
                    if (result) {
                        const index = this.cars.findIndex(car => car.id === carId || car.id == carId);
                        if (index !== -1) {
                            this.cars[index] = carData;
                            console.log('✅ Updated car in local array');
                        }
                    }
                } else {
                    // Fallback to localStorage
                    const index = this.cars.findIndex(car => car.id === carId || car.id == carId);
                    if (index !== -1) {
                        this.cars[index] = carData;
                    }
                }
            } else {
                console.log('➕ Adding new car with ID:', carId);
                // Add new car via Supabase
                if (window.supabaseCarManager) {
                    const result = await window.supabaseCarManager.saveCar(carData);
                    console.log('📡 Supabase save result:', result);
                    if (result) {
                        this.cars.push(carData);
                        console.log('✅ Added car to local array');
                    }
                } else {
                    // Fallback to localStorage
                    this.cars.push(carData);
                }
            }

            // Reload from Supabase to ensure sync
            await this.loadData();
            
            // Dispatch event to notify other pages about car updates
            const eventDetail = { 
                action: this.currentEditingCar ? 'updated' : 'added',
                car: carData 
            };
            console.log('🔔 Dispatching carsUpdated event:', eventDetail);
            
            // Use localStorage to communicate across tabs
            localStorage.setItem('nordic-autos-last-update', JSON.stringify({
                timestamp: Date.now(),
                action: eventDetail.action,
                car: carData
            }));
            
            // Also dispatch regular event for same-page updates
            window.dispatchEvent(new CustomEvent('carsUpdated', {
                detail: eventDetail
            }));
            
            // Update UI
            this.updateStats();
            this.renderCarsTable();
            this.closeCarModal();
            
            // Show success message
            this.showNotification(
                this.currentEditingCar ? 'Bil opdateret succesfuldt!' : 'Ny bil tilføjet succesfuldt!',
                'success'
            );
        } catch (error) {
            console.error('❌ Error saving car:', error);
            this.showNotification('Fejl ved gemning af bil: ' + error.message, 'error');
        }
    }

    /**
     * Generate unique numeric car ID
     */
    generateCarId() {
        // Find the highest existing ID and add 1
        if (this.cars.length === 0) {
            return 1;
        }
        
        const maxId = Math.max(...this.cars.map(car => {
            // Convert string IDs to numbers, default to 0 if invalid
            const id = typeof car.id === 'string' ? parseInt(car.id, 10) : car.id;
            return isNaN(id) ? 0 : id;
        }));
        
        return maxId + 1;
    }

    /**
     * Edit car
     */
    editCar(carId) {
        // Convert carId to number if it's a string
        const numericId = typeof carId === 'string' ? parseInt(carId, 10) : carId;
        const car = this.cars.find(c => c.id === numericId || c.id === carId);
        if (car) {
            this.openCarModal(car);
        } else {
            console.error('Car not found with ID:', carId);
        }
    }

    /**
     * Delete car
     */
    async deleteCar(carId) {
        // Convert carId to number if it's a string
        const numericId = typeof carId === 'string' ? parseInt(carId, 10) : carId;
        
        if (confirm('Er du sikker på, at du vil slette denne bil?')) {
            try {
                // Delete from Supabase ONLY
                if (window.supabaseCarManager) {
                    const result = await window.supabaseCarManager.deleteCar(numericId);
                    if (result) {
                        console.log(`✅ Car ${carId} deleted from Supabase`);
                        
                        // Reload from Supabase to ensure sync
                        await this.loadData();
                    } else {
                        throw new Error('Failed to delete car from Supabase');
                    }
                } else {
                    throw new Error('Supabase not available');
                }
                
                // Dispatch event to notify other pages about car deletion
                const eventDetail = { 
                    action: 'deleted',
                    carId: carId 
                };
                console.log('🔔 Dispatching carsUpdated event:', eventDetail);
                
                // Use localStorage to communicate across tabs
                localStorage.setItem('nordic-autos-last-update', JSON.stringify({
                    timestamp: Date.now(),
                    action: eventDetail.action,
                    carId: carId
                }));
                
                // Also dispatch regular event for same-page updates
                window.dispatchEvent(new CustomEvent('carsUpdated', {
                    detail: eventDetail
                }));
                
                this.updateStats();
                this.renderCarsTable();
                this.showNotification('Bil slettet succesfuldt!', 'success');
            } catch (error) {
                console.error('❌ Error deleting car:', error);
                this.showNotification('Fejl ved sletning af bil: ' + error.message, 'error');
            }
        }
    }

    /**
     * Save cars data - REMOVED localStorage backup
     * All data is now stored in Supabase only
     */
    saveCarsData() {
        // No longer saving to localStorage
        // All data is in Supabase
        console.log('💾 Data saved to Supabase (localStorage backup disabled)');
    }

    /**
     * Load contacts from localStorage
     */
    loadContacts() {
        const contacts = localStorage.getItem('contactSubmissions');
        if (contacts) {
            try {
                this.contacts = JSON.parse(contacts);
            } catch (error) {
                console.error('Error loading contacts:', error);
                this.contacts = [];
            }
        }
    }

    /**
     * Toggle contacts view
     */
    toggleContactsView() {
        const contactsSection = document.getElementById('contact-inquiries');
        if (!contactsSection) return;

        if (contactsSection.classList.contains('hidden')) {
            contactsSection.classList.remove('hidden');
            this.renderContactsTable();
            document.getElementById('view-contacts-btn').innerHTML = `
                <span class="material-symbols-outlined">visibility_off</span>
                Skjul henvendelser
            `;
        } else {
            contactsSection.classList.add('hidden');
            document.getElementById('view-contacts-btn').innerHTML = `
                <span class="material-symbols-outlined">contact_mail</span>
                Se henvendelser
            `;
        }
    }

    /**
     * Render contacts table
     */
    renderContactsTable() {
        const tbody = document.getElementById('contacts-table-body');
        if (!tbody) return;

        if (this.contacts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                        Ingen henvendelser endnu
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.contacts.map(contact => `
            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800">
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">${contact.name}</td>
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    <a href="mailto:${contact.email}" class="text-primary hover:underline">${contact.email}</a>
                </td>
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">${contact.subject || 'Generel henvendelse'}</td>
                <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    ${new Date(contact.timestamp).toLocaleDateString('da-DK')}
                </td>
                <td class="px-6 py-4 text-sm font-medium">
                    <button onclick="adminDashboard.viewContactDetails('${contact.timestamp}')" 
                            class="text-primary hover:text-primary-dark">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * View contact details
     */
    viewContactDetails(timestamp) {
        const contact = this.contacts.find(c => c.timestamp === timestamp);
        if (!contact) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="bg-white dark:bg-card-dark rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">Kontakt Detaljer</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Navn</label>
                        <p class="text-slate-900 dark:text-white">${contact.name}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <p class="text-slate-900 dark:text-white">
                            <a href="mailto:${contact.email}" class="text-primary hover:underline">${contact.email}</a>
                        </p>
                    </div>
                    
                    ${contact.phone ? `
                        <div>
                            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefon</label>
                            <p class="text-slate-900 dark:text-white">
                                <a href="tel:${contact.phone}" class="text-primary hover:underline">${contact.phone}</a>
                            </p>
                        </div>
                    ` : ''}
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emne</label>
                        <p class="text-slate-900 dark:text-white">${contact.subject || 'Generel henvendelse'}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Besked</label>
                        <p class="text-slate-900 dark:text-white whitespace-pre-wrap">${contact.message}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dato</label>
                        <p class="text-slate-500 dark:text-slate-400">${new Date(contact.timestamp).toLocaleString('da-DK')}</p>
                    </div>
                </div>
                
                <div class="flex justify-end gap-4 mt-8">
                    <a href="mailto:${contact.email}?subject=Re: ${contact.subject || 'Din henvendelse'}" 
                       class="btn-primary flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">reply</span>
                        Svar på email
                    </a>
                    <button onclick="this.closest('.fixed').remove()" class="btn-outline">
                        Luk
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-green-100 text-green-800 border border-green-200'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined">
                    ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
                </span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto">
                    <span class="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
} else {
    window.AdminDashboard = AdminDashboard;
}