// Cookie Banner and Consent Management for Nordic Autos
// GDPR Compliant Cookie Management System

class CookieBanner {
    constructor() {
        this.consentKey = 'nordic-autos-cookie-consent';
        this.bannerShown = false;
        this.consentData = this.loadConsent();
        
        this.init();
    }

    /**
     * Initialize cookie banner system
     */
    init() {
        // Check if consent is needed
        if (!this.hasValidConsent()) {
            this.showBanner();
        } else {
            this.applyConsent();
        }

        // Listen for consent changes
        window.addEventListener('storage', (e) => {
            if (e.key === this.consentKey) {
                this.consentData = this.loadConsent();
                this.applyConsent();
            }
        });
    }

    /**
     * Check if user has given valid consent
     */
    hasValidConsent() {
        if (!this.consentData) return false;
        
        // Check if consent is less than 1 year old
        const consentDate = new Date(this.consentData.timestamp);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        return consentDate > oneYearAgo;
    }

    /**
     * Load consent from localStorage
     */
    loadConsent() {
        try {
            const stored = localStorage.getItem(this.consentKey);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('Error loading cookie consent:', e);
            return null;
        }
    }

    /**
     * Save consent to localStorage
     */
    saveConsent(consent) {
        try {
            const consentData = {
                ...consent,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(this.consentKey, JSON.stringify(consentData));
            this.consentData = consentData;
            
            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: this.consentKey,
                newValue: JSON.stringify(consentData)
            }));
            
            return true;
        } catch (e) {
            console.error('Error saving cookie consent:', e);
            return false;
        }
    }

    /**
     * Show cookie banner
     */
    showBanner() {
        if (this.bannerShown) return;
        
        const banner = this.createBanner();
        document.body.appendChild(banner);
        this.bannerShown = true;

        // Animate in
        setTimeout(() => {
            banner.classList.remove('translate-y-full');
        }, 100);
    }

    /**
     * Create cookie banner HTML
     */
    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookieBanner';
        banner.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-2xl z-50 transform translate-y-full transition-transform duration-300';
        
        banner.innerHTML = `
            <div class="max-w-7xl mx-auto p-4 md:p-6">
                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <!-- Cookie Info -->
                    <div class="flex-1">
                        <div class="flex items-start gap-3">
                            <span class="material-symbols-outlined text-primary text-2xl mt-1">cookie</span>
                            <div>
                                <h3 class="font-bold text-slate-900 dark:text-white mb-2">Vi bruger cookies</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    Vi bruger cookies for at forbedre din oplevelse på vores hjemmeside. 
                                    Nogle cookies er nødvendige for at siden fungerer, mens andre hjælper os med at forstå hvordan du bruger siden.
                                    <a href="cookies.html" class="text-primary hover:underline ml-1">Læs mere om cookies</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Cookie Actions -->
                    <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <button onclick="cookieBanner.showSettings()" 
                                class="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors text-sm font-medium whitespace-nowrap">
                            Indstillinger
                        </button>
                        <button onclick="cookieBanner.acceptNecessary()" 
                                class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium whitespace-nowrap">
                            Kun nødvendige
                        </button>
                        <button onclick="cookieBanner.acceptAll()" 
                                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold whitespace-nowrap">
                            Accepter alle
                        </button>
                    </div>
                </div>
            </div>
        `;

        return banner;
    }

    /**
     * Show cookie settings modal
     */
    showSettings() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.modal-content').classList.remove('scale-95');
        }, 10);
    }

    /**
     * Create cookie settings modal
     */
    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'cookieSettingsModal';
        modal.className = 'fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 opacity-0 transition-opacity duration-300';
        
        modal.innerHTML = `
            <div class="modal-content bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300">
                <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Cookie-indstillinger</h2>
                        <button onclick="cookieBanner.closeSettings()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p class="text-slate-600 dark:text-slate-400 mt-2">Vælg hvilke cookies du vil acceptere</p>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Necessary Cookies -->
                    <div class="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <h3 class="font-semibold text-slate-900 dark:text-white">Nødvendige cookies</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm">Kræves for at hjemmesiden fungerer</p>
                            </div>
                            <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                                Altid aktiv
                            </div>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">
                            Disse cookies er nødvendige for grundlæggende funktioner som navigation, sikkerhed og adgang til beskyttede områder.
                        </p>
                    </div>

                    <!-- Functional Cookies -->
                    <div class="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <h3 class="font-semibold text-slate-900 dark:text-white">Funktionelle cookies</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm">Forbedrer funktionalitet og brugeroplevelse</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="functionalCookies" class="sr-only peer" checked>
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">
                            Husker dine præferencer som sprog, tema og indstillinger. Gør det muligt at personalisere din oplevelse.
                        </p>
                    </div>

                    <!-- Analytics Cookies -->
                    <div class="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <h3 class="font-semibold text-slate-900 dark:text-white">Analytiske cookies</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm">Hjælper os med at forbedre hjemmesiden</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="analyticalCookies" class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">
                            Indsamler anonyme statistikker om hvordan hjemmesiden bruges. Hjælper os med at forbedre indhold og funktionalitet.
                        </p>
                    </div>

                    <!-- Marketing Cookies -->
                    <div class="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <div>
                                <h3 class="font-semibold text-slate-900 dark:text-white">Marketing cookies</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm">Personaliseret markedsføring</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="marketingCookies" class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">
                            Bruges til at vise relevante annoncer og måle effektiviteten af markedsføringskampagner.
                        </p>
                    </div>
                </div>

                <div class="p-6 border-t border-slate-200 dark:border-slate-700">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick="cookieBanner.acceptNecessaryFromModal()" 
                                class="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors font-medium">
                            Kun nødvendige
                        </button>
                        <button onclick="cookieBanner.saveCustomSettings()" 
                                class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold">
                            Gem valg
                        </button>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-3 text-center">
                        Du kan ændre dine indstillinger når som helst i <a href="cookies.html" class="text-primary hover:underline">cookie-politikken</a>
                    </p>
                </div>
            </div>
        `;

        // Load current settings
        this.loadCurrentSettings(modal);

        return modal;
    }

    /**
     * Load current cookie settings into modal
     */
    loadCurrentSettings(modal) {
        if (!this.consentData) return;

        const functionalCheckbox = modal.querySelector('#functionalCookies');
        const analyticalCheckbox = modal.querySelector('#analyticalCookies');
        const marketingCheckbox = modal.querySelector('#marketingCookies');

        if (functionalCheckbox) functionalCheckbox.checked = this.consentData.functional !== false;
        if (analyticalCheckbox) analyticalCheckbox.checked = this.consentData.analytical === true;
        if (marketingCheckbox) marketingCheckbox.checked = this.consentData.marketing === true;
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (modal) {
            modal.classList.add('opacity-0');
            modal.querySelector('.modal-content').classList.add('scale-95');
            setTimeout(() => modal.remove(), 300);
        }
    }

    /**
     * Accept all cookies
     */
    acceptAll() {
        const consent = {
            necessary: true,
            functional: true,
            analytical: true,
            marketing: true
        };

        this.saveConsent(consent);
        this.applyConsent();
        this.hideBanner();
        
        console.log('✅ All cookies accepted');
    }

    /**
     * Accept only necessary cookies
     */
    acceptNecessary() {
        const consent = {
            necessary: true,
            functional: false,
            analytical: false,
            marketing: false
        };

        this.saveConsent(consent);
        this.applyConsent();
        this.hideBanner();
        
        console.log('✅ Only necessary cookies accepted');
    }

    /**
     * Accept only necessary cookies from modal
     */
    acceptNecessaryFromModal() {
        this.acceptNecessary();
        this.closeSettings();
    }

    /**
     * Save custom cookie settings from modal
     */
    saveCustomSettings() {
        const modal = document.getElementById('cookieSettingsModal');
        if (!modal) return;

        const consent = {
            necessary: true, // Always true
            functional: modal.querySelector('#functionalCookies').checked,
            analytical: modal.querySelector('#analyticalCookies').checked,
            marketing: modal.querySelector('#marketingCookies').checked
        };

        this.saveConsent(consent);
        this.applyConsent();
        this.hideBanner();
        this.closeSettings();
        
        console.log('✅ Custom cookie settings saved:', consent);
    }

    /**
     * Hide cookie banner
     */
    hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('translate-y-full');
            setTimeout(() => banner.remove(), 300);
        }
        this.bannerShown = false;
    }

    /**
     * Apply consent settings
     */
    applyConsent() {
        if (!this.consentData) return;

        // Apply Google Analytics
        if (this.consentData.analytical) {
            this.enableGoogleAnalytics();
        } else {
            this.disableGoogleAnalytics();
        }

        // Apply functional cookies
        if (this.consentData.functional) {
            this.enableFunctionalCookies();
        } else {
            this.disableFunctionalCookies();
        }

        // Apply marketing cookies
        if (this.consentData.marketing) {
            this.enableMarketingCookies();
        } else {
            this.disableMarketingCookies();
        }

        console.log('🍪 Cookie consent applied:', this.consentData);
    }

    /**
     * Enable Google Analytics
     */
    enableGoogleAnalytics() {
        // Only enable if not already loaded
        if (window.gtag) return;

        // Load Google Analytics
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
            });
        `;
        document.head.appendChild(script2);

        console.log('📊 Google Analytics enabled');
    }

    /**
     * Disable Google Analytics
     */
    disableGoogleAnalytics() {
        // Set gtag to disabled
        if (window.gtag) {
            window.gtag('consent', 'update', {
                analytics_storage: 'denied'
            });
        }

        // Remove GA cookies
        this.deleteCookies(['_ga', '_ga_*', '_gid']);
        
        console.log('🚫 Google Analytics disabled');
    }

    /**
     * Enable functional cookies
     */
    enableFunctionalCookies() {
        // Allow functional cookies like theme, language preferences etc.
        document.documentElement.setAttribute('data-functional-cookies', 'enabled');
        console.log('⚙️ Functional cookies enabled');
    }

    /**
     * Disable functional cookies
     */
    disableFunctionalCookies() {
        document.documentElement.setAttribute('data-functional-cookies', 'disabled');
        
        // Remove functional cookies except essential ones
        this.deleteCookies(['theme-preference', 'language-preference']);
        
        console.log('🚫 Functional cookies disabled');
    }

    /**
     * Enable marketing cookies
     */
    enableMarketingCookies() {
        document.documentElement.setAttribute('data-marketing-cookies', 'enabled');
        console.log('📢 Marketing cookies enabled');
    }

    /**
     * Disable marketing cookies
     */
    disableMarketingCookies() {
        document.documentElement.setAttribute('data-marketing-cookies', 'disabled');
        
        // Remove marketing cookies
        this.deleteCookies(['_fbp', '_fbc', '__utm*']);
        
        console.log('🚫 Marketing cookies disabled');
    }

    /**
     * Delete specific cookies
     */
    deleteCookies(cookieNames) {
        cookieNames.forEach(name => {
            if (name.includes('*')) {
                // Handle wildcard cookies
                const prefix = name.replace('*', '');
                document.cookie.split(';').forEach(cookie => {
                    const cookieName = cookie.split('=')[0].trim();
                    if (cookieName.startsWith(prefix)) {
                        this.deleteCookie(cookieName);
                    }
                });
            } else {
                this.deleteCookie(name);
            }
        });
    }

    /**
     * Delete a single cookie
     */
    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }

    /**
     * Get current consent status
     */
    getConsent() {
        return this.consentData;
    }

    /**
     * Check if specific cookie type is allowed
     */
    isAllowed(cookieType) {
        if (!this.consentData) return false;
        return this.consentData[cookieType] === true;
    }

    /**
     * Revoke consent (for testing)
     */
    revokeConsent() {
        localStorage.removeItem(this.consentKey);
        this.consentData = null;
        this.showBanner();
        console.log('🔄 Cookie consent revoked');
    }
}

// Initialize cookie banner when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global cookie banner instance
    window.cookieBanner = new CookieBanner();
    
    console.log('🍪 Cookie Banner initialized');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieBanner;
}