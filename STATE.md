# State

## Current Task
Completed: remove the left sidebar marker border, enlarge the chapter/sutra numbers, and keep the marker moving continuously.

## Route
Route A

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Rework only the left sidebar chapter/sutra marker area in `src/components/Sidebar.tsx`.
- Remove the visible border from the marker.
- Increase the chapter and sutra numbers so they dominate the marker.
- Keep the marker in continuous motion.
- Preserve the reading blocks below the marker and keep the current shell/layout intact.
- Avoid adding a new CSS file if the effect can be done in the component file itself.

Reason for Route A:
- N/A. This is a single-file slice.

## Write Sets
- main: `src/components/Sidebar.tsx`

## Reviewer
not needed

## Last Update
2026-05-14 - Finished the borderless continuous-motion sidebar marker treatment and verified typecheck/build.
