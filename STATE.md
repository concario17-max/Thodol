# State

## Current Task
Completed: wired the shared right-panel slot so the commentary panel can open from the verse header without covering the main reading column.

## Route
Route B

## Writer Slot
main: closing

## Contract Freeze
Frozen scope:
- Read `activeDesktopRightPanel` and `toggleRightPanel` in the verse shell.
- Add a small header button that toggles the commentary panel.
- Reserve desktop space for the right panel so it does not cover the main column.
- Keep the left rail and header selector behavior intact.
- Preserve the untracked root `.odt` reference files.
- Avoid destructive git operations.

Reason for Route B:
- The change touches shared shell, header controls, and desktop layout behavior.
- The right-panel slot and open-state reservation have to be wired together across multiple files.

## Write Sets
- main: `STATE.md`, `src/App.tsx`, `src/components/ui/AppShell.tsx`, `src/components/Header.tsx`

## Reviewer
Boyle

## Last Update
2026-05-18 - Right-panel trigger, comic toggle, and desktop space reservation are implemented and reviewed cleanly.
