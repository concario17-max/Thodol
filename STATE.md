# State

## Current Task
Completed: change the verse desktop layout to a 22rem-29rem left column with the right side taking the remaining space.

## Route
Route B

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Set the verse desktop column contract to `minmax(22rem, 29rem) minmax(0, 1fr)`.
- Remove the hard 360px sidebar cap so the left column can breathe up to 29rem.
- Keep mobile as a single stacked column.
- Keep the rest of the layout behavior unchanged.

Completed. The verse desktop layout now uses a 22rem-29rem left column and a flexible right side, with mobile still stacked.

## Write Sets
- worker_shared: completed `src/components/ui/desktopVerseLayout.ts`, `src/components/Sidebar.tsx`

## Reviewer
reviewer done

## Last Update
2026-05-04 - Finished adjusting the verse desktop layout to a wider, minmax-based left column.
