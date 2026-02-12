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
let cartCount = 0;

cartIcon.addEventListener('click', () => {
    console.log('Cart clicked. Items:', cartCount);
    alert(`You have ${cartCount} items in your cart`);
});

// Function to add item to cart
function addToCart() {
    cartCount++;
    cartBadge.textContent = cartCount;
    console.log('Item added to cart. Total:', cartCount);
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

// Product Grid Dynamic Loading
const productGrid = document.getElementById('productGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Fetch products from FakeStore API
async function fetchProducts() {
    try {
        loadingSpinner.style.display = 'flex';
        errorMessage.style.display = 'none';
        productGrid.innerHTML = '';

        const response = await fetch('https://fakestoreapi.com/products?limit=12');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        
        loadingSpinner.style.display = 'none';
        renderProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
        productGrid.innerHTML = '';
    }
}

// Render products to the grid
function renderProducts(products) {
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const discountedPrice = (product.price * 0.85).toFixed(2); // 15% discount
        const rating = product.rating ? product.rating.rate : 4.0;

        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.title}</h3>
                <div class="product-price">$${discountedPrice}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i> ${rating}/5
                </div>
                <button class="add-to-cart-btn" onclick="handleAddToCart(this, '${product.title}', ${discountedPrice})">
                    Add to Cart
                </button>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
}

// Handle Add to Cart
function handleAddToCart(button, productName, price) {
    addToCart();
    button.textContent = 'Added!';
    button.classList.add('added');
    
    console.log(`Added to cart: ${productName} - $${price}`);

    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 1500);
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});
