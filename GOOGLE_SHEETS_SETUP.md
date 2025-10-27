# Google Sheets Template Setup for Vernum Media GFX Package

## 📊 Quick Setup Guide

### Step 1: Import the Template CSV
1. Open Google Sheets
2. Go to **File → Import**
3. Upload the `L3_TEMPLATE.csv` file
4. Select **"Replace spreadsheet"** or **"Insert new sheet"**

### Step 2: Customize Your Graphics Data
The template supports **Lower Thirds (L3s), Corner Bugs, and Ticker** with the following columns:
- **Type**: Type of graphic (L3, Bug, or Ticker)
- **ID**: Identifier (L3: 1-5, Bug: TopLeft/TopRight/BottomLeft/BottomRight, Ticker: 1)
- **Primary Text**: Main text (name, title, or bug text)
- **Secondary Text**: Subtitle or additional text (for L3s only)
- **Color**: Background color (default: #dc3545 - Vernum Red)
- **Notes**: Internal notes/reminders

### Step 3: Share for Web Access
1. Click **File → Share → Publish to web**
2. Select **Entire Document** or just your graphics sheet
3. Choose **Comma-separated values (.csv)**
4. Copy the published URL

### Step 4: Connect to GFX Package
1. Open `control.html`
2. Go to **"Data Sources"** tab
3. Paste the Google Sheets CSV URL
4. Click **"Test Connection"** to verify
5. Click **"Load from Google Sheets"** to import all graphics

### Step 5: Enable Auto-Update (Optional)
1. Check the **"Enable Auto-Update"** checkbox
2. Set the update interval (recommended: 5-10 seconds)
3. Graphics will automatically refresh when the sheet changes!

---

## 📝 Template Format

### Complete Template Example

| Type   | ID          | Primary Text          | Secondary Text   | Color   | Notes                       |
|--------|-------------|-----------------------|------------------|---------|----------------------------|
| L3     | 1           | John Smith            | Sports Reporter  | #dc3545 | Lower Third Slot 1         |
| L3     | 2           | Jane Doe              | Weather Anchor   | #dc3545 | Lower Third Slot 2         |
| L3     | 3           | Breaking News         | Live Coverage    | #dc3545 | Lower Third Slot 3         |
| L3     | 4           | Coming Up Next        | Special Report   | #dc3545 | Lower Third Slot 4         |
| L3     | 5           | On Location           | Downtown Studio  | #dc3545 | Lower Third Slot 5         |
| Bug    | TopLeft     | LIVE                  |                  | #dc3545 | Top Left Corner Bug        |
| Bug    | TopRight    | PREVIOUSLY            |                  | #dc3545 | Top Right Corner Bug       |
| Bug    | BottomLeft  | Up Next:              |                  | #dc3545 | Bottom Left Corner Bug     |
| Bug    | BottomRight | Up Next:              |                  | #dc3545 | Bottom Right Corner Bug    |
| Ticker | 1           | Breaking • Updates • Live | (ticker items) | #dc3545 | Scrolling Ticker           |

---

## 🔄 Auto-Update Feature

### What is Auto-Update?
When enabled, the GFX package will automatically poll your Google Sheet at the specified interval and update all graphics in real-time.

### How to Use:
1. **Enable the checkbox** in the "Google Sheets Integration" section
2. **Set the interval** (how often to check for updates in seconds)
3. **Update your Google Sheet** - changes will appear automatically!

### Recommended Settings:
- **Live Production**: 5-10 seconds
- **Pre-Production**: 30-60 seconds
- **Rehearsals**: 2-5 seconds (for quick testing)

### What Gets Updated:
✅ All 5 Lower Third slots  
✅ All 4 Corner Bugs (Top-Left, Top-Right, Bottom-Left, Bottom-Right)  
✅ Ticker text and color  
✅ Individual colors for each graphic  

---

## 📋 CSV Template Types

### 1. Lower Thirds (L3)
- **Type**: `L3`
- **ID**: `1`, `2`, `3`, `4`, or `5`
- **Primary Text**: Name or main text (e.g., "John Smith")
- **Secondary Text**: Title or subtitle (e.g., "Sports Reporter")
- **Color**: Background color for the secondary box (e.g., `#dc3545`)

### 2. Corner Bugs
- **Type**: `Bug`
- **ID**: `TopLeft`, `TopRight`, `BottomLeft`, or `BottomRight`
- **Primary Text**: Bug text (e.g., "LIVE", "PREVIOUSLY", "Up Next:")
- **Secondary Text**: (leave empty)
- **Color**: Background color for the bug (e.g., `#dc3545`)

### 3. Ticker
- **Type**: `Ticker`
- **ID**: `1`
- **Primary Text**: Ticker content, use ` | ` to separate items (e.g., "Breaking News | Live Updates | More Info")
- **Secondary Text**: (leave empty)
- **Color**: Background color for the ticker (e.g., `#dc3545`)

---

## 🎨 Color Customization
You can set custom colors for each graphic:
- **Default red**: `#dc3545` (Vernum Media brand red)
- **Alternative colors**: 
  - Blue: `#007bff`
  - Green: `#28a745`
  - Orange: `#fd7e14`
  - Purple: `#6f42c1`
  - Royal Blue: `#0056b3`

---

## 💡 Tips & Best Practices

### Lower Thirds:
- Keep Primary Text short (names, locations)
- Use Secondary Text for titles/descriptions
- Test each L3 slot using the Preview before going live
- Use the **Quick Actions** dropdown to switch between saved L3s quickly

### Corner Bugs:
- Use short text (1-3 words)
- Common uses: "LIVE", "PREVIOUSLY", "BREAKING", "COMING UP"
- Bugs auto-scale to text size

### Ticker:
- Separate items with ` | ` for visual separation
- Keep items concise (2-5 words per item)
- Set to "Loop Continuously" for ongoing updates, or "Play Once & Hide" for one-time messages

### Auto-Update:
- Use **shorter intervals** (2-5 sec) during rehearsals for fast changes
- Use **longer intervals** (10-30 sec) during live production to reduce server load
- Always test with "Test Connection" before enabling auto-update
- Status indicator shows count of loaded items (e.g., "✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker")

---

## 🚀 VMix Integration
Once your graphics are loaded:
1. Copy the **VMix URL** from the Transmit section (or click "Open Tab")
2. In VMix, add an **"Input → Web Browser"**
3. Paste the URL
4. Set **Width: 1920, Height: 1080**
5. Enable **"Transparent Background"**
6. Control graphics from `control.html`
7. Auto-update will work seamlessly with VMix!

---

## 🔧 Troubleshooting

### "Failed to connect" error
- Make sure your sheet is **published to web** (not just shared)
- Verify you copied the **CSV export URL**, not the regular sheet URL
- Check that the sheet has data and the correct column headers

### Auto-update not working
- Verify "Test Connection" succeeds first
- Check the browser console (F12) for any errors
- Make sure the checkbox is checked and interval is valid (1-3600 seconds)
- Google Sheets can take 5-30 seconds to propagate changes to the published CSV

### Graphics not updating in VMix
- VMix may cache the page - try removing and re-adding the input
- Ensure Auto-update is enabled in the control panel
- Check that the VMix input URL points to `output.html`, not `control.html`

---

## 📞 Support
For issues or questions, contact **James Watson**

**Made available by James Watson**
