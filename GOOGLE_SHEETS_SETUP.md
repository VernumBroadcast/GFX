# Google Sheets Template Setup for Vernum Media GFX Package

## 📊 Quick Setup Guide

### Step 1: Import the Template CSV
1. Open Google Sheets
2. Go to **File → Import**
3. Upload the `L3_TEMPLATE.csv` file
4. Select **"Replace spreadsheet"** or **"Insert new sheet"**

### Step 2: Customize Your L3 Data
The template includes 5 slots with the following columns:
- **Slot**: The L3 slot number (1-5)
- **Primary Text**: Name or main text (top box)
- **Secondary Text**: Title or subtitle (bottom box)
- **Primary Color**: Text color for top box (default: #ffffff)
- **Secondary Color**: Background color for bottom box (default: #dc3545 - Vernum Red)
- **Notes**: Internal notes/reminders

### Step 3: Share for Web Access
1. Click **File → Share → Publish to web**
2. Select **Entire Document** or just your L3 sheet
3. Choose **Comma-separated values (.csv)**
4. Copy the published URL

### Step 4: Connect to GFX Package
1. Open `control.html`
2. Go to **"Data Source"** tab
3. Paste the Google Sheets CSV URL
4. Click **"Load Data"**

---

## 📝 Template Example

| Slot | Primary Text    | Secondary Text      | Primary Color | Secondary Color | Notes                      |
|------|----------------|---------------------|---------------|-----------------|----------------------------|
| 1    | John Smith     | Sports Reporter     | #ffffff       | #dc3545         | Example L3 for sports      |
| 2    | Jane Doe       | Weather Anchor      | #ffffff       | #dc3545         | Example L3 for weather     |
| 3    | Breaking News  | Live Coverage       | #ffffff       | #dc3545         | Example L3 for breaking    |
| 4    | Coming Up Next | Special Report      | #ffffff       | #dc3545         | Example L3 for upcoming    |
| 5    | On Location    | Downtown Studio     | #ffffff       | #dc3545         | Example L3 for location    |

---

## 🔗 Link L3 Slots 2-5 to Google Sheets

### Method 1: Manual Entry
1. Switch to the desired L3 slot (2-5) using the dropdown
2. Enter the Primary and Secondary text from your Google Sheet
3. Click **"SAVE SLOT"**
4. Repeat for each slot

### Method 2: Auto-Load from CSV (if implemented)
1. Ensure your Google Sheet is published as CSV
2. In the **Data Source** tab, enter your sheet URL
3. Click **"Load Data"** - this will auto-populate slots 1-5

---

## 🎨 Color Customization
You can override colors per L3 slot:
- **Default red**: `#dc3545` (Vernum Media brand red)
- **Alternative colors**: 
  - Blue: `#007bff`
  - Green: `#28a745`
  - Orange: `#fd7e14`
  - Purple: `#6f42c1`

---

## 💡 Tips
- Keep Primary Text short (names, locations)
- Use Secondary Text for titles/descriptions
- Test each L3 slot using the Preview before going live
- Use the **Quick Actions** dropdown to switch between saved L3s quickly

---

## 🚀 VMix Integration
Once your L3s are loaded:
1. Copy the **VMix URL** from the Transmit section
2. In VMix, add an **"Input → Web Browser"**
3. Paste the URL
4. Set **Width: 1920, Height: 1080**
5. Enable **"Transparent Background"**
6. Control graphics from `control.html`

---

## 📞 Support
For issues or questions, contact **James Watson**

