# Asset Optimization Quick Reference

## 🚀 Lazy Loading (✅ Already Implemented)

### What was done:
- All product images use `loading="lazy"` attribute
- All images use `decoding="async"` for non-blocking decoding
- IntersectionObserver handles images on browsers that don't support native lazy loading
- Performance metrics automatically tracked

### To verify it's working:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Scroll down the page
4. Watch images load only as they come into view

### What it does:
- Images below the fold don't load until needed
- Saves bandwidth for users who don't scroll
- 20-40% faster page load time

---

## 🖼️ Image Compression (Next Step)

### Quick Start:
```bash
# Option 1: Online tool (easiest)
1. Go to https://squoosh.app/
2. Upload your image
3. Use JPEG at quality 75-85
4. Download compressed version

# Option 2: Command line
magick convert input.jpg -strip -quality 80 output.jpg
```

### Expected Results:
- Original: 500KB
- Compressed: 150-200KB (60-70% reduction)

### Which images to compress:
- All product images from FakeStore API
- Testimonial avatars
- Hero background images

---

## 🎨 WebP Format (Recommended for Future)

### Why WebP?
- 25-35% smaller than JPEG
- Modern browser support (95%+)
- Falls back to JPEG automatically

### How to convert:
```bash
# Install (one time)
npm install --save-dev cwebp

# Convert
cwebp image.jpg -o image.webp
```

### HTML Usage:
```html
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

---

## 📦 Minify CSS & JavaScript (High Value)

### Setup (one time):
```bash
npm install --save-dev terser cleancss
```

### Minify command:
```bash
# JavaScript
npx terser scripts/*.js -o scripts/app.min.js

# CSS
npx cleancss styles/*.css -o styles/main.min.css
```

### Expected Results:
- Original CSS: 794 lines → ~15 KB compressed
- Original JS: 2000+ lines → ~40 KB compressed
- After minify: 50-70% smaller

### Use minified versions in HTML:
```html
<!-- Old -->
<link rel="stylesheet" href="styles/main.css">
<script src="scripts/app.js"></script>

<!-- New -->
<link rel="stylesheet" href="styles/main.min.css">
<script src="scripts/app.min.js"></script>
```

---

## 📊 Performance Testing

### Chrome DevTools Lighthouse:
1. Press **F12** to open DevTools
2. Click **Lighthouse** tab
3. Click **Analyze page load**
4. Check scores:
   - **Green (90+):** Excellent
   - **Yellow (50-89):** Good
   - **Red (<50):** Needs work

### Target Scores:
- **Mobile:** > 80
- **Desktop:** > 90

### Key Metrics:
- **LCP** (Largest Contentful Paint): < 2.5s ✓
- **FID** (First Input Delay): < 100ms ✓
- **CLS** (Cumulative Layout Shift): < 0.1 ✓

### Online Tools:
- **PageSpeed Insights:** https://pagespeed.web.dev/
- **GTmetrix:** https://gtmetrix.com/
- **WebPagetest:** https://www.webpagetest.org/

---

## 🔗 Responsive Images (Advanced)

### What it does:
- Serves different image sizes based on device
- Mobile gets smaller image (faster load)
- Desktop gets full resolution

### Implementation:
```html
<img src="image-small.jpg"
     srcset="image-small.jpg 480w,
             image-medium.jpg 768w,
             image-large.jpg 1200w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="Product"
     loading="lazy">
```

### Breakpoints used:
- **480px:** Mobile phones
- **768px:** Tablets
- **1024px:** Laptops
- **1200px:** Desktops

---

## 💾 Caching Headers (Server Config)

### What it does:
- Browser remembers images for 30 days
- No need to download again on return visit
- 80% faster on repeat visits

### .htaccess (Apache):
```apache
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>

<FilesMatch "\.(css|js)$">
    Header set Cache-Control "max-age=604800, public"
</FilesMatch>
```

### Node.js (Express):
```javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: false
}));
```

---

## 📈 Optimization Priority

### High Impact (Do First):
1. **Image Compression** - 30-50% reduction
2. **WebP Format** - 25-35% additional reduction
3. **Lazy Loading** - ✅ Already done

### Medium Impact:
4. **CSS/JS Minification** - 40-70% reduction
5. **Responsive Images** - 50% smaller on mobile

### Low Impact (Nice to Have):
6. **Gzip Compression** - 30% reduction (server-side)
7. **Caching Headers** - Not about file size

---

## 🎯 Expected Results After All Optimizations

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Page Load | 2.5s | 1.2s | 50% faster |
| JS Size | 40 KB | 12 KB | 70% smaller |
| CSS Size | 15 KB | 5 KB | 67% smaller |
| Images | 2.5 MB | 0.8 MB | 68% smaller |
| Lighthouse | 65 | 90+ | +25 points |

---

## 🛠️ Files to Know

| File | Purpose | Status |
|------|---------|--------|
| `scripts/image-optimizer.js` | Lazy loading module | ✅ Done |
| `PERFORMANCE_OPTIMIZATION.md` | Detailed guide | ✅ Done |
| `OPTIMIZATION_CHECKLIST.md` | Progress tracker | ✅ Done |
| `styles/main.min.css` | Minified CSS (to create) | ⏳ Manual |
| `scripts/app.min.js` | Minified JS (to create) | ⏳ Manual |

---

## 💡 Pro Tips

1. **Test Before & After**
   - Take Lighthouse score before optimization
   - Run again after each change
   - Verify improvements

2. **Compress Losslessly When Possible**
   - PNG for graphics with transparency
   - JPEG for photos (quality 75-85)
   - SVG for icons and logos

3. **Use CDN for Global Delivery**
   - Cloudinary (free tier available)
   - imgix
   - Bunny CDN

4. **Monitor Performance**
   - Add Core Web Vitals tracking
   - Already done with PerformanceTracker

5. **Cache Aggressively**
   - 30 days for images
   - 7 days for CSS/JS
   - 1 day for HTML

---

## 📞 Troubleshooting

### Lazy loading not working?
- Check: `loading="lazy"` attribute present
- Check: Images are below the fold
- Open DevTools Network → scroll down → images should load

### Compressed images look bad?
- Try quality 80-85 instead of 70
- Use PNG for simple graphics
- Use JPEG for photos

### Minified files not loading?
- Check file path is correct
- Clear browser cache (Ctrl+Shift+Delete)
- Verify .min files exist

### Performance score still low?
- Check Lighthouse report for specific issues
- Fix "Largest Contentful Paint" first (images)
- Then fix "First Input Delay" (JavaScript)

---

## ✅ Implementation Checklist

- [x] Lazy loading (native + polyfill)
- [x] Performance monitoring active
- [ ] Image compression (manual)
- [ ] WebP conversion (manual)
- [ ] CSS minification (manual)
- [ ] JS minification (manual)
- [ ] Responsive images (manual)
- [ ] Caching headers (server config)
- [ ] CDN setup (optional)
- [ ] Performance tested (Lighthouse > 85)

---

**Quick Commands:**
```bash
# Compress with ImageMagick
magick mogrify -quality 80 -strip *.jpg

# Convert to WebP
for f in *.jpg; do cwebp "$f" -o "${f%.jpg}.webp"; done

# Minify everything
npm install --save-dev terser cleancss && npm run minify:all
```

**Last Updated:** February 12, 2026 | **Version:** 1.0
