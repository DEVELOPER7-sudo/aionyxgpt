# Visual Animation Examples

## Animation Timeline Visualizations

### 1. Message Blur-In Animation (0.4s)
```
Time:    0ms         100ms        200ms        300ms        400ms
         |           |            |            |            |
Blur:    blur(8px)   blur(5px)    blur(2px)    blur(0.5px)  blur(0)
Opacity: 0%          25%          50%          75%          100%
Scale:   [Same throughout - no scale]

Visual:
0ms:   [████████] ← Very blurry, invisible
100ms: [██████  ] ← Still blurry, fading in
200ms: [████    ] ← Less blurry, more visible
300ms: [██      ] ← Barely blurry, almost there
400ms: [Clear   ] ← Sharp and fully visible ✓
```

### 2. Trigger Bar Collapse/Expand (0.35s)
```
Time:        0ms      100ms     200ms     300ms     350ms
             |        |         |         |         |
Height:      Full     75%       50%       25%       0% (collapse)
             0%       25%       50%       75%       Full (expand)

Blur:        0px      1px       2px       3px       4px (collapse)
             4px      3px       2px       1px       0px (expand)

Opacity:     1.0      0.8       0.6       0.4       0.0 (collapse)
             0.0      0.4       0.6       0.8       1.0 (expand)

Visual:
Collapse:
0ms:   [████████████] Full bar
100ms: [██████      ] 75% visible + slight blur
200ms: [████        ] 50% visible + medium blur
300ms: [██          ] 25% visible + strong blur
350ms: [            ] Collapsed, invisible ✓

Expand:
0ms:   [            ] Hidden, blurred
100ms: [██          ] 25% visible
200ms: [████        ] 50% visible
300ms: [██████      ] 75% visible
350ms: [████████████] Fully expanded ✓
```

### 3. Glow Pulse Animation (1.5s, infinite)
```
Time:        0ms      375ms     750ms     1125ms    1500ms
             |        |         |         |         |
Brightness:  100%     110%      100%      110%      100%
Shadow:      20px     30px      20px      30px      20px
             0.3α     0.6α      0.3α      0.6α      0.3α

Visual (side view of glow):
0ms:   ◯━━━━━ (Small glow)
375ms: ◉━━━━━━━━ (Bright glow, larger)
750ms: ◯━━━━━ (Back to normal)
1125ms: ◉━━━━━━━━ (Bright again)
1500ms: ◯━━━━━ (Cycle repeats) ✓
```

### 4. Thinking Box Pulse-Blur (2s, infinite)
```
Time:        0ms      500ms     1000ms    1500ms    2000ms
             |        |         |         |         |
Blur:        0px      1px       0px       1px       0px
Opacity:     100%     80%       100%      80%       100%

Visual:
0ms:    [Sharp thinking box content] ← Clear
500ms:  [Slightly blurry content  ] ← Subtle blur
1000ms: [Sharp thinking box content] ← Clear again
1500ms: [Slightly blurry content  ] ← Subtle blur
2000ms: [Sharp thinking box content] ✓ (Repeats)
```

### 5. Spin-Blur Effect (0.5s)
```
Time:        0ms      125ms     250ms     375ms     500ms
             |        |         |         |         |
Rotation:    0°       45°       90°       135°      180°
Blur:        blur(4px) blur(2px) blur(1px) blur(0px) blur(0px)
Scale:       0.95     0.975     0.99      0.995     1.0
Opacity:     0%       25%       50%       75%       100%

Visual:
0ms:   ◰ (Rotated, small, blurry, hidden)
125ms: ◳ (45° rotated, less blurry)
250ms: ◲ (90° rotated, clear)
375ms: ◱ (135° rotated, sharp)
500ms: ◱ (180° rotated, fully clear, normal size) ✓
```

---

## State Transition Diagrams

### Trigger Bar States
```
┌─────────────────┐
│  Normal State   │
│  (Expanded)     │
│  - All visible  │
│  - Hover: glow  │
│  - Shadows: lg  │
└────────┬────────┘
         │
         │ Click collapse
         │ duration: 0.35s
         ↓
┌─────────────────┐
│ Collapsed State │
│  - Hidden       │
│  - Blurred out  │
│  - Max-h: 0     │
└────────┬────────┘
         │
         │ Click expand
         │ duration: 0.35s
         ↓
┌─────────────────┐
│  Normal State   │
│  (Back)         │
└─────────────────┘
```

### Message Lifecycle
```
┌─────────────┐
│  Rendering  │ (Message received)
└──────┬──────┘
       │
       │ animate-blur-in (0.4s)
       ↓
┌─────────────────────┐
│  Blurred Appearing  │ (blur: 8px → 0px)
│  (Opacity: 0 → 100%)│
└──────┬──────────────┘
       │
       │ Blur clears
       ↓
┌─────────────────┐
│  Fully Visible  │ (Normal state)
│  - Can hover    │
│  - Responsive   │
│  - Can interact │
└──────┬──────────┘
       │
       │ User hovers
       │ duration: 300ms
       ↓
┌──────────────────────┐
│  Hover State         │
│  - Scaled 1.02x      │
│  - Shadow glow       │
│  - Enhanced visual   │
└─────────────────────┘
```

### Advanced Panel Flow
```
         User clicks "Advanced"
         │
         ↓
    ┌─────────────┐
    │   Closed    │ (Hidden)
    │ - Collapsed │
    │ - Not shown │
    └──────┬──────┘
           │
           │ animate-expand-blur
           │ duration: 0.35s
           │ height: 0 → auto
           │ blur: 4px → 0px
           ↓
    ┌──────────────────┐
    │     Opening      │ (Expanding)
    │ - Content shows  │
    │ - Blur clears    │
    └──────┬───────────┘
           │
           │ Duration ends
           ↓
    ┌──────────────────┐
    │      Open        │ (Fully visible)
    │ - All options    │
    │ - Interactable   │
    │ - Hover effects  │
    └──────┬───────────┘
           │
           │ User clicks "Advanced" again
           │ animate-collapse-blur
           │ duration: 0.35s
           ↓
    ┌─────────────┐
    │   Closed    │ (Back to start)
    └─────────────┘
```

---

## Hover Effect Cascades

### Button Hover Effect (200ms)
```
Idle State:
┌─────────────────────────┐
│       BUTTON            │
│ scale: 1.0              │
│ bg: transparent         │
│ shadow: none            │
│ text-color: default     │
└─────────────────────────┘

Hover At 50ms:
┌─────────────────────────┐
│       BUTTON            │
│ scale: 1.05             │ ← Growing
│ bg: primary/5           │ ← Highlighting
│ shadow: small           │ ← Appearing
│ text-color: primary     │ ← Changing
└─────────────────────────┘

Hover At 100ms:
┌─────────────────────────┐
│        BUTTON           │ ← Larger
│ scale: 1.08             │ ← Growing more
│ bg: primary/8           │ ← Stronger highlight
│ shadow: medium          │ ← Growing glow
│ text-color: primary     │ ← Same as before
└─────────────────────────┘

Hover At 200ms (Final):
┌─────────────────────────┐
│        BUTTON           │ ← Fully hovered
│ scale: 1.10             │ ← 10% larger
│ bg: primary/10          │ ← Full highlight
│ shadow: large           │ ← Strong glow
│ text-color: primary     │ ← Bright
└─────────────────────────┘

Mouse Leave (Reverse):
Returns to Idle State over 200ms
```

### Message Card Hover (300ms)
```
Normal State:
┌────────────────────────────────────┐
│ Your message here                  │
│ scale: 1.0                         │
│ shadow: shadow-lg                  │
│ border: normal                     │
└────────────────────────────────────┘

Hovering (150ms):
┌────────────────────────────────────┐
│ Your message here                  │
│ scale: 1.01                        │ ← Slightly larger
│ shadow: medium glow                │ ← Glowing
│ border: primary/20                 │ ← Highlighting
└────────────────────────────────────┘

Hovering (300ms - Final):
┌────────────────────────────────────┐
│ Your message here                  │
│ scale: 1.02                        │ ← 2% larger
│ shadow: bright primary glow        │ ← Strong glow
│ border: primary/40                 │ ← Bright border
└────────────────────────────────────┘
```

---

## Scroll Behavior Flowchart

### Before Fix (Stuck at Bottom)
```
User Message
    ↓
AI Generates
    ↓
Auto-scroll triggers
    ↓
Chat jumps to bottom ← User can't read messages
    ↓
If user scrolls up...
    ↓
Still auto-scrolls
    ↓
User frustrated ✗
```

### After Fix (User Control)
```
User Message
    ↓
AI Generates
    ↓
Auto-scroll triggers
    ↓
Chat scrolls to bottom smoothly
    ↓
User scrolls up
    ↓
Scroll position STAYS
    ↓
"Scroll to Bottom" button appears ✓
    ↓
User can read messages
    ↓
User clicks button → Smooth scroll ✓
```

---

## Animation Easing Curves

### Ease-Out (Used for Entrances)
```
Progress:
100% │     ╱───
     │   ╱
     │ ╱
  0% └─────
     Time →
     
Effect: Fast start, smooth deceleration
Use: Messages appearing, panels opening
```

### Ease-In (Used for Exits)
```
Progress:
100% │───╲
     │     ╲
     │       ╲
  0% └─────────
     Time →
     
Effect: Slow start, fast end
Use: Closing modals, collapsing panels
```

### Ease-In-Out (Used for Toggle)
```
Progress:
100% │  ╱──╲
     │╱      ╲
     │        ╲
  0% └────────
     Time →
     
Effect: Smooth both directions
Use: Expanding/collapsing content
```

---

## Color Animation Examples

### Border Color Transition
```
Normal:         hover:
blue/20         blue/60
│              │
├─────────────┤ (duration: 300ms)
│              │
┌──────────────┐
│Subtle Border │    Light blue
└──────────────┘
      ↓           (after hover)
┌──────────────┐
│Bright Border │    Dark blue
└──────────────┘
```

### Shadow Color Transition
```
Normal:                  Hover:
shadow-primary/20        shadow-primary/50
│                        │
├────────────────────────┤ (duration: 300ms)
│                        │
Subtle glow         Bright glow
 subtle              pronounced
 hard to see         clearly visible
```

---

## Performance Visualization

### GPU Acceleration ✓
```
Using transform + opacity (GOOD):
┌───────────────────────┐
│ GPU-Accelerated       │ ← Smooth 60fps
│ No layout recalc      │ ← Efficient
│ Composited layer      │ ← Fast
└───────────────────────┘

Not using position/width (AVOIDED):
┌───────────────────────┐
│ CPU-Heavy             │ ← May drop frames
│ Layout recalculation  │ ← Expensive
│ Reflow/repaint        │ ← Slow
└───────────────────────┘
```

### Animation FPS Chart
```
Frame Rate During Animations:

60 fps ├─────┤
       │ ███ │ ← Smooth animations
       │ ███ │ ← No frame drops
       │ ███ │ ← 16.67ms per frame
30 fps ├─────┤
       │ ░░░ │ ← Possible lag
       │ ░░░ │ ← Bad for animation
       └─────┘
    0 fps
Expected: Consistent 60fps ✓
```

---

## Accessibility Features

### Animation Respect for Reduced Motion
```
User sets: Prefers Reduced Motion = ON

Animation Behavior:
Normal:  [animation plays for 0.4s]
Reduced: [instant, no animation]
         [element appears immediately]
         [functional, just less visual flair]

Result: ✓ Accessible to all users
```

### Visual Feedback for Users
```
Normal Vision:
┌──────────────────────┐
│ Clear glow animation │ ← Easy to see
│ Color changes        │ ← Easy to see
└──────────────────────┘

Color Blind:
┌──────────────────────┐
│ Shape changes        │ ← Works
│ Brightness changes   │ ← Works
│ Size changes         │ ← Works
└──────────────────────┘
```

---

## Interactive Timeline

### Complete User Journey

```
1. Chat Opens (0ms)
   ↓
2. User Scrolls (100ms)
   ↓
3. User Types Message (300ms)
   ↓
4. User Clicks Send (500ms)
   Message appears: animate-blur-in (0.4s)
   ↓
5. AI Starts Generating (900ms)
   Thinking box: animate-pulse-blur (∞)
   Loading: animate-glow-pulse (∞)
   ↓
6. User Can Scroll (1100ms)
   ↓
7. AI Sending Response (2000ms)
   Messages appear with blur-in
   ↓
8. Generation Complete (3500ms)
   Loading disappears
   Thinking box complete
   Messages fully visible
   ↓
9. User Hovers Message (3600ms)
   Message scales + glows (300ms)
   ↓
10. User Clicks Advanced (4000ms)
    Panel expands: animate-expand-blur (0.35s)
    ↓
11. User Closes Advanced (4400ms)
    Panel collapses smoothly
    ↓
12. Ready for Next Message (4750ms)
```

---

## Summary

All animations use smooth easing curves and GPU-accelerated transforms for 60fps performance. The visual effects create a polished, professional interface while remaining accessible and performant.

Key principles:
- ✨ Smooth, not jarring
- ⚡ Fast, not sluggish  
- 🎯 Clear feedback
- ♿ Accessible
- 🚀 Performant

