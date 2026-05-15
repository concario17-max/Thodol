# State

## Current Task
Active: update the header verse mode toggle in `src/components/Header.tsx` to use compact icon+label pill buttons for `심화` and `해설`.

## Route
Route A

## Writer Slot
main: write-capable

## Contract Freeze
Frozen scope:
- Update only the verse mode toggle styling in `src/components/Header.tsx`.
- Use compact icon+label pill buttons for `심화` and `해설` in that order.
- Keep the rest of the app layout, routing, sidebar, and data flow unchanged.

Reason for Route A:
- This is a single-file visual tweak with no shared layout or data flow impact.
- No fan-out into other files is needed.

## Write Sets
- main: `src/components/Header.tsx`

## Reviewer
not needed

## Last Update
2026-05-15 - Re-scoped the header control to a single-file Route A icon-pill style tweak.
