# State

## Current Task
Completed: the right-side panel now opens to learning comic by default while preserving commentary as an explicit alternate view.

## Route
Route A

## Writer Slot
main: implementation

## Contract Freeze
Frozen scope:
- Default the verse right-side panel to the learning comic view for fresh sessions and first render.
- Preserve commentary as the alternate right-panel view and keep the toggle behavior intact.
- Update any persisted default-state logic so new users see comic first without breaking existing saved preferences if that is already intentional in the current code.

Reason for Route A:
- The change is a tight UI-state adjustment centered on the right panel default, with limited file impact.

## Write Sets
- main: `STATE.md`, `src/context/UIContext.tsx`, `src/pages/VerseView.tsx`, `src/components/CommentarySidebar.tsx`, `src/components/ui/desktopVerseLayout.test.ts`

## Reviewer
reviewer: not required for Route A

## Last Update
2026-05-27 17:10:00 +09:00 - Switched the verse right-side panel default to learning comic and verified typecheck.

## Open Review Item
- None.