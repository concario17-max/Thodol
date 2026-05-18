# State

## Current Task
Completed: make the commentary header icon in `VerseView.tsx` toggle between the text commentary and chapter 1 learning-comic images.

## Route
Route A

## Writer Slot
main: single-slice UI tweak

## Contract Freeze
Frozen scope:
- Update only `src/pages/VerseView.tsx`.
- Make the commentary header icon toggle between text commentary and learning-comic imagery.
- Use the uploaded chapter 1 learning-comic images from the `학습만화` folder.
- Keep the rest of the verse layout unchanged.
- Do not touch the untracked root `.odt` reference files.

Reason for Route A:
- This is a tight single-file UI polish with no shared-shell fan-out.
- The visible renderer lives in `VerseView.tsx`, so one write lane is sufficient.

## Write Sets
- main: `STATE.md`, `src/pages/VerseView.tsx`

## Reviewer
not required for Route A

## Last Update
2026-05-18 15:47:38 +09:00 - Added a commentary icon toggle in `VerseView.tsx` that switches between text commentary and the chapter 1 learning-comic images.

## Open Review Item
- Resolved: the commentary header icon now toggles between text commentary and the chapter 1 learning-comic images.
