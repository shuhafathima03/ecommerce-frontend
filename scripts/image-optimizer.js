// ============================================
// IMAGE AND ASSET OPTIMIZATION MODULE
// ============================================

/**
 * Comprehensive image and asset optimization for improved performance
 * Features:
 * - Lazy loading for images
 * - Image compression hints
 * - Responsive image handling
 * - Asset preloading
 * - Performance monitoring
 */

// ============================================
// LAZY LOADING IMPLEMENTATION
// ============================================

class ImageOptimizer {
    constructor() {
        this.lazyImages = [];
        this.observer = null;
        this.init();
    }

    init() {
        console.log('Initializing Image Optimizer');
        this.setupLazyLoading();
        this.preloadCriticalAssets();
        this.monitorPerformance();
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, using fallback');
            this.lazyLoadFallback();
            return;
        }

        const imageLoadOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        }, imageLoadOptions);

        // Observe all lazy-loadable images
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            this.observer.observe(img);
            this.lazyImages.push(img);
        });

        console.log(`✓ Lazy loading initialized for ${this.lazyImages.length} images`);
    }

    /**
     * Load image when visible
     */
    loadImage(img) {
        if (img.dataset.src) {
            // Load high-quality image
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        if (img.dataset.srcset) {
            // Load responsive images
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        if (this.observer) {
            this.observer.unobserve(img);
        }
    }

    /**
     * Fallback lazy loading for older browsers
     */
    lazyLoadFallback() {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    /**
     * Preload critical assets
     */
    preloadCriticalAssets() {
        // Preload critical fonts
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = 'styles/main.css';
        document.head.appendChild(link);

        // Preload critical scripts
        const script = document.createElement('link');
        script.rel = 'preload';
        script.as = 'script';
        script.href = 'scripts/app.js';
        document.head.appendChild(script);

        console.log('✓ Critical assets preloaded');
    }

    /**
     * Monitor and report performance metrics
     */
    monitorPerformance() {
        // Check if Performance API is available
        if (!window.performance || !window.performance.getEntriesByType) {
            return;
        }

        // Log performance on load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    const pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    const connectTime = perfData.responseEnd - perfData.requestStart;
                    const renderTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

                    console.log('📊 Performance Metrics:');
                    console.log(`  - Page Load Time: ${pageLoadTime.toFixed(2)}ms`);
                    console.log(`  - Server Response: ${connectTime.toFixed(2)}ms`);
                    console.log(`  - DOM Rendering: ${renderTime.toFixed(2)}ms`);

                    // Log image load performance
                    const imageResources = window.performance.getEntriesByType('resource')
                        .filter(r => r.name.includes('image'));
                    
                    if (imageResources.length > 0) {
                        const totalImageTime = imageResources.reduce((total, img) => total + img.duration, 0);
                        console.log(`  - Image Load Time: ${totalImageTime.toFixed(2)}ms (${imageResources.length} images)`);
                    }
                }
            }, 1000);
        });
    }

    /**
     * Get optimized image URL with compression parameters
     */
    getOptimizedImageUrl(url, options = {}) {
        const {
            width = 400,
            height = 400,
            quality = 80,
            format = 'auto'
        } = options;

        // For external APIs, return original URL
        // In production, you'd use a service like imgix or Cloudinary
        return url;
    }

    /**
     * Generate responsive image srcset
     */
    generateSrcset(baseUrl) {
        // In production, use a CDN URL that supports dynamic resizing
        // Example: https://cdn.example.com/image.jpg?w=400
        return baseUrl;
    }

    /**
     * Enable compression hints on images
     */
    addCompressionHints() {
        document.querySelectorAll('img').forEach(img => {
            // Add decoding attribute for async image decoding
            img.decoding = 'async';

            // Add importance hints
            if (!img.parentElement?.classList.contains('above-the-fold')) {
                img.loading = 'lazy';
            }
        });

        console.log('✓ Compression hints added to images');
    }
}

// ============================================
// PERFORMANCE METRICS TRACKER
// ============================================

class PerformanceTracker {
    static trackMetric(name, value) {
        console.log(`📊 ${name}: ${value}`);
    }

    static trackImageLoad(imageName, loadTime) {
        this.trackMetric(`Image Loaded: ${imageName}`, `${loadTime.toFixed(2)}ms`);
    }

    static getWebVitals() {
        if (!window.performance) {
            return null;
        }

        return {
            timestamp: new Date().toISOString(),
            resourcesLoaded: performance.getEntriesByType('resource').length,
            navigationTiming: performance.getEntriesByType('navigation')[0]
        };
    }

    static logWebVitals() {
        const vitals = this.getWebVitals();
        if (vitals) {
            console.log('🎯 Web Vitals:', vitals);
        }
    }
}

// ============================================
// ASSET CACHING STRATEGY
// ============================================

class AssetCache {
    static cacheAsset(name, data, ttl = 3600000) {
        // Cache for 1 hour by default
        const cacheData = {
            data: data,
            timestamp: new Date().getTime(),
            ttl: ttl
        };

        try {
            localStorage.setItem(`cache_${name}`, JSON.stringify(cacheData));
            console.log(`✓ Asset cached: ${name}`);
        } catch (error) {
            console.warn(`Cache full or disabled: ${error.message}`);
        }
    }

    static getCache(name) {
        try {
            const cached = localStorage.getItem(`cache_${name}`);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const now = new Date().getTime();

            // Check if cache has expired
            if (now - cacheData.timestamp > cacheData.ttl) {
                localStorage.removeItem(`cache_${name}`);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn(`Error retrieving cache: ${error.message}`);
            return null;
        }
    }

    static clearCache(name) {
        localStorage.removeItem(`cache_${name}`);
        console.log(`✓ Cache cleared: ${name}`);
    }

    static clearExpiredCache() {
        const now = new Date().getTime();
        let cleared = 0;

        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('cache_')) {
                try {
                    const cached = JSON.parse(localStorage.getItem(key));
                    if (now - cached.timestamp > cached.ttl) {
                        localStorage.removeItem(key);
                        cleared++;
                    }
                } catch (error) {
                    // Ignore parse errors
                }
            }
        }

        if (cleared > 0) {
            console.log(`✓ Cleared ${cleared} expired cache entries`);
        }
    }
}

// ============================================
// RESPONSIVE IMAGE HELPER
// ============================================

class ResponsiveImageHelper {
    /**
     * Get device-appropriate image URL
     */
    static getResponsiveImageUrl(baseUrl, deviceWidth = window.innerWidth) {
        // Determine optimal image size based on device width
        let size = 'small';
        if (deviceWidth > 1200) size = 'large';
        else if (deviceWidth > 768) size = 'medium';

        // In production, you'd use these sizes to fetch from CDN
        // Example: https://cdn.example.com/image-large.jpg
        return baseUrl;
    }

    /**
     * Generate picture element with WebP support
     */
    static generatePictureElement(jpgUrl, webpUrl, altText) {
        return `
            <picture>
                <source srcset="${webpUrl}" type="image/webp">
                <source srcset="${jpgUrl}" type="image/jpeg">
                <img src="${jpgUrl}" alt="${altText}" loading="lazy" decoding="async">
            </picture>
        `;
    }

    /**
     * Calculate optimal image dimensions for responsive design
     */
    static getOptimalDimensions() {
        const width = window.innerWidth;
        
        // Return width in common breakpoints
        if (width < 480) return 320;
        if (width < 768) return 640;
        if (width < 1024) return 1024;
        if (width < 1200) return 1200;
        return 1920;
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize optimizer
    const optimizer = new ImageOptimizer();

    // Clear expired cache
    AssetCache.clearExpiredCache();

    // Add compression hints
    optimizer.addCompressionHints();

    // Track performance
    PerformanceTracker.logWebVitals();

    console.log('✓ Asset optimization initialized');
});

// Expose to global scope for debugging
window.ImageOptimizer = ImageOptimizer;
window.PerformanceTracker = PerformanceTracker;
window.AssetCache = AssetCache;
window.ResponsiveImageHelper = ResponsiveImageHelper;

console.log('Image and Asset Optimization module loaded');
