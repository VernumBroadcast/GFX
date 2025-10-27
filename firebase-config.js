// Firebase Configuration for Vernum Media GFX Package
// 
// TO ENABLE REAL-TIME CONTROL OVER GITHUB PAGES:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (free tier is fine)
// 3. Enable Realtime Database
// 4. Copy your config below
// 5. Set database rules to allow read/write (for testing):
//    {
//      "rules": {
//        "vmix_commands": {
//          ".read": true,
//          ".write": true
//        }
//      }
//    }

const FIREBASE_CONFIG = {
    // Firebase config for webgfx-efd96 project
    apiKey: "AIzaSyAwXb0Th0kR7IcAfFawNTvm76UpWTihX9s",
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

