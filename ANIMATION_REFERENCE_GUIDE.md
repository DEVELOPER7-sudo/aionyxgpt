# Animation Reference Guide

## Quick Lookup

### All New Animation Classes

| Class | Duration | Effect | Use Case |
|-------|----------|--------|----------|
| `animate-blur-in` | 0.4s | Fades in with blur clearing | Messages entering |
| `animate-blur-out` | 0.3s | Fades out with blur | Modals closing |
| `animate-spin-blur` | 0.5s | 180° rotate + blur | Special reveals |
| `animate-collapse-blur` | 0.35s | Height collapse + blur | Content hiding |
| `animate-expand-blur` | 0.35s | Height expand + blur | Content showing |
| `animate-pulse-blur` | 2s ∞ | Subtle blur pulse | Loading/thinking |
| `animate-glow-pulse` | 1.5s ∞ | Brightness + shadow pulse | Active states |

### Existing Animations (Still Used)

| Class | Use Case |
|-------|----------|
| `animate-bounce-in` | Messages appear initially |
| `animate-float` | Brain emoji in thinking box |
| `animate-pulse` | Status text while streaming |
| `animate-slide-in-left` | AI messages |
| `animate-slide-in-right` | User messages |
| `animate-scale-in` | Image previews, modals |
| `animate-fade-in` | General fade effects |

---

## Component Animation Breakdown

### TriggerBar Component

```
User clicks collapse button
    ↓
Bar collapses: animate-collapse-blur
    ↓
Content fades with blur effect (0.35s)
    ↓
Bar is hidden
```

```
User clicks expand button
    ↓
Bar expands: animate-expand-blur
    ↓
Content fades in from blur (0.35s)
    ↓
Triggers show with hover effects
```

**Trigger Badges:**
- Normal: Static
- Hover: `scale-105` + `shadow-blue-500/50` + `-translate-y-1`
- Expanded: Chevron rotates down

**Expandable Content:**
- Uses `animate-expand-blur`
- Details have `hover:pl-2` indent animation
- Borders highlight: `hover:border-primary/50`

---

### ChatArea Component

#### Message Flow

```
AI sends message
    ↓
Message appears: animate-blur-in
    ↓
Message card visible with shadow effects
    ↓
User can hover: scale + shadow enhancement
```

#### Thinking Box (When AI Reasons)

```
<think> tag detected
    ↓
Thinking box appears with animate-pulse-blur (if still streaming)
    ↓
Brain emoji: animate-float
    ↓
Status text: "🔄 Streaming..." with animate-pulse
    ↓
User clicks to expand
    ↓
Content expands: animate-expand-blur + overflow-hidden
    ↓
Chevron rotates 180°
    ↓
User clicks collapse
    ↓
Content collapses
```

#### Loading Indicator

```
User sends message
    ↓
Loading appears: animate-bounce-in
    ↓
Container: animate-glow-pulse (continuous)
    ↓
Border glows with primary color
    ↓
Stop button: hover:scale-105
    ↓
Message completed
    ↓
Loading disappears (fade out)
```

#### Scroll Behavior (Fixed!)

```
User scrolls up: userHasScrolled = true
    ↓
Scroll to bottom button appears: animate-bounce-in
    ↓
AI generating response: Doesn't force scroll to bottom
    ↓
User can read middle messages while AI generates
    ↓
User clicks "Scroll to Bottom" button
    ↓
Smooth scroll to bottom: scrollIntoView({ behavior: 'smooth' })
    ↓
Button disappears
```

#### Image Upload Preview

```
User selects image
    ↓
Preview appears: animate-scale-in
    ↓
Image: border-primary/40 → hover:border-primary/80
    ↓
Close button: absolute, hover:scale-110
    ↓
User clicks close
    ↓
Preview fades out
```

#### Advanced Options

```
User clicks "Advanced" button
    ↓
Button styling changes: border-primary/60 bg-primary/5
    ↓
Icon rotates 180°: rotate-180
    ↓
Panel appears: animate-expand-blur
    ↓
Panel has: backdrop-blur-sm + shadow-primary/10
    ↓
Options have hover effects: hover:bg-primary/5
    ↓
User clicks "Advanced" again
    ↓
Panel closes: animate-collapse-blur
    ↓
Button returns to normal state
```

---

## Hover Animation States

### Trigger Badges
```css
/* Normal */
transition-all duration-300

/* On Hover */
scale-105         /* Grows 5% */
-translate-y-1    /* Moves up slightly */
hover:shadow-lg
hover:shadow-blue-500/50  /* Glowing shadow */
```

### Message Cards
```css
/* User Messages */
hover:scale-[1.02]         /* Grows 2% */
hover:shadow-primary/50    /* Colored shadow */

/* Assistant Messages */
hover:border-primary/30    /* Border color change */
hover:shadow-primary/20    /* Subtle shadow */
```

### Input Buttons
```css
/* Paperclip, Mic */
hover:scale-110           /* 10% grow */
hover:bg-primary/10       /* Background highlight */
hover:text-primary        /* Text color highlight */
transition-all duration-300

/* Send Button */
hover:scale-110
hover:shadow-lg hover:shadow-primary/50
```

---

## Timing Reference

### Fast Animations (Used for user feedback)
- 200ms: Button hover states
- 300ms: Trigger transitions, message hover effects

### Medium Animations (Used for reveals)
- 0.35s: Collapse/expand content
- 0.4s: Blur-in effects
- 0.5s: Spin-blur special effects

### Slow Animations (Continuous/background)
- 1.5s: Glow pulse (loading)
- 2s: Pulse blur (thinking)
- 6s: Float effect (emoji)

### Infinite Animations
- `animate-pulse`: Text blinking (thinking)
- `animate-float`: Brain emoji bobbing
- `animate-glow-pulse`: Loading glow
- `animate-pulse-blur`: Thinking box blur

---

## Easing Functions Used

| Function | Feel | Use Case |
|----------|------|----------|
| `ease-out` | Decelerating | Entrances, reveals |
| `ease-in` | Accelerating | Exits, collapses |
| `ease-in-out` | Natural curve | Expand/collapse smooth |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy | Scale-in springy feel |

---

## Code Examples

### Using Blur-In Animation

```tsx
<div className="animate-blur-in">
  {/* This element fades in with blur clearing */}
</div>
```

### Using Expand Blur

```tsx
<div className="animate-expand-blur overflow-hidden">
  {/* Expands from 0 height with blur effect */}
</div>
```

### Using Glow Pulse

```tsx
<div className="animate-glow-pulse">
  {/* Pulses with brightness and shadow */}
</div>
```

### Conditional Animation

```tsx
<div className={cn(
  "transition-all duration-300",
  isExpanded && "rotate-180"
)}>
  Chevron
</div>
```

---

## Performance Tips

✅ **DO:**
- Use CSS animations (GPU accelerated)
- Keep durations short (< 1s for user feedback)
- Use transform + opacity for smoothest performance
- Combine related animations

❌ **DON'T:**
- Animate position (use transform instead)
- Animate width/height (use clip-path or max-height with overflow-hidden)
- Create infinite animations that affect layout
- Use blur excessively on large elements

---

## Accessibility Notes

- All animations respect `prefers-reduced-motion`
- Animations are non-essential (UI still functional without them)
- Loading states clearly indicate progress
- No flashing animations that could trigger seizures
- Sufficient contrast maintained in all states

---

## Browser Support

| Feature | Support |
|---------|---------|
| `filter: blur()` | IE 10+, All modern browsers |
| `@keyframes` | All modern browsers |
| `transform` | All modern browsers |
| `transition` | All modern browsers |

Minimum browser versions: Chrome 18+, Firefox 16+, Safari 9+, Edge 12+

