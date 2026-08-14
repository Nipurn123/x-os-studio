# Technical Specification (SPEC)

## Project: X-OS Studio Mobile Responsive Architecture

**Status**: Approved / Ready for Implementation  
**Version**: 1.0.0  
**Date**: August 14, 2026  
**Architecture**: Responsive Breakpoints (Mobile `< 640px`, Tablet `< 1024px`, Desktop `≥ 1024px`), Dynamic Viewport Units (`100dvh`), iOS Bottom Sheet Modal Architecture  

---

## 1. Viewport & Layout Architecture

```
+-----------------------------------------------------------+
| MacTopBar (h-8/h-7) - Clean Minimal Status + Ask AI       |
+-----------------------------------------------------------+
| Main Window Container (flex-1, p-1 sm:p-3, h-[100dvh])    |
|                                                           |
|  [Desktop ≥ 1024px]: 3-Column Studio Grid                 |
|  (Sidebar Tree | Code Canvas | Inspector Translation)     |
|                                                           |
|  [Mobile < 1024px]: Segmented View Mode                   |
|  +-----------------------------------------------------+  |
|  | [ 📁 Files ]  [ 💻 Source Code ]  [ 🧠 Meaning ]    |  |
|  +-----------------------------------------------------+  |
|  | Shows Active Selected View with Full Touch Scrolling|  |
|                                                           |
+-----------------------------------------------------------+
| MacDock (Mobile Touch Bar: compact icons + touch-scroll)  |
+-----------------------------------------------------------+
| AIAgentDrawer (Desktop: Right Drawer | Mobile: iOS Sheet) |
+-----------------------------------------------------------+
```

---

## 2. Component Modification Matrix

1. **`src/app/layout.tsx` & `src/app/page.tsx`**:
   - Change main wrapper to `h-[100dvh]` with `p-1 sm:p-3 pb-16 sm:pb-20`.
   - Add mobile segmented sub-tab state for the Decompiler (`mobileDecompilerTab`: `"tree"` | `"code"` | `"inspect"`).
2. **`src/components/macos/MacTopBar.tsx`**:
   - Streamline mobile layout: compact padding, concise logo, right-aligned Ask AI and theme toggle.
3. **`src/components/macos/MacDock.tsx`**:
   - `overflow-x-auto no-scrollbar` on container.
   - Scale dock icons from `h-10 w-10 sm:h-12 sm:w-12` with touch-friendly active states.
4. **`src/components/agent/AIAgentDrawer.tsx`**:
   - Responsive styling: on mobile (`< 640px`), render as an iOS Bottom Sheet (`inset-x-0 bottom-0 top-10 rounded-t-3xl border-t`).
   - Add native drag handle pill on mobile header.
5. **Apps (`TweetDoctorApp`, `AlgorithmMatrixApp`, `ArchitectureDiagramsApp`)**:
   - Single-column stacked layouts on mobile with fluid touch containers.
   - SVG diagrams wrapped in touch-scrollable horizontal containers with `min-w-[540px]`.

---

## 3. Verification Plan
1. Test mobile viewport rendering using PinchTab / responsive devtools at 375px (iPhone), 414px, and 768px (iPad).
2. Verify iOS Bottom Sheet expand, drag, and dismiss behaviors.
3. Verify segmented Decompiler switcher on mobile screens.
4. Run `bun run build` to ensure 0 type or compiler errors.
5. Commit and redeploy to Google Cloud Run.
