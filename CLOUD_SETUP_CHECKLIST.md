# ☁️ Cloud Setup Checklist - 5 Minutes to Live!

## 🎯 Quick Setup (Do These In Order)

### ✅ **Step 1: Delete Old Key** (1 minute)
Go to: https://console.cloud.google.com/apis/credentials?project=webgfx-efd96

- [ ] Find key: `AIzaSyAwXb0Th0kR7IcAfFawNTvm76UpWTihX9s`
- [ ] Click the trash icon to delete it
- [ ] Confirm deletion

---

### ✅ **Step 2: Create New Restricted Key** (2 minutes)
Still on: https://console.cloud.google.com/apis/credentials?project=webgfx-efd96

- [ ] Click **"+ CREATE CREDENTIALS"**
- [ ] Select **"API key"**
- [ ] Copy the new key (save it temporarily)
- [ ] Click **"RESTRICT KEY"**

**Set Website Restrictions:**
- [ ] Select **"HTTP referrers (web sites)"**
- [ ] Add referrer: `vernumbroadcast.github.io/*`
- [ ] Add referrer: `localhost/*`

**Set API Restrictions:**
- [ ] Select **"Restrict key"**
- [ ] Check ONLY: **Firebase Realtime Database API**
- [ ] Uncheck everything else

- [ ] Click **"Save"**

---

### ✅ **Step 3: Update firebase-config.js** (30 seconds)
Open: `/Users/watson/TLWIG/firebase-config.js`

- [ ] Find line: `apiKey: "YOUR_NEW_RESTRICTED_KEY_HERE",`
- [ ] Replace with: `apiKey: "AIzaSy...YOUR_NEW_KEY...",`
- [ ] Save file

---

### ✅ **Step 4: Commit & Push** (1 minute)
```bash
cd /Users/watson/TLWIG
git add firebase-config.js .gitignore CLOUD_DEPLOYMENT_GUIDE.md SECURITY_ALERT_CLOUD_FIX.md CLOUD_SETUP_CHECKLIST.md
git commit -m "Add restricted Firebase config for secure cloud deployment"
git push origin main
```

- [ ] Run the commands above
- [ ] Push succeeds

---

### ✅ **Step 5: Enable GitHub Pages** (30 seconds)
Go to: https://github.com/VernumBroadcast/GFX/settings/pages

- [ ] Source: **main** branch
- [ ] Folder: **/ (root)**
- [ ] Click **"Save"**
- [ ] Wait for "Your site is live at..." message

---

### ✅ **Step 6: Test Control Panel** (30 seconds)
Open: https://vernumbroadcast.github.io/GFX/control.html

- [ ] Page loads successfully
- [ ] Open browser console (F12)
- [ ] Check for: `🔥 Firebase bridge ready - real-time control enabled!`
- [ ] Click any "SHOW" button
- [ ] Check preview window shows graphic

---

### ✅ **Step 7: Test VMix** (1 minute)
In VMix:
- [ ] Add Input → Web Browser
- [ ] URL: `https://vernumbroadcast.github.io/GFX/output.html`
- [ ] Width: **1920**, Height: **1080**
- [ ] Check: **Transparent Background**
- [ ] Click OK

From Control Panel:
- [ ] Type name and title in L3
- [ ] Click **"SHOW"**
- [ ] Graphic appears in VMix ✅

---

## 🎉 **You're Live!**

If all checkboxes are checked, you now have:
- ✅ Secure cloud deployment
- ✅ Control panel accessible from anywhere
- ✅ Real-time Firebase sync
- ✅ VMix integration working
- ✅ Google Sheets auto-update ready
- ✅ Zero local files needed

---

## 🔧 **Optional: Enable Google Sheets Auto-Update**

If you want automatic updates from Google Sheets:

1. Create/open your Google Sheet
2. Format with columns: `Type, ID, Primary Text, Secondary Text, Color, Notes`
3. File → Share → Publish to web → CSV
4. Copy the published CSV URL
5. Control Panel → Data Sources tab
6. Paste URL
7. Click "Test Connection"
8. Check "Enable Auto-Update"
9. Set interval: 5 seconds
10. Done! Graphics auto-update as sheet changes

---

## 📞 **Troubleshooting**

### Control panel doesn't show Firebase connected:
- Double-check API key is pasted correctly in `firebase-config.js`
- Verify domain restrictions include `vernumbroadcast.github.io/*`
- Check Firebase project is active

### VMix shows black screen:
- Make sure you're using **HTTPS** URL (not HTTP)
- Enable "Transparent Background" in VMix input settings
- Test `output.html` directly in Chrome first

### Google Sheets won't load:
- Sheet must be "Published to web" (not just shared)
- Export format must be CSV
- URL should contain `/export?format=csv`

---

## ⏱️ **Total Time: ~5 Minutes**

You're now running a **professional cloud-based graphics system**!

**Made available by James Watson**

