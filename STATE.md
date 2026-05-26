# State

## Current Task
Move the right-panel previous/next navigation up into the top header line so it no longer floats in the middle of the content area.

## Route
Route A

## Writer Slot
main: direct implementation

## Contract Freeze
Frozen scope:
- Preserve the existing right panel content flow and toggles.
- Move the previous/next buttons into the header/tab line area.
- Remove the floating mid-content arrow placement.
- Keep the content order and navigation behavior unchanged.

Reason for Route A:
- This is a tight single-slice layout bug fix centered on the shared sidebar container.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_feature: `src/components/Header.tsx`, `src/pages/VerseView.tsx`

## Reviewer
Wegener

## Last Update
2026-05-26 00:00:00 +09:00 - Re-scoped the fix from right-panel height to header-level navigation placement after verifying the arrows should live beside the top title/tab strip instead of floating over the body.

## Open Review Item
- None.
