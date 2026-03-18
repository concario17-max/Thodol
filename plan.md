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
