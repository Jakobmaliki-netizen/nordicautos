// Breadcrumb Component for Nordic Autos Website

class Breadcrumb {
    constructor(currentPage = 'home', carData = null) {
        this.currentPage = currentPage;
        this.carData = carData; // For car detail pages
        this.breadcrumbPaths = this.defineBreadcrumbPaths();
    }

    /**
     * Define breadcrumb paths for all pages
     */
    defineBreadcrumbPaths() {
        return {
            'home': [], // No breadcrumb on homepage
            'lagerbiler': [
                { text: 'Forside', href: 'index.html' },
                { text: 'Lagerbiler', href: null, current: true }
            ],
            'om-os': [
                { text: 'Forside', href: 'index.html' },
                { text: 'Om os', href: null, current: true }
            ],
            'kontakt': [
                { text: 'Forside', href: 'index.html' },
                { text: 'Kontakt', href: null, current: true }
            ],
            'bil-detaljer': [
                { text: 'Forside', href: 'index.html' },
                { text: 'Lagerbiler', href: 'lagerbiler.html' },
                { text: this.getCarBreadcrumbText(), href: null, current: true }
            ]
        };
    }

    /**
     * Get breadcrumb text for car detail page
     */
    getCarBreadcrumbText() {
        if (this.carData) {
            return `${this.carData.brand} ${this.carData.model}`;
        }
        return 'Bil detaljer';
    }

    /**
     * Render breadcrumb navigation
     */
    render() {
        // Don't show breadcrumb on homepage
        if (this.currentPage === 'home') {
            return '';
        }

        const breadcrumbPath = this.breadcrumbPaths[this.currentPage] || [];
        
        if (breadcrumbPath.length === 0) {
            return '';
        }

        return `
            <nav class="breadcrumb" aria-label="Breadcrumb navigation" role="navigation">
                <ol class="flex flex-wrap gap-2 mb-4" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumbPath.map((item, index) => this.renderBreadcrumbItem(item, index)).join('')}
                </ol>
            </nav>
        `;
    }

    /**
     * Render individual breadcrumb item
     */
    renderBreadcrumbItem(item, index) {
        const isLast = item.current;
        const itemProp = `itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"`;
        
        if (isLast) {
            return `
                <li ${itemProp}>
                    <span class="breadcrumb-current" itemprop="name" aria-current="page">${item.text}</span>
                    <meta itemprop="position" content="${index + 1}" />
                </li>
            `;
        } else {
            const separator = index < this.breadcrumbPaths[this.currentPage].length - 1 ? 
                '<span class="breadcrumb-separator" aria-hidden="true">/</span>' : '';
            
            return `
                <li ${itemProp}>
                    <a class="breadcrumb-link focus-visible:focus" href="${item.href}" itemprop="item">
                        <span itemprop="name">${item.text}</span>
                    </a>
                    <meta itemprop="position" content="${index + 1}" />
                    ${separator}
                </li>
            `;
        }
    }

    /**
     * Initialize breadcrumb for a container
     */
    initializeInContainer(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.render();
        }
    }

    /**
     * Update breadcrumb for car detail page
     */
    updateForCarDetail(carData) {
        this.carData = carData;
        this.breadcrumbPaths = this.defineBreadcrumbPaths();
    }

    /**
     * Update breadcrumb with custom path
     */
    updateBreadcrumb(customPath) {
        this.breadcrumbPaths[this.currentPage] = customPath;
        this.initializeInContainer('breadcrumb-container');
        this.injectStructuredData();
    }

    /**
     * Static method to create and render breadcrumb
     */
    static renderForPage(currentPage, containerId = 'breadcrumb-container', carData = null) {
        const breadcrumb = new Breadcrumb(currentPage, carData);
        breadcrumb.initializeInContainer(containerId);
        return breadcrumb;
    }

    /**
     * Get structured data for breadcrumbs (JSON-LD)
     */
    getStructuredData() {
        if (this.currentPage === 'home') {
            return null;
        }

        const breadcrumbPath = this.breadcrumbPaths[this.currentPage] || [];
        
        if (breadcrumbPath.length === 0) {
            return null;
        }

        const itemListElement = breadcrumbPath.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.text,
            "item": item.href ? `${window.location.origin}/${item.href}` : window.location.href
        }));

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };
    }

    /**
     * Inject structured data into page head
     */
    injectStructuredData() {
        const structuredData = this.getStructuredData();
        
        if (!structuredData) {
            return;
        }

        // Remove existing breadcrumb structured data
        const existingScript = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-breadcrumb', 'true');
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    /**
     * Get current page from URL
     */
    static getCurrentPageFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename.includes('lagerbiler')) return 'lagerbiler';
        if (filename.includes('om-os')) return 'om-os';
        if (filename.includes('kontakt')) return 'kontakt';
        if (filename.includes('bil-detaljer')) return 'bil-detaljer';
        return 'home';
    }

    /**
     * Initialize breadcrumb based on current URL
     */
    static autoInitialize(containerId = 'breadcrumb-container') {
        const currentPage = Breadcrumb.getCurrentPageFromURL();
        
        // For car detail pages, try to get car data from URL parameters
        let carData = null;
        if (currentPage === 'bil-detaljer') {
            const urlParams = new URLSearchParams(window.location.search);
            const carId = urlParams.get('id');
            
            if (carId && window.carsData) {
                carData = window.carsData.find(car => car.id.toString() === carId);
            }
        }
        
        const breadcrumb = new Breadcrumb(currentPage, carData);
        breadcrumb.initializeInContainer(containerId);
        breadcrumb.injectStructuredData();
        
        return breadcrumb;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Breadcrumb;
} else {
    window.Breadcrumb = Breadcrumb;
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-initialize breadcrumb if container exists
        if (document.getElementById('breadcrumb-container')) {
            Breadcrumb.autoInitialize();
        }
    });
}