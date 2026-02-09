// Image Optimization for Nordic Autos Website

class ImageOptimizer {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        
        this.imageSizes = {
            mobile: { width: 400, quality: 80 },
            tablet: { width: 800, quality: 85 },
            desktop: { width: 1200, quality: 90 }
        };
        
        this.lazyLoadOffset = 100; // pixels before element enters viewport
        this.observerOptions = {
            root: null,
            rootMargin: `${this.lazyLoadOffset}px`,
            threshold: 0.1
        };
        
        this.init();
    }

    /**
     * Initialize image optimizer
     */
    init() {
        this.setupLazyLoading();
        this.setupResponsiveImages();
        this.setupImageErrorHandling();
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.lazyImageObserver = new IntersectionObserver(
                this.handleLazyImageIntersection.bind(this),
                this.observerOptions
            );
            
            // Observe all lazy images
            this.observeLazyImages();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }
    }

    /**
     * Observe lazy images
     */
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-lazy], [data-bg-lazy]');
        lazyImages.forEach(img => {
            this.lazyImageObserver.observe(img);
        });
    }

    /**
     * Handle lazy image intersection
     */
    handleLazyImageIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                this.loadLazyImage(element);
                observer.unobserve(element);
            }
        });
    }

    /**
     * Load a lazy image
     */
    loadLazyImage(element) {
        if (element.tagName === 'IMG') {
            // Regular image
            const src = element.dataset.lazy || element.dataset.src;
            if (src) {
                element.src = src;
                element.classList.add('loaded');
                element.removeAttribute('data-lazy');
            }
        } else {
            // Background image
            const bgSrc = element.dataset.bgLazy;
            if (bgSrc) {
                element.style.backgroundImage = `url(${bgSrc})`;
                element.classList.add('loaded');
                element.removeAttribute('data-bg-lazy');
            }
        }
    }

    /**
     * Setup responsive images
     */
    setupResponsiveImages() {
        const responsiveImages = document.querySelectorAll('[data-responsive]');
        responsiveImages.forEach(img => {
            this.makeImageResponsive(img);
        });
        
        // Update on resize
        window.addEventListener('resize', this.debounce(() => {
            this.updateResponsiveImages();
        }, 250));
    }

    /**
     * Make an image responsive
     */
    makeImageResponsive(img) {
        const baseSrc = img.dataset.responsive || img.src;
        const currentBreakpoint = this.getCurrentBreakpoint();
        const optimizedSrc = this.getOptimizedImageSrc(baseSrc, currentBreakpoint);
        
        if (img.dataset.lazy) {
            img.dataset.lazy = optimizedSrc;
        } else {
            img.src = optimizedSrc;
        }
        
        // Add responsive attributes
        img.setAttribute('data-original-src', baseSrc);
        img.setAttribute('data-current-breakpoint', currentBreakpoint);
    }

    /**
     * Update responsive images on resize
     */
    updateResponsiveImages() {
        const responsiveImages = document.querySelectorAll('[data-responsive]');
        const currentBreakpoint = this.getCurrentBreakpoint();
        
        responsiveImages.forEach(img => {
            const lastBreakpoint = img.dataset.currentBreakpoint;
            
            if (lastBreakpoint !== currentBreakpoint) {
                const baseSrc = img.dataset.originalSrc || img.dataset.responsive;
                const optimizedSrc = this.getOptimizedImageSrc(baseSrc, currentBreakpoint);
                
                if (!img.dataset.lazy) {
                    img.src = optimizedSrc;
                }
                
                img.setAttribute('data-current-breakpoint', currentBreakpoint);
            }
        });
    }

    /**
     * Get optimized image source for breakpoint
     */
    getOptimizedImageSrc(baseSrc, breakpoint) {
        // For external images (like Google Photos), we can't modify them
        // In a real implementation, you would have multiple sizes of each image
        if (baseSrc.includes('googleusercontent.com') || baseSrc.includes('http')) {
            return this.addImageParameters(baseSrc, breakpoint);
        }
        
        // For local images, return size-specific versions
        const size = this.imageSizes[breakpoint] || this.imageSizes.desktop;
        return this.generateResponsiveImagePath(baseSrc, size);
    }

    /**
     * Add parameters to external images for optimization
     */
    addImageParameters(src, breakpoint) {
        const size = this.imageSizes[breakpoint] || this.imageSizes.desktop;
        
        // For Google Photos URLs, add size parameters
        if (src.includes('googleusercontent.com')) {
            // Remove existing size parameters
            const cleanSrc = src.split('=')[0];
            return `${cleanSrc}=w${size.width}-h${Math.floor(size.width * 0.6)}-c`;
        }
        
        return src;
    }

    /**
     * Generate responsive image path for local images
     */
    generateResponsiveImagePath(baseSrc, size) {
        const pathParts = baseSrc.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');
        
        return `${basePath}_${size.width}w.${extension}`;
    }

    /**
     * Setup image error handling
     */
    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    /**
     * Handle image loading errors
     */
    handleImageError(img) {
        // Try fallback image
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            
            // Try original source if it was a responsive version
            const originalSrc = img.dataset.originalSrc;
            if (originalSrc && img.src !== originalSrc) {
                img.src = originalSrc;
                return;
            }
            
            // Use placeholder image
            img.src = this.getPlaceholderImage();
            img.alt = 'Billede kunne ikke indlæses';
            img.classList.add('image-error');
        }
    }

    /**
     * Get placeholder image
     */
    getPlaceholderImage() {
        // Generate a simple SVG placeholder
        const svg = `
            <svg width="400" height="240" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f1f5f9"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b" font-family="Inter, sans-serif" font-size="14">
                    Billede ikke tilgængeligt
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Get current breakpoint
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width < this.breakpoints.mobile) {
            return 'mobile';
        } else if (width < this.breakpoints.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-critical]');
        
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.critical || img.src;
            document.head.appendChild(link);
        });
    }

    /**
     * Load all images (fallback for browsers without Intersection Observer)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-lazy], [data-bg-lazy]');
        lazyImages.forEach(img => {
            this.loadLazyImage(img);
        });
    }

    /**
     * Create responsive image element
     */
    static createResponsiveImage(src, alt, options = {}) {
        const img = document.createElement('img');
        
        // Set basic attributes
        img.alt = alt;
        img.setAttribute('data-responsive', src);
        
        // Add lazy loading if requested
        if (options.lazy !== false) {
            img.setAttribute('data-lazy', src);
            img.src = 'data:image/svg+xml;base64,' + btoa(`
                <svg width="400" height="240" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f8fafc"/>
                </svg>
            `);
        } else {
            img.src = src;
        }
        
        // Add critical loading if specified
        if (options.critical) {
            img.setAttribute('data-critical', src);
        }
        
        // Add CSS classes
        if (options.className) {
            img.className = options.className;
        }
        
        return img;
    }

    /**
     * Utility: Debounce function
     */
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

    /**
     * Static method to initialize image optimizer
     */
    static initialize() {
        if (!window.imageOptimizer) {
            window.imageOptimizer = new ImageOptimizer();
        }
        return window.imageOptimizer;
    }

    /**
     * Refresh lazy loading observer (useful when adding new images dynamically)
     */
    refreshLazyLoading() {
        if (this.lazyImageObserver) {
            // Disconnect existing observer
            this.lazyImageObserver.disconnect();
            
            // Re-observe all lazy images
            this.observeLazyImages();
        }
    }
}

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        ImageOptimizer.initialize();
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
} else {
    window.ImageOptimizer = ImageOptimizer;
}