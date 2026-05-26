# State

## Current Task
Refactor the site into a centered editorial canvas layout with `max-w-[52rem]` content rhythm across reading surfaces.

## Route
Route B

## Writer Slot
main: direct implementation

## Contract Freeze
Frozen scope:
- Keep the sticky header.
- Center the main content in a single canvas structure.
- Standardize primary reading surfaces around `max-w-[52rem]`.
- Preserve existing data flow, toggles, and date navigation.
- Keep mobile stacking natural and uncluttered.

Reason for Route A:
- This is a multi-file layout refactor across shared shell and page surfaces, so it needs Route B.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_feature: `src/components/ui/AppShell.tsx`, `src/pages/ChapterList.tsx`, `src/pages/VerseView.tsx`, `src/components/verse/SutraContent.tsx`, `src/components/verse/SutraHeader.tsx`, `src/components/verse/TranslationSection.tsx`, `src/components/verse/WordMeanings.tsx`, `src/components/verse/AudioPlayer.tsx`, `src/components/verse/SutraNavigation.tsx`, `src/components/CompendiumModal.tsx`, `src/components/LexiconModal.tsx`, `src/components/CommentarySidebar.tsx`, `src/components/ui/SidebarLayout.tsx`, `src/components/ui/SidebarMenu.tsx`, `src/components/Header.tsx`

## Reviewer
Wegener

## Last Update
2026-05-26 00:00:00 +09:00 - Softened the sticky header into the shell background by reducing padding, lowering contrast, and keeping the same navigation behavior.

## Open Review Item
- None.
