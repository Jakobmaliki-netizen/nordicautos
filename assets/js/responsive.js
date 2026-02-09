// Responsive Design Utilities for Nordic Autos Website

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.touchDevice = this.isTouchDevice();
        
        this.init();
    }

    /**
     * Initialize responsive manager
     */
    init() {
        this.setupEventListeners();
        this.setupTouchSupport();
        this.optimizeForDevice();
    }

    /**
     * Get current breakpoint based on window width
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.mobile) {
            return 'mobile';
        } else if (width < this.breakpoints.tablet) {
            return 'tablet';
        } else if (width < this.breakpoints.desktop) {
            return 'desktop';
        } else {
            return 'large';
        }
    }

    /**
     * Check if device supports touch
     */
    isTouchDevice() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               navigator.msMaxTouchPoints > 0;
    }

    /**
     * Setup event listeners for responsive behavior
     */
    setupEventListeners() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
        
        this.optimizeImages();
        this.adjustLayoutForViewport();
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        // Close mobile menu on orientation change
        if (window.navigation && window.navigation.mobileMenuOpen) {
            window.navigation.toggleMobileMenu();
        }
        
        // Recalculate layout
        this.adjustLayoutForViewport();
    }

    /**
     * Called when breakpoint changes
     */
    onBreakpointChange(newBreakpoint) {
        document.body.setAttribute('data-breakpoint', newBreakpoint);
        
        // Emit custom event for other components to listen to
        const event = new CustomEvent('breakpointChange', {
            detail: { 
                breakpoint: newBreakpoint,
                previousBreakpoint: this.currentBreakpoint
            }
        });
        window.dispatchEvent(event);
        
        console.log(`Breakpoint changed to: ${newBreakpoint}`);
    }

    /**
     * Setup touch support for mobile devices
     */
    setupTouchSupport() {
        if (this.touchDevice) {
            document.body.classList.add('touch-device');
            
            // Add touch-friendly styles
            const style = document.createElement('style');
            style.textContent = `
                .touch-device .hover\\:scale-105:hover {
                    transform: none;
                }
                
                .touch-device button,
                .touch-device a {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                .touch-device .car-card {
                    transition: transform 0.2s ease;
                }
                
                .touch-device .car-card:active {
                    transform: scale(0.98);
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Optimize for current device
     */
    optimizeForDevice() {
        // Set initial breakpoint attribute
        document.body.setAttribute('data-breakpoint', this.currentBreakpoint);
        
        // Add device class
        if (this.touchDevice) {
            document.body.classList.add('touch-device');
        }
        
        // Optimize images for current viewport
        this.optimizeImages();
    }

    /**
     * Optimize images for current viewport
     */
    optimizeImages() {
        const images = document.querySelectorAll('[data-responsive-image]');
        
        images.forEach(img => {
            const sizes = {
                mobile: img.dataset.mobileSrc,
                tablet: img.dataset.tabletSrc,
                desktop: img.dataset.desktopSrc
            };
            
            let targetSrc = sizes[this.currentBreakpoint] || sizes.desktop || img.src;
            
            if (img.src !== targetSrc) {
                img.src = targetSrc;
            }
        });
    }

    /**
     * Adjust layout for current viewport
     */
    adjustLayoutForViewport() {
        // Adjust hero section height on mobile
        const heroSections = document.querySelectorAll('.hero-section, [data-hero]');
        heroSections.forEach(hero => {
            if (this.currentBreakpoint === 'mobile') {
                hero.style.minHeight = '400px';
            } else {
                hero.style.minHeight = '580px';
            }
        });

        // Adjust grid layouts
        this.adjustGridLayouts();
        
        // Adjust font sizes
        this.adjustTypography();
    }

    /**
     * Adjust grid layouts for current breakpoint
     */
    adjustGridLayouts() {
        const grids = document.querySelectorAll('[data-responsive-grid]');
        
        grids.forEach(grid => {
            const columns = {
                mobile: grid.dataset.mobileColumns || '1',
                tablet: grid.dataset.tabletColumns || '2',
                desktop: grid.dataset.desktopColumns || '3'
            };
            
            const targetColumns = columns[this.currentBreakpoint] || columns.desktop;
            grid.style.gridTemplateColumns = `repeat(${targetColumns}, 1fr)`;
        });
    }

    /**
     * Adjust typography for current breakpoint
     */
    adjustTypography() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach(heading => {
            if (this.currentBreakpoint === 'mobile') {
                heading.classList.add('text-responsive-mobile');
            } else {
                heading.classList.remove('text-responsive-mobile');
            }
        });
    }

    /**
     * Create responsive image element
     */
    static createResponsiveImage(src, alt, mobileSrc = null, tabletSrc = null) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.setAttribute('data-responsive-image', 'true');
        
        if (mobileSrc) img.setAttribute('data-mobile-src', mobileSrc);
        if (tabletSrc) img.setAttribute('data-tablet-src', tabletSrc);
        img.setAttribute('data-desktop-src', src);
        
        return img;
    }

    /**
     * Add swipe gesture support
     */
    addSwipeSupport(element, callbacks = {}) {
        if (!this.touchDevice) return;
        
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0 && callbacks.swipeRight) {
                        callbacks.swipeRight();
                    } else if (deltaX < 0 && callbacks.swipeLeft) {
                        callbacks.swipeLeft();
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0 && callbacks.swipeDown) {
                        callbacks.swipeDown();
                    } else if (deltaY < 0 && callbacks.swipeUp) {
                        callbacks.swipeUp();
                    }
                }
            }
        });
    }

    /**
     * Get viewport dimensions
     */
    getViewportDimensions() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint,
            isMobile: this.currentBreakpoint === 'mobile',
            isTablet: this.currentBreakpoint === 'tablet',
            isDesktop: this.currentBreakpoint === 'desktop' || this.currentBreakpoint === 'large',
            isTouch: this.touchDevice
        };
    }

    /**
     * Static method to initialize responsive manager
     */
    static initialize() {
        if (!window.responsiveManager) {
            window.responsiveManager = new ResponsiveManager();
        }
        return window.responsiveManager;
    }
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        ResponsiveManager.initialize();
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
} else {
    window.ResponsiveManager = ResponsiveManager;
}