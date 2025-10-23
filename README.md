# VMix HTML5 Graphics System

A professional, browser-based graphics overlay system designed for VMix with transparent output, real-time control, and multiple data source integrations.

## Features

- **Modern Lower Thirds** - Clean, rounded rectangle design with dual-box layout
- **Scrolling Ticker** - Customizable news ticker with smooth animations
- **Real-time Control** - Side-by-side Preview and Transmit views
- **Multiple Data Sources** - Google Sheets, Rundown Creator API, and JSON config files
- **Transparent Output** - VMix-compatible alpha channel support
- **Custom Fonts** - Upload your own fonts or use web-safe options
- **Style Presets** - Quick styling for News, Sports, and Corporate themes
- **URL Parameters** - Generate static URLs with embedded settings
- **State Management** - Save and load your configurations

## File Structure

```
TLWIG/
├── control.html       # Main control panel with preview/transmit views
├── output.html        # Graphics output page for VMix
├── styles.css         # All styling and animations
├── control.js         # Control panel logic
├── graphics.js        # Graphics rendering engine
├── config.json        # Example configuration file
└── README.md          # This file
```

## Quick Start

### 1. Basic Setup

1. Open `control.html` in your web browser
2. You'll see two preview windows (Preview and Transmit) and controls below
3. The **Preview** window is for testing
4. The **Transmit** window is what you'll use in VMix

### 2. Add to VMix

1. In VMix, click **Add Input → More → Web Browser**
2. Copy the URL from the "Output URL for VMix" section in the control panel
3. Paste it into VMix's URL field
4. Make sure "Transparent Background" is enabled in VMix
5. The graphics will now appear in VMix with transparency

### 3. Using the Control Panel

The control panel has 5 main tabs:

#### **Lower Third Tab**
- Enter primary and secondary text
- Adjust position (X/Y coordinates)
- Customize colors, fonts, and sizes
- Show/Hide graphics on Preview, Transmit, or Both
- Real-time preview updates as you type

#### **Ticker Tab**
- Enter ticker items separated by `|` (pipe character)
- Example: `Breaking News | Weather Update | Sports Score`
- Adjust speed, position, and styling
- Show/Hide ticker independently

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
- Apply style presets (Default, News, Sports, Corporate)
- Custom font upload supports .ttf, .otf, .woff, .woff2

#### **Output Tab**
- Copy URL for VMix
- Generate URLs with embedded parameters (static setup)
- Save/Load control panel state

## Usage Examples

### Example 1: Basic Lower Third

1. Go to the **Lower Third** tab
2. Enter:
   - Primary Text: `Rich McDonald`
   - Secondary Text: `Trade Live With IG`
3. Click **"Show on Transmit"**
4. The graphic appears in VMix with smooth animation

### Example 2: Ticker

1. Go to the **Ticker** tab
2. Enter ticker items:
   ```
   Breaking News | Weather: Sunny 75°F | Sports: Team A wins 3-2
   ```
3. Adjust speed to `20` seconds
4. Click **"Show on Transmit"**

### Example 3: Google Sheets Integration

1. Create a Google Sheet with columns: `Name`, `Title`
2. Add rows with guest information
3. Make the sheet public
4. In the control panel, go to **Data Sources** tab
5. Paste your sheet URL
6. Click **"Load from Google Sheets"**
7. The first row's data loads into the lower third

### Example 4: URL Parameters (Static Setup)

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

## Troubleshooting

### Graphics don't appear in VMix
- Ensure "Transparent Background" is enabled in VMix's Web Browser input settings
- Check that the output.html URL is correct
- Verify the graphics are visible in the control panel's Transmit window

### Google Sheets not loading
- Make sure the sheet is set to "Anyone with the link can view"
- Verify the URL is the full Google Sheets URL
- Check browser console (F12) for CORS errors

### Custom font not working
- Ensure font file format is supported (.ttf, .otf, .woff, .woff2)
- Enter a font name without spaces
- Apply font before showing graphics

### Ticker not scrolling
- Make sure ticker items are separated by `|` (pipe character)
- Check that speed is set (default: 20 seconds)
- Verify ticker is shown (visible in control panel)

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

## Credits

Built for professional broadcast graphics with VMix compatibility.

## License

Free to use and modify for your productions.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the example configuration in `config.json`
- Test in the control panel's Preview window before going live

---

**Version**: 1.0  
**Last Updated**: October 23, 2025  
**Compatible with**: VMix 24+, HTML5 browsers

