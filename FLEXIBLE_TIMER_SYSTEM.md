# 🎯 Flexible Timer System

## Overview

The Vernum Media GFX Package now features a **flexible timer system** that allows ANY corner bug to display either **text** OR a **clock/countdown/stopwatch**!

## ✨ What Changed

### Before:
- ❌ Timer was locked to bottom-right position only
- ❌ Bottom-right bug couldn't display text
- ❌ Top bugs were text-only

### After:
- ✅ **3 Corner Bugs**: Top-Left, Top-Right, Bottom-Right
- ✅ **Any bug can be TEXT or TIMER**
- ✅ **One Timer/Clock Control** - select which bug shows the timer
- ✅ **Bottom-right bug can now show text** like the others

## 🎮 How to Use

### Text Bugs (All Three Positions)

1. Go to the **Corner Bugs** tab
2. For each bug (Top-Left, Top-Right, Bottom-Right):
   - Enter your text (e.g., "LIVE", "PREVIOUSLY", "COMING UP NEXT")
   - Choose background color
   - Click **Show Bug** to display it
   - Click **Hide Bug** to remove it

### Timer/Clock (On Any Position)

1. Go to the **Corner Bugs** tab
2. Scroll to **⏰ Timer/Clock Control** section
3. Select **Timer Position** (Top-Left, Top-Right, or Bottom-Right)
4. Choose **Timer Type**:
   - **None (Text Mode)** - Bug shows text instead
   - **Live Clock** - Current time of day
   - **Countdown to Time** - Count down to a specific time today
   - **Stopwatch** - Count up from zero
   - **Countdown from Duration** - Count down from X minutes
5. Choose **Display Format**:
   - `HH:MM` - Hours and minutes (e.g., 02:30)
   - `HH:MM:SS` - Hours, minutes, seconds (e.g., 02:30:45)
   - `MM:SS` - Minutes and seconds (e.g., 30:45)
   - `HH:MM:SS.000` - With milliseconds (e.g., 02:30:45.123)
   - `MM:SS.000` - Minutes, seconds, milliseconds (e.g., 30:45.123)
   - `SS.000` - Seconds and milliseconds only (e.g., 45.123)
6. Add an optional **Label** (e.g., "TIME REMAINING", "LIVE TIME")
7. Choose **Background Color**
8. Click **Start Timer** to show it

### Quick Actions (Top Bar)

The Quick Actions buttons work with the current text settings:
- **LEFT** - Shows/Hides top-left bug (as text)
- **RIGHT** - Shows/Hides top-right bug (as text)
- **⏰** - Starts the timer at the selected position

## 🎯 Use Cases

### Example 1: Live Broadcast
- **Top-Left**: "LIVE" text bug (red)
- **Top-Right**: "PREVIOUSLY" text bug (red)
- **Bottom-Right**: Live clock showing current time (HH:MM format)

### Example 2: Countdown Event
- **Top-Left**: "BREAKING NEWS" text bug
- **Top-Right**: Live clock (HH:MM:SS)
- **Bottom-Right**: Event name text bug

### Example 3: Timed Segment
- **Top-Left**: "INTERVIEW" text bug
- **Top-Right**: Countdown timer (MM:SS) showing time remaining
- **Bottom-Right**: Empty (hidden)

### Example 4: Stopwatch
- **Top-Left**: "RACE IN PROGRESS" text bug
- **Bottom-Right**: Stopwatch (HH:MM:SS.000) for precise timing
- **Top-Right**: Empty (hidden)

## 🔧 Technical Details

### Under the Hood:
- Each bug tracks its **mode** (text or timer) independently
- Only **one timer can be active** at a time
- Starting a timer on a new position **automatically stops** any existing timer
- Hiding a bug with an active timer **stops the timer**
- **Hide All** button stops timer and hides all bugs

### State Management:
- Bug text settings are saved separately for each position
- Timer settings include the selected position
- When you switch timer positions, the previous bug returns to text mode

### Animations:
- All bugs use the same smooth fade-in/fade-out animations
- Timer updates happen in real-time without re-triggering animations
- Millisecond precision timers update every 10ms for smooth display

## 💡 Tips

1. **Default Time Display**: Bottom-right timer defaults to showing current time (HH:MM)
2. **Default Bug Text**: Top-left defaults to "LIVE", top-right to "PREVIOUSLY"
3. **Clock/Timer Tab**: Use this to control which position shows the timer
4. **Master Control**: The "Hide All" button stops timers and hides all bugs
5. **Font Selection**: Fonts from the Styling tab apply to all bugs and timers

## 📋 Quick Reference

| Position | Text Control | Timer Control |
|----------|--------------|---------------|
| Top-Left | "Top Left Bug" section | Timer Position = "Top Left Bug" |
| Top-Right | "Top Right Bug" section | Timer Position = "Top Right Bug" |
| Bottom-Right | "Bottom Right Bug" section | Timer Position = "Bottom Right Bug" |

## 🎬 Workflow Example

**Setting up a live show with countdown:**

1. Configure all three bugs as text in the Corner Bugs tab
2. Show top-left "LIVE" bug
3. Show top-right with show name
4. In Timer/Clock Control:
   - Select "Bottom Right Bug" as position
   - Choose "Countdown from Duration"
   - Set duration to 10 minutes
   - Add label "TIME REMAINING"
   - Click "Start Timer"
5. Now you have two text bugs + one countdown timer!

**Switching timer position mid-show:**

1. In Timer/Clock Control, change position to "Top Right Bug"
2. Click "Start Timer"
3. The timer moves to top-right, and the old position returns to showing text!

---

**Made available by James Watson**  
**Vernum Media GFX Package** 🎬

