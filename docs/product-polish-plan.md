# Product Polish Plan

Updated: 2026-05-21
Status: draft
Scope: frontend premiumization only

## What I found

- The app already has a solid single-shell structure in `src/components/ui/AppShell.tsx`, with routing centralized in `src/App.tsx`.
- Visual tokens are already defined in `src/index.css`, so the project has a real design-system base instead of ad hoc colors everywhere.
- Most UI is built from a small set of shared pieces: `Header`, `Sidebar`, `SidebarLayout`, `GlassCard`, and the verse subcomponents under `src/components/verse/`.
- State is already centralized through `ThemeContext`, `UIContext`, and `YogaDataContext`; that is good news because the polish pass can be done without adding new global libraries.
- The main route surface is simple: a landing page and a verse page, which makes the rollout manageable in small PRs.
- The biggest technical risk is not routing complexity. It is inconsistency: too many one-off surface styles, mixed interaction patterns, and some accessibility gaps in modal and button behavior.
- The clearest performance concern is in `src/pages/VerseView.tsx`, where the learning-comic image map is eagerly loaded.

## Design Direction

- Keep the current warm editorial tone, but tighten it into a more product-grade system.
- Aim for restrained luxury rather than flashy motion.
- Prefer fewer surface styles, cleaner spacing, stronger hierarchy, and sharper keyboard/focus behavior.
- Mobile stays first-class. Desktop should feel like an expanded reading desk, not a different app.

## P0

### 1. Fix interaction and accessibility baseline

- Goal: make the app feel trustworthy under keyboard, screen reader, and reduced-motion use.
- Expected files:
  - `src/components/CompendiumModal.tsx`
  - `src/components/LexiconModal.tsx`
  - `src/components/Header.tsx`
  - `src/components/ThemeToggle.tsx`
  - `src/components/Sidebar.tsx`
  - `src/components/ui/SidebarLayout.tsx`
  - `src/components/verse/AudioPlayer.tsx`
  - `src/components/verse/SutraNavigation.tsx`
  - `src/components/verse/WordMeanings.tsx`
  - `src/pages/ChapterList.tsx`
- Main risks:
  - Breaking existing open/close behavior in modals or drawers.
  - Changing the verse-mode toggle semantics.
  - Accidentally hiding controls from mobile users.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run test -- --run`
  - Manual keyboard pass for modals, sidebar, and verse controls
  - Browser smoke on landing and verse routes

### 2. Stabilize loading, fallback, and data states

- Goal: remove fragile empty states and make loading/error behavior feel deliberate.
- Expected files:
  - `src/utils/dataFetcher.ts`
  - `src/context/YogaDataContext.tsx`
  - `src/pages/ChapterList.tsx`
  - `src/pages/VerseView.tsx`
  - `src/components/LexiconModal.tsx`
- Main risks:
  - Breaking the existing cached fetch behavior.
  - Surfacing errors too aggressively and creating noisy UI.
  - Introducing loading flicker during route changes.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run test -- --run`
  - `npm.cmd run build`

## P1

### 3. Consolidate the visual system

- Goal: reduce the number of one-off card, border, and text treatments so the product feels designed, not assembled.
- Expected files:
  - `src/index.css`
  - `src/components/ui/GlassCard.tsx`
  - `src/components/Header.tsx`
  - `src/components/Sidebar.tsx`
  - `src/components/ui/SidebarLayout.tsx`
  - `src/components/CompendiumModal.tsx`
  - `src/components/LexiconModal.tsx`
  - `src/components/verse/SutraContent.tsx`
  - `src/components/verse/TranslationSection.tsx`
  - `src/components/verse/WordMeanings.tsx`
- Main risks:
  - Over-normalizing the look and flattening the current character.
  - Breaking contrast in dark mode.
  - Accidentally shifting spacing in the reading layout.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - Visual QA on mobile and desktop

### 4. Clean up the verse layout and route shell

- Goal: make the verse page hierarchy feel intentional and reduce duplicated layout logic.
- Expected files:
  - `src/App.tsx`
  - `src/pages/VerseView.tsx`
  - `src/components/ui/AppShell.tsx`
  - `src/components/ui/desktopVerseLayout.ts`
  - `src/hooks/useSutraNavigation.ts`
  - `src/utils/sutraNavigation.ts`
- Main risks:
  - Breaking chapter/verse navigation.
  - Introducing desktop grid regressions.
  - Unintentionally changing commentary mode behavior.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run test -- --run`
  - `npm.cmd run build`

### 5. Remove avoidable frontend performance cost

- Goal: cut wasted bytes and avoid eagerly loading assets that only matter on the verse route.
- Expected files:
  - `src/pages/VerseView.tsx`
  - `src/pages/ChapterList.tsx`
  - `src/components/CompendiumModal.tsx`
  - `src/components/LexiconModal.tsx`
  - `src/utils/dataFetcher.ts`
  - `src/components/ui/AppShell.tsx`
- Main risks:
  - Breaking asset lookup for learning-comic images.
  - Introducing a lazy-load edge case that only appears on one chapter or verse.
  - Making the first open of a modal feel slower if preload behavior changes.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - Browser smoke on verse routes that use learning-comic imagery

## P2

### 6. Tune motion and micro-interactions

- Goal: keep motion restrained, purposeful, and consistent with a premium reading product.
- Expected files:
  - `src/index.css`
  - `src/components/ui/AppShell.tsx`
  - `src/components/ui/GlassCard.tsx`
  - `src/pages/ChapterList.tsx`
  - `src/pages/VerseView.tsx`
- Main risks:
  - Over-animating content and hurting readability.
  - Ignoring `prefers-reduced-motion`.
  - Making transitions feel ornamental instead of useful.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - Manual reduced-motion check

### 7. Polish copy, labels, and affordances

- Goal: make every visible label feel intentional and consistent.
- Expected files:
  - `src/components/Header.tsx`
  - `src/components/Sidebar.tsx`
  - `src/components/ui/SidebarMenu.tsx`
  - `src/components/verse/SutraHeader.tsx`
  - `src/components/verse/SutraNavigation.tsx`
  - `src/components/CompendiumModal.tsx`
  - `src/components/LexiconModal.tsx`
- Main risks:
  - Accidental copy regressions in localized or precomposed text.
  - Missing aria-label updates where visual text is hidden.
- Verification:
  - `npm.cmd run typecheck`
  - `npm.cmd run build`
  - Targeted keyboard and screen-reader review

## Suggested PR Split

1. P0 accessibility and interaction baseline
2. P0 loading and fallback stabilization
3. P1 visual system consolidation
4. P1 verse layout and route shell cleanup
5. P1 performance pass
6. P2 motion and copy polish

## Notes for rollout

- Keep every change small and reviewable.
- Do not add new dependencies unless a blocker appears.
- Preserve the current data model and routing shape unless a problem cannot be solved otherwise.
- Treat `src/index.css` and `src/components/ui/AppShell.tsx` as the shared foundation before touching page-specific polish.
