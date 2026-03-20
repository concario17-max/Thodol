# Yoga Layout Research

## Goal

The requested target desktop behavior is:

- Left panel: `20%`
- Main panel: `60%`
- Right panel: `20%`

When the left panel closes:

- Right panel expands to `40%`
- Main panel shifts left by the amount the left panel released
- Header elements stay pinned to the inner left/right edges of the main panel

This report explains how the current project works, where the current layout logic lives, what blocks the target behavior, and how to implement the new model safely.

## High-Level Architecture

The verse-reading screen is assembled in four layers:

1. Routing and page composition
2. Global UI state
3. Outer shell layout
4. Inner panel and content layout

The key files are:

- `src/App.tsx`
- `src/context/UIContext.tsx`
- `src/components/ui/AppShell.tsx`
- `src/components/Header.tsx`
- `src/components/Sidebar.tsx`
- `src/components/CommentarySidebar.tsx`
- `src/components/ui/SidebarLayout.tsx`
- `src/pages/VerseView.tsx`
- `src/components/verse/SutraContent.tsx`
- `src/components/verse/TranslationSection.tsx`
- `src/components/verse/AudioPlayer.tsx`
- `src/components/ui/SidebarMenu.tsx`

## Current Screen Assembly

### 1. `src/App.tsx`

`MainLayout` determines whether the current route is a verse page:

- `isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/')`

If true, it renders:

- `header={<Header ... />}`
- `sidebar={<Sidebar />}`
- `rightPanel={<CommentarySidebar />}` only when commentary is active

Important detail:

- `App.tsx` does not decide widths.
- It only decides whether each region exists.

### 2. `src/context/UIContext.tsx`

This file owns all open/close state:

- `isSidebarOpen`: mobile left drawer
- `isDesktopSidebarOpen`: desktop left panel
- `activeRightPanel`: mobile right drawer
- `activeDesktopRightPanel`: desktop right panel

Important behaviors:

- Desktop/mobile split happens at `window.innerWidth < 1024`
- Desktop left panel state is persisted in `localStorage`
- Desktop right panel state is persisted in `localStorage`

This means the layout is state-driven, but the state only says open/closed and active panel type. It does not define proportions.

## Current Outer Layout Model

### 3. `src/components/ui/AppShell.tsx`

Current shell structure:

```tsx
<div className="relative flex flex-1 overflow-hidden">
  {sidebar}
  <main className="min-w-0 flex-1 ...">{children}</main>
  {rightPanel}
</div>
```

This is the most important structural fact in the app.

What it means:

- Layout is currently `flex` based, not ratio/grid based
- Left and right panels take their own explicit widths
- Main panel just gets the leftover space with `flex-1`

So the app is currently using:

- `fixed-width left`
- `remaining-width main`
- `fixed-width right`

This is the opposite of the requested target, which is ratio-based.

### 4. `src/components/ui/SidebarLayout.tsx`

This file is the reusable shell for the left sidebar.

Important details:

- Mobile uses `fixed top-16`
- Desktop uses `lg:sticky lg:top-16`
- Width is injected from parent using `widthClass` and `desktopWidthClass`
- Closed desktop state collapses to `lg:w-0 lg:opacity-0`

This component does not know about proportions. It only knows:

- open vs closed
- left vs right
- width classes passed in by parent

## Current Left Panel

### 5. `src/components/Sidebar.tsx`

The left panel currently uses:

- mobile: `w-[88vw] max-w-[360px]`
- desktop: `lg:w-[400px]`

So the left panel is currently:

- not percentage based
- fixed `400px` on desktop

Behavior:

- It reads `isDesktopSidebarOpen` from `UIContext`
- It passes `desktopWidthClass="lg:w-[400px]"` into `SidebarLayout`
- It does navigation and chapter expansion locally

Important implication:

- Your requested `20%` cannot be achieved by tweaking `AppShell` alone
- `Sidebar.tsx` must stop injecting a fixed `400px` desktop width

## Current Right Panel

### 6. `src/components/CommentarySidebar.tsx`

The right panel currently has custom shell logic instead of reusing `SidebarLayout`.

Current desktop width logic:

```tsx
const desktopWidthClass = isDesktopSidebarOpen ? 'lg:w-[400px]' : 'lg:w-[800px]';
```

Meaning:

- left open => right panel `400px`
- left closed => right panel `800px`

This is the current source of many layout distortions.

It creates a layout model of:

- left `400px`
- right `400px` or `800px`
- main gets remainder

That directly conflicts with the desired behavior:

- base: `20 / 60 / 20`
- left closed: `0 / 60 shifted left / 40`

Important implication:

- current right-panel logic is state-coupled to the left panel width
- but it is implemented as hard-coded pixels, not ratios

## Current Header Model

### 7. `src/components/Header.tsx`

Current desktop header alignment:

```tsx
const desktopLeftOffset = showSidebarToggle ? 400 : 0;
const desktopRightOffset = showSidebarToggle ? 400 : 0;
```

Then:

```tsx
style={{
  paddingLeft: `calc(${desktopLeftOffset}px + 1.25rem)`,
  paddingRight: `calc(${desktopRightOffset}px + 1.25rem)`,
}}
```

Meaning:

- Header is not actually aware of current layout geometry
- It simulates alignment using fixed left/right padding
- It assumes left and right side spacing are both `400px`

This currently works only because the layout has been manually coerced to match it.

It will not survive a real `20/60/20` system unless the header is refactored.

### Header Behavior Today

The header currently places:

- left group: menu + icon + title
- right group: commentary toggle + theme toggle

But their placement is based on fixed `paddingLeft` / `paddingRight`, not the real main panel edges.

For the requested design, the header should instead be derived from the same frame geometry as the body.

## Current Main Content Model

### 8. `src/pages/VerseView.tsx`

The main content wrapper is:

```tsx
<div className="mx-auto w-full max-w-[1000px] ...">
```

This means:

- even if the main panel is visually wide
- the actual readable content is capped at `1000px`
- and centered with `mx-auto`

This is why the body can look disconnected from the panel geometry.

### 9. Inner Verse Components

Several inner components also re-impose their own width limits:

- `src/components/verse/SutraContent.tsx`
  - `max-w-3xl mx-auto`
- `src/components/verse/TranslationSection.tsx`
  - `mx-auto max-w-3xl`
- `src/components/verse/AudioPlayer.tsx`
  - `max-w-[400px]`
- `src/components/verse/SutraNavigation.tsx`
  - centered navigation control
- `src/components/verse/SutraHeader.tsx`
  - centered header block

Implication:

- Even after outer panel ratios are changed, inner content may still look centered and narrow
- If the new design wants the main panel itself to visually define the readable column, these inner `max-width` constraints will need review

## Current Sidebar Menu Model

### 10. `src/components/ui/SidebarMenu.tsx`

The left panel content is split vertically like this:

- top section: `h-[30%]`
- bottom section: `flex-1`

This is not directly part of the 20/60/20 layout request, but it matters because:

- the sidebar has its own internal layout assumptions
- when the outer width becomes ratio-based, cramped or overly roomy internals may become more visible

Also notable:

- There are visible encoding issues in this file
- Empty-state Korean text is garbled

## Current Landing Page

### 11. `src/pages/ChapterList.tsx`

This page is separate from the verse-reading layout.

It uses:

- centered intro block
- centered chapter picker
- responsive chapter card grid

It does not participate in the left/main/right reading shell.

So the requested 20/60/20 design only affects verse pages, not the landing page.

## What the Current Layout Really Is

On desktop verse pages, the current app is effectively:

- left panel: fixed `400px`
- main panel: `flex-1`
- right panel:
  - `400px` when left is open
  - `800px` when left is closed

Header simulates alignment with:

- left padding: `400px`
- right padding: `400px`

Main content then narrows itself again using:

- `max-w-[1000px]`
- several nested `max-w-3xl` wrappers

So there are **three independent layout systems** currently stacked together:

1. outer shell widths
2. header pseudo-alignment
3. inner content width constraints

This is the main architectural reason layout changes have been fragile.

## Gap Between Current State and Requested State

### Requested

Base desktop:

- left: `20%`
- main: `60%`
- right: `20%`

When left closes:

- left: `0%`
- main: visually shifts left
- right: `40%`

Header:

- left controls pinned to main panel inner-left edge
- right controls pinned to main panel inner-right edge
- these positions remain stable according to the layout frame, not arbitrary panel toggles

### Current

- left: fixed pixels
- right: fixed pixels
- main: leftover width
- header: fixed offsets, not frame-derived
- inner content: separate max-width rules

Therefore the requested design requires a **layout model rewrite**, not a small CSS tweak.

## Exact Areas That Must Change

### A. Introduce a Shared Desktop Frame Model

Recommended new source of truth:

- one layout constants/helper module
- returns widths or CSS variables for:
  - left width
  - main width
  - right width
  - header left inset
  - header right inset

Suggested shape:

```ts
type DesktopFrame = {
  left: string;
  main: string;
  right: string;
  headerLeftInset: string;
  headerRightInset: string;
};
```

Behavior:

- default: `20 / 60 / 20`
- left closed: `0 / 60 / 40`

Important:

- percentages should be calculated in one place
- header and body must consume the same frame data

### B. Refactor `AppShell.tsx`

Current:

- plain flex row with `sidebar`, `main`, `rightPanel`

Target:

- explicit desktop grid or explicit width variables

Recommended desktop structure:

```tsx
<div className="lg:grid" style={{ gridTemplateColumns: '20% 60% 20%' }}>
```

Then switch to:

- `0% 60% 40%` when left panel is closed

Reason:

- grid expresses the target requirement directly
- easier to align header to main panel edges

### C. Refactor `Header.tsx`

Current:

- fixed `paddingLeft` / `paddingRight`

Target:

- header should use the same desktop grid frame as the body
- or consume CSS variables produced by that frame

Best approach:

- render desktop header as a three-column grid
- left controls live in column 2 start edge
- right controls live in column 2 end edge
- side columns mirror left/right panel widths

That would make the header naturally follow:

- `20 / 60 / 20`
- `0 / 60 / 40`

without special-case arithmetic inside the header.

### D. Refactor `Sidebar.tsx`

Current desktop width:

- `lg:w-[400px]`

Target:

- width should no longer be injected as a fixed pixel class
- desktop width should be controlled by the outer layout frame

Likely change:

- keep mobile width in `SidebarLayout`
- stop assigning fixed desktop width here
- let shell grid column define desktop width instead

### E. Refactor `CommentarySidebar.tsx`

Current desktop width:

- `400px` or `800px`

Target:

- right panel width should also come from the shared frame
- base: `20%`
- expanded when left closed: `40%`

Likely change:

- remove local width branching from `CommentarySidebar.tsx`
- let shell grid/body frame decide its desktop width

### F. Revisit `SidebarLayout.tsx`

This component currently mixes:

- mobile fixed drawer behavior
- desktop sticky side panel width handling

For the new system:

- mobile behavior can stay mostly as-is
- desktop width control should be reduced here
- desktop width should come from parent layout, not internal `desktopWidthClass`

This file may need a split in responsibility:

- mobile drawer transitions remain here
- desktop width ownership moves up

### G. Revisit `VerseView.tsx` and Inner Verse Components

Even after shell refactor, visual balance will still be affected by:

- `max-w-[1000px]`
- nested `max-w-3xl`
- centered audio player
- centered section titles

Decision needed:

- keep a narrower readable column inside the 60% main panel
- or let content use more of the panel width

If the visual goal is "main panel itself defines the reading column", then these constraints need to become conditional or be widened.

## State and Interaction Behavior That Must Be Preserved

These flows should continue to work after refactor:

- Mobile left drawer open/close
- Mobile commentary drawer open/close
- Desktop left panel persistence in localStorage
- Desktop commentary panel persistence in localStorage
- Route change closes mobile drawers via `closeAllDrawers()`
- `main-scroll-container` remains the scroll target for verse navigation reset

## Risks and Edge Cases

### 1. Header/body drift

If header and body still calculate layout separately, they will drift again.

### 2. Sticky + grid interaction

`SidebarLayout.tsx` currently uses `lg:sticky`.
If desktop panels move into a grid-based frame, sticky behavior must be retested carefully.

### 3. Inner content still looks narrow

Even after outer ratios are correct, the verse body can still appear visually too narrow due to nested `max-width` rules.

### 4. Very wide screens

Pure percentages may make side panels too wide or too narrow depending on viewport.
You may still want min/max bounds even in a percentage system.

Example:

- left: `minmax(280px, 20%)`
- main: `minmax(640px, 60%)`
- right: `minmax(320px, 20%)`

But this must be balanced against the user's request for strict ratios.

### 5. 1024px boundary behavior

Desktop logic activates at `1024px`.
The new percentage layout should be tested at:

- 1024
- 1280
- 1440
- 1600
- ultrawide

## Recommended Implementation Order

1. Introduce a shared desktop frame configuration
2. Refactor `AppShell.tsx` to own desktop columns
3. Refactor `Header.tsx` to consume the same frame
4. Remove fixed desktop widths from `Sidebar.tsx`
5. Remove fixed desktop widths from `CommentarySidebar.tsx`
6. Simplify desktop responsibility inside `SidebarLayout.tsx`
7. Revisit `VerseView.tsx` and inner content width constraints
8. Test at multiple desktop widths and mobile breakpoints

## Suggested Technical Direction

The cleanest design is:

- mobile: keep current drawer system
- desktop: use one shared grid frame for header + body

Recommended desktop frame:

```css
grid-template-columns:
  var(--left-panel-width)
  var(--main-panel-width)
  var(--right-panel-width);
```

State mapping:

- default:
  - `--left-panel-width: 20%`
  - `--main-panel-width: 60%`
  - `--right-panel-width: 20%`
- left closed:
  - `--left-panel-width: 0%`
  - `--main-panel-width: 60%`
  - `--right-panel-width: 40%`

Then:

- body grid uses these variables
- header desktop grid uses these variables
- left/right controls align to the inner edges of the main column automatically

## Additional Code Quality Notes

During research, several files showed visible encoding corruption in terminal output:

- `src/components/Sidebar.tsx`
- `src/components/ui/SidebarMenu.tsx`
- `src/components/verse/TranslationSection.tsx`

These are not the core reason the layout behaves the way it does, but they are maintenance risks and should be cleaned up during or after the layout refactor.

## Final Assessment

The requested layout change is feasible, but it is not a one-line width adjustment.

The current app is based on:

- fixed left width
- fixed right width
- leftover main width
- simulated header alignment

The desired app should be based on:

- one shared desktop frame
- ratio-driven panel widths
- header aligned from the same frame
- optional inner content width rules on top of that frame

The critical implementation principle is:

**do not let `Header`, `Sidebar`, `CommentarySidebar`, and `AppShell` each define desktop geometry independently.**

If one shared frame is introduced and consumed everywhere, the requested behavior becomes straightforward and stable.
