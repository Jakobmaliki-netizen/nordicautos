// Footer Component for Nordic Autos Website

class Footer {
    constructor() {
        this.contactInfo = {
            address: {
                street: 'Danelykke 3',
                city: '7800 Skive',
                country: 'Danmark'
            },
            phone: '+45 25 45 45 63',
            email: 'info@nordicautos.dk',
            hours: {
                weekdays: '09:00 - 17:30',
                saturday: '10:00 - 14:00',
                sunday: 'Lukket'
            },
            cvr: '46194330',
            openingHours: 'Åbning efter aftale'
        };
        
        // Load saved content
        this.loadSavedContent();
        
        this.navigationLinks = [
            { href: 'lagerbiler.html', text: 'Lagerbiler' },
            { href: 'import.html', text: 'Import' },
            { href: 'om-os.html', text: 'Om os' },
            { href: 'kontakt.html', text: 'Kontakt' }
        ];
        
        this.legalLinks = [
            { href: 'privatlivspolitik.html', text: 'Privatlivspolitik' },
            { href: 'cookies.html', text: 'Cookies' },
            { href: 'handelsbetingelser.html', text: 'Handelsbetingelser' }
        ];
    }

    /**
     * Load saved content from localStorage
     */
    loadSavedContent() {
        const savedContent = localStorage.getItem('nordic-autos-content');
        if (!savedContent) return;
        
        try {
            const content = JSON.parse(savedContent);
            
            // Apply kontakt content
            if (content.kontakt) {
                if (content.kontakt.phone) this.contactInfo.phone = content.kontakt.phone;
                if (content.kontakt.email) this.contactInfo.email = content.kontakt.email;
                if (content.kontakt.address) {
                    // Parse address if it's a string
                    if (typeof content.kontakt.address === 'string') {
                        const addressParts = content.kontakt.address.split(',');
                        if (addressParts.length >= 2) {
                            this.contactInfo.address.street = addressParts[0].trim();
                            this.contactInfo.address.city = addressParts[1].trim();
                        }
                    }
                }
            }
            
            // Apply footer content
            if (content.footer) {
                if (content.footer.cvr) this.contactInfo.cvr = content.footer.cvr;
                if (content.footer.openingHours) this.contactInfo.openingHours = content.footer.openingHours;
            }
            
        } catch (e) {
            console.error('Error loading footer content:', e);
        }
    }

    /**
     * Render the complete footer HTML
     */
    render() {
        return `
            <footer class="bg-slate-100 dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 py-12" role="contentinfo">
                <div class="max-w-[1200px] mx-auto px-6 lg:px-10">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        ${this.renderBrandSection()}
                        ${this.renderNavigationSection()}
                        ${this.renderContactSection()}
                        ${this.renderHoursSection()}
                    </div>
                    ${this.renderBottomSection()}
                </div>
            </footer>
        `;
    }

    /**
     * Render brand and description section
     */
    renderBrandSection() {
        return `
            <div class="col-span-1 md:col-span-2 space-y-6">
                <div class="flex items-center gap-3">
                    <div class="size-6 text-primary" aria-hidden="true">
                        ${this.getLogoSVG()}
                    </div>
                    <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        <a href="index.html" class="hover:text-primary transition-colors focus-visible:focus">Nordic Autos</a>
                    </h2>
                </div>
                <p class="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                    Nordic Autos er din foretrukne partner i Skive, når det kommer til køb, salg og service af eksklusive biler. Grundlagt i 2025 med mange års erfaring.
                </p>
                <div class="flex gap-4">
                    ${this.renderSocialLinks()}
                </div>
            </div>
        `;
    }

    /**
     * Render navigation links section
     */
    renderNavigationSection() {
        return `
            <div class="space-y-4">
                <h3 class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Navigation</h3>
                <nav role="navigation" aria-label="Footer navigation">
                    <ul class="space-y-2 text-slate-500 dark:text-slate-400">
                        ${this.navigationLinks.map(link => `
                            <li>
                                <a class="hover:text-primary transition-colors focus-visible:focus" href="${link.href}">
                                    ${link.text}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </nav>
            </div>
        `;
    }

    /**
     * Render contact information section
     */
    renderContactSection() {
        return `
            <div class="space-y-4">
                <h3 class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Kontakt</h3>
                <address class="not-italic">
                    <ul class="space-y-2 text-slate-500 dark:text-slate-400">
                        <li class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-sm text-primary mt-0.5" aria-hidden="true">location_on</span>
                            <div>
                                <div>${this.contactInfo.address.street}</div>
                                <div>${this.contactInfo.address.city}</div>
                                <div>${this.contactInfo.address.country}</div>
                            </div>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm text-primary" aria-hidden="true">call</span>
                            <a href="tel:${this.contactInfo.phone.replace(/\s/g, '')}" 
                               class="hover:text-primary transition-colors focus-visible:focus">
                                ${this.contactInfo.phone}
                            </a>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-sm text-primary" aria-hidden="true">mail</span>
                            <a href="mailto:info@nordicautos.dk" 
                               class="hover:text-primary transition-colors focus-visible:focus">
                                info@nordicautos.dk
                            </a>
                        </li>
                    </ul>
                </address>
            </div>
        `;
    }

    /**
     * Render opening hours section
     */
    renderHoursSection() {
        return `
            <div class="space-y-4">
                <h3 class="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Åbningstider</h3>
                <div class="text-slate-500 dark:text-slate-400">
                    <p class="text-slate-900 dark:text-white font-medium">${this.contactInfo.openingHours}</p>
                    <p class="text-sm mt-2">Kontakt os for at aftale tid</p>
                </div>
            </div>
        `;
    }

    /**
     * Render bottom section with copyright and legal links
     */
    renderBottomSection() {
        const currentYear = new Date().getFullYear();
        
        return `
            <div class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div class="space-y-1">
                    <p>© ${currentYear} Nordic Autos ApS. Alle rettigheder forbeholdes.</p>
                    <p>CVR: ${this.contactInfo.cvr} • Skive, Danmark</p>
                </div>
                <nav role="navigation" aria-label="Legal links">
                    <div class="flex gap-6">
                        ${this.legalLinks.map(link => `
                            <a class="hover:text-primary transition-colors focus-visible:focus" href="${link.href}">
                                ${link.text}
                            </a>
                        `).join('')}
                    </div>
                </nav>
            </div>
        `;
    }

    /**
     * Render social media links
     */
    renderSocialLinks() {
        const socialLinks = [
            { 
                href: '#facebook', 
                icon: 'share', 
                label: 'Facebook',
                ariaLabel: 'Følg Nordic Autos på Facebook'
            },
            { 
                href: '#instagram', 
                icon: 'photo_camera', 
                label: 'Instagram',
                ariaLabel: 'Følg Nordic Autos på Instagram'
            },
            { 
                href: '#linkedin', 
                icon: 'business', 
                label: 'LinkedIn',
                ariaLabel: 'Følg Nordic Autos på LinkedIn'
            }
        ];

        return socialLinks.map(social => `
            <a href="${social.href}" 
               class="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-primary hover:text-white transition-all focus-visible:focus"
               aria-label="${social.ariaLabel}">
                <span class="material-symbols-outlined text-sm" aria-hidden="true">${social.icon}</span>
            </a>
        `).join('');
    }

    /**
     * Get logo SVG
     */
    getLogoSVG() {
        return `
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                <path clip-rule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
        `;
    }

    /**
     * Initialize footer in a container
     */
    initializeInContainer(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.render();
        }
    }

    /**
     * Get structured data for organization (JSON-LD)
     */
    getOrganizationStructuredData() {
        return {
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            "name": "Nordic Autos",
            "description": "Premium bilforhandler i Skive specialiseret i eksklusive biler som Porsche, Audi, Mercedes-Benz, BMW og Tesla.",
            "url": window.location.origin,
            "logo": `${window.location.origin}/assets/images/logo.svg`,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": this.contactInfo.address.street,
                "addressLocality": "Skive",
                "postalCode": "7800",
                "addressCountry": "DK"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": this.contactInfo.phone,
                "email": this.contactInfo.email,
                "contactType": "customer service",
                "availableLanguage": "Danish"
            },
            "openingHours": [
                "Mo-Fr 09:00-17:30",
                "Sa 10:00-14:00"
            ],
            "sameAs": [
                "#facebook",
                "#instagram", 
                "#linkedin"
            ]
        };
    }

    /**
     * Inject organization structured data into page head
     */
    injectOrganizationStructuredData() {
        // Remove existing organization structured data
        const existingScript = document.querySelector('script[type="application/ld+json"][data-organization]');
        if (existingScript) {
            existingScript.remove();
        }

        // Add new structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-organization', 'true');
        script.textContent = JSON.stringify(this.getOrganizationStructuredData());
        document.head.appendChild(script);
    }

    /**
     * Refresh footer content from localStorage
     */
    refreshContent() {
        this.loadSavedContent();
        // Re-render footer if it exists
        const container = document.getElementById('footer-container');
        if (container) {
            container.innerHTML = this.render();
        }
    }

    /**
     * Static method to create and render footer
     */
    static renderInContainer(containerId = 'footer-container') {
        const footer = new Footer();
        footer.initializeInContainer(containerId);
        footer.injectOrganizationStructuredData();
        
        // Listen for content changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'nordic-autos-content') {
                footer.refreshContent();
            }
        });
        
        return footer;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Footer;
} else {
    window.Footer = Footer;
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-initialize footer if container exists
        if (document.getElementById('footer-container')) {
            Footer.renderInContainer();
        }
    });
}