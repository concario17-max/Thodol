# State

## Current Task
Completed: remake the right commentary panel to match the calendar-style reference, with `Commentary` in the top label area and a `학습만화` transition icon/button inside the panel.

## Route
Route B

## Writer Slot
main: planner-only

## Contract Freeze
Frozen scope completed:
- Rebuilt the right-side commentary presentation to mirror the reference layout as closely as practical.
- Replaced the reference's `오늘의 효사` text with `Commentary`.
- Added a `학습만화` transition icon/button to the right of `Commentary` inside the panel.
- Kept the rest of the app routing and left sidebar behavior unchanged.
- Kept the untracked root `.odt` reference files untouched.

Reason for Route B:
- The change spans shared layout, the right panel content, and the panel interaction.
- The desired result depended on coordinated updates across multiple files.

## Write Sets
- main: `STATE.md`
- worker_shared: `src/App.tsx`, `src/context/UIContext.tsx`, `src/components/ui/AppShell.tsx`, `src/components/ui/desktopVerseLayout.ts`, `src/components/Header.tsx`
- worker_feature: `src/components/CommentarySidebar.tsx`

## Reviewer
No findings.

## Last Update
2026-05-17 - Completed the calendar-style right commentary panel remake after reviewer pass with no findings.
