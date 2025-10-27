# 🔥 Firebase Setup Guide - Real-Time GitHub Pages Control

## Problem You're Solving:
You want to use your control panel on GitHub Pages and have VMix update in REAL-TIME, just like the local version!

Currently:
- ✅ Control panel works → Chrome iframe updates
- ❌ Control panel works → VMix doesn't update (different browsers can't talk!)

**Solution: Firebase acts as a bridge!**

```
Control Panel (Chrome) → Firebase → VMix Browser
     ↓ Send command          ↓ Cloud DB        ↓ Receives command
  Click "SHOW L3"      → Store command  →   Shows L3
```

---

## 🚀 Setup Steps (15 minutes, FREE)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Name it: `vernum-media-gfx` (or whatever you want)
4. **Disable Google Analytics** (not needed, simplifies setup)
5. Click **"Create project"**

### Step 2: Enable Realtime Database

1. In your new project, click **"Realtime Database"** in the left menu
2. Click **"Create Database"**
3. Choose location: **United States** (or closest to you)
4. **Start in TEST mode** (we'll set this up properly in a moment)
5. Click **"Enable"**

###Step 3: Set Database Rules

1. Click the **"Rules"** tab at the top
2. Replace the rules with this:

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

3. Click **"Publish"**

⚠️ **Note**: These rules allow anyone to read/write. For production, you'd want authentication, but for a graphics system this is fine.

### Step 4: Get Your Config

1. Click the **⚙️ gear icon** → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **</>** (Web) icon
4. Name it: `vmix-graphics` → Click **"Register app"**
5. You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC6xS8x...",
  authDomain: "vernum-media-gfx.firebaseapp.com",
  databaseURL: "https://vernum-media-gfx-default-rtdb.firebaseio.com",
  projectId: "vernum-media-gfx",
  storageBucket: "vernum-media-gfx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **COPY THIS** - you'll need it!

### Step 5: Update Your Files

#### A. Edit `firebase-config.js`:

Replace the empty config with YOUR Firebase config:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",  // ← IMPORTANT!
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const ENABLE_FIREBASE = true;  // ← Change to true!
```

#### B. Add Firebase SDK to `control.html`:

Find the `</body>` tag near the end of `control.html` and add BEFORE it:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-bridge.js"></script>
```

#### C. Add Firebase SDK to `output.html`:

Find the `</body>` tag and add BEFORE it:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="firebase-bridge.js"></script>
```

#### D. Modify `control.js`:

Add this near the top of the `ControlPanel` class `init()` method:

```javascript
init() {
    // ... existing code ...
    
    // Initialize Firebase bridge
    if (window.ENABLE_FIREBASE && window.FIREBASE_CONFIG) {
        window.firebaseBridge.init(window.FIREBASE_CONFIG);
    }
    
    // ... rest of init code ...
}
```

And modify how commands are sent (find where commands are sent to iframes):

```javascript
sendToFrames(action, data) {
    // Send via postMessage (for local iframes)
    if (this.previewFrame && this.previewFrame.contentWindow) {
        this.previewFrame.contentWindow.postMessage({ action, ...data }, '*');
    }
    if (this.transmitFrame && this.transmitFrame.contentWindow) {
        this.transmitFrame.contentWindow.postMessage({ action, ...data }, '*');
    }
    
    // Send via localStorage (for local VMix)
    localStorage.setItem('vmix_graphics_command', JSON.stringify({
        timestamp: Date.now(),
        message: { action, ...data }
    }));
    
    // Send via Firebase (for GitHub Pages + VMix)
    if (window.firebaseBridge && window.firebaseBridge.enabled) {
        window.firebaseBridge.sendCommand(action, data);
    }
}
```

#### E. Modify `graphics.js`:

Add this in the `init()` method:

```javascript
init() {
    // ... existing message listeners ...
    
    // Listen for Firebase commands (for GitHub Pages + VMix)
    if (window.ENABLE_FIREBASE && window.FIREBASE_CONFIG && window.firebaseBridge) {
        window.firebaseBridge.init(window.FIREBASE_CONFIG);
        window.firebaseBridge.listen((message) => {
            console.log('Firebase command received:', message);
            this.handleMessage(message);
        });
    }
    
    // ... rest of init code ...
}
```

### Step 6: Deploy & Test

1. **Upload all files to GitHub**:
   - `firebase-config.js` (with YOUR config)
   - `firebase-bridge.js`
   - Modified `control.html`
   - Modified `output.html`
   - Modified `control.js`
   - Modified `graphics.js`

2. **Test Control Panel**:
   - Open: `https://vernumbroadcast.github.io/GFX/control.html`
   - Open browser console (F12)
   - Should see: `✅ Firebase bridge initialized`

3. **Test VMix**:
   - In VMix, load: `https://vernumbroadcast.github.io/GFX/output.html`
   - In control panel, click **"SHOW L3"**
   - VMix should update in real-time! 🎉

---

## 🐛 Troubleshooting

### "Firebase not configured"
- Check `firebase-config.js` has your actual Firebase config
- Make sure `ENABLE_FIREBASE = true`
- Verify all fields are filled in (especially `databaseURL`)

### "Permission denied"
- Check Firebase Database Rules allow read/write
- Go to Firebase Console → Realtime Database → Rules
- Should be set to allow `vmix_commands` read/write

### Commands not reaching VMix
- Open VMix browser console (if possible) to check for errors
- Check Firebase Console → Realtime Database → Data tab
- You should see `vmix_commands` node updating when you click buttons
- If data appears in Firebase but VMix doesn't update, check `graphics.js` Firebase listener

### "Failed to fetch"
- Firebase SDK may not be loading
- Check internet connection
- Verify SDK URLs are correct in HTML files

---

## 💰 Cost

Firebase **FREE tier** includes:
- ✅ 100,000 simultaneous connections
- ✅ 1 GB stored data
- ✅ 10 GB/month downloaded data

For a graphics system, you'll use:
- ~1 KB per command
- Maybe 100 commands per show
- = 0.0001 GB per show

**You could run 100,000 shows before hitting the free limit!** 😎

---

## 🔒 Security Notes

Current setup allows anyone to read/write commands. For better security:

1. **Add Firebase Authentication**
2. **Use security rules** like:
```json
{
  "rules": {
    "vmix_commands": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

3. **Add password protection** to your control panel

But for a private graphics system, open rules are usually fine!

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Database rules set to allow read/write
- [ ] Firebase config copied to `firebase-config.js`
- [ ] `ENABLE_FIREBASE` set to `true`
- [ ] Firebase SDK added to `control.html`
- [ ] Firebase SDK added to `output.html`
- [ ] `control.js` modified to send via Firebase
- [ ] `graphics.js` modified to listen for Firebase
- [ ] All files uploaded to GitHub
- [ ] Control panel shows "Firebase bridge initialized"
- [ ] VMix updates when clicking buttons in control panel

---

## 🎉 Result

Once set up:
1. Open control panel anywhere (phone, tablet, another computer)
2. Click buttons
3. VMix updates instantly
4. No HTTP server needed!
5. Works from anywhere in the world! 🌍

---

**Made available by James Watson for Vernum Media** 🔥

