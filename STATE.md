# State

## Current Task
Move the right-panel previous/next navigation next to the commentary/comic toggle inside the right panel header line.

## Route
Route A

## Writer Slot
main: direct implementation

## Contract Freeze
Frozen scope:
- Preserve the existing right panel content flow and toggles.
- Place the previous/next buttons immediately to the left of the commentary/comic toggle.
- Remove the floating mid-content arrow placement.
- Keep the content order and navigation behavior unchanged.

Reason for Route A:
- This is a tight single-slice layout bug fix centered on the shared sidebar container.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_feature: `src/pages/VerseView.tsx`

## Reviewer
Wegener

## Last Update
2026-05-26 00:00:00 +09:00 - Tightened the right-panel navigation group so the prev/next buttons sit closer to the commentary/comic toggle as a single compact control cluster.

## Open Review Item
- None.
