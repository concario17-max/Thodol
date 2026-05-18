# State

## Current Task
Completed: persist the fixed right-panel commentary/comic mode across reloads.

## Route
Route B

## Writer Slot
main: planner-only

## Contract Freeze
Frozen scope:
- Recreate only the right-side reading surface in Yoga after the `calendar` reference.
- Make the right side a fixed reading column with an internal `Commentary / Learning comic` toggle instead of a slide-in drawer.
- Keep the left sidebar fixed and untouched unless the right-panel layout requires a shared shell adjustment.
- Use Yoga's existing commentary data for the text view; do not depend on comic image assets.
- Keep the right column in flow as a fixed desktop reading surface, not an overlay or drawer.
- Preserve the untracked root `.odt` reference files.

Reason for Route B:
- This is a multi-file UI rework with shared shell/state concerns and a separate reference implementation to mirror.
- The right panel needs its own internal view toggle and layout behavior, which crosses component boundaries.
- The shell, commentary view state, and panel rendering are tightly coupled enough that one worker slice keeps the contract safer than forced micro-splitting.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker-right-panel: `src/components/CommentarySidebar.tsx`, `src/components/ui/AppShell.tsx`, `src/App.tsx`, `src/pages/VerseView.tsx`, `src/context/UIContext.tsx`, `src/components/Header.tsx`, `src/components/ui/desktopVerseLayout.ts`, `src/components/ui/desktopVerseLayout.test.ts`, `scripts/browser_smoke.mjs`

## Reviewer
local-review (passed)

## Last Update
2026-05-18 - Persisted the right-panel commentary/comic mode in localStorage and verified the change with typecheck, build, and browser smoke.

## Open Review Item
- Resolved: persist the right-panel `commentary / comic` mode across reloads so the fixed right column does not reset to Commentary unexpectedly.
