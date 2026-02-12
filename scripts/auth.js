// ============================================
// FIREBASE AUTHENTICATION
// ============================================

// Firebase Authentication State
let currentUser = null;

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth page loaded');
    initializeFirebase();
    setupEventListeners();
    checkAuthState();
});

// Initialize Firebase
function initializeFirebase() {
    // Firebase is loaded from CDN in HTML
    // Check if Firebase is available
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded. Make sure to include Firebase CDN in HTML.');
        showError('Firebase authentication is not available. Please refresh the page.');
        return;
    }

    // Initialize Firebase with config from firebase-config.js
    if (typeof firebaseConfig === 'undefined') {
        console.error('Firebase config not found. Add your Firebase config to scripts/firebase-config.js');
        showError('Firebase configuration is missing. Please contact support.');
        return;
    }

    try {
        firebase.initializeApp(firebaseConfig);
        console.log('✓ Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
        // Firebase might already be initialized
    }
}

// Check Authentication State
function checkAuthState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            console.log('✓ User authenticated:', user.email);
            // Redirect to home page if user is already logged in
            // Comment this out if you want to allow viewing auth page while logged in
            // setTimeout(() => {
            //     window.location.href = 'index.html';
            // }, 1000);
        } else {
            currentUser = null;
            console.log('No user authenticated');
        }
    });
}

function setupEventListeners() {
    loginFormElement.addEventListener('submit', handleLogin);
    signupFormElement.addEventListener('submit', handleSignup);

    // Mobile hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Real-time email validation
    document.getElementById('loginEmail').addEventListener('blur', validateLoginEmail);
    document.getElementById('signupEmail').addEventListener('blur', validateSignupEmail);

    // Real-time password match validation
    document.getElementById('signupConfirmPassword').addEventListener('blur', validatePasswordMatch);
}

// ============================================
// FORM SWITCHING
// ============================================

function switchForm(formType) {
    if (formType === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        clearFormErrors();
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        clearFormErrors();
    }
}



// ============================================
// PASSWORD VISIBILITY TOGGLE
// ============================================

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = event.currentTarget;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ============================================
// EMAIL VALIDATION
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateLoginEmail() {
    const email = document.getElementById('loginEmail');
    const errorElement = document.getElementById('loginEmailError');

    if (!email.value.trim()) {
        errorElement.textContent = 'Email is required';
        email.classList.add('error');
        return false;
    }

    if (!validateEmail(email.value)) {
        errorElement.textContent = 'Please enter a valid email address';
        email.classList.add('error');
        return false;
    }

    errorElement.textContent = '';
    email.classList.remove('error');
    email.classList.add('success');
    return true;
}

function validateSignupEmail() {
    const email = document.getElementById('signupEmail');
    const errorElement = document.getElementById('signupEmailError');

    if (!email.value.trim()) {
        errorElement.textContent = 'Email is required';
        email.classList.add('error');
        return false;
    }

    if (!validateEmail(email.value)) {
        errorElement.textContent = 'Please enter a valid email address';
        email.classList.add('error');
        return false;
    }

    // Check if email already exists
    const users = getUsers();
    const emailExists = users.some(user => user.email.toLowerCase() === email.value.toLowerCase());

    if (emailExists) {
        errorElement.textContent = 'This email is already registered. Please sign in or use a different email.';
        email.classList.add('error');
        return false;
    }

    errorElement.textContent = '';
    email.classList.remove('error');
    email.classList.add('success');
    return true;
}

// ============================================
// PASSWORD VALIDATION
// ============================================

function validatePasswordStrength(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
    };

    return requirements;
}

function checkPasswordStrength(password) {
    const requirements = validatePasswordStrength(password);
    
    // Update requirement indicators
    updateRequirement('lengthReq', requirements.length);
    updateRequirement('uppercaseReq', requirements.uppercase);
    updateRequirement('lowercaseReq', requirements.lowercase);
    updateRequirement('numberReq', requirements.number);

    // Calculate strength
    const strengthCount = Object.values(requirements).filter(Boolean).length;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    strengthFill.classList.remove('weak', 'fair', 'good', 'strong');
    strengthText.classList.remove('weak', 'fair', 'good', 'strong');

    if (strengthCount === 0) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak';
        strengthText.classList.add('weak');
    } else if (strengthCount === 1 || strengthCount === 2) {
        strengthFill.classList.add('fair');
        strengthText.textContent = 'Fair';
        strengthText.classList.add('fair');
    } else if (strengthCount === 3) {
        strengthFill.classList.add('good');
        strengthText.textContent = 'Good';
        strengthText.classList.add('good');
    } else if (strengthCount === 4) {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong';
        strengthText.classList.add('strong');
    }
}

function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    const icon = element.querySelector('i');
    
    if (isMet) {
        element.classList.add('met');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-check');
    } else {
        element.classList.remove('met');
        icon.classList.remove('fa-check');
        icon.classList.add('fa-times');
    }
}

function validatePassword(password, fieldId = 'signupPassword') {
    const errorElement = document.getElementById(fieldId + 'Error');
    const requirements = validatePasswordStrength(password);
    const allMet = Object.values(requirements).every(Boolean);

    if (!allMet) {
        errorElement.textContent = 'Password must meet all requirements';
        document.getElementById(fieldId).classList.add('error');
        return false;
    }

    errorElement.textContent = '';
    document.getElementById(fieldId).classList.remove('error');
    document.getElementById(fieldId).classList.add('success');
    return true;
}

function validatePasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorElement = document.getElementById('signupConfirmError');

    if (!confirmPassword) {
        errorElement.textContent = '';
        return true;
    }

    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        document.getElementById('signupConfirmPassword').classList.add('error');
        return false;
    }

    errorElement.textContent = '';
    document.getElementById('signupConfirmPassword').classList.remove('error');
    document.getElementById('signupConfirmPassword').classList.add('success');
    return true;
}

// ============================================
// FORM SUBMISSION
// ============================================

// ============================================
// FIREBASE LOGIN
// ============================================

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate inputs
    if (!validateEmail(email)) {
        document.getElementById('loginEmailError').textContent = 'Invalid email format';
        return;
    }

    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Password is required';
        return;
    }

    // Disable button and show loading state
    const loginBtn = loginFormElement.querySelector('button[type="submit"]');
    const originalBtnText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    // Firebase Login
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('✓ Login successful:', user.email);

            // Show success message
            const loginSuccess = document.getElementById('loginSuccess');
            loginSuccess.classList.add('show');

            // Save additional user data if needed
            saveUserPreferences(user);

            // Redirect to home page
            setTimeout(() => {
                alert(`Welcome back, ${user.email}!`);
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Login error:', error);
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalBtnText;
            
            // Handle Firebase errors
            let errorMsg = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMsg = 'No account found with this email. Please sign up first.';
                    break;
                case 'auth/wrong-password':
                    errorMsg = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMsg = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMsg = 'This account has been disabled. Contact support.';
                    break;
                case 'auth/too-many-login-attempts':
                    errorMsg = 'Too many login attempts. Please try again later.';
                    break;
                default:
                    errorMsg = error.message;
            }
            
            document.getElementById('loginPasswordError').textContent = errorMsg;
            document.getElementById('loginPassword').classList.add('error');
        });
}

// ============================================
// FIREBASE SIGNUP
// ============================================

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const termsCheckbox = document.getElementById('termsCheckbox').checked;

    // Validate all fields
    let isValid = true;

    // Name validation
    if (!name || name.length < 2) {
        document.getElementById('signupNameError').textContent = 'Please enter your full name (at least 2 characters)';
        document.getElementById('signupName').classList.add('error');
        isValid = false;
    }

    // Email validation
    if (!validateEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Invalid email format';
        document.getElementById('signupEmail').classList.add('error');
        isValid = false;
    }

    // Password validation
    if (!validatePassword(password)) {
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        document.getElementById('signupConfirmError').textContent = 'Passwords do not match';
        document.getElementById('signupConfirmPassword').classList.add('error');
        isValid = false;
    }

    // Terms validation
    if (!termsCheckbox) {
        document.getElementById('termsError').textContent = 'You must agree to the Terms & Conditions';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Disable button and show loading state
    const signupBtn = signupFormElement.querySelector('button[type="submit"]');
    const originalBtnText = signupBtn.innerHTML;
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    // Firebase Signup
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('✓ Signup successful:', user.uid);

            // Save user profile information
            return user.updateProfile({
                displayName: name
            }).then(() => {
                // Save additional user data to localStorage as backup
                return saveUserData(user, name, email);
            });
        })
        .then(() => {
            // Show success message
            const signupSuccess = document.getElementById('signupSuccess');
            signupSuccess.classList.add('show');

            console.log('✓ User profile updated');

            // Redirect to home page
            setTimeout(() => {
                alert('Account created successfully! Welcome to ShopHub!');
                window.location.href = 'index.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Signup error:', error);
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalBtnText;

            // Handle Firebase errors
            let errorMsg = 'Signup failed. Please try again.';
            let errorField = 'signupPasswordError';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMsg = 'This email is already registered. Please sign in or use a different email.';
                    errorField = 'signupEmailError';
                    document.getElementById('signupEmail').classList.add('error');
                    break;
                case 'auth/weak-password':
                    errorMsg = 'Password is too weak. Please use a stronger password.';
                    break;
                case 'auth/invalid-email':
                    errorMsg = 'Invalid email format.';
                    errorField = 'signupEmailError';
                    document.getElementById('signupEmail').classList.add('error');
                    break;
                case 'auth/operation-not-allowed':
                    errorMsg = 'Email/password signup is not enabled. Contact support.';
                    break;
                default:
                    errorMsg = error.message;
            }

            document.getElementById(errorField).textContent = errorMsg;
        });
}

// ============================================
// USER DATA MANAGEMENT
// ============================================

function saveUserData(user, name, email) {
    // This would typically save to Firestore or Realtime Database
    // For now, we'll save to localStorage as backup
    const userData = {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    try {
        localStorage.setItem('ShopHub_UserProfile', JSON.stringify(userData));
        return Promise.resolve();
    } catch (error) {
        console.error('Error saving user data:', error);
        return Promise.reject(error);
    }
}

function saveUserPreferences(user) {
    // Save login preferences
    const preferences = {
        uid: user.uid,
        lastLogin: new Date().toISOString(),
        email: user.email
    };

    try {
        localStorage.setItem('ShopHub_UserPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

// ============================================
// UTILITIES
// ============================================

function clearFormErrors() {
    // Clear all error messages and input classes
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('input').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

function showError(message) {
    const errorElement = document.getElementById('errorState');
    if (errorElement) {
        document.getElementById('errorMessage').textContent = message;
        errorElement.style.display = 'flex';
    } else {
        console.error(message);
    }
}

// ============================================
// SOCIAL LOGIN (Demo)
// ============================================

function handleSocialLogin(provider) {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not yet implemented with Firebase. Please use email/password authentication.`);
    console.log(`Social login attempt: ${provider}`);
}

console.log('Firebase authentication script loaded successfully');
