# State

## Current Task
Active: reduce the size of the header verse mode toggle in `src/components/Header.tsx` while keeping the `심화` / `해설` labels.

## Route
Route A

## Writer Slot
main: write-capable

## Contract Freeze
Frozen scope:
- Update only the verse mode toggle size and spacing in `src/components/Header.tsx`.
- Keep the `심화` / `해설` labels and their order unchanged.
- Keep the rest of the app layout, routing, sidebar, and data flow unchanged.

Reason for Route A:
- This is a single-file visual tweak with no shared layout or data flow impact.
- No fan-out into other files is needed.

## Write Sets
- main: `src/components/Header.tsx`

## Reviewer
not needed

## Last Update
2026-05-15 - Re-scoped the header control to a single-file Route A size tweak.
