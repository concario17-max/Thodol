# Yoga Sutra UI Overhaul Plan

## 1. Deep Research & Analysis (Completed)
- [x] Analyze current component architecture (src/App.tsx, src/pages/ChapterList.tsx)
- [x] Audit theme tokens and CSS variables (src/index.css)
- [x] Identify icon assets and spacing bottlenecks
- [x] Document findings in research.md

## 2. Infrastructure & Theme Update
- [/] Update Tailwind 4 `@theme` block in `src/index.css`
  - Introduce "Deep Gold" semantic colors (#B8860B)
  - Darken background tokens (`gold-bg`, `gold-surface`) to reduce eye strain
  - Refine `glass-panel` and scrollbar styles for the new theme
- [ ] Ensure `AppShell.tsx` ambient background aligns with darker theme

## 3. Home Page (ChapterList) Refactoring
- [ ] Implement 4-column grid layout for chapters (`lg:grid-cols-4`)
- [ ] Minimize vertical spacing:
  - Reduce container paddings (`py-12` -> `py-8`)
  - Tighten section margins (`mb-16` -> `mb-10`)
- [ ] Fix title icons ("아이콘 찐빠"):
  - Verify and update `gita_header_icon.png` reference or replace with a proper Yoga symbol
  - Adjust icon sizing and alignment above the main title

## 4. Component Compression & Polish
- [ ] Optimize `GlassCard.tsx`:
  - Shrink internal padding for higher density
  - Adjust hover effects for the darker background
- [ ] Verify "one-page" visibility (minimize scrolling)
- [ ] Sync theme across VerseView and Chapter pages

## 5. Verification & Finalization
- [ ] Manual layout verification on various screen sizes
- [ ] Theme consistency check
- [ ] Auto-commit and push changes (Ray Standard)
