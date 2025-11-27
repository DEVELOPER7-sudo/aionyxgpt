# Modal & Overlay Z-Index Reference Guide

## Quick Reference

Use this guide when creating new modal/overlay components to avoid z-index conflicts.

---

## Z-Index Hierarchy (Tailwind)

```
Layer 4: z-[100]  → Dropdowns, Select menus, Tooltips (top of UI)
Layer 3: z-50     → Dialog/Sheet/Drawer/Alert content (above overlays)
Layer 2: z-40     → Modal overlays/backdrops (behind content)
Layer 1: z-10     → Sticky headers, nested dropdowns
Layer 0: (none)   → Normal document flow
Layer -1: -z-10   → Background elements (Motion background)
```

---

## Component Z-Index Template

### For New Dialog Components

```tsx
const MyOverlay = React.forwardRef<...>(({ className, ...props }, ref) => (
  <MyPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/80",  // ← Always z-40 for overlays
      className,
    )}
    {...props}
  />
));

const MyContent = React.forwardRef<...>(({ className, children, ...props }, ref) => (
  <MyPortal>
    <MyOverlay />
    <MyPrimitive.Content
      ref={ref}
      className={cn(
        "fixed ... z-50 ...",  // ← Always z-50 for content above overlay
        className,
      )}
      {...props}
    >
      {children}
    </MyPrimitive.Content>
  </MyPortal>
));
```

---

## Working Examples

### ✅ Dialog (Correct)
```tsx
DialogOverlay:  z-40  // Backdrop
DialogContent:  z-50  // On top of backdrop
```

### ✅ Sheet (Correct)
```tsx
SheetOverlay:   z-40  // Backdrop
SheetContent:   z-50  // Slides in above backdrop
```

### ✅ Select Dropdown (Correct)
```tsx
SelectContent:  z-[100]  // Above all modals when open
```

### ❌ Wrong Pattern (Don't Use)
```tsx
// Both at same level → Rendering order wins (unpredictable)
Overlay:   z-50
Content:   z-50  // Problem! Which one renders on top?
```

---

## CSS Classes by Use Case

### Overlay/Backdrop
```css
/* Semi-transparent background */
fixed inset-0 z-40 bg-black/50
fixed inset-0 z-40 bg-black/80
```

### Dialog Content
```css
/* Centered dialog */
fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]
```

### Sheet Content
```css
/* Slide-in from side */
fixed z-50 inset-y-0 right-0 h-full w-3/4
```

### Drawer Content
```css
/* Slide-in from bottom */
fixed inset-x-0 bottom-0 z-50
```

### Dropdowns/Popovers (Above Modals)
```css
relative z-[100] max-h-96
```

---

## Common Mistakes

### ❌ Mistake 1: Overlay Blocks Content
```tsx
// WRONG - Both z-50
Overlay: "fixed inset-0 z-50 bg-black/80"
Content: "fixed left-[50%] top-[50%] z-50"
// Result: Overlay on top → black screen
```

### ✅ Fix
```tsx
// CORRECT - Overlay at z-40
Overlay: "fixed inset-0 z-40 bg-black/80"
Content: "fixed left-[50%] top-[50%] z-50"
// Result: Content on top → visible
```

---

### ❌ Mistake 2: Nested Modals
```tsx
// WRONG - Can't have z-50 > z-50
Modal1Overlay: z-50
Modal1Content: z-50
  Modal2Overlay: z-50
  Modal2Content: z-50
```

### ✅ Fix
```tsx
// CORRECT - Use hierarchy
Modal1Overlay:   z-40
Modal1Content:   z-50
  Modal2Overlay: z-50
  Modal2Content: z-[100]  // Higher for nested
```

---

### ❌ Mistake 3: Conflicting Dropdowns
```tsx
// WRONG - Dropdown hidden behind modal
Modal: z-50
SelectDropdown: z-50  // Same level!
```

### ✅ Fix
```tsx
// CORRECT - Dropdown above everything
Modal: z-50
SelectDropdown: z-[100]  // Always above modals
```

---

## Implementation Checklist

When creating a new modal/overlay component:

- [ ] Overlay uses `z-40`
- [ ] Content uses `z-50`
- [ ] Overlay has `bg-black/XX` for dimming
- [ ] Content can receive `className` prop
- [ ] Nested elements don't override z-index
- [ ] Close button is interactive (not blocked)
- [ ] Works with other modals (no conflicts)

---

## Files Using This Pattern

✅ **Correct implementations:**
- `src/components/ui/dialog.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/TriggerTagGuide.tsx`

---

## Related Documentation

- [CSS Z-Index MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
- [Radix UI Dialog Docs](https://www.radix-ui.com/docs/primitives/components/dialog)
- [Tailwind Z-Index](https://tailwindcss.com/docs/z-index)

---

## Questions?

If experiencing z-index issues:

1. Check if both overlay and content have same z-index
2. Verify overlay is `z-40` (not z-50)
3. Verify content is `z-50` (not same as overlay)
4. Check for nested stacking contexts
5. Use browser DevTools to inspect actual z-index values
6. Check if parent element has `position` property set

Common debugging:
```css
/* Temporarily highlight to debug */
.modal-overlay { outline: 5px solid red !important; }
.modal-content { outline: 5px solid blue !important; }
/* Blue should appear on top */
```
