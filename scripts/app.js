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
