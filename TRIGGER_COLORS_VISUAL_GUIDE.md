# Trigger Bar Colors - Visual Guide

## Color Palette Overview

### 🧩 Reasoning & Analysis
- **Category**: Problem-solving, logical thinking, step-by-step analysis
- **Primary Color**: Blue (#3b82f6)
- **Badge Background**: `bg-blue-500/15` (15% opacity)
- **Badge Text**: `text-blue-700` (light mode) / `text-blue-400` (dark mode)
- **Border Color**: `border-blue-500/40`
- **Hover State**: `bg-blue-500/25`
- **Card Gradient**: Light blue gradient (12% to 6% opacity)
- **Left Border**: Solid #3b82f6

**Use Case**: Detected when users ask for analysis, comparisons, logic puzzles, algorithm explanations, debugging help, decision-making frameworks.

---

### 🔍 Research & Information
- **Category**: Data gathering, fact-checking, research, knowledge synthesis
- **Primary Color**: Emerald/Green (#10b981)
- **Badge Background**: `bg-emerald-500/15` (15% opacity)
- **Badge Text**: `text-emerald-700` (light mode) / `text-emerald-400` (dark mode)
- **Border Color**: `border-emerald-500/40`
- **Hover State**: `bg-emerald-500/25`
- **Card Gradient**: Light green gradient (12% to 6% opacity)
- **Left Border**: Solid #10b981

**Use Case**: Detected when users ask for research, information gathering, fact verification, statistics, citing sources, comprehensive reviews.

---

### 📋 Planning & Organization
- **Category**: Project planning, task management, scheduling, organization
- **Primary Color**: Violet/Purple (#a855f7)
- **Badge Background**: `bg-violet-500/15` (15% opacity)
- **Badge Text**: `text-violet-700` (light mode) / `text-violet-400` (dark mode)
- **Border Color**: `border-violet-500/40`
- **Hover State**: `bg-violet-500/25`
- **Card Gradient**: Light violet gradient (12% to 6% opacity)
- **Left Border**: Solid #a855f7

**Use Case**: Detected when users ask for planning, organization, roadmaps, timelines, project breakdowns, prioritization, workflow design.

---

### ✨ Communication & Style
- **Category**: Writing, communication, tone adjustment, presentation
- **Primary Color**: Amber/Orange (#f97316)
- **Badge Background**: `bg-amber-500/15` (15% opacity)
- **Badge Text**: `text-amber-700` (light mode) / `text-amber-400` (dark mode)
- **Border Color**: `border-amber-500/40`
- **Hover State**: `bg-amber-500/25`
- **Card Gradient**: Light orange gradient (12% to 6% opacity)
- **Left Border**: Solid #f97316

**Use Case**: Detected when users ask for writing assistance, tone adjustment, style improvements, communication templates, presentation skills.

---

### 🎯 Default/Other
- **Category**: Fallback for triggers that don't fit above categories
- **Primary Color**: Slate/Gray (#6b7280)
- **Badge Background**: `bg-slate-500/15` (15% opacity)
- **Badge Text**: `text-slate-700` (light mode) / `text-slate-400` (dark mode)
- **Border Color**: `border-slate-500/40`
- **Hover State**: `bg-slate-500/25`
- **Card Gradient**: Light gray gradient (12% to 6% opacity)
- **Left Border**: Solid #6b7280

**Use Case**: General-purpose triggers that don't fit specific categories.

---

## Color Design Principles

### Why These Colors?

1. **Semantic Association**
   - Blue = Analytical/Logical (traditional analytical color)
   - Green/Emerald = Growth/Knowledge/Research
   - Purple = Creativity/Organization
   - Orange/Amber = Communication/Warmth

2. **Accessibility**
   - All colors meet WCAG AA contrast requirements
   - Work well in both light and dark modes
   - Distinguishable from one another for color-blind users

3. **Subtle Yet Visible**
   - Using 15% opacity for badges prevents overwhelming the interface
   - Hover state at 25% provides clear interaction feedback
   - Card backgrounds use 12% to 6% gradients for depth

4. **Visual Hierarchy**
   - Darker text on light backgrounds
   - Lighter text on dark backgrounds
   - Left border provides strong accent without overwhelming
   - Shadow adds depth and separation

---

## Component Structure

### Badge (Collapsed Trigger)
```
┌─────────────────────────────────┐
│ 🧩 Trigger Name           ▼    │  ← Chevron indicates expandable
└─────────────────────────────────┘
  ▲                           ▲
  └─ Icon (category emoji)    └─ Hover: Scale 105%, Translate -1px up
     Text color matches category
     Border 1px solid category color
     Background semi-transparent category color
```

### Expanded Card
```
┌─────────────────────────────────┐
│ Category: Reasoning & Analysis  │  ← Dark mode: lighter text
├─────────────────────────────────┤  ← Subtle gradient background
│ Purpose: ...                    │  ← 4px left border in category color
│ Context Used: ...              │
│ Influence Scope: ...           │
│ Tagged Content Preview: ...    │
│ System Instruction: ...        │
└─────────────────────────────────┘
  ▲
  └─ Left border solid category color
```

---

## Dark Mode Support

All colors include explicit dark mode variants:
- `text-blue-700 dark:text-blue-400`
- `text-emerald-700 dark:text-emerald-400`
- `text-violet-700 dark:text-violet-400`
- `text-amber-700 dark:text-amber-400`
- `text-slate-700 dark:text-slate-400`

This ensures proper contrast in both light and dark themes.

---

## Responsive Behavior

### Desktop
- Triggers display in a horizontal wrap layout
- Full-width card details on expand
- Smooth transitions on hover

### Tablet
- Same layout, optimized spacing
- Touch-friendly hover states

### Mobile
- Triggers stack vertically if needed
- Full-width cards for readability
- Touch-optimized interactions

---

## Animation Details

### Badge Hover
```css
transition: all 300ms
transform: scale(1.05) translateY(-4px)
```

### Card Expand/Collapse
```css
animation: slide-down 300ms ease-out
```

### Shadow Effects
```css
box-shadow: 0 10px 25px -5px rgba(color, 0.15)
```

---

## Future Customization

Users can customize colors via Settings:
1. Pick primary color for each category
2. Auto-calculate accent colors
3. Save preferences to localStorage
4. Apply to all future trigger displays

---

## Performance Notes

- Colors are computed once per component render
- No animation jank from frequent recomputes
- Gradients use CSS linear-gradient (hardware accelerated)
- Shadow effects use box-shadow (optimized)

---

## Browser Support

All color features tested on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## Accessibility Checklist

- [x] WCAG AA contrast ratio (4.5:1 minimum for text)
- [x] Color-blind safe palette (checked with Colorblind app)
- [x] Dark mode variants provided
- [x] Semantic HTML with proper ARIA labels
- [x] Focus states for keyboard navigation
- [x] Touch targets at least 44x44 pixels

