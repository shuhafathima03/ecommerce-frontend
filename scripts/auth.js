// ============================================
// AUTHENTICATION PAGE - JAVASCRIPT
// ============================================

const AUTH_KEY = 'ShopHub_Auth';
const USERS_KEY = 'ShopHub_Users';

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
    setupEventListeners();
    initializeUsers();
});

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
// USER MANAGEMENT
// ============================================

function initializeUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        if (!users) {
            // Initialize with demo user
            const demoUsers = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123' // In real app, this would be hashed
                }
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
            console.log('Demo users initialized');
        }
    } catch (error) {
        console.error('Error initializing users:', error);
    }
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
    }
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
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
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

    // Check credentials
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
        document.getElementById('loginPasswordError').textContent = 'Invalid email or password';
        document.getElementById('loginPassword').classList.add('error');
        return;
    }

    // Successful login
    const loginSuccess = document.getElementById('loginSuccess');
    const loginBtn = loginFormElement.querySelector('button[type="submit"]');
    const originalBtnText = loginBtn.innerHTML;

    // Show success message
    loginSuccess.classList.add('show');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    // Save auth data
    const authData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

    // Simulate redirect
    console.log('✓ Login successful:', authData);
    
    setTimeout(() => {
        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'index.html';
    }, 1500);
}

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
    } else {
        document.getElementById('signupNameError').textContent = '';
        document.getElementById('signupName').classList.remove('error');
    }

    // Email validation
    if (!validateEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Invalid email format';
        document.getElementById('signupEmail').classList.add('error');
        isValid = false;
    } else {
        const users = getUsers();
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            document.getElementById('signupEmailError').textContent = 'This email is already registered';
            document.getElementById('signupEmail').classList.add('error');
            isValid = false;
        } else {
            document.getElementById('signupEmailError').textContent = '';
            document.getElementById('signupEmail').classList.remove('error');
        }
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
    } else {
        document.getElementById('signupConfirmError').textContent = '';
        document.getElementById('signupConfirmPassword').classList.remove('error');
    }

    // Terms validation
    if (!termsCheckbox) {
        document.getElementById('termsError').textContent = 'You must agree to the Terms & Conditions';
        isValid = false;
    } else {
        document.getElementById('termsError').textContent = '';
    }

    if (!isValid) {
        console.log('❌ Form validation failed');
        return;
    }

    // Create new user
    const users = getUsers();
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Successful signup
    const signupSuccess = document.getElementById('signupSuccess');
    const signupBtn = signupFormElement.querySelector('button[type="submit"]');

    signupSuccess.classList.add('show');
    signupBtn.disabled = true;
    signupBtn.textContent = 'Account created...';

    // Save auth data
    const authData = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        loginTime: new Date().toISOString(),
        rememberMe: false
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));

    console.log('✓ Account created successfully:', newUser);

    setTimeout(() => {
        alert(`Welcome to ShopHub, ${newUser.name}! Your account has been created successfully.`);
        window.location.href = 'index.html';
    }, 1500);
}

// ============================================
// SOCIAL LOGIN (Demo)
// ============================================

function handleSocialLogin(provider) {
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not yet implemented. Please use email/password authentication.`);
    console.log(`Social login attempt: ${provider}`);
}

console.log('Auth page script loaded successfully');
