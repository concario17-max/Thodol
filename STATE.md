# State

## Current Task
Fix the broken Korean labels in the header and right-panel controls.

## Route
Route A

## Writer Slot
main: direct implementation

## Contract Freeze
Frozen scope:
- Restore the broken Korean strings in the header and right-panel navigation.
- Keep the layout and control placement unchanged.
- Do not alter the underlying navigation behavior.

Reason for Route A:
- This is a tight single-slice layout bug fix centered on the shared sidebar container.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_feature: `src/components/Header.tsx`, `src/pages/VerseView.tsx`

## Reviewer
Wegener

## Last Update
2026-05-26 00:00:00 +09:00 - Restored the broken Korean labels in the header and right-panel controls and normalized the touched files to UTF-8.

## Open Review Item
- None.
