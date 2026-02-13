// ============================================
// CART PAGE - JAVASCRIPT
// ============================================

const CART_KEY = 'ShopHub_Cart';
const PRODUCTS_CACHE_KEY = 'ShopHub_Products_Cache';

// DOM Elements
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCart = document.getElementById('emptyCart');
const subtotalAmount = document.getElementById('subtotalAmount');
const discountAmount = document.getElementById('discountAmount');
const shippingAmount = document.getElementById('shippingAmount');
const taxAmount = document.getElementById('taxAmount');
const totalAmount = document.getElementById('totalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoCode = document.getElementById('promoCode');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');

let cart = [];
const SHIPPING_COST = 5.00;
const TAX_RATE = 0.10;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart page loaded');
    initializeCart();
    renderCart();
    setupEventListeners();
    initializeCartBadge();
});

function initializeCart() {
    try {
        cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        console.log('Cart initialized:', cart);
    } catch (error) {
        console.error('Error initializing cart:', error);
        cart = [];
    }
}

function initializeCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
    }
}

function setupEventListeners() {
    clearCartBtn.addEventListener('click', clearCart);
    applyPromoBtn.addEventListener('click', applyPromoCode);
    checkoutBtn.addEventListener('click', handleCheckout);

    // Cart icon click - show alert
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            const count = getCartItemCount();
            alert(`You have ${count} items in your cart`);
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

    // Mobile hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// ============================================
// CART RENDERING
// ============================================

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCart.classList.add('show');
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
        updateOrderSummary();
        return;
    }

    cartItemsContainer.style.display = 'flex';
    emptyCart.classList.remove('show');
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItemElement);
    });

    updateOrderSummary();
}

function createCartItemElement(item, index) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.id = `cart-item-${index}`;

    // Calculate prices
    const basePrice = item.price * 0.85; // 15% discount already applied
    const itemSubtotal = (basePrice * item.quantity).toFixed(2);

    const variations = item.selectedVariations || {};
    const sizeText = variations.size ? `Size: ${variations.size}` : '';
    const colorText = variations.color ? `Color: ${variations.color}` : '';
    const variationsHTML = [sizeText, colorText].filter(Boolean).join(' • ');

    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-image" loading="lazy" decoding="async">
        
        <div class="cart-item-details">
            <h3 class="cart-item-title">${item.title}</h3>
            ${variationsHTML ? `<div class="cart-item-variations">${variationsHTML}</div>` : ''}
            <div class="cart-item-price">
                <span class="item-original-price">$${item.price.toFixed(2)}</span>
                <span class="item-discounted-price">$${basePrice.toFixed(2)}</span>
                <span class="discount-label">15% OFF</span>
            </div>
        </div>

        <div class="item-actions">
            <div class="item-subtotal">
                <span class="item-subtotal-label">Subtotal</span>
                <div class="item-subtotal-price">$${itemSubtotal}</div>
            </div>

            <div class="quantity-control">
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       onchange="updateQuantity(${index}, this.value)" min="1" max="10">
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
            </div>

            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;

    return itemDiv;
}

// ============================================
// CART OPERATIONS
// ============================================

function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function increaseQuantity(index) {
    if (cart[index].quantity < 10) {
        cart[index].quantity++;
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

function updateQuantity(index, value) {
    let quantity = parseInt(value);
    
    // Validate quantity
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
    }
    if (quantity > 10) {
        quantity = 10;
    }

    cart[index].quantity = quantity;
    saveCart();
    renderCart();
    updateCartBadge();
    console.log(`Updated quantity for item ${index}: ${quantity}`);
}

function removeFromCart(index) {
    const itemTitle = cart[index].title;
    
    if (confirm(`Remove "${itemTitle}" from cart?`)) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartBadge();
        showSuccessMessage(`"${itemTitle}" removed from cart`);
        console.log(`Removed item ${index} from cart`);
    }
}

function clearCart() {
    if (cart.length === 0) {
        alert('Your cart is already empty');
        return;
    }

    if (confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartBadge();
        showSuccessMessage('Cart cleared successfully');
        console.log('Cart cleared');
    }
}

// ============================================
// ORDER SUMMARY & CALCULATIONS
// ============================================

function updateOrderSummary() {
    if (cart.length === 0) {
        subtotalAmount.textContent = '$0.00';
        discountAmount.textContent = '$0.00';
        taxAmount.textContent = '$0.00';
        totalAmount.textContent = '$0.00';
        return;
    }

    // Calculate subtotal (before discount)
    let subtotal = 0;
    cart.forEach(item => {
        const originalPrice = item.price;
        subtotal += originalPrice * item.quantity;
    });

    // Calculate discount (15% off is already in price, so calculate the difference)
    const discountedSubtotal = subtotal * 0.85;
    const discount = subtotal - discountedSubtotal;

    // Calculate tax (on discounted price)
    const tax = (discountedSubtotal * TAX_RATE);

    // Calculate total
    const total = discountedSubtotal + tax + SHIPPING_COST;

    // Update DOM
    subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    discountAmount.textContent = `-$${discount.toFixed(2)}`;
    taxAmount.textContent = `$${tax.toFixed(2)}`;
    totalAmount.textContent = `$${total.toFixed(2)}`;

    console.log('Order Summary:', {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    });
}

// ============================================
// PROMO CODE
// ============================================

function applyPromoCode() {
    const code = promoCode.value.trim().toUpperCase();

    if (!code) {
        alert('Please enter a promo code');
        return;
    }

    // Valid promo codes (for demonstration)
    const validCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.05,
        'SUMMER': 0.15
    };

    if (validCodes[code]) {
        const discount = validCodes[code];
        alert(`✓ Promo code "${code}" applied! ${Math.round(discount * 100)}% discount activated.`);
        console.log(`Promo code applied: ${code} (${discount * 100}% off)`);
        promoCode.value = '';
    } else {
        alert(`✗ Promo code "${code}" is invalid or expired`);
        promoCode.value = '';
    }
}

// ============================================
// CHECKOUT
// ============================================

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
    }

    // Calculate total
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const discountedSubtotal = subtotal * 0.85;
    const tax = discountedSubtotal * TAX_RATE;
    const total = (discountedSubtotal + tax + SHIPPING_COST).toFixed(2);

    // Show checkout confirmation
    const itemCount = getCartItemCount();
    alert(`
✓ Ready for checkout!

Items: ${itemCount}
Total: $${total}

This is a demo store. In a real application, you would be redirected to payment processing. 

Thank you for your purchase!
    `);

    console.log('Checkout initiated:', {
        items: itemCount,
        total: total,
        cart: cart
    });

    // In a real application, clear cart after successful checkout
    // For now, just clear for demo
    // cart = [];
    // saveCart();
    // renderCart();
    // updateCartBadge();
}

// ============================================
// UTILITIES
// ============================================

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        console.log('Cart saved to localStorage');
    } catch (error) {
        console.error('Error saving cart:', error);
        alert('Error saving cart. Please try again.');
    }
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const count = getCartItemCount();
        cartBadge.textContent = count;
        console.log('Cart badge updated:', count);
    }
}

function showSuccessMessage(message) {
    // Create success message element
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message show';
    successMsg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

console.log('Cart page script loaded successfully');
