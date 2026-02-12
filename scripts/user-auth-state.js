// ============================================
// GLOBAL USER AUTHENTICATION STATE MANAGER
// ============================================
// This script manages user authentication state across all pages

let globalUser = null;
let isAuthReady = false;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeySetThisWithYourActualKey123456789",
    authDomain: "shophub-demo.firebaseapp.com",
    projectId: "shophub-demo",
    storageBucket: "shophub-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcd"
};

// Initialize Firebase on non-auth pages
function initializeGlobalFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not loaded');
        return;
    }

    try {
        firebase.initializeApp(firebaseConfig);
        console.log('✓ Firebase initialized globally');
        
        // Set up authentication state listener
        firebase.auth().onAuthStateChanged((user) => {
            globalUser = user;
            isAuthReady = true;
            
            if (user) {
                console.log('✓ User authenticated:', user.email);
                updateUIForAuthenticatedUser(user);
            } else {
                console.log('No user authenticated');
                updateUIForUnauthenticatedUser();
            }
        });
    } catch (error) {
        if (error.code === 'app/duplicate-app') {
            // Firebase already initialized
            isAuthReady = true;
            firebase.auth().onAuthStateChanged((user) => {
                globalUser = user;
                if (user) {
                    updateUIForAuthenticatedUser(user);
                } else {
                    updateUIForUnauthenticatedUser();
                }
            });
        } else {
            console.error('Firebase initialization error:', error);
        }
    }
}

// Update UI when user is authenticated
function updateUIForAuthenticatedUser(user) {
    // Hide login/signup links
    const loginLinks = document.querySelectorAll('.auth-links');
    loginLinks.forEach(links => {
        links.style.display = 'none';
    });

    // Show user profile menu
    const userMenu = document.getElementById('userMenuDropdown');
    if (userMenu) {
        userMenu.style.display = 'flex';
    }

    // Update user name in header
    const userName = document.getElementById('userNameDisplay');
    if (userName) {
        userName.textContent = user.displayName || user.email.split('@')[0];
    }

    // Update user email
    const userEmail = document.getElementById('userEmailDisplay');
    if (userEmail) {
        userEmail.textContent = user.email;
    }

    console.log('✓ UI updated for authenticated user');
}

// Update UI when user is not authenticated
function updateUIForUnauthenticatedUser() {
    // Show login/signup links
    const loginLinks = document.querySelectorAll('.auth-links');
    loginLinks.forEach(links => {
        links.style.display = 'flex';
    });

    // Hide user profile menu
    const userMenu = document.getElementById('userMenuDropdown');
    if (userMenu) {
        userMenu.style.display = 'none';
    }

    console.log('✓ UI updated for unauthenticated user');
}

// Logout function
function handleLogout() {
    firebase.auth().signOut()
        .then(() => {
            console.log('✓ User logged out successfully');
            localStorage.removeItem('ShopHub_UserProfile');
            localStorage.removeItem('ShopHub_UserPreferences');
            alert('You have been logged out successfully');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
}

// Get current user
function getCurrentUser() {
    return globalUser;
}

// Check if user is authenticated
function isUserAuthenticated() {
    return globalUser !== null;
}

// Wait for auth to be ready
function waitForAuth() {
    return new Promise((resolve) => {
        if (isAuthReady) {
            resolve(globalUser);
        } else {
            const interval = setInterval(() => {
                if (isAuthReady) {
                    clearInterval(interval);
                    resolve(globalUser);
                }
            }, 100);
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeGlobalFirebase();
});

console.log('Global user authentication state manager loaded');
