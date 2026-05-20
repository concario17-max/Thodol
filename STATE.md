# State

## Current Task
Completed: move the chapter/sutra context pill to the left of the commentary/deep-dive toggle in `src/components/Header.tsx`.

## Route
Route A

## Writer Slot
main: single-file implementation

## Contract Freeze
Frozen scope:
- Move the chapter/sutra context pill to the left of the verse mode toggle in `src/components/Header.tsx`.
- Preserve the existing verse mode toggle behavior and tracked learning-comic assets.
- Keep the root `.odt` files untouched.

Reason for Route A:
- This remains a single-file change with no fanout, shared assets, or multi-file coordination required.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`

## Reviewer
pending assignment

## Last Update
2026-05-20 00:00:00 +09:00 - Moved the chapter/sutra context pill to the left of the verse mode toggle and verified the change with `npm.cmd run typecheck` and `npm.cmd run build`.

## Open Review Item
- None.
