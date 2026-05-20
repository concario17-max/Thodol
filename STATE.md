# State

## Current Task
Completed: move the sutra navigation arrows fully outside the verse body, floating at the left and right edges.

## Route
Route A

## Writer Slot
main: single-file implementation

## Contract Freeze
Frozen scope:
- Move the sutra navigation arrows fully outside the verse body, floating at the left and right edges.
- Preserve the existing verse mode toggle behavior and tracked learning-comic assets.
- Keep the root `.odt` files untouched.

Reason for Route A:
- This remains a single-file change with no fanout, shared assets, or multi-file coordination required.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
not requested

## Last Update
2026-05-20 00:00:00 +09:00 - Moved the sutra navigation arrows fully outside the verse body so they float at the left and right edges, then verified with `npm.cmd run typecheck` and `npm.cmd run build`.

## Open Review Item
- None.
