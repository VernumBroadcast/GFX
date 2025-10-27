# 🚀 GitHub Pages Setup Guide - Vernum Media GFX

## ⚠️ IMPORTANT: How GitHub Pages Works with VMix

When you deploy to GitHub Pages, your **control panel (Chrome)** and **VMix browser** are **separate** and **cannot communicate**!

### ❌ This WON'T Work:
1. Open `control.html` in Chrome
2. Load `output.html` in VMix
3. Click buttons in Chrome → **VMix won't update!**

### ✅ This WILL Work:
Use **URL parameters** to embed graphics directly in the VMix URL!

---

## 🔧 Method 1: Use the URL Generator (EASIEST)

1. Open `vmix-control.html` in your browser
2. Configure your graphic (name, title, colors)
3. Click **"Generate URL"**
4. Click **"Copy URL"**
5. Paste into VMix Web Browser input
6. Graphic appears automatically! ✨

---

## 🛠️ Method 2: Manual URL Construction

### Base URL Format:
```
https://vernumbroadcast.github.io/GFX/output.html?[PARAMETERS]
```

### Available Parameters:

#### Lower Third:
- `l3_show=true` - Show the L3 (required)
- `l3_primary=Your%20Name` - Primary text (URL encoded)
- `l3_secondary=Your%20Title` - Secondary text (URL encoded)
- `l3_primary_bg=%23ffffff` - Primary background color (# = %23)
- `l3_primary_color=%23000000` - Primary text color
- `l3_secondary_bg=%23dc3545` - Secondary background color
- `l3_secondary_color=%23ffffff` - Secondary text color
- `l3_x=80` - X position (pixels from left)
- `l3_y=850` - Y position (pixels from top)

#### Ticker:
- `ticker_show=true` - Show ticker
- `ticker_text=Item1|Item2|Item3` - Ticker items (| separated)
- `ticker_speed=20` - Animation speed (seconds)
- `ticker_position=bottom` - Position

### Example URLs:

**Simple L3:**
```
https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=John%20Smith&l3_secondary=Sports%20Reporter&l3_primary_bg=%23ffffff&l3_secondary_bg=%23dc3545
```

**L3 + Ticker:**
```
https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=Breaking%20News&l3_secondary=Live%20Coverage&ticker_show=true&ticker_text=Weather%20Alert|Traffic%20Update|Sports%20Score
```

**Blank (No Graphics):**
```
https://vernumbroadcast.github.io/GFX/output.html
```

---

## 📝 URL Encoding Guide

Special characters must be encoded:

| Character | Encoded | Example |
|-----------|---------|---------|
| Space | `%20` | `John Smith` → `John%20Smith` |
| # | `%23` | `#ffffff` → `%23ffffff` |
| & | `%26` | `News & Sports` → `News%20%26%20Sports` |
| | | `%7C` | `Item1|Item2` → `Item1%7CItem2` |

**Tip:** Use the URL Generator tool - it handles encoding automatically!

---

## 🎬 VMix Setup Steps

### 1. Generate Your URL
Use `vmix-control.html` or construct manually (see above)

### 2. Add to VMix
1. In VMix: **Add Input → Web Browser**
2. Paste your generated URL
3. **Width**: 1920
4. **Height**: 1080
5. **Frame Rate**: 30 fps (or match your production)
6. ✅ **Enable "Transparent Background"**

### 3. Verify
- Graphic should appear immediately
- Background should be transparent
- No black screen! ✨

---

## 🔄 Updating Graphics in VMix

### Option A: Create Multiple URLs (Recommended)
1. Generate URLs for different graphics:
   - `output.html?l3_primary=Guest1&l3_secondary=Title1`
   - `output.html?l3_primary=Guest2&l3_secondary=Title2`
   - `output.html?l3_primary=Guest3&l3_secondary=Title3`
2. Add each as a separate VMix input
3. Switch between them using VMix transitions

### Option B: Reload URL in VMix
1. Right-click the Web Browser input
2. Select **"Web Browser Properties"**
3. Change the URL
4. Click **"Reload"**
5. Graphic updates

---

## 🐛 Troubleshooting

### Black Screen in VMix
- ✅ Check "Transparent Background" is enabled
- ✅ Verify URL is correct (check for typos)
- ✅ Test URL in Chrome first - does it show the graphic?
- ✅ Ensure colors aren't all black

### No Graphic Showing
- ✅ URL must include `?l3_show=true` to show an L3
- ✅ Check URL encoding (spaces = %20, # = %23)
- ✅ Verify parameters are spelled correctly
- ✅ Test in Chrome: `https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=TEST`

### Graphic Shows in Chrome but Not VMix
- ✅ Restart VMix
- ✅ Re-add the Web Browser input
- ✅ Update VMix to latest version
- ✅ Check VMix browser cache (Settings → clear cache)

### Logo Not Showing
- ✅ Logo URL must be absolute (include full `https://...`)
- ✅ Upload logo to GitHub repo
- ✅ Add `&logoUrl=https://vernumbroadcast.github.io/GFX/ravelogo.png` to URL

### Colors Look Wrong
- ✅ Verify hex codes are encoded correctly (`#` = `%23`)
- ✅ Check primary vs secondary colors aren't swapped
- ✅ Test in Chrome to verify appearance

---

## 📁 GitHub Pages Deployment Checklist

Before going live:

- [ ] All files uploaded to GitHub repo
- [ ] GitHub Pages enabled (Settings → Pages → Source: main branch)
- [ ] Test URLs in Chrome (should show graphics)
- [ ] Logo files uploaded to repo (if using logos)
- [ ] Font files uploaded (if using custom fonts)
- [ ] URLs generated for all graphics needed
- [ ] VMix inputs configured with correct URLs
- [ ] Transparency verified in VMix
- [ ] Test graphics in VMix preview before going live

---

## 💡 Pro Tips

1. **Bookmark URLs**: Save frequently-used graphic URLs in a text file
2. **Use vmix-control.html**: Much easier than manual URL construction
3. **Test in Chrome first**: Faster iteration than testing in VMix
4. **Multiple inputs**: Set up 5+ VMix inputs with different graphics for quick switching
5. **URL shortener**: Use bit.ly or similar for long URLs (but test first!)
6. **Version control**: Keep old URLs in case you need to rollback

---

## 🎨 Example Preset URLs

Copy these and customize:

**Guest L3:**
```
https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=Guest%20Name&l3_secondary=Guest%20Title&l3_primary_bg=%23ffffff&l3_secondary_bg=%23dc3545
```

**LIVE Badge:**
```
https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=LIVE&l3_secondary=On%20Air%20Now&l3_primary_bg=%23ffffff&l3_secondary_bg=%23dc3545
```

**Breaking News:**
```
https://vernumbroadcast.github.io/GFX/output.html?l3_show=true&l3_primary=BREAKING%20NEWS&l3_secondary=Live%20Coverage&l3_primary_bg=%23ffffff&l3_secondary_bg=%23fd7e14
```

**Blank (Standby):**
```
https://vernumbroadcast.github.io/GFX/output.html
```

---

## 📞 Support

For issues:
1. Test URL in Chrome browser first
2. Check URL encoding is correct
3. Verify VMix transparency is enabled
4. Contact James Watson for assistance

---

**Made available by James Watson for Vernum Media** 🎬

