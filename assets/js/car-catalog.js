// Car Catalog functionality for Nordic Autos Website

class CarCatalog {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentPage = 1;
        this.carsPerPage = 9;
        this.filters = {
            brand: null,
            priceMin: 0,
            priceMax: 5000000,
            bodyTypes: [],
            fuelTypes: [],
            searchTerm: ''
        };
        this.sortBy = 'newest';
        
        this.init();
    }

    /**
     * Initialize car catalog
     */
    async init() {
        console.log('CarCatalog initializing...');
        try {
            await this.loadCarsData();
            console.log('Cars data loaded:', this.cars.length, 'cars');
            
            this.setupFilters();
            this.setupEventListeners();
            this.setupRealTimeUpdates();
            this.applyFiltersAndSort();
            
            console.log('CarCatalog initialized successfully');
        } catch (error) {
            console.error('Failed to initialize car catalog:', error);
            this.showError('Kunne ikke indlæse bilkataloget. Prøv at genindlæse siden.');
            
            // No fallback - only show error
            this.cars = [];
            this.setupFilters();
            this.setupEventListeners();
            this.applyFiltersAndSort();
        }
    }

    /**
     * Load cars data from Supabase only - no fallbacks
     */
    async loadCarsData() {
        console.log('🔄 Loading cars data from Supabase...');
        
        // ONLY load from Supabase - no fallbacks
        if (window.supabaseCarManager) {
            try {
                console.log('📡 Loading from Supabase...');
                await window.supabaseCarManager.initialize();
                this.cars = await window.supabaseCarManager.getCars();
                
                // Ensure cars is an array
                if (!Array.isArray(this.cars)) {
                    console.warn('⚠️ Cars data is not an array, converting...');
                    this.cars = [];
                }
                
                console.log(`✅ Loaded ${this.cars.length} cars from Supabase`);
                console.log('📸 First car images:', this.cars[0]?.images);
                
                // Filter out cars without status or set to available
                this.cars = this.cars.filter(car => !car.status || car.status === 'available');
                
                window.carsData = this.cars; // Make available globally
                
                return;
            } catch (error) {
                console.error('❌ Supabase load failed:', error);
                this.cars = [];
                throw error;
            }
        } else {
            console.error('❌ SupabaseCarManager not available');
            this.cars = [];
            throw new Error('SupabaseCarManager not available');
        }
    }

    /**
     * Get sample cars data as fallback - REMOVED
     * No fallback data - only load from Supabase database
     */
    getSampleCarsData() {
        console.warn('⚠️ getSampleCarsData() called - returning empty array. Only Supabase data should be used.');
        return [];
    }

    /**
     * Setup filter interface - simplified to only brand filter
     */
    setupFilters() {
        const filtersContainer = document.getElementById('filters-container');
        if (!filtersContainer) return;

        filtersContainer.innerHTML = `
            <!-- Brand Filter -->
            <div class="flex flex-col gap-3">
                <label class="text-slate-900 dark:text-white text-sm font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-lg">directions_car</span>
                    Mærke
                </label>
                <select id="brand-filter" class="form-select">
                    <option value="">Alle mærker</option>
                    ${this.getUniqueBrands().map(brand => `<option value="${brand}">${brand}</option>`).join('')}
                </select>
                <div id="selected-brand" class="hidden text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded">
                    <!-- Selected brand will show here -->
                </div>
            </div>

            <!-- Reset Button -->
            <button id="reset-filters-btn" class="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-border-dark text-white text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all">
                <span class="material-symbols-outlined text-sm">refresh</span>
                Nulstil filtre
            </button>
        `;
    }

    /**
     * Setup event listeners - simplified for brand filter only
     */
    setupEventListeners() {
        // Brand filter
        const brandFilter = document.getElementById('brand-filter');
        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                this.filters.brand = e.target.value || null;
                this.updateBrandFilterDisplay(e.target);
                this.applyFiltersAndSort();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFiltersAndSort();
            });
        }

        // Reset filters button
        const resetBtn = document.getElementById('reset-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Global reset filters button (from empty state)
        const globalResetBtn = document.getElementById('reset-filters');
        if (globalResetBtn) {
            globalResetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    /**
     * Setup real-time updates from Supabase
     */
    setupRealTimeUpdates() {
        console.log('🔄 Setting up real-time updates...');
        
        // Set up Supabase real-time subscription if available
        if (window.supabaseCarManager && !window.supabaseCarManager.fallbackToLocalStorage) {
            try {
                const subscription = window.supabaseCarManager.subscribeToCarUpdates(() => {
                    console.log('🔄 Real-time update from Supabase, refreshing catalog');
                    this.forceRefreshFromSupabase();
                });
                console.log('✅ Supabase real-time subscription active');
            } catch (error) {
                console.error('❌ Error setting up Supabase real-time:', error);
            }
        }
        
        // Listen for cars updated events from admin dashboard
        window.addEventListener('carsUpdated', async (event) => {
            console.log('🔄 Cars updated event received in catalog', event.detail);
            await this.forceRefreshFromSupabase();
        });
        
        // Listen for storage events (localStorage fallback and cross-tab communication)
        window.addEventListener('storage', (e) => {
            if (e.key === 'nordic-autos-cars' || e.key === 'nordic-autos-last-update') {
                console.log('🔄 Storage update detected, refreshing catalog');
                this.forceRefreshFromSupabase();
            }
        });
        
        // Periodic refresh every 10 seconds (reduced from 30)
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                console.log('🔄 Periodic refresh of car catalog');
                this.forceRefreshFromSupabase();
            }
        }, 10000);
        
        // Refresh when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('🔄 Page became visible, refreshing car catalog');
                this.forceRefreshFromSupabase();
            }
        });
        
        console.log('✅ Real-time updates configured');
    }

    /**
     * Force refresh data directly from Supabase (bypassing cache)
     */
    async forceRefreshFromSupabase() {
        console.log('🔄 Force refreshing from Supabase...');
        
        if (window.supabaseCarManager) {
            try {
                // Re-initialize to ensure fresh connection
                await window.supabaseCarManager.initialize();
                
                // Get fresh data
                this.cars = await window.supabaseCarManager.getCars();
                console.log(`✅ Force loaded ${this.cars.length} cars from Supabase`);
                
                // Ensure cars is an array
                if (!Array.isArray(this.cars)) {
                    console.warn('⚠️ Cars data is not an array, converting...');
                    this.cars = [];
                }
                
                // Update UI
                this.applyFiltersAndSort();
                
                return true;
            } catch (error) {
                console.error('❌ Force refresh from Supabase failed:', error);
                // Fallback to regular load
                await this.loadCarsData();
                this.applyFiltersAndSort();
                return false;
            }
        } else {
            console.warn('⚠️ SupabaseCarManager not available for force refresh');
            await this.loadCarsData();
            this.applyFiltersAndSort();
            return false;
        }
    }

    /**
     * Update brand filter display
     */
    updateBrandFilterDisplay(selectElement) {
        const selectedBrandDiv = document.getElementById('selected-brand');
        
        if (selectElement.value) {
            selectElement.classList.add('filter-selected');
            if (selectedBrandDiv) {
                selectedBrandDiv.textContent = `Valgt: ${selectElement.value}`;
                selectedBrandDiv.classList.remove('hidden');
            }
        } else {
            selectElement.classList.remove('filter-selected');
            if (selectedBrandDiv) {
                selectedBrandDiv.classList.add('hidden');
            }
        }
    }

    /**
     * Toggle body type filter
     */
    toggleBodyTypeFilter(button, bodyType) {
        const isActive = button.classList.contains('filter-button-active');
        
        if (isActive) {
            button.classList.remove('filter-button-active');
            button.classList.add('filter-button');
            this.filters.bodyTypes = this.filters.bodyTypes.filter(type => type !== bodyType);
        } else {
            button.classList.remove('filter-button');
            button.classList.add('filter-button-active');
            this.filters.bodyTypes.push(bodyType);
        }
        
        this.applyFiltersAndSort();
    }

    /**
     * Toggle fuel type filter
     */
    toggleFuelTypeFilter(fuelType, checked) {
        if (checked) {
            if (!this.filters.fuelTypes.includes(fuelType)) {
                this.filters.fuelTypes.push(fuelType);
            }
        } else {
            this.filters.fuelTypes = this.filters.fuelTypes.filter(type => type !== fuelType);
        }
        
        this.applyFiltersAndSort();
    }

    /**
     * Apply filters and sorting - simplified for brand filter only
     */
    applyFiltersAndSort() {
        this.showLoading();
        
        // Apply filters
        this.filteredCars = this.cars.filter(car => {
            // Brand filter
            if (this.filters.brand && car.brand !== this.filters.brand) {
                return false;
            }
            
            return true;
        });

        // Apply sorting
        this.sortCars();
        
        // Update display
        this.currentPage = 1;
        this.updateCarCount();
        this.renderCars();
        this.renderPagination();
        
        this.hideLoading();
    }

    /**
     * Sort cars based on current sort option
     */
    sortCars() {
        switch (this.sortBy) {
            case 'price_low':
                this.filteredCars.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                this.filteredCars.sort((a, b) => b.price - a.price);
                break;
            case 'year':
                this.filteredCars.sort((a, b) => b.year - a.year);
                break;
            case 'mileage':
                this.filteredCars.sort((a, b) => a.mileage - b.mileage);
                break;
            case 'newest':
            default:
                this.filteredCars.sort((a, b) => {
                    // Sort by isNew first, then by year
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return b.year - a.year;
                });
                break;
        }
    }

    /**
     * Render cars grid
     */
    renderCars() {
        const carsGrid = document.getElementById('cars-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!carsGrid) return;

        if (this.filteredCars.length === 0) {
            carsGrid.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        const startIndex = (this.currentPage - 1) * this.carsPerPage;
        const endIndex = startIndex + this.carsPerPage;
        const carsToShow = this.filteredCars.slice(startIndex, endIndex);

        carsGrid.innerHTML = carsToShow.map(car => this.createCarCard(car)).join('');
        
        // Refresh lazy loading for new images
        if (window.imageOptimizer) {
            window.imageOptimizer.refreshLazyLoading();
        }
    }

    /**
     * Create car card HTML
     */
    createCarCard(car) {
        const badge = this.getCarBadge(car);
        const mainImage = car.images && car.images.length > 0 ? car.images[0] : this.getPlaceholderImage();
        
        return `
            <div class="group bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer" onclick="window.location.href='bil-detaljer.html?id=${car.id}'">
                <div class="relative h-56 overflow-hidden">
                    ${badge}
                    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         src="${mainImage}" 
                         alt="${car.brand} ${car.model}"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjQ3NDhiIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJpbGxlZGUgaWtrZSB0aWxnw6ZuZ2VsaWd0PC90ZXh0Pjwvc3ZnPg=='" />
                </div>
                <div class="p-6">
                    <div class="flex flex-col gap-1 mb-4">
                        <h3 class="text-slate-900 dark:text-white text-xl font-bold leading-tight">${car.brand} ${car.model}</h3>
                        <p class="text-primary font-semibold">${car.variant || ''}</p>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-border-dark mb-4">
                        <div class="flex flex-col items-center">
                            <span class="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Årgang</span>
                            <span class="text-sm font-bold dark:text-white">${car.year}</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <span class="material-symbols-outlined text-slate-400 text-lg">${this.getFuelIcon(car.fuelType)}</span>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">HK</span>
                            <span class="text-sm font-bold dark:text-white">${car.horsepower || 'N/A'}</span>
                        </div>
                        <div class="flex flex-col items-center">
                            <span class="material-symbols-outlined text-slate-400 text-lg">${this.getFuelTypeIcon(car.fuelType)}</span>
                            <span class="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Brændstof</span>
                            <span class="text-sm font-bold dark:text-white">${car.fuelType}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-slate-500 dark:text-slate-400 text-xs font-medium">${this.getMonthlyLeasing(car) ? 'Leasingydelse pr. måned' : 'Pris inkl. afgift'}</span>
                            <span class="text-slate-900 dark:text-white text-xl font-black tracking-tight">${this.getMonthlyLeasing(car) ? this.formatMonthlyLeasing(this.getMonthlyLeasing(car)) : this.formatPrice(car.price) + ' DKK'}</span>
                        </div>
                        <button class="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-border-dark text-slate-600 dark:text-white hover:bg-primary hover:text-white transition-all">
                            <span class="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get car badge HTML
     */
    getCarBadge(car) {
        if (car.isNew) {
            return '<div class="absolute top-4 left-4 z-10"><span class="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Nyhed</span></div>';
        }
        
        if (car.status === 'reserved') {
            return '<div class="absolute top-4 right-4 z-10"><span class="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Reserveret</span></div>';
        }
        
        return '';
    }

    /**
     * Get fuel type icon
     */
    getFuelIcon(fuelType) {
        switch (fuelType?.toLowerCase()) {
            case 'el':
            case 'electric':
                return 'bolt';
            case 'hybrid':
                return 'bolt';
            default:
                return 'speed';
        }
    }

    /**
     * Get fuel type display icon
     */
    getFuelTypeIcon(fuelType) {
        switch (fuelType?.toLowerCase()) {
            case 'el':
            case 'electric':
                return 'ev_station';
            case 'hybrid':
                return 'ev_station';
            default:
                return 'local_gas_station';
        }
    }

    /**
     * Update car count display
     */
    updateCarCount() {
        const carCount = document.getElementById('car-count');
        if (carCount) {
            carCount.textContent = this.filteredCars.length;
        }
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredCars.length / this.carsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <button class="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 hover:text-primary transition-all ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                    onclick="carCatalog.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <span class="material-symbols-outlined">chevron_left</span>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const isActive = i === this.currentPage;
            paginationHTML += `
                <button class="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark font-medium transition-all ${isActive ? 'bg-primary text-white border-primary' : 'text-slate-500 dark:text-white hover:bg-slate-100 dark:hover:bg-border-dark'}" 
                        onclick="carCatalog.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        paginationHTML += `
            <button class="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-border-dark text-slate-500 hover:text-primary transition-all ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
                    onclick="carCatalog.goToPage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                <span class="material-symbols-outlined">chevron_right</span>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredCars.length / this.carsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderCars();
        this.renderPagination();
        
        // Scroll to top of cars grid
        const carsGrid = document.getElementById('cars-grid');
        if (carsGrid) {
            carsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Reset all filters - simplified for brand filter only
     */
    resetFilters() {
        this.filters = {
            brand: null,
            priceMin: 0,
            priceMax: 5000000,
            bodyTypes: [],
            fuelTypes: [],
            searchTerm: ''
        };
        
        // Reset UI
        const brandFilter = document.getElementById('brand-filter');
        if (brandFilter) {
            brandFilter.value = '';
            brandFilter.classList.remove('filter-selected');
        }
        
        const selectedBrandDiv = document.getElementById('selected-brand');
        if (selectedBrandDiv) {
            selectedBrandDiv.classList.add('hidden');
        }
        
        this.applyFiltersAndSort();
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingState = document.getElementById('loading-state');
        const carsGrid = document.getElementById('cars-grid');
        
        if (loadingState) loadingState.classList.remove('hidden');
        if (carsGrid) carsGrid.style.opacity = '0.5';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        const carsGrid = document.getElementById('cars-grid');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (carsGrid) carsGrid.style.opacity = '1';
    }

    /**
     * Show error message
     */
    showError(message) {
        const carsGrid = document.getElementById('cars-grid');
        if (carsGrid) {
            carsGrid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <span class="material-symbols-outlined text-6xl text-red-300 mb-4 block">error</span>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Der opstod en fejl</h3>
                    <p class="text-slate-600 dark:text-slate-400">${message}</p>
                </div>
            `;
        }
    }

    /**
     * Get placeholder image
     */
    getPlaceholderImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjQ3NDhiIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJpbGxlZGUgaWtrZSB0aWxnw6ZuZ2VsaWd0PC90ZXh0Pjwvc3ZnPg==';
    }

    /**
     * Utility functions
     */
    getUniqueBrands() {
        return [...new Set(this.cars.map(car => car.brand))].sort();
    }

    getUniqueBodyTypes() {
        return [...new Set(this.cars.map(car => car.bodyType))].sort();
    }

    getUniqueFuelTypes() {
        return [...new Set(this.cars.map(car => car.fuelType))].sort();
    }

    formatPrice(price) {
        return price?.toLocaleString('da-DK') || 'Pris på forespørgsel';
    }

    /**
     * Get monthly leasing from car object (checks both monthlyLeasing field and specifications.monthlyLeasing)
     */
    getMonthlyLeasing(car) {
        // Check direct field first
        if (car.monthlyLeasing) {
            return car.monthlyLeasing;
        }
        // Check specifications object
        if (car.specifications && car.specifications.monthlyLeasing) {
            return car.specifications.monthlyLeasing;
        }
        return null;
    }

    /**
     * Format monthly leasing payment
     */
    formatMonthlyLeasing(amount) {
        if (!amount || amount <= 0) {
            return 'Kontakt os';
        }
        return `${amount.toLocaleString('da-DK')} kr./md.`;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarCatalog;
} else {
    window.CarCatalog = CarCatalog;
}
