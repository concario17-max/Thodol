# State

## Current Task
Completed: move the sutra navigation into the left/right whitespace of the verse body for commentary/deep-dive views.

## Route
Route A

## Writer Slot
main: single-file implementation

## Contract Freeze
Frozen scope:
- Move the sutra navigation into the verse body’s left/right whitespace for commentary and deep-dive views.
- Preserve the existing verse mode toggle behavior and tracked learning-comic assets.
- Keep the root `.odt` files untouched.

Reason for Route A:
- This remains a single-file change with no fanout, shared assets, or multi-file coordination required.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
not requested

## Last Update
2026-05-20 00:00:00 +09:00 - Moved the sutra navigation into the verse body’s side whitespace with desktop side buttons and a centered verse label; verified with `npm.cmd run typecheck` and `npm.cmd run build`.

## Open Review Item
- None.
