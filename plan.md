# Yoga Sutra UI Phase 4 - Dark Mode & Final Polish Plan

## 1. Dark Mode Fix
- [x] Research and implement Tailwind 4 `class` strategy configuration in `index.css`.
  - Add `@custom-variant dark (&:where(.dark, .dark *));` or equivalent.
- [x] Verify that `ThemeProvider` correctly applies the `.dark` class to `html`.
- [x] Audit `AppShell.tsx` and `ChapterList.tsx` for any missing `dark:` variant declarations.
- [x] Ensure `bg-dark-bg` and `text-dark-text-primary` provide sufficient contrast.

## 2. UI Refinements (Fulfillment)
- [x] Double-check the 5-point title increase in `ChapterList.tsx`.
- [x] Verify the blank line spacing between "The Light of Yoga" and the sub-header.
- [x] Confirm `GlassCard` legibility in both themes with the new longer descriptions.

## 3. Verification & Sync
- [x] Test dark mode toggle on the Home Page and Verse View.
- [x] Ensure no regressions in typography or layout density.
- [x] Auto-commit and push changes (Ray Standard).

## 4. Phase 5 - Refactoring & Quality (Ray Standard Compliance)
- [ ] Centralize and correct `localStorage` keys (Prefix: `yoga-`).
- [ ] Remove all `console.log`, `console.warn`, `console.error` calls.
- [ ] Extract `useAudio` hook from `VerseView.tsx` to handle playback logic.
- [ ] Decompose `VerseView.tsx` into smaller sub-components.
  - [ ] `SutraHeader`: Navigation and Breadcrumbs.
  - [ ] `SutraContent`: Sanskrit, Pronunciation, Lexicon.
  - [ ] `AudioPlayer`: Media controls.
  - [ ] `TranslationSection`: Multi-language translations and Commentary.
- [ ] Refactor `dataFetcher.ts` to include better error handling (non-console) and possibly pre-process verse ranges.
- [ ] Audit and fix UI accessibility and specific `dark:` variant omissions.
- [ ] Auto-commit and push changes.
