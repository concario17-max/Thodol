# State

## Current Task
Completed: split the commentary header in `VerseView.tsx` so the outer white space and inner beige sheet read together more naturally.

## Route
Route A

## Writer Slot
main: single-slice UI tweak

## Contract Freeze
Frozen scope:
- Update only the commentary header inside `src/pages/VerseView.tsx`.
- Make the header read as a background-blended meta strip rather than a prominent card.
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
2026-05-18 15:47:38 +09:00 - Split the commentary header and content sheet in `VerseView.tsx` so the outer white space reads with the header while the beige sheet holds the body.

## Open Review Item
- Resolved: the commentary header now reads like a thin bridge between the outer white background and the beige content sheet.
