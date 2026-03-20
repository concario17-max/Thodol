# Yoga Improvement Plan

작성일: 2026-03-18
상태: 완료

이 문서는 `research.md`에서 도출한 작업 항목을 구현 계획으로 세분화한 뒤, 실제 완료 상태로 갱신한 기록이다.

## 1. Scope and sources

- [x] Confirmed the live application surface is `src/`.
- [x] Confirmed runtime data sources are `public/data.json`, `public/lexicon.json`, and `public/mp3/`.
- [x] Kept `legacy/legacy_web/` as reference-only material.
- [x] Preserved the existing project structure while improving the live app.

## 2. Text and encoding cleanup

- [x] Rewrote broken user-facing strings in the header, sidebar, reflections panel, commentary panel, verse header, translation section, home page, and supporting modals.
- [x] Replaced garbled documentation content in `README.md` and `scripts/README.md`.
- [x] Removed `any` usage from the active `src/` tree.
- [x] Removed `unknown` usage from the active `src/` tree.

## 3. Chapter metadata integrity

- [x] Restored chapter Korean titles to the requested wording.
- [x] Rewrote chapter descriptions in `src/constants.ts`.
- [x] Verified chapter counts against `public/data.json`.
- [x] Corrected chapter 3 metadata count to `55`.

## 4. Shared data access

- [x] Added `YogaDataProvider` to centralize data loading.
- [x] Updated `useYogaData` to read from shared context.
- [x] Reduced repeated fetch patterns across page and panel code.
- [x] Added shared range utilities in `src/utils/yogaData.ts`.

## 5. Data model and fetch normalization

- [x] Reworked `src/utils/dataFetcher.ts` to normalize the runtime sutra shape without `any` or `unknown`.
- [x] Normalized word meanings in one place.
- [x] Kept `public/data.json` as the single runtime source of truth.

## 6. Verse page and navigation

- [x] Kept range-aware verse lookup behavior.
- [x] Moved verse range logic into reusable utilities.
- [x] Moved previous/next target resolution into reusable navigation utilities.
- [x] Updated `useSutraNavigation` to use tested pure helpers.

## 7. Audio stability

- [x] Reworked `useAudio` to avoid stale state toggling.
- [x] Added playback failure handling.
- [x] Added surfaced playback error messaging in the verse audio player.
- [x] Kept reset and seek behavior in sync with page navigation.

## 8. Notes and commentary

- [x] Preserved the reflections storage format in `localStorage`.
- [x] Cleaned the reflections panel text and export flow.
- [x] Updated `ReflectionsModal` to consume shared yoga data instead of refetching.
- [x] Replaced the empty commentary placeholder with a study guide panel using chapter context, verse text, and prompts.

## 9. Sidebar and header UX

- [x] Preserved the 30/70 chapter-to-verse split in the sidebar.
- [x] Cleaned sidebar headings and empty-state text.
- [x] Kept the single top-bar panel toggle behavior.
- [x] Stabilized header button labels and tooltips for QA.

## 10. Home page and study content

- [x] Rewrote the chapter landing page copy.
- [x] Rewrote the compendium modal with readable study guidance.
- [x] Kept chapter/verse quick selection flow intact.

## 11. Documentation

- [x] Rewrote `README.md` to match the current architecture.
- [x] Rewrote `scripts/README.md` to match the current data pipeline.
- [x] Preserved `research.md` as the deeper architecture report.
- [x] Updated this plan file to reflect completed work.

## 12. Testing and QA

- [x] Kept existing `dataFetcher` tests passing.
- [x] Added utility tests for verse range logic.
- [x] Added utility tests for sutra navigation logic.
- [x] Updated the browser smoke script to match the current UI behavior.
- [x] Ran `npm run typecheck`.
- [x] Ran `npm run test -- --run`.
- [x] Ran `npm run build`.
- [x] Ran `npm run qa:browser`.

## 13. Completion summary

- [x] User-facing text recovery completed.
- [x] Chapter metadata integrity completed.
- [x] Shared data access refactor completed.
- [x] Audio and notes stability completed.
- [x] Commentary panel implementation completed.
- [x] Documentation refresh completed.
- [x] Test and browser QA completion completed.

## 14. Desktop Layout Refactor TODO

Status: pending
Source of truth: `research.md`

### 14.1 Discovery and guardrails

- [ ] Reconfirm the desktop-only scope for the new `20 / 60 / 20` layout.
- [ ] Freeze current mobile drawer behavior as a non-goal for the first refactor pass.
- [ ] Capture the current desktop verse layout states that must still work:
  - [ ] left open + commentary closed
  - [ ] left open + commentary open
  - [ ] left closed + commentary open
  - [ ] route change after toggling either panel
- [ ] Identify all remaining files with encoding-corrupted UI strings that could interfere with layout verification.

### 14.2 Shared desktop frame model

- [ ] Decision lock: make `AppShell` the single owner of desktop frame geometry.
- [ ] Decision lock: store desktop frame values in one shared helper/module consumed by both `AppShell` and `Header`.
- [ ] Introduce one shared desktop layout model for verse pages.
- [ ] Define explicit desktop width variables or helpers for:
  - [ ] left panel width
  - [ ] main panel width
  - [ ] right panel width
  - [ ] header left inset
  - [ ] header right inset
- [ ] Encode the two primary desktop states:
  - [ ] default: `20 / 60 / 20`
  - [ ] left closed: `0 / 60 / 40`
- [ ] Decision lock: use ratio-first desktop columns, but allow guarded `minmax` only if testing shows unreadable compression near the `1024px` boundary.
- [ ] Keep the model independent from mobile drawer widths.

### 14.3 App shell restructuring

- [ ] Refactor `src/components/ui/AppShell.tsx` so desktop verse pages are driven by the shared frame instead of `flex-1 + fixed side widths`.
- [ ] Decide whether to use:
  - [ ] CSS grid columns
  - [ ] CSS variables applied to a shared desktop frame
- [ ] Ensure `main-scroll-container` remains the scroll target after layout changes.
- [ ] Preserve the existing mobile `overflow-hidden` behavior when drawers are open.

### 14.4 Header restructuring

- [ ] Refactor `src/components/Header.tsx` so desktop alignment is derived from the same frame as the body.
- [ ] Remove duplicated desktop geometry assumptions from the header.
- [ ] Place the left header group on the inner-left edge of the main panel.
- [ ] Place the right header group on the inner-right edge of the main panel.
- [ ] Keep both groups visually fixed across:
  - [ ] left panel open/close
  - [ ] commentary panel open/close
- [ ] Verify the desktop header no longer depends on hard-coded `400px` padding logic.

### 14.5 Left panel refactor

- [ ] Refactor `src/components/Sidebar.tsx` so desktop width is controlled by the shared frame, not `lg:w-[400px]`.
- [ ] Preserve mobile width behavior in the sidebar drawer.
- [ ] Confirm chapter expansion and verse navigation still behave the same.
- [ ] Review `src/components/ui/SidebarMenu.tsx` for width-sensitive issues once the outer desktop width changes.

### 14.6 Right panel refactor

- [ ] Refactor `src/components/CommentarySidebar.tsx` so desktop width comes from the shared frame.
- [ ] Remove the current `400px / 800px` branching rule.
- [ ] Implement the requested desktop state behavior:
  - [ ] default right panel width = `20%`
  - [ ] left panel closed right panel width = `40%`
- [ ] Preserve mobile commentary drawer behavior.

### 14.7 Sidebar shell responsibilities

- [ ] Revisit `src/components/ui/SidebarLayout.tsx` responsibility split.
- [ ] Keep mobile fixed drawer transitions inside `SidebarLayout`.
- [ ] Reduce or remove desktop width ownership from `SidebarLayout`.
- [ ] Ensure sticky positioning still works after desktop frame ownership moves upward.

### 14.8 Main content width review

- [ ] Refactor `src/pages/VerseView.tsx` so desktop verse content participates correctly in the new main panel geometry.
- [ ] Decision lock: make `VerseView` outer width responsive to the shared desktop frame instead of unconditional `mx-auto max-w-[1000px]`.
- [ ] Decision lock: keep readability constraints selectively, not globally.
- [ ] Review whether `max-w-[1000px]` should remain unconditional.
- [ ] Review nested desktop width constraints in:
  - [ ] `src/components/verse/SutraContent.tsx`
  - [ ] `src/components/verse/TranslationSection.tsx`
  - [ ] `src/components/verse/AudioPlayer.tsx`
  - [ ] `src/components/verse/SutraHeader.tsx`
  - [ ] `src/components/verse/SutraNavigation.tsx`
  - [ ] `src/components/verse/WordMeanings.tsx`
- [ ] Decision lock: only keep centered/narrow inner widths for elements that benefit from readability, and remove unconditional `mx-auto max-w-*` from containers that should visually follow the main panel width.
- [ ] Decide which elements should remain centered for readability and which should expand with the main panel.

### 14.9 State-flow validation

- [ ] Confirm `UIContext` still expresses only open/close state and not geometry.
- [ ] Verify desktop panel persistence in `localStorage` after the refactor.
- [ ] Verify route changes still close only mobile drawers.
- [ ] Confirm the layout remains correct when `activeDesktopRightPanel` is `null`.

### 14.10 Desktop QA matrix

- [ ] Verify layout at desktop breakpoints and common widths:
  - [ ] 1024px
  - [ ] 1280px
  - [ ] 1440px
  - [ ] 1600px
  - [ ] ultrawide
- [ ] Verify the following desktop interaction states:
  - [ ] left open + commentary closed
  - [ ] left open + commentary open
  - [ ] left closed + commentary open
  - [ ] left reopened after commentary expansion
- [ ] Verify header controls remain pinned to main-panel inner edges in all desktop states.
- [ ] Verify commentary does not visually crush the main reading column.

### 14.11 Mobile regression pass

- [ ] Confirm mobile left drawer still opens and closes correctly.
- [ ] Confirm mobile commentary drawer still opens and closes correctly.
- [ ] Confirm mobile verse layout spacing remains unchanged unless explicitly intended.
- [ ] Confirm landing page behavior remains unaffected.

### 14.12 Cleanup and documentation

- [ ] Clean remaining encoding-corrupted strings in layout-adjacent files.
- [ ] Update `research.md` if the implementation direction changes from the current recommendation.
- [ ] Add a concise implementation summary after the refactor is complete.
- [ ] Record final verification notes and known tradeoffs.
