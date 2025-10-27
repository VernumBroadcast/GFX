# 🎉 What's New - Google Sheets Auto-Update

## ✅ Major Update: Auto-Update from Google Sheets

### New Features:

#### 1. **Enhanced CSV Template** 📋
The `L3_TEMPLATE.csv` now supports:
- ✅ **5 Lower Thirds (L3s)** - ID: 1-5
- ✅ **4 Corner Bugs** - ID: TopLeft, TopRight, BottomLeft, BottomRight  
- ✅ **1 Ticker** - ID: 1

**New Format:**
```csv
Type,ID,Primary Text,Secondary Text,Color,Notes
L3,1,John Smith,Sports Reporter,#dc3545,Example
Bug,TopLeft,LIVE,,#dc3545,Example
Ticker,1,Breaking News | Updates,,#dc3545,Example
```

#### 2. **Auto-Update System** 🔄
New controls in "Data Sources" tab:
- ✅ **Enable/Disable Checkbox** - Toggle auto-update on/off
- ✅ **Update Interval Input** - Set polling frequency (1-3600 seconds)
- ✅ **Smart Status Display** - Shows what was loaded (e.g., "✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker")

#### 3. **Real-Time Graphics Updates** ⚡
- Edit your Google Sheet at any time
- Changes automatically sync to control panel
- Recommended interval: 5-10 seconds for live production
- Works seamlessly with VMix

---

## 🎯 How to Use

### Quick Start:
1. Open `control.html`
2. Go to **"Data Sources"** tab
3. Paste your Google Sheets CSV URL
4. Click **"Test Connection"**
5. Check **"Enable Auto-Update"**
6. Set interval to **5 seconds**
7. Done! Graphics will auto-update

### What Happens:
- Every X seconds, the system fetches your Google Sheet
- All L3 slots, bugs, and ticker update automatically
- Status shows: "✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker"
- Click "SHOW" buttons to display updated graphics

---

## 📚 Documentation

Full guides available:
- **GOOGLE_SHEETS_SETUP.md** - Complete setup guide with examples
- **GOOGLE_SHEETS_AUTO_UPDATE.md** - Deep dive into auto-update feature
- **L3_TEMPLATE.csv** - Downloadable template

---

## ❓ FAQ

### Q: Will L3s update automatically when the Google Sheet changes?
**A: YES!** When auto-update is enabled, all L3 slots, bugs, and ticker will automatically refresh from the sheet at your specified interval.

### Q: Can I update Bugs and Ticker from Google Sheets too?
**A: YES!** The new template supports L3s, Bugs, and Ticker - all in one sheet.

### Q: Will graphics change mid-broadcast?
**A: NO.** Auto-update only updates the stored data in the control panel. You must manually click "SHOW" to display updated graphics. This gives you full control.

### Q: What's the recommended update interval?
**A: 5-10 seconds for live production.** Use 2-5 seconds for rehearsals, or 30-60 seconds for long events.

### Q: Does this work with VMix?
**A: YES!** Auto-update works perfectly with VMix. The control panel updates the data, and you control what's displayed.

---

## 🔧 Technical Details

### Code Changes:
- **control.js**: Added `startAutoUpdate()`, `stopAutoUpdate()`, `setupAutoUpdate()` methods
- **control.js**: Enhanced `loadGoogleSheets()` to parse Type-based CSV format
- **control.html**: Added auto-update checkbox and interval input
- **L3_TEMPLATE.csv**: Updated format to support L3s, Bugs, and Ticker

### How It Works:
1. `setupAutoUpdate()` initializes event listeners on checkbox and interval input
2. When enabled, `startAutoUpdate()` calls `loadGoogleSheets()` immediately
3. `setInterval()` polls the sheet every X seconds
4. `loadGoogleSheets()` parses CSV and updates:
   - `this.l3Slots[1-5]` for L3s
   - Bug text inputs and color pickers
   - Ticker text input and color
5. Changes are saved to `localStorage`
6. L3 dropdown labels update to reflect new names

---

## 💡 Pro Tips

1. **Test First**: Always click "Test Connection" before enabling auto-update
2. **Use Notes**: The Notes column is perfect for internal reminders
3. **Color Code**: Use different colors for different segment types
4. **Multiple Sheets**: Easily switch between sheets for different shows
5. **Backup**: Control panel saves to localStorage, so you have offline backup

---

**Made available by James Watson**

