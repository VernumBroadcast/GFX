# 🎥 VMix Integration Guide for Vernum Media GFX Package

## ⚠️ Important: Black Screen / Transparency Issues

If you're seeing a **black screen** or **no transparency** in VMix, follow these troubleshooting steps:

---

## 🔧 Solution 1: Use HTTP Server (RECOMMENDED)

VMix works best with HTML graphics served over HTTP, not `file://` protocol.

### Quick HTTP Server Setup:

#### Option A: Python (Easiest - Mac/Linux/Windows)
```bash
# Navigate to your TLWIG folder
cd /Users/watson/TLWIG

# Start a simple HTTP server
python3 -m http.server 8080
```

Then use this URL in VMix:
```
http://localhost:8080/output.html
```

#### Option B: Node.js http-server
```bash
# Install http-server globally
npm install -g http-server

# Navigate to your TLWIG folder
cd /Users/watson/TLWIG

# Start server
http-server -p 8080
```

Then use this URL in VMix:
```
http://localhost:8080/output.html
```

#### Option C: VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click `output.html`
3. Select "Open with Live Server"
4. Copy the URL (usually `http://127.0.0.1:5500/output.html`)

---

## 🎬 VMix Input Setup

### Step 1: Add Web Browser Input
1. In VMix, click **"Add Input"**
2. Select **"Web Browser"**
3. Paste your HTTP URL: `http://localhost:8080/output.html`

### Step 2: Configure Settings
- **Width**: `1920`
- **Height**: `1080`
- **Zoom**: `100%`
- **Frame Rate**: `30 fps` (or match your production settings)

### Step 3: Enable Transparency
- ✅ Check **"Transparent Background"**
- ✅ Check **"Enable Browser Audio"** (if needed)

### Step 4: Test
- Open `control.html` in your browser
- Click **"SHOW L3"** in Quick Actions
- You should see the graphic appear in VMix

---

## 🐛 Troubleshooting Black Screen

### Issue: Black Background (Not Transparent)
**Cause**: VMix chromium engine may not be applying transparency correctly.

**Solutions**:
1. ✅ Ensure you're using **HTTP** (not `file://`)
2. ✅ Check "Transparent Background" is enabled in VMix
3. ✅ Restart VMix after adding the input
4. ✅ Try refreshing the browser input (right-click → Reload)
5. ✅ Update VMix to the latest version

### Issue: Blank Screen (No Graphics)
**Cause**: Control panel and output page are not communicating.

**Solutions**:
1. ✅ Open `control.html` in the **same browser** as a separate tab
2. ✅ Graphics commands are sent via `localStorage`, which requires same-origin
3. ✅ Both `control.html` and VMix must access via same HTTP server

### Issue: Graphics Don't Update
**Cause**: VMix browser cache or localStorage not syncing.

**Solutions**:
1. Right-click VMix input → **Reload**
2. In `control.html`, click **"Hide All"** then retry
3. Check browser console for errors (F12)
4. Ensure `output.html` and `control.html` are from same HTTP origin

---

## 🎛️ Control Methods

### Method 1: Browser Control (Primary)
1. Keep `control.html` open in Chrome/Firefox
2. Use the Quick Actions to send graphics to VMix
3. Graphics appear in VMix via `localStorage` communication

### Method 2: Direct URL Parameters (Fallback)
You can also trigger graphics directly via URL:
```
http://localhost:8080/output.html?action=showL3&slot=1
```

This is useful for:
- VMix scripting
- External control systems
- Automation

---

## 📡 Network Control (Advanced)

For multi-machine setups:

### On Graphics Control Machine:
1. Find your local IP address:
   - Mac: `ifconfig | grep "inet "` 
   - Windows: `ipconfig`
2. Start HTTP server (as above)
3. Share IP address (e.g., `192.168.1.100`)

### On VMix Machine:
Use networked URL:
```
http://192.168.1.100:8080/output.html
```

**Note**: Both machines must be on the same network, and firewall must allow HTTP traffic on port 8080.

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] `output.html` loads correctly in browser at `http://localhost:8080/output.html`
- [ ] Test button shows sample L3 when clicked
- [ ] Background is **transparent** (you see checker pattern or transparency)
- [ ] VMix input shows the output page with transparency enabled
- [ ] `control.html` is open at `http://localhost:8080/control.html`
- [ ] Clicking "SHOW L3" in Quick Actions makes graphic appear in VMix
- [ ] "Hide All" clears all graphics

---

## 🎨 Known Issues & Workarounds

### Issue: Fonts Don't Load
**Solution**: Upload custom fonts via the **Styling** tab, or use web-safe fonts like Arial, Helvetica, Georgia.

### Issue: Logo Doesn't Show
**Solution**: 
- Use absolute HTTP URLs for logos: `http://localhost:8080/ravelogo.png`
- Or upload logo file directly in the Logo Settings tab

### Issue: Colors Look Different in VMix
**Solution**: VMix uses a chromium browser engine that may render colors slightly differently. Calibrate your VMix output display if color accuracy is critical.

---

## 📞 Support

If you continue to experience issues:
1. Check the browser console (F12) for errors
2. Verify `output.html` works standalone with the TEST button
3. Confirm VMix version is up to date
4. Contact **James Watson** for assistance

---

## 🚀 Quick Start Command

```bash
cd /Users/watson/TLWIG && python3 -m http.server 8080
```

Then open:
- Control: `http://localhost:8080/control.html`
- VMix Input: `http://localhost:8080/output.html`

**Now you're ready to broadcast!** 🎬✨

