# State

## Current Task
Completed the merged `book` + `prayers` runtime contract and consumer update so prayers appear first as `부록:기도문`, while leaving `albums.json` and `mp3` untouched.

## Route
Route B

## Writer Slot
main: planner

## Contract Freeze
Frozen scope:
- Merge `public/book.json` and `public/prayers.json` into one runtime contract.
- Ensure prayers are presented first as `부록:기도문`.
- Keep `albums.json`, `album-covers/`, and `mp3/` untouched in this pass.
- Update the runtime loader and the minimum consumer surfaces needed to present the merged data.
- Preserve existing verse content as much as possible while normalizing schema differences.

Reason for Route B:
- The work spans the loader contract, view model, chapter list, verse view, and supporting tests.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_data: implementation files for the merged data contract and loader
- worker_ui: implementation files for the consumer surfaces
- reviewer: implementation review only

## Reviewer
reviewer: completed

## Last Update
2026-05-28 16:15:20 +09:00 - Implemented the merged book/prayers runtime contract, updated the UI to show prayers first as `부록:기도문`, and verified typecheck, vitest, and build successfully.

## Open Review Item
- None.
