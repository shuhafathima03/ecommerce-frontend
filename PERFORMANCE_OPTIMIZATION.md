# Performance Optimization Guide

This guide covers image and asset optimization strategies for the ShopHub e-commerce platform.

## Table of Contents

1. [Image Optimization](#image-optimization)
2. [Lazy Loading](#lazy-loading)
3. [Responsive Images](#responsive-images)
4. [Asset Minification](#asset-minification)
5. [Caching Strategies](#caching-strategies)
6. [Performance Monitoring](#performance-monitoring)
7. [Tools & Resources](#tools--resources)

## Image Optimization

### Compress Images

Use these tools to reduce image file sizes without losing quality:

- **TinyPNG/TinyJPG** - https://tinypng.com/
  - ~80% file size reduction
  - Free tier: 20 images/month
  - Pro tier: unlimited

- **Squoosh** - https://squoosh.app/
  - Free, open-source
  - Multiple compression algorithms
  - Real-time preview

- **ImageMagick** - https://imagemagick.org/
  - Command-line tool for batch processing
  - Example: `convert input.jpg -strip -quality 80 output.jpg`

### Convert to Modern Formats

#### WebP Format

**Advantages:**
- 25-35% smaller than JPEG
- 35-45% smaller than PNG
- Better transparency support

**Browser Support:** 95%+ modern browsers
- Chrome/Edge: ✓
- Firefox: ✓
- Safari 16+: ✓
- IE 11: ✗ (fallback to JPEG/PNG)

**Conversion Command:**
```bash
# Using ImageMagick
convert image.jpg image.webp

# Using cwebp
cwebp image.jpg -o image.webp

# Batch convert
for file in *.jpg; do cwebp "$file" -o "${file%.jpg}.webp"; done
```

**HTML Implementation:**
```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

#### JPEG vs PNG Optimization

**Use JPEG for:**
- Photographs
- Complex images with gradients
- Typical product images
- Quality: 75-85 for web

**Use PNG for:**
- Images with transparency
- Simple graphics
- Icons
- Screenshots

**Use SVG for:**
- Icons
- Logos
- Simple illustrations
- Scalable graphics

### Image Sizing

```
Desktop (1920px):    1200x1200px product images
Tablet (1024px):     800x800px
Mobile (480px):      400x400px
Thumbnail:           200x200px
```

## Lazy Loading

### Implementation Methods

#### 1. Native Lazy Loading (Recommended)

```html
<img src="placeholder.jpg" 
     data-src="actual-image.jpg" 
     loading="lazy" 
     alt="Product">
```

- Supported in 95%+ browsers
- No JavaScript required
- Built-in 50px margin for preloading

#### 2. JavaScript-Based (Fallback)

Implemented in `scripts/image-optimizer.js`:

```javascript
const optimizer = new ImageOptimizer();
// Automatically handles:
// - IntersectionObserver detection
// - Fallback for older browsers
// - Image preloading with margin
```

#### 3. Apply to All Images

```html
<!-- Product Images -->
<img src="product.jpg" 
     loading="lazy" 
     decoding="async"
     alt="Product Name">

<!-- Below-the-fold Images Only -->
<img class="lazy-load" 
     data-src="image.jpg" 
     loading="lazy"
     alt="Description">

<!-- Product Grid -->
<div class="product-grid">
    <img loading="lazy" decoding="async" alt="Product">
</div>
```

## Responsive Images

### Using srcset Attribute

```html
<!-- Device-specific resolution -->
<img src="image.jpg"
     srcset="image-small.jpg 480w,
             image-medium.jpg 768w,
             image-large.jpg 1200w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 80vw,
            (max-width: 1200px) 60vw,
            50vw"
     alt="Product">
```

### Using Picture Element

```html
<picture>
    <!-- WebP for modern browsers -->
    <source srcset="image.webp" type="image/webp">
    <source srcset="image-small.webp" 
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 80vw,
                   50vw"
            type="image/webp">
    
    <!-- PNG/JPEG fallback -->
    <source srcset="image.jpg" type="image/jpeg">
    <source srcset="image-small.jpg" 
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 80vw,
                   50vw"
            type="image/jpeg">
    
    <!-- Fallback image -->
    <img src="image.jpg" 
         alt="Product" 
         loading="lazy"
         decoding="async">
</picture>
```

## Asset Minification

### CSS Minification

**Before:**
```css
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    margin: 0;
}
```

**After:**
```css
body{background-color:#f0f0f0;font-family:Arial,sans-serif;margin:0}
```

**Tools:**
- **CSS-Nano** - https://cssnano.co/
- **UglifyCSS** - https://github.com/fmartin5/uglify-css
- **YUI Compressor** - https://yui.github.io/yuicompressor/

**Command:**
```bash
# Using CSS-Nano
npx cssnano input.css -o output.min.css

# Using terser for CSS
npx cleancss styles/main.css -o styles/main.min.css
```

### JavaScript Minification

**Tools:**
- **Terser** (recommended)
- **UglifyJS**
- **Google Closure Compiler**

**Commands:**
```bash
# Using Terser
npx terser scripts/app.js -o scripts/app.min.js

# Minify all JS files
npx terser scripts/*.js -o scripts/all.min.js

# With source map
npx terser scripts/app.js -o scripts/app.min.js --source-map
```

**Installation:**
```bash
npm install --save-dev terser
npm install --save-dev cleancss
```

**package.json Scripts:**
```json
{
  "scripts": {
    "minify:css": "cleancss styles/main.css -o styles/main.min.css",
    "minify:js": "terser scripts/app.js -o scripts/app.min.js",
    "minify:all": "npm run minify:css && npm run minify:js"
  }
}
```

## Caching Strategies

### Browser Caching Headers

**For Static Assets (.htaccess):**
```apache
# Cache images for 30 days
<FilesMatch "\.(jpg|jpeg|png|gif|webp|ico)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>

# Cache CSS/JS for 7 days
<FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=604800, public"
</FilesMatch>

# Don't cache HTML
<FilesMatch "\.html$">
    Header set Cache-Control "max-age=3600, no-cache"
</FilesMatch>
```

**For Node.js/Express:**
```javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: false
}));

// Specific cache rules
app.get('*.jpg', (req, res) => {
    res.set('Cache-Control', 'public, max-age=31536000');
    res.sendFile(path.join(__dirname, req.path));
});
```

### JavaScript Cache API

Used in `scripts/image-optimizer.js`:

```javascript
// Cache asset
AssetCache.cacheAsset('product-list', data, 3600000);

// Retrieve cached asset
const cached = AssetCache.getCache('product-list');

// Clear specific cache
AssetCache.clearCache('product-list');

// Clear expired cache
AssetCache.clearExpiredCache();
```

## Performance Monitoring

### Built-in Performance Tools

Use `PerformanceTracker` class in `scripts/image-optimizer.js`:

```javascript
// Get Web Vitals
PerformanceTracker.getWebVitals();

// Log Web Vitals
PerformanceTracker.logWebVitals();

// Track custom metrics
PerformanceTracker.trackMetric('API Response', '245ms');
PerformanceTracker.trackImageLoad('product.jpg', 123);
```

### Console Output Example

```
✓ Asset optimization initialized
✓ Lazy loading initialized for 24 images
✓ Critical assets preloaded
📊 Performance Metrics:
  - Page Load Time: 1245.34ms
  - Server Response: 450.12ms
  - DOM Rendering: 340.56ms
  - Image Load Time: 1020.34ms (24 images)
```

### Google Lighthouse

1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Click **Analyze page load**
4. Review performance score and recommendations

Key metrics:
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1

### PageSpeed Insights

1. Go to https://pagespeed.web.dev/
2. Enter your website URL
3. View mobile and desktop scores
4. Get specific recommendations

### WebPagetest

1. Go to https://www.webpagetest.org/
2. Enter URL and test location
3. Analyze waterfall chart
4. Review optimization recommendations

## Tools & Resources

### Image Optimization Tools

| Tool | Type | Features | Cost |
|------|------|----------|------|
| TinyPNG | Online | JPEG/PNG compression, WebP | Free (20/mo) + Pro |
| Squoosh | Online | Multiple algorithms, real-time | Free |
| ImageMagick | CLI | Batch processing, format conversion | Free |
| Cloudinary | CDN | Dynamic resizing, optimization | Free (10GB) + Pro |
| imgix | CDN | On-the-fly optimization | Pro only |

### Performance Testing Tools

| Tool | Purpose | Cost |
|------|---------|------|
| Google Lighthouse | Overall performance | Free |
| PageSpeed Insights | Mobile/Desktop optimization | Free |
| WebPagetest | Detailed waterfall analysis | Free |
| GTmetrix | Performance tracking | Free + Pro |
| Speedcurve | Continuous monitoring | Pro only |

### NPM Packages

```bash
npm install --save-dev terser        # JS minification
npm install --save-dev cleancss      # CSS minification
npm install --save-dev sharp         # Image processing
npm install --save-dev imagemin      # Image optimization
npm install --save-dev compression   # Gzip/Brotli compression
```

## Implementation Checklist

- ✅ Images compressed (TinyPNG or similar)
- ✅ WebP format implemented with fallbacks
- ✅ Lazy loading enabled (`loading="lazy"`)
- ✅ Responsive images with srcset
- ✅ CSS minified
- ✅ JavaScript minified
- ✅ Caching headers configured
- ✅ CDN configured (if applicable)
- ✅ Gzip compression enabled
- ✅ Performance tested (Lighthouse score > 85)

## Quick Start

1. **Compress existing images:**
   ```bash
   # Using ImageMagick
   for file in assets/*.jpg; do
       convert "$file" -strip -quality 80 "$file"
   done
   ```

2. **Convert to WebP:**
   ```bash
   # Install cwebp
   npm install --save-dev cwebp
   
   # Convert all JPG to WebP
   for file in assets/*.jpg; do
       cwebp "$file" -o "${file%.jpg}.webp"
   done
   ```

3. **Minify CSS/JS:**
   ```bash
   npm install --save-dev terser cleancss
   npm run minify:all
   ```

4. **Enable lazy loading:**
   - Add `loading="lazy"` to all images
   - Include `scripts/image-optimizer.js` in HTML

5. **Test performance:**
   - Run Google Lighthouse audit
   - Check PageSpeed Insights
   - Monitor with WebPagetest

## Results Expectation

Proper image and asset optimization typically yields:

- **Page Load Time Reduction:** 30-50% faster
- **File Size Reduction:** 40-70% smaller
- **Image Load Time:** 20-40% faster
- **Lighthouse Score:** +15-30 points
- **Core Web Vitals:** Pass all metrics

## Next Steps

1. Implement image optimization
2. Enable lazy loading across all pages
3. Minify and compress assets
4. Set up CDN for asset delivery
5. Configure caching headers
6. Monitor performance continuously

---

**Last Updated:** February 12, 2026
**Version:** 1.0
