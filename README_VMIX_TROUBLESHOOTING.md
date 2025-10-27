# 🚨 VMix Black Screen Fix - Quick Reference

## Problem: Output shows BLACK in VMix (not transparent)

### ✅ SOLUTION 1: Use HTTP Server (Most Common Fix)

VMix **requires** HTTP protocol, not `file://`

**Mac/Linux Command:**
```bash
cd /Users/watson/TLWIG
python3 -m http.server 8080
```

**Windows Command:**
```bash
cd C:\Path\To\TLWIG
python -m http.server 8080
```

**Then in VMix:**
- Add Input → Web Browser
- URL: `http://localhost:8080/output.html`
- Width: 1920, Height: 1080
- ✅ Enable "Transparent Background"

---

## Problem: Output is BLANK in VMix

### ✅ SOLUTION 2: Open Control Panel

1. Open `http://localhost:8080/control.html` in your browser
2. Use Quick Actions to send graphics to VMix
3. Graphics communicate via localStorage (requires same origin)

**DO NOT** open `control.html` as `file://` - it won't work with VMix!

---

## Problem: URL in Control Panel shows wrong path

The "VMix URL" should show:
```
http://localhost:8080/output.html
```

NOT:
```
file:///Users/watson/TLWIG/control.html
```

**Fix:** Open control panel via HTTP server (see Solution 1)

---

## ✅ Quick Verification Test

1. Open `http://localhost:8080/output.html` in Chrome
2. Click the **"TEST: Show Sample L3"** button
3. If you see a graphic appear → output.html works
4. If background is transparent → ready for VMix
5. If you see black → check browser settings

---

## 📞 Still Having Issues?

Check `VMIX_SETUP.md` for detailed troubleshooting steps.

---

**Created by James Watson for Vernum Media** 🎬

