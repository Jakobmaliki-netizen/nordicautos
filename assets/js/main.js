// Nordic Autos Website - Main JavaScript

// Tailwind CSS Configuration
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#1754cf",
                "background-light": "#f6f6f8",
                "background-dark": "#0a0c10",
                "card-dark": "#1c2536",
                "border-dark": "#243047",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');
    console.log('Navigation class available:', typeof Navigation);
    
    // Initialize navigation using the Navigation class
    if (typeof Navigation !== 'undefined') {
        const currentPage = Navigation.getCurrentPageFromURL();
        console.log('Current page detected:', currentPage);
        window.navigation = new Navigation(currentPage);
        console.log('Navigation initialized successfully');
    } else {
        console.error('❌ Navigation class not found! Check if navigation-clean.js loaded properly');
    }
    
    initializeFooter();
    initializePage();
    setupEventListeners();
    
    console.log('Website initialization complete');
});

// Footer Component
function initializeFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="bg-slate-100 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-12">
            <div class="max-w-[1200px] mx-auto px-6 lg:px-10">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div class="col-span-1 md:col-span-2 space-y-6">
                        <div class="flex items-center gap-3">
                            <div class="size-6 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Nordic Autos</h2>
                        </div>
                        <p class="text-slate-500 dark:text-slate-400 max-w-sm">
                            Nordic Autos er din pålidelige samarbejdspartner inden for køb, salg og service af biler – for alle behov og budgetter.
                        </p>
                        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">
                            CVR: 46194330
                        </p>
                    </div>
                    <div class="space-y-4">
                        <h4 class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Navigation</h4>
                        <ul class="space-y-2 text-slate-500 dark:text-slate-400">
                            <li><a class="hover:text-primary transition-colors" href="lagerbiler.html">Lagerbiler</a></li>
                            <li><a class="hover:text-primary transition-colors" href="om-os.html">Om os</a></li>
                            <li><a class="hover:text-primary transition-colors" href="kontakt.html">Kontakt</a></li>
                        </ul>
                    </div>
                    <div class="space-y-4">
                        <h4 class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Kontakt</h4>
                        <ul class="space-y-2 text-slate-500 dark:text-slate-400">
                            <li>Danelykke 3</li>
                            <li>7800 Skive</li>
                            <li>Danmark</li>
                            <li class="pt-2">
                                <a href="tel:+4525454563" class="text-primary font-semibold hover:underline">
                                    +45 25 45 45 63
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@nordicautos.dk" class="text-primary font-semibold hover:underline">
                                    info@nordicautos.dk
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <p>© 2024 Nordic Autos. Alle rettigheder forbeholdes.</p>
                    <div class="flex gap-6">
                        <a class="hover:text-primary transition-colors" href="privatlivspolitik.html">Privatlivspolitik</a>
                        <a class="hover:text-primary transition-colors" href="cookies.html">Cookies</a>
                        <a class="hover:text-primary transition-colors" href="handelsbetingelser.html">Handelsbetingelser</a>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

// Initialize page-specific functionality
function initializePage() {
    // Determine current page from URL
    const path = window.location.pathname;
    let currentPage = 'home';
    if (path.includes('lagerbiler')) currentPage = 'lagerbiler';
    else if (path.includes('om-os')) currentPage = 'om-os';
    else if (path.includes('kontakt')) currentPage = 'kontakt';
    else if (path.includes('bil-detaljer')) currentPage = 'bil-detaljer';
    
    // Load featured cars on homepage
    if (currentPage === 'home') {
        loadFeaturedCars();
    }
}

// Load featured cars for homepage
async function loadFeaturedCars() {
    const featuredCarsContainer = document.getElementById('featured-cars');
    if (!featuredCarsContainer) {
        console.log('ℹ️ Featured cars container not found on this page - skipping');
        return;
    }

    console.log('Loading featured cars from Supabase...');

    // Clear any existing content first
    featuredCarsContainer.innerHTML = '<div class="col-span-full text-center py-10"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>';

    try {
        // Wait for Supabase to be ready
        if (!window.supabaseCarManager) {
            console.error('SupabaseCarManager not available');
            return;
        }
        
        await window.supabaseCarManager.initialize();
        const allCars = await window.supabaseCarManager.getCars();
        
        console.log(`✅ Loaded ${allCars.length} cars from Supabase for featured section`);
        
        // Get first 3 cars that are available
        const featuredCars = allCars
            .filter(car => !car.status || car.status === 'available')
            .slice(0, 3);
        
        if (featuredCars.length === 0) {
            featuredCarsContainer.innerHTML = '<div class="col-span-full text-center py-10 text-slate-400">Ingen biler tilgængelige</div>';
            return;
        }

        // Create car cards HTML directly
        const carCardsHTML = featuredCars.map(car => {
            const badge = car.isNew ? 
                '<div style="position: absolute; top: 16px; left: 16px; background-color: rgba(15, 61, 46, 0.9); color: white; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 20px;">Nyhed</div>' : 
                car.status === 'reserved' ? 
                '<div style="position: absolute; top: 16px; left: 16px; background-color: #f59e0b; color: white; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 20px;">Reserveret</div>' : '';
            
            const mainImage = car.images && car.images.length > 0 ? car.images[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+';
            
            return `
                <div style="display: flex; flex-direction: column; background-color: #151a16; border-radius: 16px; overflow: hidden; border: 1px solid #374151; cursor: pointer; transition: all 0.3s ease;" onclick="window.location.href='bil-detaljer.html?id=${car.id}'">
                    <div style="position: relative; aspect-ratio: 16/10; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background-image: url('${mainImage}'); background-size: cover; background-position: center; transition: transform 0.5s ease;"></div>
                        ${badge}
                    </div>
                    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="font-size: 18px; font-weight: bold; color: #f5f5f5; margin: 0;">${car.brand} ${car.model}</h3>
                        </div>
                        <div style="display: flex; align-items: center; gap: 16px; color: #9ca3af; font-size: 14px;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span class="material-symbols-outlined" style="font-size: 16px;">calendar_today</span>
                                ${car.year}
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span class="material-symbols-outlined" style="font-size: 16px;">speed</span>
                                ${car.mileage?.toLocaleString('da-DK') || 'N/A'} km
                            </div>
                        </div>
                    <p style="font-size: 24px; font-weight: 900; color: #f5f5f5; margin: 0; padding-top: 8px;">${car.price?.toLocaleString('da-DK') || 'Pris på forespørgsel'} DKK</p>
                </div>
            </div>
        `;
    }).join('');

    featuredCarsContainer.innerHTML = carCardsHTML;
    console.log('Featured cars loaded successfully');
    
    // Debug: Check if images are loading
    setTimeout(() => {
        const images = document.querySelectorAll('#featured-cars img');
        images.forEach((img, index) => {
            console.log(`Image ${index + 1}:`, img.src, 'Complete:', img.complete, 'Natural dimensions:', img.naturalWidth, 'x', img.naturalHeight);
            if (!img.complete || img.naturalWidth === 0) {
                console.error(`Image ${index + 1} failed to load:`, img.src);
            }
        });
    }, 2000);
    } catch (error) {
        console.error('❌ Error loading featured cars:', error);
        featuredCarsContainer.innerHTML = '<div class="col-span-full text-center py-10 text-red-400">Fejl ved indlæsning af biler</div>';
    }
}



// Setup global event listeners
function setupEventListeners() {
    // Listen for car updates from admin dashboard
    window.addEventListener('carsUpdated', () => {
        console.log('🔄 Cars updated, refreshing featured cars on homepage');
        if (document.getElementById('featured-cars')) {
            loadFeaturedCars();
        }
    });
    
    // Listen for storage events (cross-tab updates)
    window.addEventListener('storage', (e) => {
        if (e.key === 'nordic-autos-cars' || e.key === 'nordic-autos-last-update') {
            console.log('🔄 Storage update detected, refreshing featured cars');
            if (document.getElementById('featured-cars')) {
                loadFeaturedCars();
            }
        }
    });
    
    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && document.getElementById('featured-cars')) {
            console.log('🔄 Page visible, refreshing featured cars');
            loadFeaturedCars();
        }
    });
}

// Utility Functions
function formatPrice(price) {
    return price?.toLocaleString('da-DK') || 'Pris på forespørgsel';
}

function formatMileage(mileage) {
    return mileage?.toLocaleString('da-DK') || 'N/A';
}

// Export functions for global use
window.formatPrice = formatPrice;
window.formatMileage = formatMileage;
window.loadFeaturedCars = loadFeaturedCars; // Export for manual refresh
