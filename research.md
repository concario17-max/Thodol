# Yoga Project Research

Updated: 2026-03-20
Status: post-remediation
Workspace: `C:\Users\roadsea\Desktop\yoga`

## Scope

This report reflects a direct read of the live repository after the latest remediation pass. It covers the active React/Vite app, its runtime data flow, shared layout system, QA scripts, and the cleanup work completed during this pass.

The active surfaces are:

- `src/`
- `public/`
- `scripts/`
- root docs such as `README.md`, `plan.md`, and `reuse-guide.md`

Historical notes remain in `docs/`, but they are no longer treated as current guidance.

## Executive summary

This repository is a static React 19 + Vite reading application for the Yoga Sutras. The live app now provides:

- a landing page with chapter cards and quick chapter-to-verse selection
- a verse reading page with Sanskrit, pronunciation, audio, word meanings, translations, and a commentary study panel
- a lexicon modal and a compendium modal
- a shared desktop frame model for sidebar, main reading column, and commentary panel
- synchronized desktop/mobile panel state through `UIContext`

The most important remediation results from this pass are:

- user-facing encoding corruption in active code paths was cleaned up
- data-loading failures are now surfaced to users instead of being silently softened
- the commentary panel is now a real study guide instead of an empty shell
- `README.md` and the browser smoke script now match the live application
- historical docs were explicitly marked as historical instead of silently conflicting with current behavior
- the verification stack now passes:
  - `npm run typecheck`
  - `npm run test -- --run`
  - `npm run build`
  - `npm run qa:browser`

## Stack

From `package.json`:

- React 19
- React Router DOM 7
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Vitest
- Playwright

Scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run typecheck`
- `npm run qa:browser`

TypeScript is configured in strict mode with `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, and related checks. The current remediation pass did not introduce `any` or `unknown` in active TypeScript code.

## Repository structure

Important top-level locations:

- `src/`: live application code
- `public/`: runtime JSON and MP3 assets
- `data-source/`: source text and intermediate artifacts
- `scripts/`: generation, verification, and browser QA scripts
- `legacy/legacy_web/`: archived pre-React implementation
- `docs/`: historical notes only
- `plan.md`: active remediation log
- `research.md`: current architecture and status report
- `reuse-guide.md`: layout reuse guide for other projects

## Boot and provider model

Entry point: `src/main.tsx`

Provider order:

1. `ThemeProvider`
2. `UIProvider`
3. `YogaDataProvider`
4. `App`

Implications:

- theme state is globally available before rendering route content
- UI state drives panel behavior independently of route content
- yoga data is fetched once and shared through context

## Routing and shell composition

`src/App.tsx` uses `BrowserRouter` with two routes:

- `/`
- `/chapter/:chapterNum/verse/:verseNum`

`MainLayout` wraps both routes and decides whether the shared verse shell should render. Verse routes receive:

- `Header`
- left `Sidebar`
- optional right `CommentarySidebar`
- `AppShell` with desktop grid geometry

The landing page does not use the verse shell and instead receives a floating theme toggle.

## Desktop and mobile layout system

### App shell

`src/components/ui/AppShell.tsx` is the main frame. It owns:

- full-height application layout
- background treatment
- the sticky header slot
- optional left and right side panels
- `main-scroll-container`
- optional floating action content

### Desktop frame model

`src/components/ui/desktopVerseLayout.ts` is the source of truth for desktop verse column ratios.

Current supported states:

- left open + commentary open: `20% 60% 20%`
- left closed + commentary open: `0% 60% 40%`
- left open + commentary closed: `20% 80% 0%`
- left closed + commentary closed: `0% 100% 0%`

This model is now covered by a targeted unit test in:

- `src/components/ui/desktopVerseLayout.test.ts`

### Header

`src/components/Header.tsx` uses the same desktop frame model so the verse-page header aligns with the main reading column instead of full-window edges.

Desktop behavior:

- the left `Menu + title` cluster stays pinned to the main column
- the right `Commentary + theme` cluster stays pinned to the opposite inner edge
- header alignment stays stable across left-panel open/close and commentary open/close states

### Shared panel wrapper

`src/components/ui/SidebarLayout.tsx` handles:

- left/right placement
- mobile overlay drawers
- sticky desktop panel behavior
- desktop hidden-state collapse without leftover translate offsets

This file remains important because it cleanly separates mobile transition logic from desktop width ownership.

## UI state model

`src/context/UIContext.tsx` separates mobile and desktop panel state:

- `isSidebarOpen`: mobile left drawer
- `activeRightPanel`: mobile right drawer
- `isDesktopSidebarOpen`: desktop left panel
- `activeDesktopRightPanel`: desktop right panel

Persistence:

- `yoga-desktop-sidebar` in `localStorage`
- `yoga-desktop-right-panel` in `localStorage`

Behavior:

- desktop toggles persist
- route changes close only mobile drawers
- resize into desktop width clears temporary mobile drawer state

## Theme system

`src/context/ThemeContext.tsx` stores a `light` or `dark` theme in `localStorage` and mirrors it to `document.documentElement.classList`.

`src/components/ThemeToggle.tsx` is the shared visible control surface.

## Data model and runtime loading

Types live in `src/types.ts`.

Important runtime types:

- `YogaChapter`
- `YogaSutra`
- `ChapterMeta`
- `WordMeaning`

### Runtime data source

The live app reads:

- `public/data.json`

Primary loader:

- `src/utils/dataFetcher.ts`

### Loader behavior

`fetchYogaData()` now:

- fetches `/data.json`
- normalizes raw sutra rows
- groups them by chapter
- injects metadata from `YOGA_CHAPTERS_META`
- sorts sutras
- caches successful results in memory
- throws a descriptive error when fetch fails

This stronger failure contract replaced the older silent empty-object fallback.

### Shared provider

`src/context/YogaDataContext.tsx` now exposes:

- `allChapters`
- `chapters`
- `loading`
- `error`
- `getVerseInRange`
- `getVerseRangeLabel`

The provider surfaces real load failure state instead of hiding it.

### User-facing failure handling

Failure UI is now present in:

- `src/pages/ChapterList.tsx`
- `src/pages/VerseView.tsx`
- `src/components/LexiconModal.tsx`

So the app no longer leaves users with silent empty data or indefinite ambiguity when runtime assets fail to load.

## Static metadata

`src/constants.ts` contains `YOGA_CHAPTERS_META`.

Current state after cleanup:

- Korean chapter titles are readable
- English chapter titles match the app surfaces
- descriptions are readable and no longer carry encoding artifacts
- sutra counts remain aligned with `public/data.json`

## Page flows

### Landing page

`src/pages/ChapterList.tsx`

Features:

- animated title and hero copy
- `Compendium` modal trigger
- `Lexicon` modal trigger
- quick chapter selector
- quick verse selector
- chapter cards generated from shared provider data
- explicit loading and error states

### Verse page

`src/pages/VerseView.tsx`

Responsibilities:

- resolve canonical sutra targets from route params
- redirect to the correct range owner when necessary
- reset scroll and audio on sutra changes
- render:
  - `SutraHeader`
  - `SutraContent`
  - `WordMeanings`
  - `AudioPlayer`
  - `TranslationSection`
  - `SutraNavigation`
- show loading and failure states when shared data is unavailable

## Verse subcomponents

### `SutraContent`

Renders:

- Sanskrit
- romanized pronunciation
- Korean pronunciation

It also normalizes display strings before rendering.

### `WordMeanings`

Renders a collapsible word-by-word glossary only when meanings exist.

### `AudioPlayer`

Uses `useAudio` for play/pause, seek, progress, time formatting, and error display.

### `TranslationSection`

Renders multiple translation sources and now uses cleaned, readable source labels.

### `SutraNavigation`

Uses `useSutraNavigation` and the pure utilities in `src/utils/sutraNavigation.ts`.

## Commentary panel

`src/components/CommentarySidebar.tsx` is now a meaningful study surface.

It renders:

- chapter frame summary
- key line fallback chain
- study prompts
- a short “how to use this panel” guidance block

This is a meaningful improvement over the earlier empty shell and now matches the live product description in docs and QA.

## Modals

### Compendium

`src/components/CompendiumModal.tsx` is now free of the earlier malformed and corrupted body copy.

### Lexicon

`src/components/LexiconModal.tsx` lazily loads `/lexicon.json` and now surfaces a user-facing error state if the fetch fails.

## Scripts and QA

### Data pipeline

The runtime app still depends on the generated `public/data.json`, with generation and verification scripts under `scripts/`.

### Browser smoke script

`scripts/browser_smoke.mjs` was fully realigned with the live app.

It now checks:

- landing page navigation into a verse route
- desktop commentary availability and persistence behavior
- mobile sidebar open and verse selection flow
- mobile commentary drawer open and close behavior

The previous stale assumptions about reflections and `textarea` elements are gone.

An additional smoke-script bug was fixed during remediation:

- storage reset now happens once per new browser context instead of on every reload

That fix was necessary for the desktop persistence check to be valid.

## Tests

Passing test surfaces now include:

- `src/utils/dataFetcher.test.ts`
- `src/utils/yogaData.test.ts`
- `src/utils/sutraNavigation.test.ts`
- `src/components/ui/desktopVerseLayout.test.ts`

Verified commands during this pass:

- `npm run typecheck`
- `npm run test -- --run`
- `npm run build`
- `npm run qa:browser`

## Documentation state

Current guidance is now split cleanly:

- root `README.md`: current usage and architecture overview
- root `plan.md`: active remediation log and completion state
- root `research.md`: current deep report
- `docs/리서치.md`: historical note
- `docs/plan.md`: historical note

This removes the previous ambiguity where older docs looked current even when they no longer matched the app.

## Remaining tradeoffs

The repository is in much better shape after this pass, but a few non-blocking tradeoffs still exist:

- visual styling is still mostly encoded inline in component class strings rather than a more formal token system
- some reading-column width decisions still live in multiple verse subcomponents
- the smoke test is intentionally lightweight and validates core flows rather than deep content semantics

These are maintainability considerations, not active breakages.

## Bottom line

The project now has a coherent live contract across:

- runtime behavior
- user-facing copy
- failure handling
- browser QA
- repository documentation

The main earlier mismatches from the previous research pass were resolved:

- encoding-corrupted active UI copy
- stale reflections references
- stale browser smoke assumptions
- empty commentary shell
- weak load-failure surfacing

At this point the live app, tests, smoke QA, and docs are aligned.
