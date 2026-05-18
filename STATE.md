# State

## Current Task
Completed: restyle the commentary block in `VerseView.tsx` so it matches the compact badge-plus-line-plus-icon reference.

## Route
Route A

## Writer Slot
main: single-slice UI tweak

## Contract Freeze
Frozen scope:
- Update only the commentary header inside `src/pages/VerseView.tsx`.
- Make the header read as a compact badge with a thin separator line and a right-edge icon.
- Keep the rest of the commentary content flow unchanged.
- Do not touch the untracked root `.odt` reference files.

Reason for Route A:
- This is a tight single-file UI polish with no shared-shell fan-out.
- The visible renderer lives in `VerseView.tsx`, so one write lane is sufficient.

## Write Sets
- main: `STATE.md`, `src/pages/VerseView.tsx`

## Reviewer
not required for Route A

## Last Update
2026-05-18 15:47:38 +09:00 - Restyled the real commentary renderer in `VerseView.tsx` and re-verified typecheck/build.

## Open Review Item
- Resolved: the commentary header in `VerseView.tsx` now uses the compact badge-plus-line-plus-icon reference style.
