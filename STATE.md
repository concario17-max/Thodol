# State

## Current Task
Active: update the header verse mode labels in `src/components/Header.tsx` to use `심화` and `해설` in that order.

## Route
Route A

## Writer Slot
main: write-capable

## Contract Freeze
Frozen scope:
- Update only the verse mode toggle labels in `src/components/Header.tsx`.
- Change the order so `심화` comes before `해설`.
- Keep the rest of the app layout, routing, sidebar, and data flow unchanged.

Reason for Route A:
- This is a single-file label change with no shared layout or data flow impact.
- No fan-out into other files is needed.

## Write Sets
- main: `src/components/Header.tsx`

## Reviewer
not needed

## Last Update
2026-05-15 - Re-scoped the header label swap to a single-file Route A slice.
