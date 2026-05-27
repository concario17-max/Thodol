# State

## Current Task
Synchronize the app with the newly copied Bhagavad Gita data source and adapt the runtime data model to the 18-chapter dataset.

## Route
Route B

## Writer Slot
main: planner / integration

## Contract Freeze
Frozen scope:
- Treat `public/gita.json` as the canonical data source.
- Migrate the runtime loader and chapter navigation to the 18-chapter Bhagavad Gita dataset.
- Preserve the existing UI shell and commentary/comic affordances where they still fit the data.
- Update user-facing chapter labels, audio handling, and default copy to match Gita.

Reason for Route B:
- The copied dataset changes the chapter count, verse shape, audio mapping, and multiple shared UI surfaces.

## Write Sets
- main: `STATE.md`
- implementation: `src/types.ts`, `src/constants.ts`, `src/utils/dataFetcher.ts`, `src/utils/yogaData.ts`, `src/context/YogaDataContext.tsx`, `src/hooks/useSutraNavigation.ts`, `src/utils/sutraNavigation.ts`, `src/pages/ChapterList.tsx`, `src/pages/VerseView.tsx`, `src/components/Sidebar.tsx`, `src/components/CommentarySidebar.tsx`, `src/components/CompendiumModal.tsx`, `src/components/Header.tsx`, `src/components/verse/SutraContent.tsx`, `src/components/verse/TranslationSection.tsx`, `src/components/verse/SutraNavigation.tsx`, `src/components/verse/SutraHeader.tsx`, `src/components/commentary/CommentaryMarkdown.tsx`, `src/App.tsx`, `src/utils/*.test.ts`, `src/components/**/*.test.ts`

## Reviewer
reviewer: pending assignment

## Last Update
2026-05-27 15:58:10 +09:00 - Reclassified the task for the copied Gita dataset and expanded the runtime sync scope.

## Open Review Item
- None.
