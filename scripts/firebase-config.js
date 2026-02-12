// ============================================
// FIREBASE CONFIGURATION
// ============================================
// 
// INSTRUCTIONS:
// 1. Go to https://firebase.google.com/
// 2. Click "Go to console" or sign in
// 3. Create a new project (name: "ShopHub" or similar)
// 4. In Project Settings, find "Your apps" section
// 5. Click "Web" to register a web app
// 6. Copy the firebaseConfig object
// 7. Replace the placeholder values below with your config
//
// The config object will look like:
// {
//   "apiKey": "AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   "authDomain": "yourproject.firebaseapp.com",
//   "projectId": "yourproject",
//   "storageBucket": "yourproject.appspot.com",
//   "messagingSenderId": "123456789",
//   "appId": "1:123456789:web:abcdefghijklmnop"
// }

const firebaseConfig = {
    apiKey: "AIzaSyDemoKeySetThisWithYourActualKey123456789",
    authDomain: "shophub-demo.firebaseapp.com",
    projectId: "shophub-demo",
    storageBucket: "shophub-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcd"
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
