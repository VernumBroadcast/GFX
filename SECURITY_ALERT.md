# 🚨 CRITICAL SECURITY ALERT

## ⚠️ Your Firebase API Key Has Been Exposed on GitHub

GitHub has detected that your **Firebase API Key** is publicly visible in your repository. This is a serious security risk.

---

## 🔥 Immediate Actions Required (Do These NOW):

### Step 1: Revoke the Exposed API Key
1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Navigate to **APIs & Services → Credentials**
3. Find the API key: `AIzaSyAwXb0Th0kR7IcAfFawNTvm76UpWTihX9s`
4. Click **Delete** or **Regenerate Key**

### Step 2: Create a New API Key with Restrictions
1. In Google Cloud Console, create a **new API key**
2. **Restrict the key** to:
   - **Website restrictions**: Add `vernumbroadcast.github.io/*`
   - **API restrictions**: Select only "Firebase Realtime Database API"
3. Copy the new API key

### Step 3: Update Your Local File
1. Open `firebase-config.js` on your computer
2. Replace the old `apiKey` with your new restricted key
3. **DO NOT commit this file to GitHub**

### Step 4: Remove from GitHub History
The key is still in your Git history. Run these commands:

```bash
cd /Users/watson/TLWIG

# Add firebase-config.js to .gitignore (already done)
# Remove the file from Git tracking (but keep it locally)
git rm --cached firebase-config.js

# Commit the removal
git commit -m "Remove sensitive Firebase config from repository"

# Push to GitHub
git push origin main
```

---

## 🛡️ What Could Happen if You Don't Act?

**Anyone with the exposed API key could:**
- ✗ Make unlimited requests to your Firebase database
- ✗ Read/write data in your Realtime Database
- ✗ Potentially rack up costs on your Google Cloud account
- ✗ Abuse your Firebase quota limits
- ✗ Impersonate your application

**Even though the key is now in `.gitignore`, it's still in your Git history!** You must:
1. Revoke the old key immediately
2. Remove it from GitHub

---

## ✅ I've Already Taken These Security Steps:

### 1. Created `.gitignore`
- Added `firebase-config.js` to prevent future commits

### 2. Created `firebase-config.TEMPLATE.js`
- A safe template file you can commit to GitHub
- Users can copy it and add their own credentials locally

### 3. Next Steps for You:
1. **Revoke the exposed key** (Google Cloud Console)
2. **Create a new restricted key**
3. **Update your local `firebase-config.js`**
4. **Run the Git commands above** to remove from history

---

## 🔐 Future Best Practices:

### For Local Development:
- Keep `firebase-config.js` in `.gitignore`
- Use `firebase-config.TEMPLATE.js` for documentation
- Each developer creates their own local `firebase-config.js`

### For GitHub Pages:
- Use **GitHub Secrets** for environment variables
- Or use **Firebase App Check** for added security
- Always restrict API keys to specific domains

### For VMix:
- Firebase is optional - you can use `localStorage` and `postMessage`
- If using Firebase, always restrict the API key

---

## 📞 Need Help?

If you're unsure about any of these steps:
1. **Priority 1**: Revoke the exposed key (prevent abuse)
2. **Priority 2**: Create a new restricted key
3. **Priority 3**: Remove from Git history

**Made available by James Watson**

