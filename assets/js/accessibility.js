// Accessibility enhancements for Nordic Autos Website

class AccessibilityEnhancer {
    constructor() {
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.skipLinkTarget = null;
        
        this.init();
    }

    /**
     * Initialize accessibility enhancements
     */
    init() {
        this.addSkipLinks();
        this.enhanceFocusManagement();
        this.addKeyboardNavigation();
        this.enhanceFormAccessibility();
        this.addAriaLiveRegions();
        this.setupColorContrastToggle();
        this.addScreenReaderAnnouncements();
    }

    /**
     * Add skip links for keyboard navigation
     */
    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Spring til hovedindhold</a>
            <a href="#navigation" class="skip-link">Spring til navigation</a>
            <a href="#footer" class="skip-link">Spring til footer</a>
        `;
        
        // Insert at the beginning of body
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add CSS for skip links
        this.addSkipLinkStyles();
    }

    /**
     * Add CSS styles for skip links
     */
    addSkipLinkStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 1000;
            }
            
            .skip-link {
                position: absolute;
                top: -100px;
                left: 6px;
                background: #1754cf;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 600;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            .skip-link:hover {
                background: #0f3a9f;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enhance focus management
     */
    enhanceFocusManagement() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible:focus {
                outline: 2px solid #1754cf;
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            .focus-visible:focus:not(:focus-visible) {
                outline: none;
            }
            
            /* Enhanced focus for interactive elements */
            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 2px solid #1754cf;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Focus trap for modals
        this.setupFocusTrap();
    }

    /**
     * Setup focus trap for modals and overlays
     */
    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            const modal = document.querySelector('.modal:not(.hidden), .fixed:not(.hidden)');
            if (!modal) return;

            const focusableElements = modal.querySelectorAll(this.focusableElements);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /**
     * Add keyboard navigation enhancements
     */
    addKeyboardNavigation() {
        // Arrow key navigation for card grids
        this.setupArrowKeyNavigation();
        
        // Enter key activation for clickable elements
        this.setupEnterKeyActivation();
        
        // Escape key handling
        this.setupEscapeKeyHandling();
    }

    /**
     * Setup arrow key navigation for card grids
     */
    setupArrowKeyNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

            const activeElement = document.activeElement;
            const cardGrid = activeElement.closest('.grid');
            if (!cardGrid) return;

            const cards = Array.from(cardGrid.querySelectorAll('[tabindex="0"], button, a'));
            const currentIndex = cards.indexOf(activeElement);
            if (currentIndex === -1) return;

            e.preventDefault();

            let newIndex;
            const gridCols = this.getGridColumns(cardGrid);

            switch (e.key) {
                case 'ArrowRight':
                    newIndex = Math.min(currentIndex + 1, cards.length - 1);
                    break;
                case 'ArrowLeft':
                    newIndex = Math.max(currentIndex - 1, 0);
                    break;
                case 'ArrowDown':
                    newIndex = Math.min(currentIndex + gridCols, cards.length - 1);
                    break;
                case 'ArrowUp':
                    newIndex = Math.max(currentIndex - gridCols, 0);
                    break;
            }

            if (newIndex !== undefined && cards[newIndex]) {
                cards[newIndex].focus();
            }
        });
    }

    /**
     * Get number of grid columns
     */
    getGridColumns(grid) {
        const computedStyle = window.getComputedStyle(grid);
        const gridTemplateColumns = computedStyle.gridTemplateColumns;
        return gridTemplateColumns.split(' ').length;
    }

    /**
     * Setup Enter key activation for clickable elements
     */
    setupEnterKeyActivation() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;

            const element = e.target;
            if (element.hasAttribute('onclick') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
                e.preventDefault();
                element.click();
            }
        });
    }

    /**
     * Setup Escape key handling
     */
    setupEscapeKeyHandling() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;

            // Close modals
            const modal = document.querySelector('.modal:not(.hidden), .fixed:not(.hidden)');
            if (modal) {
                const closeButton = modal.querySelector('[aria-label*="Luk"], [aria-label*="Close"]');
                if (closeButton) {
                    closeButton.click();
                }
            }

            // Close dropdowns
            const dropdown = document.querySelector('.dropdown.open');
            if (dropdown) {
                dropdown.classList.remove('open');
            }
        });
    }

    /**
     * Enhance form accessibility
     */
    enhanceFormAccessibility() {
        // Add required field indicators
        document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator text-red-500 ml-1';
                indicator.setAttribute('aria-label', 'påkrævet felt');
                indicator.textContent = '*';
                label.appendChild(indicator);
            }
        });

        // Add error announcements
        this.setupFormErrorAnnouncements();
        
        // Add field descriptions
        this.setupFieldDescriptions();
    }

    /**
     * Setup form error announcements
     */
    setupFormErrorAnnouncements() {
        document.addEventListener('invalid', (e) => {
            const field = e.target;
            const errorMessage = field.validationMessage;
            
            // Create or update error message
            let errorElement = document.getElementById(`${field.id}-error`);
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = `${field.id}-error`;
                errorElement.className = 'error-message text-red-600 text-sm mt-1';
                errorElement.setAttribute('role', 'alert');
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
            field.setAttribute('aria-describedby', errorElement.id);
            field.setAttribute('aria-invalid', 'true');
        });

        // Clear errors on valid input
        document.addEventListener('input', (e) => {
            const field = e.target;
            if (field.checkValidity()) {
                const errorElement = document.getElementById(`${field.id}-error`);
                if (errorElement) {
                    errorElement.remove();
                }
                field.removeAttribute('aria-describedby');
                field.setAttribute('aria-invalid', 'false');
            }
        });
    }

    /**
     * Setup field descriptions
     */
    setupFieldDescriptions() {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            const helpText = field.nextElementSibling;
            if (helpText && helpText.classList.contains('help-text')) {
                const helpId = `${field.id}-help`;
                helpText.id = helpId;
                field.setAttribute('aria-describedby', helpId);
            }
        });
    }

    /**
     * Add ARIA live regions for dynamic content
     */
    addAriaLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Create assertive live region for urgent announcements
        const assertiveLiveRegion = document.createElement('div');
        assertiveLiveRegion.id = 'assertive-live-region';
        assertiveLiveRegion.setAttribute('aria-live', 'assertive');
        assertiveLiveRegion.setAttribute('aria-atomic', 'true');
        assertiveLiveRegion.className = 'sr-only';
        document.body.appendChild(assertiveLiveRegion);

        // Add screen reader only class
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup color contrast toggle
     */
    setupColorContrastToggle() {
        // Add high contrast mode toggle
        const contrastToggle = document.createElement('button');
        contrastToggle.className = 'contrast-toggle fixed bottom-4 right-4 z-50 p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary';
        contrastToggle.innerHTML = '<span class="material-symbols-outlined">contrast</span>';
        contrastToggle.setAttribute('aria-label', 'Skift til høj kontrast');
        contrastToggle.setAttribute('title', 'Høj kontrast tilstand');
        
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            contrastToggle.setAttribute('aria-label', isHighContrast ? 'Skift til normal kontrast' : 'Skift til høj kontrast');
            
            // Announce change
            this.announce(isHighContrast ? 'Høj kontrast aktiveret' : 'Normal kontrast aktiveret');
        });

        document.body.appendChild(contrastToggle);

        // Add high contrast styles
        const style = document.createElement('style');
        style.textContent = `
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }
            
            .high-contrast .text-slate-500,
            .high-contrast .text-slate-400 {
                color: #000 !important;
            }
            
            .high-contrast .dark .text-slate-500,
            .high-contrast .dark .text-slate-400 {
                color: #fff !important;
            }
            
            .high-contrast button,
            .high-contrast a {
                outline: 2px solid currentColor;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add screen reader announcements
     */
    addScreenReaderAnnouncements() {
        // Announce page changes
        this.announcePageLoad();
        
        // Announce dynamic content changes
        this.setupContentChangeAnnouncements();
    }

    /**
     * Announce page load
     */
    announcePageLoad() {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1');
        const announcement = mainHeading ? 
            `Side indlæst: ${pageTitle}. Hovedoverskrift: ${mainHeading.textContent}` :
            `Side indlæst: ${pageTitle}`;
        
        setTimeout(() => {
            this.announce(announcement);
        }, 1000);
    }

    /**
     * Setup content change announcements
     */
    setupContentChangeAnnouncements() {
        // Observe dynamic content changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Announce new content with specific announcements
                            if (node.classList.contains('car-card')) {
                                this.announce('Ny bil tilføjet til listen');
                            } else if (node.classList.contains('error-message')) {
                                this.announce('Fejlmeddelelse vist', true);
                            } else if (node.classList.contains('success-message')) {
                                this.announce('Succesmeddelelse vist');
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Announce message to screen readers
     */
    announce(message, assertive = false) {
        const liveRegion = document.getElementById(assertive ? 'assertive-live-region' : 'live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Add heading navigation
     */
    addHeadingNavigation() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        // Add heading navigation shortcut
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.showHeadingNavigation(headings);
            }
        });
    }

    /**
     * Show heading navigation modal
     */
    showHeadingNavigation(headings) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-lg font-bold mb-4">Overskrifter på siden</h2>
                <ul class="space-y-2 max-h-60 overflow-y-auto">
                    ${Array.from(headings).map((heading, index) => `
                        <li>
                            <button class="text-left w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" 
                                    onclick="document.querySelectorAll('h1,h2,h3,h4,h5,h6')[${index}].focus(); this.closest('.fixed').remove();">
                                ${heading.tagName} - ${heading.textContent.trim()}
                            </button>
                        </li>
                    `).join('')}
                </ul>
                <button class="mt-4 btn-secondary w-full" onclick="this.closest('.fixed').remove();">
                    Luk
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('button').focus();
    }

    /**
     * Static method to initialize accessibility enhancements
     */
    static initialize() {
        if (!window.accessibilityEnhancer) {
            window.accessibilityEnhancer = new AccessibilityEnhancer();
        }
        return window.accessibilityEnhancer;
    }
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        AccessibilityEnhancer.initialize();
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityEnhancer;
} else {
    window.AccessibilityEnhancer = AccessibilityEnhancer;
}