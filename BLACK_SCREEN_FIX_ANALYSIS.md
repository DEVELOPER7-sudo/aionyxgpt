# Black Screen Bug Fix - Complete Analysis

## Summary
Fixed critical z-index layering bug causing black screen when opening trigger bar/gallery dialogs. The issue was present in **all modal/overlay components** due to improper CSS z-index stacking context.

**Commit:** `e72dd84`

---

## Problem Description

When users opened the Trigger Gallery or any dialog, they would see a completely black screen instead of the modal content. This was caused by overlay elements rendering on top of content elements due to equal or greater z-index values.

### Visual Issue
```
❌ BEFORE FIX:
[Overlay (z-50, 80% opacity) visible on top]
  └─ Content (z-50, hidden behind overlay)

✅ AFTER FIX:
[Content (z-50) visible]
  └─ Overlay (z-40, behind content)
```

---

## Root Cause Analysis

### Issue 1: Dialog Component
**File:** `src/components/ui/dialog.tsx`
- **DialogOverlay:** `z-50` + `bg-black/80`
- **DialogContent:** `z-50`
- **Problem:** Same z-index level → rendering order decides visibility (overlay on top)
- **Fix:** Changed DialogOverlay to `z-40`

### Issue 2: Sheet Component  
**File:** `src/components/ui/sheet.tsx`
- **SheetOverlay:** `z-50` + `bg-black/80`
- **SheetContent:** `z-50`
- **Problem:** Same z-index level → overlay blocks content
- **Fix:** Changed SheetOverlay to `z-40`

### Issue 3: Drawer Component
**File:** `src/components/ui/drawer.tsx`
- **DrawerOverlay:** `z-50` + `bg-black/80`
- **DrawerContent:** `z-50`
- **Problem:** Same z-index level → overlay blocks content
- **Fix:** Changed DrawerOverlay to `z-40`

### Issue 4: AlertDialog Component
**File:** `src/components/ui/alert-dialog.tsx`
- **AlertDialogOverlay:** `z-50` + `bg-black/80`
- **AlertDialogContent:** `z-50`
- **Problem:** Same z-index level → overlay blocks content
- **Fix:** Changed AlertDialogOverlay to `z-40`

### Issue 5: TriggerTagGuide Component
**File:** `src/components/TriggerTagGuide.tsx`
- **Overlay div:** `z-50` + `bg-black/50`
- **Card (content):** No explicit z-index
- **Problem:** Overlay has higher z-index → card hidden behind it
- **Fix:** 
  - Changed overlay to `z-40`
  - Added `relative z-50` to Card component

---

## Technical Details

### CSS Z-Index Stacking Context

Z-index only works within the same stacking context. All modals use the same `position: fixed` + z-index approach.

**Proper Hierarchy:**
```
z-100: Select dropdowns, Tooltips (above all modals)
z-50:  Dialog/Sheet/Drawer/AlertDialog content (visible modals)
z-40:  Modal overlays (behind content, semi-transparent)
z-10:  Sticky headers within modals
z-0:   Default/Normal content
-z-10: Background elements (MotionBackground)
```

### Why This Works

When elements have different z-index values in the same stacking context:
- Higher z-index renders on top
- `z-50 > z-40` means content appears above overlay
- Overlay provides visual dimming without blocking interaction

---

## Files Changed

### 1. `src/components/ui/dialog.tsx`
```tsx
// BEFORE
DialogOverlay: "fixed inset-0 z-50 bg-black/80"
DialogContent: "fixed left-[50%] top-[50%] z-50"

// AFTER
DialogOverlay: "fixed inset-0 z-40 bg-black/80"  // Changed z-50 → z-40
DialogContent: "fixed left-[50%] top-[50%] z-50"  // Unchanged
```

### 2. `src/components/ui/sheet.tsx`
```tsx
// BEFORE
SheetOverlay: "fixed inset-0 z-50 bg-black/80"
SheetContent: "fixed z-50"

// AFTER
SheetOverlay: "fixed inset-0 z-40 bg-black/80"  // Changed z-50 → z-40
SheetContent: "fixed z-50"                        // Unchanged
```

### 3. `src/components/ui/drawer.tsx`
```tsx
// BEFORE
DrawerOverlay: "fixed inset-0 z-50 bg-black/80"
DrawerContent: "fixed inset-x-0 bottom-0 z-50"

// AFTER
DrawerOverlay: "fixed inset-0 z-40 bg-black/80"  // Changed z-50 → z-40
DrawerContent: "fixed inset-x-0 bottom-0 z-50"   // Unchanged
```

### 4. `src/components/ui/alert-dialog.tsx`
```tsx
// BEFORE
AlertDialogOverlay: "fixed inset-0 z-50 bg-black/80"
AlertDialogContent: "fixed left-[50%] top-[50%] z-50"

// AFTER
AlertDialogOverlay: "fixed inset-0 z-40 bg-black/80"  // Changed z-50 → z-40
AlertDialogContent: "fixed left-[50%] top-[50%] z-50" // Unchanged
```

### 5. `src/components/TriggerTagGuide.tsx`
```tsx
// BEFORE
<div className="fixed inset-0 z-50 ...">  {/* Overlay */}
  <Card className="...">                   {/* Content - no z-index */}

// AFTER
<div className="fixed inset-0 z-40 ...">  {/* Changed z-50 → z-40 */}
  <Card className="... relative z-50">    {/* Added relative z-50 */}
```

---

## Testing Checklist

- [x] Build completes without errors
- [x] Dialog opens and content is visible (not black screen)
- [x] Sheet opens and content is visible
- [x] Drawer opens and content is visible
- [x] Alert dialogs work correctly
- [x] TriggerTagGuide displays properly
- [x] Overlay provides visual dimming effect
- [x] Close buttons functional
- [x] Content is interactive (not blocked by overlay)
- [x] Z-index hierarchy maintained across all components

---

## Impact

**Severity:** Critical (blocks core functionality)
**Affected Features:**
- Trigger Gallery dialog
- Settings panels
- All modal dialogs
- Sheet navigation
- Alert confirmations
- Drawer menus

**Fix Scope:** UI Components only (no logic changes)
**Performance Impact:** None (CSS property change only)
**Breaking Changes:** None

---

## Related Issues

The black screen issue was also exacerbated by:
1. Dark theme with `--background: 0 0% 0%` (pure black)
2. Semi-transparent overlays (`bg-black/80`) at same z-level
3. No explicit z-index on nested content

These are now properly handled with correct z-index stacking.

---

## Prevention

To prevent similar issues in future:
1. Always use `z-40` for overlays (Radix Dialog Primitive standard)
2. Always use `z-50` for modal content above overlays
3. Use `z-[100]` for dropdowns/tooltips (highest in modals)
4. Document z-index hierarchy in component comments
5. Test modal components during development

---

## Verification

```bash
# Build verification
npm run build  # ✓ Success

# Git verification
git show e72dd84  # Shows all 5 file changes
```

All fixes verified and deployed to main branch.
