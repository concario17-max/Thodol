# State

## Current Task
Rollback commit `b9bef3d` to remove the side-panel density pass while preserving later changes.

## Route
Route B

## Writer Slot
main: direct implementation

## Contract Freeze
Frozen scope:
- Revert the side-panel typography and padding changes introduced in `b9bef3d`.
- Preserve all later commits and unrelated layout adjustments.
- Keep the sticky header and current canvas shell intact unless the reverted commit touched them directly.
- Leave untracked user files untouched.

Reason for Route A:
- This rollback touches multiple tracked files through a commit revert, so it stays on Route B.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_feature: `src/components/ui/AppShell.tsx`, `src/pages/ChapterList.tsx`, `src/pages/VerseView.tsx`, `src/components/verse/SutraContent.tsx`, `src/components/verse/SutraHeader.tsx`, `src/components/verse/TranslationSection.tsx`, `src/components/verse/WordMeanings.tsx`, `src/components/verse/AudioPlayer.tsx`, `src/components/verse/SutraNavigation.tsx`, `src/components/CompendiumModal.tsx`, `src/components/LexiconModal.tsx`, `src/components/CommentarySidebar.tsx`, `src/components/ui/SidebarLayout.tsx`, `src/components/ui/SidebarMenu.tsx`, `src/components/Header.tsx`

## Reviewer
Wegener

## Last Update
2026-05-26 00:00:00 +09:00 - Reverting `b9bef3d` to remove the side-panel density pass while keeping later header and canvas changes intact.

## Open Review Item
- None.
