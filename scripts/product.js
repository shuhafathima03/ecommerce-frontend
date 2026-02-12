// ============================================
// PRODUCT DETAIL PAGE SCRIPT
// ============================================

// DOM Elements
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const productDetailContainer = document.getElementById('productDetailContainer');
const cartBadge = document.getElementById('cartBadge');
const mainImage = document.getElementById('mainImage');
const zoomBtn = document.getElementById('zoomBtn');
const imageZoomModal = document.getElementById('imageZoomModal');
const zoomImage = document.getElementById('zoomImage');
const closeZoom = document.getElementById('closeZoom');
const quantityInput = document.getElementById('quantityInput');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const addToCartBtn = document.getElementById('addToCartBtn');
const wishlistBtn = document.getElementById('wishlistBtn');
const successMessage = document.getElementById('successMessage');

// Product Data Storage
let currentProduct = null;
let allProducts = [];
const PRODUCTS_CACHE_KEY = 'ShopHub_Products_Cache';
const CART_KEY = 'ShopHub_Cart';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    loadProductDetail();
    setupEventListeners();
});

// ============================================
// CART MANAGEMENT
// ============================================

function initializeCart() {
    updateCartBadge();
}

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

function addItemToCart(product, quantity = 1) {
    try {
        let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadge();
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

// ============================================
// PRODUCT LOADING
// ============================================

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchAllProducts() {
    try {
        // Check cache first
        const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 3600000) {
                return data;
            }
        }

        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        
        // Cache products
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({
            data: products,
            timestamp: Date.now()
        }));
        
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

async function loadProductDetail() {
    const productId = getProductIdFromUrl();
    
    if (!productId) {
        showError('No product ID provided');
        return;
    }

    try {
        loadingState.style.display = 'flex';
        
        // Fetch all products
        allProducts = await fetchAllProducts();
        
        // Find specific product
        currentProduct = allProducts.find(p => p.id == productId);
        
        if (!currentProduct) {
            throw new Error('Product not found');
        }

        loadingState.style.display = 'none';
        errorState.style.display = 'none';
        productDetailContainer.style.display = 'grid';
        
        displayProductDetail();
        loadRelatedProducts();
        
    } catch (error) {
        console.error('Error loading product:', error);
        loadingState.style.display = 'none';
        showError(error.message);
    }
}

function displayProductDetail() {
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = currentProduct.title.substring(0, 30) + '...';
    
    // Update category badge
    const categoryBadge = document.getElementById('categoryBadge');
    categoryBadge.textContent = currentProduct.category;
    
    // Update title
    document.getElementById('productTitle').textContent = currentProduct.title;
    
    // Update rating
    const rating = currentProduct.rating ? currentProduct.rating.rate : 4.0;
    const reviewCount = currentProduct.rating ? currentProduct.rating.count : 0;
    document.getElementById('ratingValue').textContent = rating;
    document.getElementById('reviewCount').textContent = `(${reviewCount} reviews)`;
    
    // Update price
    const originalPrice = currentProduct.price.toFixed(2);
    const discountedPrice = (currentProduct.price * 0.85).toFixed(2);
    document.getElementById('originalPrice').textContent = `$${originalPrice}`;
    document.getElementById('discountPrice').textContent = `$${discountedPrice}`;
    
    // Update description
    document.getElementById('productDescription').textContent = 
        currentProduct.description || 'This is a high-quality product with excellent features.';
    
    // Update details list
    document.getElementById('detailCategory').textContent = currentProduct.category;
    document.getElementById('detailRating').textContent = `${rating}/5`;
    document.getElementById('detailReviews').textContent = reviewCount;
    
    // Update image
    mainImage.src = currentProduct.image;
    mainImage.alt = currentProduct.title;
    zoomImage.src = currentProduct.image;
    
    // Update page title
    document.title = `${currentProduct.title} - ShopHub`;
}

function loadRelatedProducts() {
    const relatedGrid = document.getElementById('relatedProductsGrid');
    const category = currentProduct.category;
    
    const relatedProducts = allProducts
        .filter(p => p.category === category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    relatedGrid.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'related-product-card';
        productCard.onclick = () => goToProduct(product.id);
        
        const discountedPrice = (product.price * 0.85).toFixed(2);
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="related-product-image">
            <div class="related-product-info">
                <h4>${product.title}</h4>
                <div class="related-product-price">$${discountedPrice}</div>
            </div>
        `;
        
        relatedGrid.appendChild(productCard);
    });
}

function goToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

function showError(message) {
    loadingState.style.display = 'none';
    errorState.style.display = 'flex';
    document.getElementById('errorMessage').textContent = message || 'Sorry, unable to load product details.';
    productDetailContainer.style.display = 'none';
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Image zoom
    zoomBtn.addEventListener('click', () => {
        imageZoomModal.style.display = 'flex';
    });

    closeZoom.addEventListener('click', () => {
        imageZoomModal.style.display = 'none';
    });

    imageZoomModal.addEventListener('click', (e) => {
        if (e.target === imageZoomModal) {
            imageZoomModal.style.display = 'none';
        }
    });

    // Quantity controls
    decreaseBtn.addEventListener('click', () => {
        const value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });

    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;
        quantityInput.value = value;
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        
        const quantity = parseInt(quantityInput.value);
        const success = addItemToCart(currentProduct, quantity);
        
        if (success) {
            // Show success message
            successMessage.style.display = 'flex';
            addToCartBtn.style.display = 'none';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
                addToCartBtn.style.display = 'flex';
            }, 2000);
            
            console.log(`✓ Added ${quantity} x ${currentProduct.title} to cart`);
        } else {
            alert('Error adding to cart. Please try again.');
        }
    });

    // Wishlist button
    wishlistBtn.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');
    });

    // Mobile menu (header)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            alert(`You have ${getCartCount()} items in your cart`);
        });
    }

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                console.log('Search for:', query);
                alert(`Searching for: ${query}`);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

console.log('Product detail page loaded');
