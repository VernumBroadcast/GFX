# ⚡ Quick Start: Flexible Timer System

## 🎯 What You Can Do Now

**Every corner bug can be EITHER:**
- 📝 **Text** (like "LIVE", "BREAKING NEWS", "COMING UP NEXT")
- ⏰ **Timer/Clock** (live clock, countdown, stopwatch)

---

## 🎮 5-Minute Tutorial

### Step 1: Show Text Bugs

Open `control.html` → Go to **Corner Bugs** tab:

**Top Left Bug:**
```
Text: LIVE
Background: Red (#dc3545)
[Show Bug] ← Click this
```
✅ Top-left corner now shows "LIVE" in red!

**Top Right Bug:**
```
Text: PREVIOUSLY
Background: Red (#dc3545)
[Show Bug] ← Click this
```
✅ Top-right corner now shows "PREVIOUSLY" in red!

**Bottom Right Bug:**
```
Text: COMING UP NEXT
Background: Red (#dc3545)
[Show Bug] ← Click this
```
✅ Bottom-right corner now shows "COMING UP NEXT" in red!

---

### Step 2: Turn One Bug Into a Timer

Scroll down to **⏰ Timer/Clock Control**:

```
Timer Position: [Bottom Right Bug ▼]  ← Select where timer goes
Timer Type: [Live Clock (Time of Day) ▼]
Display Format: [HH:MM (Hours, Minutes) ▼]
Label: TIME  ← Optional
Background Color: [Red]

[Start Timer] ← Click this!
```

**What happens:**
- ❌ "COMING UP NEXT" text disappears
- ✅ Live clock appears in bottom-right (e.g., "14:32")

---

### Step 3: Move the Timer

**Change position:**
```
Timer Position: [Top Right Bug ▼]  ← Change to top-right
[Start Timer] ← Click again
```

**What happens:**
- ❌ Timer leaves bottom-right
- ✅ "COMING UP NEXT" text comes back to bottom-right!
- ✅ Timer appears on top-right
- ❌ "PREVIOUSLY" text is replaced by timer

**Result:**
- Top-left: "LIVE" (text)
- Top-right: "14:32" (timer)
- Bottom-right: "COMING UP NEXT" (text)

---

### Step 4: Stop Timer, Return to Text

**Option A: Hide the bug entirely**
```
In Corner Bugs tab, find "Top Right Bug"
[Hide Bug] ← Click this
```
✅ Timer stops, top-right is hidden

**Option B: Start a different timer**
```
Timer Position: [Top Left Bug ▼]
Timer Type: [Stopwatch (Count Up) ▼]
Display Format: [HH:MM:SS ▼]
[Start Timer]
```
✅ Old timer stops automatically
✅ New stopwatch starts on top-left
✅ Top-right returns to showing "PREVIOUSLY" text!

---

## 💡 Common Scenarios

### Scenario 1: Live Show with Clock
```
Top-Left:     "LIVE" (text, red)
Top-Right:    "SPORTS TONIGHT" (text, blue)
Bottom-Right: 19:30 (clock, timer mode)
```

**Setup:**
1. Set text for top-left and top-right → Show both
2. Timer position = Bottom-right, type = Live Clock, format = HH:MM
3. Start timer

---

### Scenario 2: Countdown Event
```
Top-Left:     "BREAKING NEWS" (text)
Top-Right:    03:45 (countdown timer)
Bottom-Right: Hidden
```

**Setup:**
1. Set top-left text → Show bug
2. Timer position = Top-right, type = Countdown from Duration, duration = 10 minutes
3. Start timer
4. Keep bottom-right hidden

---

### Scenario 3: Race Timing
```
Top-Left:     "RACE IN PROGRESS" (text)
Top-Right:    Hidden
Bottom-Right: 00:02:34.123 (stopwatch with milliseconds)
```

**Setup:**
1. Set top-left text → Show bug
2. Timer position = Bottom-right, type = Stopwatch, format = HH:MM:SS.000
3. Start timer
4. Keep top-right hidden

---

## 🎛️ Quick Actions (Top Bar)

**Buttons:**
```
[LEFT]   → Show top-left as TEXT
[OFF]    → Hide top-left

[RIGHT]  → Show top-right as TEXT  
[OFF]    → Hide top-right

[⏰]     → Start TIMER at selected position
```

**Note:** Quick Actions use your current text settings, NOT timer mode.

---

## 🔄 Switching Timer Position

**Anytime you start a timer:**
1. Old timer stops automatically
2. Old position returns to text mode (if it had text configured)
3. New timer starts at new position

**You can only have ONE timer active at a time.**

---

## ⚙️ Timer Types Explained

| Type | What It Does | Example Use |
|------|--------------|-------------|
| **Live Clock** | Shows current time | "It's currently 14:32" |
| **Countdown to Time** | Counts down to a specific time today | "Show starts at 20:00, currently 19:45" |
| **Stopwatch** | Counts up from 00:00:00 | "Race has been running for 2 minutes" |
| **Countdown from Duration** | Counts down from X minutes | "10 minute break, 7:23 remaining" |

---

## 📐 Display Formats

| Format | Example | Best For |
|--------|---------|----------|
| **HH:MM** | 02:30 | Live clocks, simple countdowns |
| **HH:MM:SS** | 02:30:45 | Most timers, shows seconds |
| **MM:SS** | 30:45 | Short countdowns (< 1 hour) |
| **HH:MM:SS.000** | 02:30:45.123 | Precise race timing |
| **MM:SS.000** | 30:45.123 | Short precise timing |
| **SS.000** | 45.123 | Very short events (< 1 min) |

---

## 🎨 Customization

**Each bug can have:**
- ✅ Custom text
- ✅ Custom background color
- ✅ Custom label (for timer mode)
- ✅ Independent show/hide

**Timer can have:**
- ✅ Optional label above time (e.g., "TIME REMAINING")
- ✅ Custom background color
- ✅ Any of the display formats above

---

## 🆘 Troubleshooting

**Timer not showing?**
- Check Timer Position is set correctly
- Make sure you clicked "Start Timer" (not just "Show Bug")
- Timer Type must NOT be "None (Text Mode)"

**Timer stuck on wrong position?**
- Change Timer Position dropdown
- Click "Start Timer" again (not "Show Bug")
- Old timer will move to new position

**Want text back after showing timer?**
- Either hide the bug entirely
- OR start timer on a different position (text returns automatically)

**Multiple timers showing?**
- Not possible! Only one timer can be active
- If you see multiple, they're text bugs (not actual timers)

**Timer not updating?**
- Click "Pause" then "Start Timer" to restart
- Check that timer type is correct (not "None")
- Make sure display format is supported for your timer type

---

## ✅ Best Practices

1. **Configure text FIRST** for all bugs you might use
2. **Then decide** which one should show the timer
3. **Use Timer/Clock Control** section to enable timer on a position
4. **Use individual bug controls** to hide/show text bugs
5. **Remember:** Starting a timer on a bug replaces its text temporarily

---

## 🎬 Production Workflow

**Before Show:**
```
1. Configure all bug texts (LIVE, show name, coming up text)
2. Test each bug individually (show/hide)
3. Configure timer settings (position, type, format)
4. Test timer (start/pause/reset)
5. Test switching timer between positions
```

**During Show:**
```
1. Use Quick Actions for instant text bugs
2. Use Timer controls to start/stop/switch timer
3. Use Hide All for clean slate
4. Use individual hide buttons for precision
```

---

**Ready to test? Start your HTTP server and open control.html!**

```bash
cd /Users/watson/TLWIG
python3 -m http.server 8080
open http://localhost:8080/control.html
```

🎬 **Happy Broadcasting!**

**Made available by James Watson**  
**Vernum Media GFX Package**

