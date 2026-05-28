# State

## Current Task
Change the browser tab title from the old Yoga Sutras label to the Bhagavad Gita label.

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
2026-05-28 00:00:00 +09:00 - Identified the stale tab title in index.html and reclassified the task as a small UI copy fix.

## Open Review Item
- None.
