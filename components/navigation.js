// Navigation Component for Nordic Autos Website

class Navigation {
    constructor(currentPage = 'home') {
        this.currentPage = currentPage;
        this.mobileMenuOpen = false;
        this.init();
    }

    init() {
        console.log('Navigation initializing with current page:', this.currentPage);
        this.render();
        this.setupEventListeners();
        console.log('Navigation initialized successfully');
    }

    render() {
        const navContainer = document.getElementById('navigation-container');
        if (!navContainer) return;

        navContainer.innerHTML = this.getNavigationHTML();
    }

    getNavigationHTML() {
        return `
            <header class="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-[#243047] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div class="max-w-[1200px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between whitespace-nowrap">
                    <div class="flex items-center gap-3">
                        <div class="size-8 text-primary">
                            ${this.getLogoSVG()}
                        </div>
                        <h2 class="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
                            <a href="index.html" class="hover:text-primary transition-colors">Nordic Autos</a>
                        </h2>
                    </div>
                    <div class="flex flex-1 justify-end gap-10">
                        <nav class="hidden md:flex items-center gap-10" role="navigation" aria-label="Hovednavigation">
                            ${this.getNavigationLinks()}
                        </nav>
                        <button class="btn-primary focus-visible:focus" onclick="window.location.href='lagerbiler.html'" aria-label="Se lagerbiler">
                            Se lagerbiler
                        </button>
                        <!-- Mobile Menu Button -->
                        <button class="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus-visible:focus" 
                                onclick="navigation.toggleMobileMenu()" 
                                aria-label="Åbn mobilmenu"
                                aria-expanded="${this.mobileMenuOpen}">
                            <span class="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="mobile-menu ${this.mobileMenuOpen ? 'visible' : 'hidden'}" role="dialog" aria-modal="true" aria-label="Mobilnavigation">
                <div class="flex flex-col h-full">
                    <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark">
                        <div class="flex items-center gap-3">
                            <div class="size-6 text-primary">
                                ${this.getLogoSVG()}
                            </div>
                            <h2 class="text-slate-900 dark:text-white text-lg font-bold">Nordic Autos</h2>
                        </div>
                        <button class="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus-visible:focus" 
                                onclick="navigation.toggleMobileMenu()" 
                                aria-label="Luk mobilmenu">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav class="flex-1 p-6" role="navigation" aria-label="Mobilnavigation">
                        <ul class="space-y-4">
                            ${this.getMobileNavigationLinks()}
                        </ul>
                    </nav>
                    <div class="p-6 border-t border-slate-200 dark:border-border-dark">
                        <button class="w-full btn-primary focus-visible:focus" 
                                onclick="window.location.href='lagerbiler.html'; navigation.toggleMobileMenu()" 
                                aria-label="Se lagerbiler">
                            Se lagerbiler
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getLogoSVG() {
        return `
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                <path clip-rule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
        `;
    }

    getNavigationLinks() {
        const links = [
            { href: 'index.html', text: 'Hjem', page: 'home' },
            { href: 'lagerbiler.html', text: 'Lagerbiler', page: 'lagerbiler' },
            { href: 'import.html', text: 'Import', page: 'import' },
            { href: 'om-os.html', text: 'Om os', page: 'om-os' },
            { href: 'kontakt.html', text: 'Kontakt', page: 'kontakt' }
        ];

        console.log('Generating navigation links:', links);

        return links.map(link => {
            const isActive = this.currentPage === link.page;
            const className = isActive ? 'text-primary font-bold' : 'nav-link';
            const ariaCurrent = isActive ? 'aria-current="page"' : '';
            
            return `<a class="${className} focus-visible:focus" href="${link.href}" ${ariaCurrent}>${link.text}</a>`;
        }).join('');
    }

    getMobileNavigationLinks() {
        const links = [
            { href: 'index.html', text: 'Hjem', page: 'home' },
            { href: 'lagerbiler.html', text: 'Lagerbiler', page: 'lagerbiler' },
            { href: 'import.html', text: 'Import', page: 'import' },
            { href: 'om-os.html', text: 'Om os', page: 'om-os' },
            { href: 'kontakt.html', text: 'Kontakt', page: 'kontakt' }
        ];

        return links.map(link => {
            const isActive = this.currentPage === link.page;
            const className = isActive ? 'text-primary' : 'text-slate-900 dark:text-white';
            const ariaCurrent = isActive ? 'aria-current="page"' : '';
            
            return `
                <li>
                    <a class="block py-3 text-lg font-semibold ${className} hover:text-primary transition-colors focus-visible:focus" 
                       href="${link.href}" 
                       onclick="navigation.toggleMobileMenu()" 
                       ${ariaCurrent}>
                        ${link.text}
                    </a>
                </li>
            `;
        }).join('');
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (this.mobileMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('visible');
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            const closeButton = mobileMenu.querySelector('button[aria-label="Luk mobilmenu"]');
            if (closeButton) closeButton.focus();
        } else {
            mobileMenu.classList.remove('visible');
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
            
            // Return focus to menu button
            const menuButton = document.querySelector('button[aria-label="Åbn mobilmenu"]');
            if (menuButton) menuButton.focus();
        }

        // Update aria-expanded attribute
        const menuButton = document.querySelector('button[aria-label="Åbn mobilmenu"]');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', this.mobileMenuOpen.toString());
        }
    }

    highlightCurrentPage(page) {
        this.currentPage = page;
        this.render();
    }

    setupEventListeners() {
        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuButton = event.target.closest('[onclick*="toggleMobileMenu"]');
            
            if (this.mobileMenuOpen && !mobileMenu?.contains(event.target) && !menuButton) {
                this.toggleMobileMenu();
            }
        });

        // Handle escape key for mobile menu
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        });

        // Handle tab navigation in mobile menu
        document.addEventListener('keydown', (event) => {
            if (!this.mobileMenuOpen) return;
            
            if (event.key === 'Tab') {
                const mobileMenu = document.getElementById('mobile-menu');
                const focusableElements = mobileMenu.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Static method to determine current page from URL
    static getCurrentPageFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename.includes('lagerbiler')) return 'lagerbiler';
        if (filename.includes('import')) return 'import';
        if (filename.includes('om-os')) return 'om-os';
        if (filename.includes('kontakt')) return 'kontakt';
        if (filename.includes('bil-detaljer')) return 'bil-detaljer';
        return 'home';
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
} else {
    window.Navigation = Navigation;
}