# 🚀 Quick Firebase Integration - Copy & Paste Guide

## Step 1: Get Firebase Config (5 min)

1. Go to https://console.firebase.google.com/
2. Create project → Enable Realtime Database → Set rules to:
```json
{
  "rules": {
    "vmix_commands": {
      ".read": true,
      ".write": true
    }
  }
}
```
3. Get your config from Project Settings → Your apps → Web app

---

## Step 2: Update `firebase-config.js`

Replace with YOUR Firebase config:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

const ENABLE_FIREBASE = true;  // ← Change to true
```

---

## Step 3: Add to `control.html` (before `</body>`)

```html
<!-- Firebase SDK - Add BEFORE </body> tag -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-bridge.js"></script>

<!-- Initialize Firebase in control panel -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    if (window.ENABLE_FIREBASE && window.FIREBASE_CONFIG && window.firebaseBridge) {
        window.firebaseBridge.init(window.FIREBASE_CONFIG);
    }
});
</script>
```

---

## Step 4: Add to `output.html` (before `</body>`)

```html
<!-- Firebase SDK - Add BEFORE graphics.js script -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-bridge.js"></script>
```

---

## Step 5: Modify `graphics.js`

Find the `init()` method and add AFTER the existing listeners:

```javascript
init() {
    // ... existing code (postMessage listener, localStorage listener) ...
    
    // Add Firebase listener
    if (window.ENABLE_FIREBASE && window.FIREBASE_CONFIG && window.firebaseBridge) {
        const firebaseInitialized = window.firebaseBridge.init(window.FIREBASE_CONFIG);
        if (firebaseInitialized) {
            window.firebaseBridge.listen((message) => {
                if (this.debugMode) {
                    console.log('📥 Firebase command:', message);
                    this.addDebugLog('Firebase: ' + message.action);
                }
                this.handleMessage(message);
            });
            console.log('✅ Firebase bridge active - real-time control enabled!');
        }
    }
    
    // ... rest of init code ...
}
```

---

## Step 6: Modify How Control Panel Sends Commands

The control panel currently uses `postMessage` and `localStorage`. We need to add Firebase.

Find where commands are sent (search for where data is posted to iframes) and add Firebase:

**Example - for any button that shows graphics:**

```javascript
// OLD CODE:
this.previewFrame.contentWindow.postMessage({action: 'showL3', config: {...}}, '*');
localStorage.setItem('vmix_graphics_command', ...);

// ADD THIS:
if (window.firebaseBridge && window.firebaseBridge.enabled) {
    window.firebaseBridge.sendCommand('showL3', {config: {...}});
}
```

---

## 🎯 Quick Test

1. Upload all files to GitHub Pages
2. Open `https://yoursite.github.io/GFX/control.html` - should see "✅ Firebase bridge initialized"
3. Load `https://yoursite.github.io/GFX/output.html` in VMix
4. Click "SHOW L3" in control panel
5. Graphic should appear in VMix instantly! 🎉

---

## 🐛 Debug

If not working:
- Open console (F12) in both control panel and output.html
- Should see Firebase initialization messages
- Check Firebase Console → Realtime Database → Data - should see `vmix_commands` updating
- If commands appear in Firebase but VMix doesn't update, check output.html console for errors

---

**That's it! Real-time GitHub Pages control!** 🔥

