# State

## Current Task
Completed: move chapter and sutra selection into a title-adjacent context pill with an on-click picker.

## Route
Route B

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Rework the header title area and selection controls.
- Show only a small context pill next to the title.
- Open a picker only when the pill is clicked.
- Keep the rest of the header layout and the reading flow intact.
- Avoid adding new files unless absolutely required.

Reason for Route B:
- The header picker and routing state changed together, so a review pass is required.
- The implementation touched shared app flow even though it stayed in two existing files.

## Write Sets
- worker_header_picker: completed `src/App.tsx`, `src/components/Header.tsx`

## Reviewer
done

## Last Update
2026-05-14 - Implemented the title-adjacent chapter/sutra pill picker, verified typecheck/build, and closed with a no-findings review.
