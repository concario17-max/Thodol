# State

## Current Task
Fix the blank monochrome screen caused by the UI provider using router state outside the router, while preserving the stacked mobile sidebar flow.

## Route
Route A

## Writer Slot
main: write-capable

## Contract Freeze
Frozen scope:
- Keep the existing `prayers` + `book` runtime contract intact.
- Remove the router-hook crash from `src/context/UIContext.tsx` and keep the mobile sidebar stacking behavior working.
- Keep the translation body and sidebar content otherwise unchanged.
- Leave the album/header/routing work untouched.

Reason for Route A:
- This is a small runtime fix confined to `src/context/UIContext.tsx`.

## Write Sets
- main: `src/context/UIContext.tsx`, `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
reviewer: not required (Route A)

## Last Update
2026-05-29 00:00:00 +09:00 - Removed the router-hook crash from UIContext and kept the mobile sidebar stacking behavior working on narrow screens.

## Open Review Item
- None.
