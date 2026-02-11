// Car Details functionality for Nordic Autos Website

class CarDetails {
    constructor() {
        this.car = null;
        this.carId = null;
        this.allCars = [];
        this.currentImageIndex = 0;
        
        this.init();
    }

    /**
     * Initialize car details page
     */
    async init() {
        try {
            // Get car ID from URL parameters
            this.carId = this.getCarIdFromUrl();
            
            if (!this.carId) {
                this.showError();
                return;
            }

            // Load cars data
            await this.loadCarsData();
            
            // Find the specific car - handle both string and numeric IDs
            const numericId = typeof this.carId === 'string' ? parseInt(this.carId, 10) : this.carId;
            this.car = this.allCars.find(car => car.id === numericId || car.id == this.carId);
            
            if (!this.car) {
                console.error('Car not found with ID:', this.carId, 'Numeric ID:', numericId);
                console.log('Available car IDs:', this.allCars.map(c => c.id));
                this.showError();
                return;
            }

            // Render car details
            this.renderCarDetails();
            this.setupEventListeners();
            this.loadRelatedCars();
            
            // Update page metadata
            this.updatePageMetadata();
            
            // Hide loading state
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to initialize car details:', error);
            this.showError();
        }
    }

    /**
     * Get car ID from URL parameters
     */
    getCarIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    /**
     * Load cars data from Supabase or fallback to JSON
     */
    async loadCarsData() {
        try {
            // Try loading from Supabase first
            if (window.supabaseCarManager) {
                await window.supabaseCarManager.initialize();
                this.allCars = await window.supabaseCarManager.getCars();
                console.log(`✅ Loaded ${this.allCars.length} cars from Supabase for car details`);
                return;
            }
        } catch (error) {
            console.error('❌ Error loading from Supabase:', error);
        }
        
        // Fallback to JSON
        try {
            const response = await fetch('assets/data/cars.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allCars = await response.json();
            console.log(`📄 Loaded ${this.allCars.length} cars from JSON`);
        } catch (error) {
            console.error('Error loading cars data:', error);
            throw error;
        }
    }

    /**
     * Render all car details
     */
    renderCarDetails() {
        this.renderCarHeader();
        this.renderCarGallery();
        this.renderSpecifications();
        this.renderFeatures();
        this.renderQuickInfo();
        this.renderCarHistory();
        this.setupContactForm();
        
        // Show content
        const content = document.getElementById('car-details-content');
        if (content) {
            content.classList.remove('hidden');
        }
    }

    /**
     * Render car header information
     */
    renderCarHeader() {
        // Car title
        const titleElement = document.getElementById('car-title');
        if (titleElement) {
            titleElement.textContent = `${this.car.brand} ${this.car.model}`;
        }

        // Car variant
        const variantElement = document.getElementById('car-variant');
        if (variantElement && this.car.variant) {
            variantElement.textContent = this.car.variant;
        }

        // Car description
        const descriptionElement = document.getElementById('car-description');
        if (descriptionElement && this.car.description) {
            // Replace newlines with <br> tags to preserve formatting
            descriptionElement.innerHTML = this.car.description.replace(/\n/g, '<br>');
        }

        // Car price
        const priceElement = document.getElementById('car-price');
        if (priceElement) {
            priceElement.textContent = `${this.formatPrice(this.car.price)} DKK`;
        }

        // Car badges
        this.renderCarBadges();
    }

    /**
     * Render car badges (new, reserved, etc.)
     */
    renderCarBadges() {
        const badgeContainer = document.getElementById('car-badge-container');
        const statusContainer = document.getElementById('car-status-container');
        
        if (!badgeContainer || !statusContainer) return;

        let badgeHTML = '';
        let statusHTML = '';

        if (this.car.isNew) {
            badgeHTML = '<span class="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest">Nyhed</span>';
        }

        if (this.car.status === 'reserved') {
            statusHTML = '<span class="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">Reserveret</span>';
        } else if (this.car.status === 'sold') {
            statusHTML = '<span class="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">Solgt</span>';
        }

        badgeContainer.innerHTML = badgeHTML;
        statusContainer.innerHTML = statusHTML;
    }

    /**
     * Render car image gallery
     */
    renderCarGallery() {
        const galleryContainer = document.getElementById('car-gallery');
        if (!galleryContainer) return;

        const images = this.car.images || [];
        
        if (images.length === 0) {
            galleryContainer.innerHTML = `
                <div class="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <div class="text-center">
                        <span class="material-symbols-outlined text-4xl text-slate-400 mb-2 block">image</span>
                        <p class="text-slate-500 dark:text-slate-400">Ingen billeder tilgængelige</p>
                    </div>
                </div>
            `;
            return;
        }

        galleryContainer.innerHTML = `
            <!-- Main Image -->
            <div class="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img id="main-image" 
                     src="${images[0]}" 
                     alt="${this.car.brand} ${this.car.model}"
                     class="w-full h-full object-cover cursor-zoom-in"
                     onclick="carDetails.openImageModal(${this.currentImageIndex})">
                
                ${images.length > 1 ? `
                    <button id="prev-image" class="absolute left-4 top-1/2 transform -translate-y-1/2 size-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button id="next-image" class="absolute right-4 top-1/2 transform -translate-y-1/2 size-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </button>
                ` : ''}
                
                <div class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    <span id="image-counter">${this.currentImageIndex + 1} / ${images.length}</span>
                </div>
            </div>

            ${images.length > 1 ? `
                <!-- Thumbnail Navigation -->
                <div class="p-4 bg-slate-50 dark:bg-slate-800">
                    <div class="flex gap-2 overflow-x-auto" id="thumbnail-container">
                        ${images.map((image, index) => `
                            <button class="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === 0 ? 'border-primary' : 'border-transparent hover:border-slate-300'}" 
                                    onclick="carDetails.showImage(${index})" 
                                    data-thumbnail="${index}">
                                <img src="${image}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    /**
     * Show specific image in gallery
     */
    showImage(index) {
        const images = this.car.images || [];
        if (index < 0 || index >= images.length) return;

        this.currentImageIndex = index;
        
        // Update main image
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.src = images[index];
        }

        // Update counter
        const counter = document.getElementById('image-counter');
        if (counter) {
            counter.textContent = `${index + 1} / ${images.length}`;
        }

        // Update thumbnail selection
        document.querySelectorAll('[data-thumbnail]').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.remove('border-transparent');
                thumb.classList.add('border-primary');
            } else {
                thumb.classList.remove('border-primary');
                thumb.classList.add('border-transparent');
            }
        });
    }

    /**
     * Navigate to previous image
     */
    previousImage() {
        const images = this.car.images || [];
        const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : images.length - 1;
        this.showImage(newIndex);
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        const images = this.car.images || [];
        const newIndex = this.currentImageIndex < images.length - 1 ? this.currentImageIndex + 1 : 0;
        this.showImage(newIndex);
    }

    /**
     * Open image in modal with zoom functionality
     */
    openImageModal(index) {
        const images = this.car.images || [];
        if (index < 0 || index >= images.length) return;

        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="relative max-w-7xl max-h-full p-4">
                <button class="absolute top-4 right-4 z-10 size-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all" onclick="this.closest('.fixed').remove()">
                    <span class="material-symbols-outlined">close</span>
                </button>
                
                <div class="relative">
                    <img src="${images[index]}" 
                         alt="${this.car.brand} ${this.car.model}" 
                         class="max-w-full max-h-[90vh] object-contain cursor-zoom-in"
                         onclick="this.classList.toggle('scale-150'); this.classList.toggle('cursor-zoom-out'); this.classList.toggle('cursor-zoom-in');">
                    
                    ${images.length > 1 ? `
                        <button class="absolute left-4 top-1/2 transform -translate-y-1/2 size-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all" onclick="carDetails.modalPrevImage(this, ${index})">
                            <span class="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 size-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all" onclick="carDetails.modalNextImage(this, ${index})">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </button>
                    ` : ''}
                    
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                        ${index + 1} / ${images.length}
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.appendChild(modal);
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        });
    }

    /**
     * Navigate to previous image in modal
     */
    modalPrevImage(button, currentIndex) {
        const images = this.car.images || [];
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        const modal = button.closest('.fixed');
        const img = modal.querySelector('img');
        const counter = modal.querySelector('.absolute.bottom-4');
        
        img.src = images[newIndex];
        counter.textContent = `${newIndex + 1} / ${images.length}`;
        
        // Update button onclick handlers
        const prevBtn = modal.querySelector('button[onclick*="modalPrevImage"]');
        const nextBtn = modal.querySelector('button[onclick*="modalNextImage"]');
        if (prevBtn) prevBtn.setAttribute('onclick', `carDetails.modalPrevImage(this, ${newIndex})`);
        if (nextBtn) nextBtn.setAttribute('onclick', `carDetails.modalNextImage(this, ${newIndex})`);
    }

    /**
     * Navigate to next image in modal
     */
    modalNextImage(button, currentIndex) {
        const images = this.car.images || [];
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        const modal = button.closest('.fixed');
        const img = modal.querySelector('img');
        const counter = modal.querySelector('.absolute.bottom-4');
        
        img.src = images[newIndex];
        counter.textContent = `${newIndex + 1} / ${images.length}`;
        
        // Update button onclick handlers
        const prevBtn = modal.querySelector('button[onclick*="modalPrevImage"]');
        const nextBtn = modal.querySelector('button[onclick*="modalNextImage"]');
        if (prevBtn) prevBtn.setAttribute('onclick', `carDetails.modalPrevImage(this, ${newIndex})`);
        if (nextBtn) nextBtn.setAttribute('onclick', `carDetails.modalNextImage(this, ${newIndex})`);
    }

    /**
     * Render car specifications
     */
    renderSpecifications() {
        const specsContainer = document.getElementById('car-specifications');
        if (!specsContainer) return;

        const specs = this.car.specifications || {};
        const basicSpecs = {
            'Motor': specs.engine || 'N/A',
            'Transmission': specs.transmission || 'N/A',
            'Træk': specs.drivetrain || 'N/A',
            'Acceleration (0-100 km/t)': specs.acceleration || 'N/A',
            'Tophastighed': specs.topSpeed || 'N/A',
            'Forbrug': specs.fuelConsumption || 'N/A'
        };

        specsContainer.innerHTML = Object.entries(basicSpecs).map(([key, value]) => `
            <div class="flex justify-between items-center py-3 border-b border-slate-100 dark:border-border-dark last:border-b-0">
                <span class="text-slate-600 dark:text-slate-400 font-medium">${key}</span>
                <span class="text-slate-900 dark:text-white font-semibold">${value}</span>
            </div>
        `).join('');
    }

    /**
     * Render car features
     */
    renderFeatures() {
        const featuresContainer = document.getElementById('car-features');
        if (!featuresContainer) return;

        const features = this.car.features || [];
        
        if (features.length === 0) {
            featuresContainer.innerHTML = '<p class="text-slate-500 dark:text-slate-400 col-span-full">Ingen specielle features angivet.</p>';
            return;
        }

        featuresContainer.innerHTML = features.map(feature => `
            <div class="flex items-center gap-3 py-2">
                <span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                <span class="text-slate-700 dark:text-slate-300">${feature}</span>
            </div>
        `).join('');
    }

    /**
     * Render quick info section
     */
    renderQuickInfo() {
        const quickInfoContainer = document.getElementById('quick-info');
        if (!quickInfoContainer) return;

        const quickInfo = [
            { icon: 'calendar_month', label: 'Årgang', value: this.car.year },
            { icon: 'speed', label: 'Kilometerstand', value: `${this.car.mileage?.toLocaleString('da-DK')} km` },
            { icon: 'local_gas_station', label: 'Brændstof', value: this.car.fuelType },
            { icon: 'directions_car', label: 'Karrosseri', value: this.car.bodyType },
            { icon: 'bolt', label: 'Hestekræfter', value: `${this.car.horsepower} HK` }
        ];

        quickInfoContainer.innerHTML = quickInfo.map(item => `
            <div class="flex items-center justify-between py-2">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">${item.icon}</span>
                    <span class="text-slate-600 dark:text-slate-400 font-medium">${item.label}</span>
                </div>
                <span class="text-slate-900 dark:text-white font-semibold">${item.value}</span>
            </div>
        `).join('');
    }

    /**
     * Render car history section
     */
    renderCarHistory() {
        const historyContainer = document.getElementById('car-history');
        if (!historyContainer) return;

        const history = this.car.history || {};
        
        const historyItems = [
            { 
                icon: 'person', 
                label: 'Tidligere ejere', 
                value: history.previousOwners || 'Ukendt',
                status: (history.previousOwners || 0) <= 1 ? 'good' : 'neutral'
            },
            { 
                icon: 'build', 
                label: 'Servicehistorik', 
                value: history.serviceHistory ? 'Komplet' : 'Ufuldstændig',
                status: history.serviceHistory ? 'good' : 'warning'
            },
            { 
                icon: 'warning', 
                label: 'Uheld', 
                value: history.accidents ? 'Ja' : 'Nej',
                status: history.accidents ? 'warning' : 'good'
            }
        ];

        historyContainer.innerHTML = historyItems.map(item => {
            const statusColor = item.status === 'good' ? 'text-green-500' : 
                               item.status === 'warning' ? 'text-yellow-500' : 'text-slate-500';
            
            return `
                <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined ${statusColor}">${item.icon}</span>
                        <span class="text-slate-600 dark:text-slate-400 font-medium">${item.label}</span>
                    </div>
                    <span class="text-slate-900 dark:text-white font-semibold">${item.value}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Setup contact form functionality
     */
    setupContactForm() {
        const form = document.getElementById('car-inquiry-form');
        if (!form) return;

        // Pre-fill message with car information
        const messageField = document.getElementById('inquiry-message');
        if (messageField && messageField.value === '') {
            messageField.value = `Hej Nordic Autos,\n\nJeg er interesseret i jeres ${this.car.brand} ${this.car.model} fra ${this.car.year} og vil gerne høre mere om bilen.\n\nMed venlig hilsen`;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactFormSubmit(form);
        });
    }

    /**
     * Handle contact form submission
     */
    handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const messageContainer = document.getElementById('form-message');
        
        // Basic validation
        const name = formData.get('name');
        const email = formData.get('email');
        
        if (!name || !email) {
            this.showFormMessage('Udfyld venligst alle påkrævede felter.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showFormMessage('Indtast venligst en gyldig email adresse.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Sender...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showFormMessage('Tak for din henvendelse! Vi kontakter dig snarest muligt.', 'success');
            form.reset();
            
            // Reset message field with car info
            const messageField = document.getElementById('inquiry-message');
            if (messageField) {
                messageField.value = `Hej Nordic Autos,\n\nJeg er interesseret i jeres ${this.car.brand} ${this.car.model} fra ${this.car.year} og vil gerne høre mere om bilen.\n\nMed venlig hilsen`;
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    /**
     * Show form message
     */
    showFormMessage(message, type) {
        const messageContainer = document.getElementById('form-message');
        if (!messageContainer) return;

        messageContainer.className = `text-sm text-center py-2 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`;
        messageContainer.textContent = message;
        messageContainer.classList.remove('hidden');

        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000);
    }

    /**
     * Load and display related cars
     */
    loadRelatedCars() {
        const relatedContainer = document.getElementById('related-cars');
        if (!relatedContainer) return;

        // Find cars from same brand or similar price range
        const relatedCars = this.allCars
            .filter(car => car.id !== this.car.id) // Exclude current car
            .filter(car => 
                car.brand === this.car.brand || 
                Math.abs(car.price - this.car.price) < 500000
            )
            .slice(0, 3); // Limit to 3 cars

        if (relatedCars.length === 0) {
            relatedContainer.innerHTML = '<p class="text-slate-500 dark:text-slate-400 col-span-full text-center">Ingen lignende biler fundet.</p>';
            return;
        }

        relatedContainer.innerHTML = relatedCars.map(car => this.createCarCard(car)).join('');
    }

    /**
     * Create car card HTML (similar to catalog)
     */
    createCarCard(car) {
        const badge = this.getCarBadge(car);
        const mainImage = car.images && car.images.length > 0 ? car.images[0] : this.getPlaceholderImage();
        
        return `
            <div class="group bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer" onclick="window.location.href='bil-detaljer.html?id=${car.id}'">
                <div class="relative h-48 overflow-hidden">
                    ${badge}
                    <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         src="${mainImage}" 
                         alt="${car.brand} ${car.model}"/>
                </div>
                <div class="p-4">
                    <div class="flex flex-col gap-1 mb-3">
                        <h3 class="text-slate-900 dark:text-white text-lg font-bold leading-tight">${car.brand} ${car.model}</h3>
                        <p class="text-primary font-semibold text-sm">${car.variant || ''}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-slate-500 dark:text-slate-400 text-xs font-medium">Pris inkl. afgift</span>
                            <span class="text-slate-900 dark:text-white text-lg font-black tracking-tight">${this.formatPrice(car.price)} DKK</span>
                        </div>
                        <button class="size-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-border-dark text-slate-600 dark:text-white hover:bg-primary hover:text-white transition-all">
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
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
            return '<div class="absolute top-3 left-3 z-10"><span class="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Nyhed</span></div>';
        }
        
        if (car.status === 'reserved') {
            return '<div class="absolute top-3 right-3 z-10"><span class="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Reserveret</span></div>';
        }
        
        return '';
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Gallery navigation
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        // Contact button
        const contactBtn = document.getElementById('contact-btn');
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                document.getElementById('car-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Keyboard navigation for gallery
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });

        // Touch/swipe support for gallery
        this.setupTouchSupport();
    }

    /**
     * Update page metadata
     */
    updatePageMetadata() {
        // Update page title
        const title = document.getElementById('page-title');
        if (title) {
            title.textContent = `${this.car.brand} ${this.car.model} - Nordic Autos`;
        }

        // Update meta description
        const description = document.getElementById('page-description');
        if (description) {
            description.setAttribute('content', 
                `${this.car.brand} ${this.car.model} fra ${this.car.year} til ${this.formatPrice(this.car.price)} DKK. ${this.car.description || 'Se detaljer og kontakt Nordic Autos i Skive.'}`
            );
        }

        // Update breadcrumb
        if (window.breadcrumb) {
            window.breadcrumb.updateBreadcrumb([
                { text: 'Forside', href: 'index.html' },
                { text: 'Lagerbiler', href: 'lagerbiler.html' },
                { text: `${this.car.brand} ${this.car.model}`, href: '#', active: true }
            ]);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.remove('hidden');
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.add('hidden');
        }
    }

    /**
     * Show error state
     */
    showError() {
        this.hideLoading();
        
        const errorState = document.getElementById('error-state');
        if (errorState) {
            errorState.classList.remove('hidden');
        }
    }

    /**
     * Setup touch/swipe support for gallery
     */
    setupTouchSupport() {
        const galleryContainer = document.getElementById('car-gallery');
        if (!galleryContainer) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        galleryContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        galleryContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousImage(); // Swipe right = previous image
                } else {
                    this.nextImage(); // Swipe left = next image
                }
            }
        }, { passive: true });
    }

    /**
     * Utility functions
     */
    formatPrice(price) {
        return price?.toLocaleString('da-DK') || 'Pris på forespørgsel';
    }

    getPlaceholderImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjQ3NDhiIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkJpbGxlZGUgaWtrZSB0aWxnw6ZuZ2VsaWd0PC90ZXh0Pjwvc3ZnPg==';
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
    module.exports = CarDetails;
} else {
    window.CarDetails = CarDetails;
}