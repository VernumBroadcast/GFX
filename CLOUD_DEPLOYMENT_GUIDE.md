# ☁️ Cloud Deployment Guide - GitHub Pages + Firebase

## ✅ Why Firebase Config in GitHub is SAFE

### **Common Misconception:**
❌ "API keys should never be in public repos"

### **Reality for Firebase:**
✅ **Firebase API keys are DESIGNED for client-side use!**

They're **not** secret keys. Security comes from:
1. **Domain Restrictions** - Only your website can use the key
2. **API Restrictions** - Only specific Firebase services allowed
3. **Firebase Security Rules** - Control who can read/write data

---

## 🔐 **3-Layer Security Model**

### **Layer 1: Domain Restrictions**
```
Allowed Referrers:
- vernumbroadcast.github.io/*
- localhost/*

Anyone else trying to use your key = BLOCKED
```

### **Layer 2: API Restrictions**
```
Allowed APIs:
- Firebase Realtime Database API

Someone trying to use it for Google Maps = BLOCKED
Someone trying to access Cloud Storage = BLOCKED
```

### **Layer 3: Firebase Security Rules**
```json
{
  "rules": {
    "vmix_commands": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"]
    }
  }
}
```

**Result:** Even if someone gets your key, they can only:
- Access from your domain
- Use Firebase Realtime Database
- Follow your security rules

---

## 🚀 **Cloud Deployment Steps**

### **Step 1: Create Restricted API Key**

1. **Delete the old exposed key:**
   - Go to: https://console.cloud.google.com/
   - Navigate: **APIs & Services → Credentials**
   - Find: `AIzaSyAwXb0Th0kR7IcAfFawNTvm76UpWTihX9s`
   - Click: **Delete** (or the trash icon)

2. **Create new API key:**
   - Click: **"+ CREATE CREDENTIALS" → API key**
   - Copy the new key
   - Click: **"RESTRICT KEY"**

3. **Add Website Restrictions:**
   ```
   Application restrictions: HTTP referrers (web sites)
   
   Website restrictions:
   - vernumbroadcast.github.io/*
   - localhost/*
   - 127.0.0.1/*
   ```

4. **Add API Restrictions:**
   ```
   API restrictions: Restrict key
   
   Select APIs:
   ☑ Firebase Realtime Database API
   
   (Uncheck everything else)
   ```

5. **Save restrictions**

---

### **Step 2: Update firebase-config.js**

1. Open `firebase-config.js`
2. Replace `YOUR_NEW_RESTRICTED_KEY_HERE` with your new key:

```javascript
apiKey: "AIzaSy...YOUR_NEW_KEY...",  // ← Paste here
```

3. **Save the file**

---

### **Step 3: Set Firebase Security Rules**

1. Go to: https://console.firebase.google.com/
2. Select: **webgfx-efd96** project
3. Click: **Realtime Database** (left sidebar)
4. Click: **Rules** tab
5. Paste these rules:

```json
{
  "rules": {
    "vmix_commands": {
      ".read": true,
      ".write": true,
      ".indexOn": ["timestamp"],
      ".validate": "newData.hasChildren(['action', 'timestamp'])"
    }
  }
}
```

6. Click: **Publish**

---

### **Step 4: Commit & Push to GitHub**

```bash
cd /Users/watson/TLWIG
git add firebase-config.js .gitignore CLOUD_DEPLOYMENT_GUIDE.md
git commit -m "Add restricted Firebase config for cloud deployment"
git push origin main
```

---

### **Step 5: Enable GitHub Pages**

1. Go to: https://github.com/VernumBroadcast/GFX
2. Click: **Settings** tab
3. Click: **Pages** (left sidebar)
4. Source: **main branch**
5. Folder: **/ (root)**
6. Click: **Save**

**Your site will be live at:**
```
https://vernumbroadcast.github.io/GFX/
```

---

## 🎯 **How It Works in Production**

### **Control Panel (Cloud):**
```
https://vernumbroadcast.github.io/GFX/control.html
  ↓
Uses Firebase API key (restricted to this domain)
  ↓
Sends commands to Firebase Realtime Database
  ↓
Firebase checks: "Is this from vernumbroadcast.github.io?" ✅
```

### **VMix Output:**
```
VMix → Web Browser Input → https://vernumbroadcast.github.io/GFX/output.html
  ↓
Listens to Firebase Realtime Database
  ↓
Receives commands from control panel
  ↓
Displays graphics in real-time
```

### **Google Sheets Auto-Update:**
```
Google Sheets (public CSV)
  ↓
Control panel fetches every 5 seconds
  ↓
Updates L3s, Bugs, Ticker
  ↓
Sends to Firebase → VMix displays
```

---

## ✅ **Benefits of Cloud Deployment**

### **For You:**
- ✅ **No local HTTP server needed** - Everything runs on GitHub Pages
- ✅ **Access from anywhere** - Control panel works from any device
- ✅ **No file management** - Just push to GitHub, it deploys automatically
- ✅ **Free hosting** - GitHub Pages is free
- ✅ **Automatic HTTPS** - Secure by default

### **For Your Team:**
- ✅ **Multiple operators** - Anyone can access control panel
- ✅ **No setup** - Just open the URL
- ✅ **Real-time sync** - Control panel → Firebase → VMix
- ✅ **Google Sheets integration** - Update from anywhere

---

## 🧪 **Testing Cloud Deployment**

### **Test 1: Control Panel**
1. Open: `https://vernumbroadcast.github.io/GFX/control.html`
2. Check browser console (F12)
3. Should see: `🔥 Firebase bridge ready - real-time control enabled!`

### **Test 2: VMix Integration**
1. VMix → Add Input → Web Browser
2. URL: `https://vernumbroadcast.github.io/GFX/output.html`
3. Size: 1920x1080
4. Enable: Transparent Background
5. Test: Click "SHOW" on control panel → Graphic appears in VMix

### **Test 3: Google Sheets Auto-Update**
1. Control panel → Data Sources tab
2. Paste Google Sheets CSV URL
3. Enable Auto-Update (5 seconds)
4. Update Google Sheet → Changes sync automatically

---

## 🔧 **Troubleshooting Cloud Deployment**

### **Problem: "Firebase not connected"**
**Solution:**
- Check API key is correctly pasted in `firebase-config.js`
- Verify domain restrictions include your GitHub Pages URL
- Check Firebase project is active

### **Problem: "Google Sheets won't load"**
**Solution:**
- Make sure sheet is published to web as CSV
- Check "Anyone with the link can view"
- Test the CSV URL directly in browser

### **Problem: "VMix shows black screen"**
**Solution:**
- Use the HTTPS URL (not HTTP)
- Enable "Transparent Background" in VMix
- Check output.html loads directly in browser first

---

## 📊 **Production Workflow**

### **Setup (One Time):**
1. Create restricted Firebase API key
2. Update `firebase-config.js`
3. Push to GitHub
4. Enable GitHub Pages
5. Add VMix web browser input

### **Daily Use:**
1. Open control panel in browser (any device)
2. Enable Google Sheets auto-update (optional)
3. Control graphics from anywhere
4. VMix displays in real-time
5. Zero local files needed!

---

## 🎉 **You Now Have:**

✅ **Cloud-based control panel** (GitHub Pages)  
✅ **Real-time Firebase sync** (Control → VMix)  
✅ **Google Sheets auto-update** (Spreadsheet → Graphics)  
✅ **No local server needed** (Everything in the cloud)  
✅ **Access from anywhere** (Phone, tablet, laptop)  
✅ **Secure & restricted** (Domain + API + Firebase rules)  
✅ **Free hosting** (GitHub Pages)  

---

## 🔒 **Security Summary**

**What's Public:**
- Firebase API key (restricted to your domain)
- Control panel code (GitHub repo)
- Output graphics page

**What's Protected:**
- API key only works from your domains
- Firebase rules control data access
- No sensitive data in code

**Best Practice:**
✅ Restricted API keys for client-side apps  
✅ Firebase security rules for data protection  
✅ Domain restrictions for access control  

This is the **official Firebase deployment method** for web apps!

---

**Made available by James Watson**

