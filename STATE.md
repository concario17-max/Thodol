# State

## Current Task
Restore the missing `해설/심화/앨범` header toggle on the verse view by passing the toggle flag from `App.tsx` into `Header`.

## Route
Route A

## Writer Slot
main: direct

## Contract Freeze
Frozen scope:
- Restore the verse-view content toggle by wiring `showContentModeToggle` into the `Header` call site.
- Do not touch the existing album/content routing, sidebar logic, or published branches.
- Keep the fix to a single-file hotfix unless new scope appears.

Reason for Route A:
- This is a single-file hotfix that restores a missing header control without expanding into shared asset or routing work.

## Write Sets
- main: `STATE.md`
- hotfix slice: `src/App.tsx`

## Reviewer
reviewer: not required for Route A hotfix

## Last Update
2026-05-29 00:00:00 +09:00 - Published the verse-reader and album branches, then re-scoped the remaining work to the asset cleanup slice after confirming the learning-comic assets only exist in the dirty root worktree. 2026-05-29 17:30:00 +09:00 - Published the filtered learning-comic cleanup branch after rewriting history in a temporary clone and pushing it to GitHub. 2026-05-29 18:00:00 +09:00 - Re-scoped again to a main-ready non-MP3 branch. 2026-05-29 18:15:00 +09:00 - Tightened the publish contract to exclude all staged `mp3` assets, including the `Prayer` audio files. 2026-05-29 18:33:00 +09:00 - Rebased the clean publish worktree onto `origin/codex/gita-data-sync` and pushed commit `d80f0f8` successfully. 2026-05-29 18:40:00 +09:00 - Reclassified the next task as a Route A hotfix after noticing `showContentModeToggle` was not passed into `Header`.

## Open Review Item
- None.
