# State

## Current Task
Completed: simplify the header context picker by removing its helper text and close button.

## Route
Route A

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Rework only `src/App.tsx`.
- Remove the helper text and close button from the existing context picker.
- Keep the title-adjacent pill trigger intact.
- Keep the rest of the header layout and routing flow intact.

Reason for Route A:
- The requested change stays inside the existing picker component and label generation logic.
- No additional files or shared layout rewrites are needed.

## Write Sets
- main: `src/App.tsx`

## Reviewer
not needed

## Last Update
2026-05-15 - Simplified the header context picker by stripping helper text and the close button, then verified typecheck/build.
