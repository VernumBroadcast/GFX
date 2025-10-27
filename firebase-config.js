// Firebase Configuration for Vernum Media GFX Package
// 
// ✅ CLOUD DEPLOYMENT - This file is SAFE to commit to GitHub!
// 
// Why? Firebase API keys are designed for client-side use when properly restricted:
// 1. Domain restrictions limit usage to vernumbroadcast.github.io
// 2. API restrictions limit usage to Firebase Realtime Database only
// 3. Firebase security rules control data access
// 
// IMPORTANT: This key MUST be restricted in Google Cloud Console!
// See FIREBASE_SETUP_GUIDE.md for instructions.

const FIREBASE_CONFIG = {
    // Firebase config for webgfx-efd96 project
    // 
    // ⚠️ REPLACE WITH YOUR NEW RESTRICTED KEY BELOW:
    // 
    // 1. Go to Google Cloud Console → APIs & Services → Credentials
    // 2. Delete the old exposed key (AIzaSyAwXb0Th0kR7IcAfFawNTvm76UpWTihX9s)
    // 3. Create NEW key with restrictions:
    //    - Website: vernumbroadcast.github.io/* AND localhost/*
    //    - API: Firebase Realtime Database API only
    // 4. Paste the new key below
    
    apiKey: "YOUR_NEW_RESTRICTED_KEY_HERE",  // ← PASTE YOUR NEW KEY HERE
    authDomain: "webgfx-efd96.firebaseapp.com",
    databaseURL: "https://webgfx-efd96-default-rtdb.firebaseio.com",
    projectId: "webgfx-efd96",
    storageBucket: "webgfx-efd96.firebasestorage.app",
    messagingSenderId: "271981605949",
    appId: "1:271981605949:web:4fda740a767ba339cbe654"
};

// Firebase bridge enabled for real-time GitHub Pages control
const ENABLE_FIREBASE = true;

// Export for use in other files
if (typeof window !== 'undefined') {
    window.FIREBASE_CONFIG = FIREBASE_CONFIG;
    window.ENABLE_FIREBASE = ENABLE_FIREBASE;
}
