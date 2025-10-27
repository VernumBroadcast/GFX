// Firebase Configuration Template
// 
// SECURITY INSTRUCTIONS:
// 1. Copy this file to 'firebase-config.js' (DO NOT commit firebase-config.js to Git!)
// 2. Replace the placeholder values with your actual Firebase credentials
// 3. In Google Cloud Console, restrict your API key to:
//    - Domain: vernumbroadcast.github.io (or your domain)
//    - API: Firebase services only
//
// For GitHub Pages deployment, use GitHub Secrets to inject these values

const FIREBASE_CONFIG = {
    // Get these from Firebase Console → Project Settings → General
    apiKey: "YOUR_API_KEY_HERE",  // e.g., AIzaSy...
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Set to true to enable Firebase real-time control (GitHub Pages + VMix)
// Set to false to disable Firebase and use postMessage/localStorage only
const ENABLE_FIREBASE = false;  // Change to true after configuring

// Export for use in other files
if (typeof window !== 'undefined') {
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    window.ENABLE_FIREBASE = ENABLE_FIREBASE;
}

