# Vernum Media GFX Package

A professional, broadcast-grade graphics overlay system designed for VMix with transparent output, real-time control, and comprehensive branding features.

**Made available by James Watson**

## 🎬 Features

- **Single & Dual Lower Thirds** - Display L3s on left, right, or both sides of screen
- **5 L3 Slots** - Pre-configure up to 5 lower thirds for instant recall
- **Four Corner Bugs** - Top-left, top-right, bottom-left, and bottom-right bugs with auto-scaling text
- **Flexible Timer/Clock** - Display clock, countdown, or stopwatch on ANY corner bug
- **Scrolling Ticker** - Bottom-screen news ticker with smooth animations
- **Logo Support** - Global and per-L3 logo integration with auto-sizing
- **Real-time Control** - Side-by-side Preview and Transmit views
- **Multiple Data Sources** - Google Sheets (with auto-update), Rundown Creator API, and JSON config
- **Transparent Output** - VMix-compatible alpha channel support
- **Custom Fonts** - Upload your own fonts or use web-safe options
- **Global Color Controls** - Batch change all colors across the entire project
- **State Management** - Persistent memory of last used settings
- **Vernum Media Branding** - Professional blue color scheme with brand logo

## 📁 File Structure

```
TLWIG/
├── control.html                      # Main control panel with preview/transmit views
├── output.html                       # Graphics output page for VMix
├── styles.css                        # All styling and animations
├── control.js                        # Control panel logic
├── graphics.js                       # Graphics rendering engine
├── config.json                       # Example configuration file
├── README.md                         # This file (overview)
├── VMIX_SETUP.md                     # ⚠️ DETAILED VMix integration guide
├── README_VMIX_TROUBLESHOOTING.md    # ⚠️ Quick fixes for black screen issues
├── L3_TEMPLATE.csv                   # Google Sheets template for L3s, Bugs, and Ticker
├── GOOGLE_SHEETS_SETUP.md            # Guide for Google Sheets integration with auto-update
├── GOOGLE_SHEETS_AUTO_UPDATE.md      # Detailed guide for auto-update feature
└── ravelogo.png                      # Default logo (example)
```

## 🚨 QUICK START: Cloud Deployment (Recommended!)

**Want everything to work in the cloud with zero local setup?**

### ☁️ Cloud Setup (GitHub Pages + Firebase):
👉 **See `CLOUD_SETUP_CHECKLIST.md` for 5-minute setup**  
👉 **See `CLOUD_DEPLOYMENT_GUIDE.md` for complete guide**  
**Key features**: 
- ✅ Control panel works from anywhere (phone, tablet, laptop)
- ✅ Real-time sync to VMix via Firebase
- ✅ Google Sheets auto-update
- ✅ No local HTTP server needed

### 💻 Local Setup (Files on your computer):
👉 **See `README_VMIX_TROUBLESHOOTING.md` for quick fixes**  
👉 **See `VMIX_SETUP.md` for complete setup guide**  
**Key requirement**: You MUST use an HTTP server (not file://)

## 🚀 Quick Start

### 1. Start HTTP Server (REQUIRED for VMix)

**Mac/Linux:**
```bash
cd /Users/watson/TLWIG
python3 -m http.server 8080
```

**Windows:**
```bash
cd C:\Path\To\TLWIG
python -m http.server 8080
```

### 2. Open Control Panel

Open your browser and go to:
```
http://localhost:8080/control.html
```

You'll see:
- **Preview** window (left) - for testing graphics
- **Transmit** window (right) - shows what VMix sees
- **Quick Actions** - instant show/hide buttons
- **Tabs** - L3s, Dual L3s, Corner Bugs, Ticker, Styling, Data Sources, Output

### 3. Add to VMix

1. In VMix, click **Add Input → Web Browser**
2. Copy the URL from the "VMix URL" bar in the Transmit section
3. Paste it into VMix: `http://localhost:8080/output.html`
4. Set Width: **1920**, Height: **1080**
5. ✅ Enable **"Transparent Background"**
6. The graphics will now appear in VMix with transparency

### 4. Test It!

In `control.html`:
1. Click **"SHOW L3"** in Quick Actions
2. You should see the graphic appear in both Preview and Transmit windows
3. If it appears in Transmit → it's working in VMix too! ✅

### 5. Using the Control Panel

The control panel has 7 main tabs:

#### **Lower Third Tab**
- Configure up to 5 L3 slots
- Enter primary (name) and secondary (title) text
- Customize colors, fonts, and sizes for each slot
- Add logos (global or per-L3 override)
- Save slots for instant recall via Quick Actions
- Real-time preview updates as you type

#### **Dual L3s Tab**
- Display two L3s simultaneously (left and right sides)
- Select from any of your 5 saved L3 slots
- Preview shows current content of selected slots
- Perfect for split-screen interviews or debates

#### **Corner Bugs Tab**
- **Top-Left Bug** - Defaults to "LIVE"
- **Top-Right Bug** - Defaults to "PREVIOUSLY"
- **Bottom-Right Timer** - Clock, countdown, stopwatch, or custom timer
- All bugs auto-scale to text length
- Individual show/hide controls for each bug
- Timer supports HH:MM, HH:MM:SS, and millisecond formats

#### **Ticker Tab**
- Enter ticker items separated by `|` (pipe character)
- Example: `Breaking News | Weather Update | Sports Score`
- Adjust speed, position, and styling
- Show/Hide ticker independently
- Animates from bottom with smooth scrolling

#### **Data Sources Tab**
Three ways to load data:

1. **Google Sheets Integration**
   - Make your Google Sheet public (Share → Anyone with link can view)
   - Sheet should have columns: Name, Title
   - Paste the sheet URL
   - Click "Test Connection" then "Load from Google Sheets"

2. **Rundown Creator API**
   - Enter your API credentials from Rundown Creator
   - List available rundowns or load specific rundown data
   - API Documentation: https://www.rundowncreator.com/api/

3. **JSON Config File**
   - Upload a JSON configuration file
   - Export current settings as JSON
   - See `config.json` for example format

#### **Styling Tab**
- Choose from web-safe fonts or upload custom fonts
- **Global Color Controls** - Batch change all colors across all graphics
- **Global Logo Settings** - Set default logo for all L3s
- Custom font upload supports .ttf, .otf, .woff, .woff2
- Fonts apply to L3s, bugs, ticker, and timer

#### **Output Tab**
- Copy URL for VMix
- Generate URLs with embedded parameters (static setup)
- Save/Load control panel state

## Usage Examples

### Example 1: Basic Lower Third

1. Go to the **Lower Third** tab
2. Select **Slot 1** from the dropdown
3. Enter:
   - Primary Text: `John Smith`
   - Secondary Text: `Sports Reporter`
4. Click **"SAVE SLOT"**
5. Click **"SHOW L3"** in Quick Actions
6. The graphic appears in VMix with smooth slide-in animation

### Example 2: Ticker

1. Go to the **Ticker** tab
2. Enter ticker items:
   ```
   Breaking News | Weather: Sunny 75°F | Sports: Team A wins 3-2
   ```
3. Adjust speed to `20` seconds
4. Click **"Show on Transmit"**

### Example 3: Dual Lower Thirds (Split Screen)

1. Set up two L3 slots (e.g., Slot 1 and Slot 2) with different names/titles
2. Go to **Dual L3s** tab
3. Select **Slot 1** for left side, **Slot 2** for right side
4. Preview shows both L3s' content
5. Click **"SHOW DUAL L3s"** in Quick Actions
6. Both L3s appear on left and right sides of screen

### Example 4: Live Clock

1. Go to **Corner Bugs** tab, scroll to "Bottom Right Timer/Clock"
2. Set **Timer Type**: "Clock (Time of Day)"
3. Set **Format**: "HH:MM" (or "HH:MM:SS" for seconds)
4. Set **Label**: "LIVE" (or leave blank)
5. Click **"Start Timer"**
6. Current time appears in bottom-right corner

### Example 5: Google Sheets Integration

1. Create a Google Sheet with columns: `Slot`, `Primary Text`, `Secondary Text`
2. Add rows with L3 data (see `L3_TEMPLATE.csv` for format)
3. Make the sheet public (Share → Anyone with link can view)
4. In the control panel, go to **Data Sources** tab
5. Paste your sheet URL
6. Click **"Load from Google Sheets"**
7. All 5 slots populate automatically

👉 **See `GOOGLE_SHEETS_SETUP.md` for detailed instructions**

### Example 6: URL Parameters (Static Setup)

1. Configure your graphics in the control panel
2. Go to **Output** tab
3. Click **"Generate URL with Current Settings"**
4. Copy the generated URL
5. Use this URL in VMix - graphics will appear automatically on load

Example generated URL:
```
output.html?l3_show=true&l3_primary=John%20Doe&l3_secondary=CEO&l3_x=80&l3_y=850
```

## Customization

### Changing Default Position

Lower thirds default to bottom-left (X: 80, Y: 850). Adjust in the control panel:
- **X Position**: 0 = left edge, 1920 = right edge
- **Y Position**: 0 = top edge, 1080 = bottom edge

### Custom Colors

Each box can have independent colors:
- **Primary Box**: Default white background (#ffffff) with black text (#000000)
- **Secondary Box**: Default red background (#dc3545) with white text (#ffffff)

Use the color pickers in the Lower Third tab to customize.

### Custom Fonts

1. Go to **Styling** tab
2. Select "Custom Font (Upload)" from dropdown
3. Upload your font file (.ttf, .otf, .woff, .woff2)
4. Enter a font name (e.g., "MyBroadcastFont")
5. Click **"Apply Font"**

### Animation Styles

Currently uses slide-in/slide-out animations. To customize, edit `styles.css`:

```css
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
```

## Data Source Formats

### Google Sheets Format

Create a sheet with these columns:
```
Name          | Title
Rich McDonald | Trade Live With IG
Jane Smith    | Financial Analyst
```

### Rundown Creator Integration

The system uses these API methods:
- `getRundowns` - List all rundowns
- `getRows` - Get rundown content

Row data maps to lower thirds:
- `Slug` → Primary Text
- `Title` → Secondary Text

### JSON Config Format

See `config.json` for complete example. Basic structure:

```json
{
  "lowerThird": {
    "show": true,
    "primaryText": "Name Here",
    "secondaryText": "Title Here",
    "x": 80,
    "y": 850
  },
  "ticker": {
    "show": true,
    "items": ["Item 1", "Item 2", "Item 3"],
    "speed": 20
  }
}
```

## Advanced Features

### Config File Monitoring

The `output.html` page checks `config.json` every 5 seconds. You can:
1. Edit `config.json` with a text editor
2. Graphics update automatically without refreshing

### State Management

Save your current control panel settings:
1. Configure everything as desired
2. Go to **Output** tab
3. Click **"Save Current State"**
4. Settings persist in browser localStorage
5. Click **"Load Saved State"** to restore

### Real-time Preview

Changes in the control panel update the Preview window in real-time as you type. This lets you fine-tune positioning and styling before pushing to Transmit (VMix).

## 🐛 Troubleshooting

### ⚠️ Black Screen in VMix
**Most Common Issue!**
- ❌ You're using `file://` protocol
- ✅ **Solution**: Start an HTTP server and use `http://localhost:8080/output.html`
- 👉 **See `README_VMIX_TROUBLESHOOTING.md` for step-by-step fixes**

### Graphics don't appear in VMix
- Ensure "Transparent Background" is enabled in VMix's Web Browser input settings
- Check that the output.html URL is correct (`http://localhost:8080/output.html`)
- Verify the graphics are visible in the control panel's Transmit window
- Ensure control panel is open at `http://localhost:8080/control.html` (same origin)

### Blank/Transparent Output
- This is **normal** when no graphics are active
- Graphics only appear when you click "SHOW" buttons in control panel
- Test standalone by opening `output.html` and clicking "TEST: Show Sample L3" button

### Google Sheets not loading
- Make sure the sheet is set to "Anyone with the link can view"
- Verify the URL is the full Google Sheets URL
- Check browser console (F12) for CORS errors
- Use the CSV template in `L3_TEMPLATE.csv` as a starting point

### Custom font not working
- Ensure font file format is supported (.ttf, .otf, .woff, .woff2)
- Enter a font name without spaces
- Apply font before showing graphics
- Font changes apply to all graphics (L3s, bugs, ticker, timer)

### Ticker not scrolling
- Make sure ticker items are separated by `|` (pipe character)
- Check that speed is set (default: 20 seconds)
- Verify ticker is shown (visible in control panel)
- Ticker defaults to red background (#dc3545)

### Timer/Clock not showing
- Ensure you clicked "Start Timer" in the Corner Bugs tab
- Check that timer format is set (default: HH:MM)
- Use "Hide All" master control to hide all graphics including timer
- Timer aligns with L3s and sits above ticker

## Browser Compatibility

- **Recommended**: Google Chrome, Microsoft Edge (Chromium)
- **Supported**: Firefox, Safari (latest versions)
- **VMix**: Uses Chromium engine (fully compatible)

## Technical Details

- **Resolution**: 1920x1080 (Full HD)
- **Transparency**: Full alpha channel support
- **Framework**: Pure HTML5/CSS3/JavaScript (no dependencies)
- **Communication**: PostMessage API for iframe control
- **Storage**: LocalStorage for state persistence

## Extending the System

### Adding New Graphics

1. Edit `output.html` - Add new HTML elements
2. Edit `styles.css` - Add styling for new elements
3. Edit `graphics.js` - Add methods to control new elements
4. Edit `control.html` - Add UI controls
5. Edit `control.js` - Add control logic

### Custom Animations

Add new keyframe animations in `styles.css`:

```css
@keyframes customAnimation {
    from { /* start state */ }
    to { /* end state */ }
}
```

Apply to elements:
```css
.my-element {
    animation: customAnimation 0.5s ease-in-out;
}
```

## Performance Tips

1. **Limit ticker items** - Too many items can slow scrolling
2. **Optimize custom fonts** - Use WOFF2 format for smaller file size
3. **Use solid colors** - Better performance than gradients
4. **Close unused tabs** - Control panel can be closed after setup

## 📚 Additional Documentation

- **`VMIX_SETUP.md`** - Complete VMix integration guide with troubleshooting
- **`README_VMIX_TROUBLESHOOTING.md`** - Quick reference for black screen issues
- **`GOOGLE_SHEETS_SETUP.md`** - Detailed Google Sheets integration guide
- **`L3_TEMPLATE.csv`** - Template for importing L3 data into Google Sheets
- **`QUICKSTART.md`** - Quick reference guide for operators

## 🎨 Branding

This package is branded as **Vernum Media GFX Package** with:
- Primary brand color: Vernum Blue (#2c5aa0)
- Accent colors: Green (Preview), Red (Transmit)
- Default L3/Bug color: Vernum Red (#dc3545)
- Logo: Vernum Media (customizable via Styling tab)

**Made available by James Watson**

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `VMIX_SETUP.md` for VMix-specific issues
3. Check `GOOGLE_SHEETS_SETUP.md` for data integration help
4. Review the example configuration in `config.json`
5. Test in the control panel's Preview window before going live
6. Contact James Watson for additional assistance

## 💡 Tips for Live Production

- **Pre-configure all 5 L3 slots** before the show starts
- **Use Quick Actions** for instant show/hide during live production
- **Hide Preview** to reduce screen clutter during broadcast
- **Test graphics** in Preview before showing on Transmit
- **Use "Hide All"** as a panic button to clear all graphics instantly
- **Set up Timer/Clock** early and leave running throughout show
- **Dual L3s** are perfect for panel discussions or debates
- **Corner Bugs** help brand segments (LIVE, BREAKING NEWS, etc.)

---

**Version**: 2.0 - Vernum Media Edition  
**Last Updated**: October 27, 2025  
**Compatible with**: VMix 24+, HTML5 browsers (Chrome, Edge, Firefox)  
**Created by**: James Watson for Vernum Media

