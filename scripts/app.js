// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const cartIcon = document.querySelector('.cart-icon');
const cartBadge = document.querySelector('.cart-badge');

// Toggle hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        console.log('Searching for:', query);
        alert(`Searching for: ${query}`);
        searchInput.value = '';
    }
});

// Allow search on Enter key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Cart functionality
const CART_KEY = 'ShopHub_Cart';

function getCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
}

function updateCartBadge() {
    const count = getCartCount();
    cartBadge.textContent = count;
}

// Initialize cart on page load
function initializeCart() {
    updateCartBadge();
}

cartIcon.addEventListener('click', () => {
    const count = getCartCount();
    console.log('Cart clicked. Items:', count);
    alert(`You have ${count} items in your cart`);
});

// Function to add item to cart
function addToCart() {
    // This is called from product cards - increment cart
    const count = getCartCount();
    updateCartBadge();
    console.log('Item added to cart. Total:', count + 1);
}

// CTA Button Functionality
const ctaButton = document.getElementById('ctaButton');

ctaButton.addEventListener('click', () => {
    console.log('CTA Button clicked - Shop Now');
    // Scroll to products section (when we add it)
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // For now, show a message
        alert('👋 Welcome to ShopHub! Explore our amazing products and find exactly what you need. Click on "Products" in the navigation to browse our collection!');
    }
});

// Add scroll animation to welcome section
window.addEventListener('scroll', () => {
    const welcomeSection = document.querySelector('.welcome-section');
    const heroSection = document.querySelector('.hero-section');
    
    if (welcomeSection) {
        const welcomeRect = welcomeSection.getBoundingClientRect();
        if (welcomeRect.top < window.innerHeight && welcomeRect.bottom > 0) {
            welcomeSection.style.opacity = Math.min(1, 1 - (welcomeRect.top - window.innerHeight) / window.innerHeight);
        }
    }
});

console.log('E-Commerce Website Loaded');

// ============================================
// PRODUCT API MANAGEMENT SYSTEM
// ============================================

const productGrid = document.getElementById('productGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.querySelector('.load-more-container');
const categoryButtons = document.querySelectorAll('.category-btn');

// Product Management Variables
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let displayedCount = 0;
const productsPerLoad = 6;
const CACHE_KEY = 'ShopHub_Products_Cache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const MAX_RETRIES = 3;
let retryCount = 0;

// ============================================
// CACHING SYSTEM
// ============================================

function getCachedProducts() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            // Check if cache is still valid
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log('✓ Using cached products');
                return data;
            } else {
                console.log('✓ Cache expired, fetching fresh data');
                localStorage.removeItem(CACHE_KEY);
            }
        }
    } catch (error) {
        console.error('Cache retrieval error:', error);
    }
    return null;
}

function setCachedProducts(products) {
    try {
        const cacheData = {
            data: products,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('✓ Products cached successfully');
    } catch (error) {
        console.error('Cache storage error:', error);
    }
}

// ============================================
// API FETCHING WITH RETRY LOGIC
// ============================================

async function fetchProducts(attempt = 1) {
    try {
        // Check cache first
        const cachedProducts = getCachedProducts();
        if (cachedProducts) {
            allProducts = cachedProducts;
            loadingSpinner.style.display = 'none';
            filterByCategory('all');
            return;
        }

        loadingSpinner.style.display = 'flex';
        errorMessage.style.display = 'none';
        productGrid.innerHTML = '';

        console.log(`Fetching products (Attempt ${attempt}/${MAX_RETRIES})...`);

        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();
        
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('No products received from API');
        }

        allProducts = products;
        setCachedProducts(products);
        retryCount = 0;
        
        loadingSpinner.style.display = 'none';
        filterByCategory('all');
        
        console.log(`✓ Successfully loaded ${products.length} products`);
        
    } catch (error) {
        console.error(`Error fetching products (Attempt ${attempt}):`, error.message);
        
        if (attempt < MAX_RETRIES) {
            console.log(`⏳ Retrying in 2 seconds...`);
            setTimeout(() => {
                fetchProducts(attempt + 1);
            }, 2000);
        } else {
            loadingSpinner.style.display = 'none';
            showError(error.message);
        }
    }
}

// ============================================
// PRODUCT FILTERING
// ============================================

function filterByCategory(category) {
    currentCategory = category;
    displayedCount = 0;

    if (category === 'all') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Render products
    productGrid.innerHTML = '';
    loadMoreProducts();
    
    // Show/hide load more button
    if (filteredProducts.length > productsPerLoad) {
        loadMoreContainer.style.display = 'flex';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// ============================================
// PRODUCT RENDERING
// ============================================

function renderProducts(products) {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        productCard.style.cursor = 'pointer';
        
        const discountedPrice = (product.price * 0.85).toFixed(2);
        const rating = product.rating ? product.rating.rate : 4.0;
        const ratingCount = product.rating ? product.rating.count : 0;

        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.title}</h3>
                <div class="product-price">$${discountedPrice}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i> ${rating}/5 (${ratingCount} reviews)
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); handleAddToCart(this, '${product.title.replace(/'/g, "\\'")}', ${discountedPrice})">
                    Add to Cart
                </button>
            </div>
        `;

        // Add click handler to navigate to product detail page
        productCard.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        productGrid.appendChild(productCard);
    });
}

function loadMoreProducts() {
    const startIndex = displayedCount;
    const endIndex = startIndex + productsPerLoad;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    renderProducts(productsToDisplay);
    displayedCount = endIndex;

    // Hide load more button if all products are displayed
    if (displayedCount >= filteredProducts.length) {
        loadMoreContainer.style.display = 'none';
    }
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
    errorMessage.style.display = 'block';
    
    let errorMsg = 'Unable to load products.';
    
    if (message.includes('HTTP')) {
        errorMsg = 'Server error. Please try again later.';
    } else if (message.includes('No products')) {
        errorMsg = 'No products available at the moment.';
    } else if (message.includes('Network')) {
        errorMsg = 'Network error. Please check your connection.';
    } else if (message.includes('Failed')) {
        errorMsg = 'Failed to fetch products. Please try again.';
    }
    
    errorText.textContent = errorMsg;
    productGrid.innerHTML = '';
}

// ============================================
// CART MANAGEMENT
// ============================================

function handleAddToCart(button, productName, price) {
    addToCart();
    button.textContent = 'Added!';
    button.classList.add('added');
    
    console.log(`✓ Added to cart: ${productName} - $${price}`);

    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 1500);
}

// ============================================
// EVENT LISTENERS
// ============================================

// Category filter buttons
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterByCategory(btn.dataset.category);
    });
});

// Load more button
loadMoreBtn.addEventListener('click', () => {
    loadMoreProducts();
});

// Retry button
retryBtn.addEventListener('click', () => {
    retryCount = 0;
    fetchProducts();
});

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    fetchProducts();
});
