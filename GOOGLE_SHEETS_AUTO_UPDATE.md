# 🔄 Google Sheets Auto-Update Feature

## ✅ Implementation Complete

The Vernum Media GFX Package now supports **automatic real-time updates** from Google Sheets for all graphics!

---

## 🎯 What's New

### 1. **Enhanced CSV Template**
The CSV template (`L3_TEMPLATE.csv`) now supports:
- ✅ **5 Lower Thirds (L3s)** - All text and colors
- ✅ **4 Corner Bugs** - Top-Left, Top-Right, Bottom-Left, Bottom-Right
- ✅ **1 Ticker** - Full ticker text and color

**New CSV Format:**
```csv
Type,ID,Primary Text,Secondary Text,Color,Notes
L3,1,John Smith,Sports Reporter,#dc3545,Lower Third Slot 1
L3,2,Jane Doe,Weather Anchor,#dc3545,Lower Third Slot 2
...
Bug,TopLeft,LIVE,,#dc3545,Top Left Corner Bug
Bug,TopRight,PREVIOUSLY,,#dc3545,Top Right Corner Bug
...
Ticker,1,Breaking News | Latest Updates,,#dc3545,Ticker items separated by |
```

### 2. **Auto-Update System**
New controls in the "Data Sources" tab:
- ✅ **Enable/Disable Checkbox** - Turn auto-update on/off
- ✅ **Update Interval** - Set polling frequency (1-3600 seconds)
- ✅ **Status Indicator** - Shows what was loaded (e.g., "✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker")

### 3. **How Auto-Update Works**
When enabled:
1. **Immediate Load**: Graphics load instantly when you check the box
2. **Continuous Polling**: System checks Google Sheet at the specified interval
3. **Silent Updates**: Graphics update in the background without interrupting your workflow
4. **VMix Compatible**: Works seamlessly with VMix output

---

## 📋 Answer to Your Questions

### ❓ "Will the L3's Update as that Google Sheet is updated?"

**YES!** ✅ 

When you enable auto-update:
1. The system will poll your Google Sheet every X seconds (you set the interval)
2. Any changes you make to the sheet will automatically update:
   - All 5 L3 slots
   - All 4 corner bugs
   - The ticker text and color
3. Updates happen **automatically** - you don't need to click "Load" again
4. The control panel will refresh with new data
5. **Currently displayed graphics will NOT auto-switch** - only the stored data updates
   - To show updated graphics, click the appropriate "SHOW" button
   - This gives you control over what's live vs. what's ready

### ❓ "The Template should also allow for Tickers, Bugs to be updated as well"

**YES!** ✅

The new CSV template supports:
- **L3s**: All 5 slots (1-5)
- **Bugs**: TopLeft, TopRight, BottomLeft, BottomRight
- **Ticker**: Full ticker text

Each can have its own color, and all update automatically when the sheet changes!

---

## 🚀 Quick Start Guide

### Step 1: Update Your Google Sheet
1. Download `L3_TEMPLATE.csv` from the project
2. Import it into Google Sheets (File → Import)
3. Customize the content (L3s, Bugs, Ticker)
4. Publish to web as CSV (File → Share → Publish to web → CSV)

### Step 2: Connect to Control Panel
1. Open `control.html`
2. Go to **"Data Sources"** tab
3. Paste your Google Sheets CSV URL
4. Click **"Test Connection"** (should show "✓ Connection successful!")

### Step 3: Enable Auto-Update
1. Check the **"Enable Auto-Update"** checkbox
2. Set interval to **5 seconds** (recommended for live production)
3. Status should show: **"✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker"**

### Step 4: Use in Production
- Your graphics data now auto-updates every 5 seconds!
- Update the Google Sheet at any time
- Control panel will refresh automatically
- Click "SHOW" buttons to display updated graphics

---

## ⚙️ How It Works Internally

### Technical Implementation:
1. **`loadGoogleSheets()`** - Parses CSV and updates all graphics
2. **`startAutoUpdate()`** - Starts polling timer
3. **`stopAutoUpdate()`** - Stops polling when checkbox is unchecked
4. **`setupAutoUpdate()`** - Initializes event listeners

### Update Behavior:
- **L3 Slots**: Updates `this.l3Slots` object with new text and colors
- **Bugs**: Updates bug text inputs and color pickers
- **Ticker**: Updates ticker text input and color
- **State Persistence**: All changes are saved to `localStorage`
- **Dropdown Sync**: L3 dropdown labels update to show new names

### What Happens When Sheet Updates:
```
Google Sheet changes
   ↓
Auto-update timer fires (every X seconds)
   ↓
Fetch CSV from Google
   ↓
Parse rows (Type, ID, Primary Text, Secondary Text, Color, Notes)
   ↓
Update L3 slots, bugs, ticker in control panel
   ↓
Save to localStorage
   ↓
Status indicator shows: "✓ Loaded: 5 L3s, 4 Bugs, 1 Ticker"
   ↓
User clicks "SHOW" button to display updated graphic
```

---

## 🎛️ Recommended Settings

### Live Production:
- **Interval**: 5-10 seconds
- **Reason**: Fast enough for quick changes, not too frequent to cause lag

### Pre-Production/Rehearsals:
- **Interval**: 2-5 seconds
- **Reason**: Allows for rapid testing and iteration

### Long-Form Events (Conferences, etc.):
- **Interval**: 30-60 seconds
- **Reason**: Graphics change less frequently, reduces server load

---

## 💡 Pro Tips

### 1. **Test Before Going Live**
Always click "Test Connection" before enabling auto-update to ensure your sheet is accessible.

### 2. **Use Notes Column**
The "Notes" column is great for reminders like:
- "Guest arriving 10:15 AM"
- "Use this for breaking news only"
- "Pronunciation: Doe (rhymes with 'go')"

### 3. **Color Coding**
Use different colors in your Google Sheet to visually organize:
- Red: Breaking news
- Blue: Regular segments
- Green: Weather
- Orange: Sports

### 4. **Multiple Sheets**
You can have multiple Google Sheets for different shows/events. Just:
1. Paste the new URL
2. Click "Load from Google Sheets"
3. All 5 L3 slots + bugs + ticker update instantly

### 5. **Backup Your Data**
The control panel saves all L3 slots to `localStorage`, so even if your sheet goes offline, you still have the last loaded data.

---

## 🔧 Troubleshooting

### Auto-update isn't working
- ✅ Check "Test Connection" succeeds
- ✅ Verify checkbox is checked
- ✅ Open browser console (F12) and look for "Auto-updating from Google Sheets..." logs
- ✅ Google Sheets can take 5-30 seconds to publish changes to CSV

### Graphics aren't showing updated content
- ✅ Auto-update only updates the **stored data**, not what's currently displayed
- ✅ You must click "SHOW" buttons to display the updated content
- ✅ This is intentional - prevents graphics from changing mid-broadcast

### "Failed to load" error
- ✅ Make sure sheet is **published to web** (not just shared)
- ✅ Use the CSV export URL, not the regular sheet URL
- ✅ Check that the sheet has the correct column headers: Type, ID, Primary Text, Secondary Text, Color, Notes

---

## 📞 Support
For issues or questions, contact **James Watson**

**Made available by James Watson**

