# State

## Current Task
Completed: make the header context picker feel more polished and remove chapter prefixes from sutra labels.

## Route
Route A

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Rework only `src/App.tsx`.
- Make the existing context picker feel more polished and less bland.
- Keep the title-adjacent pill trigger intact.
- Remove chapter prefixes from the sutra option labels so they show only the sutra number.
- Keep the rest of the header layout and routing flow intact.

Reason for Route A:
- The requested change stays inside the existing picker component and label generation logic.
- No additional files or shared layout rewrites are needed.

## Write Sets
- main: `src/App.tsx`

## Reviewer
not needed

## Last Update
2026-05-14 - Polished the header context picker and removed chapter prefixes from sutra labels, then verified typecheck/build.
