# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the ShopHub e-commerce application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter a project name (e.g., "ShopHub")
4. Disable "Enable Google Analytics" (optional, you can enable it later)
5. Click **"Create project"**
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Enable Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click on **"Get started"**
3. Select **"Email/Password"** authentication method
4. Toggle **"Enable"** to turn it on
5. Keep **"Email link (passwordless sign-in)"** disabled unless you want to use that feature
6. Click **"Save"**

## Step 3: Register Your Web App

1. In the Firebase Console, click on the **"Project Settings"** icon (gear icon) in the top-left
2. Go to **"Project settings"** or the **"General"** tab
3. Scroll down to the **"Your apps"** section
4. Click on the **"Web"** option (</> icon)
5. Enter an app nickname (e.g., "ShopHub Web")
6. Check **"Also set up Firebase Hosting for this app"** (optional)
7. Click **"Register app"**

## Step 4: Copy Firebase Configuration

1. After registering your app, you'll see a code snippet with your Firebase configuration
2. Copy the `firebaseConfig` object (it contains apiKey, authDomain, projectId, etc.)
3. Paste it into `scripts/firebase-config.js` in your project

The config object should look like:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project-name.firebaseapp.com",
    projectId: "your-project-name",
    storageBucket: "your-project-name.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrst"
};
```

## Step 5: Update Your Firebase Config File

1. Open `scripts/firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration
3. Save the file

## Step 6: Test Authentication

1. Start your local development server (e.g., with Live Server or another web server)
2. Go to `http://localhost:3000/auth.html` (or your port number)
3. Try creating a new account with:
   - Email: `test@example.com`
   - Password: `TestPassword123`
4. If signup is successful, you'll see a success message and be redirected to the home page
5. Try logging out and then logging back in to verify the login functionality

## File Structure

```
scripts/
├── firebase-config.js       ← Your Firebase configuration (UPDATE THIS)
├── auth.js                  ← Authentication form handling (uses Firebase)
├── user-auth-state.js       ← Global authentication state manager
├── app.js                   ← Main app script
├── cart.js                  ← Cart management
└── product.js               ← Product detail page

auth.html                     ← Login/Signup page (includes Firebase SDK)
index.html                    ← Home page (includes Firebase SDK)
product.html                  ← Product detail page (includes Firebase SDK)
cart.html                     ← Shopping cart page (includes Firebase SDK)
```

## Key Features Implemented

✅ **User Signup**
- Email validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Password confirmation
- Firebase Authentication integration

✅ **User Login**
- Email and password authentication
- Error handling for invalid credentials
- Session persistence

✅ **Session Management**
- Authentication state persists across page refreshes
- User profile information stored in Firebase
- Automatic logout on browser close (optional)

✅ **Error Handling**
- User-friendly error messages
- Firebase error code mapping
- Real-time validation feedback

✅ **Security**
- Passwords stored securely by Firebase
- No plaintext passwords in localStorage
- HTTPS required for production

## Troubleshooting

### "Firebase config not found" Error
- Make sure `scripts/firebase-config.js` exists
- Verify you've added your Firebase configuration to the file
- Check the file path in the script tags of HTML files

### "Firebase SDK not loaded" Error
- Ensure the Firebase CDN scripts are included in HTML files:
  ```html
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"></script>
  ```

### Signup/Login Not Working
- Check browser console for error messages (F12 → Console)
- Verify your email/password meet requirements
- Check if Email/Password authentication is enabled in Firebase Console
- Make sure your Firebase configuration is correct

### User Not Staying Logged In After Refresh
- Firebase session persistence should be enabled by default
- Clear browser cache and cookies
- Check browser console for any errors related to `firebase.auth().onAuthStateChanged()`

## Backend Integration (Next Steps)

To fully deploy this application, you'll need to:

1. **Set up Firestore** for storing user profiles and order history
2. **Configure Firebase Security Rules** to protect user data
3. **Set up Firebase Storage** for product images
4. **Implement Email Verification** for new accounts
5. **Add Password Reset** functionality
6. **Deploy to Firebase Hosting** or your preferred hosting provider

## Firebase Console Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)

## Support

For issues with Firebase, visit:
- [Firebase Support](https://firebase.google.com/support)
- [Firebase GitHub Issues](https://github.com/firebase/firebase-js-sdk/issues)

---

**Last Updated:** February 12, 2026
**Firebase SDK Version:** 9.23.0
