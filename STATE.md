# State

## Current Task
Completed: move the sutra navigation arrows into the verse body’s left/right whitespace, above the current sutra number.

## Route
Route A

## Writer Slot
main: single-file implementation

## Contract Freeze
Frozen scope:
- Move the sutra navigation arrows into the verse body’s left/right whitespace, above the current sutra number.
- Preserve the existing verse mode toggle behavior and tracked learning-comic assets.
- Keep the root `.odt` files untouched.

Reason for Route A:
- This remains a single-file change with no fanout, shared assets, or multi-file coordination required.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
not requested

## Last Update
2026-05-20 00:00:00 +09:00 - Moved the sutra navigation arrows into the verse body’s left/right whitespace with the sutra number above them, then verified with `npm.cmd run typecheck` and `npm.cmd run build`.

## Open Review Item
- None.
