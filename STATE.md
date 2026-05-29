# State

## Current Task
Make the verse sidebar remain visible in a one-column vertical flow on narrow screens so the left panel stacks above the main content.

## Route
Route A

## Writer Slot
main: direct

## Contract Freeze
Frozen scope:
- Keep the existing `prayers` + `book` runtime contract intact.
- Keep the sidebar content visible on narrow screens by stacking it above the main content in a single vertical flow.
- Keep the translation body and sidebar content otherwise unchanged.
- Leave the album/header/routing work untouched.

Reason for Route A:
- This is a small UI layout fix confined to `src/context/UIContext.tsx`.

## Write Sets
- main: `src/context/UIContext.tsx`, `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
reviewer: not required (Route A)

## Last Update
2026-05-29 00:00:00 +09:00 - Made the verse sidebar stay visible on narrow screens by forcing the mobile sidebar open so the layout stacks vertically.

## Open Review Item
- None.
