# State

## Current Task
Restyle the left sidebar chapter/verse caption so the number line and description line match the reference more closely.

## Route
Route A

## Writer Slot
main: direct

## Contract Freeze
Frozen scope:
- Restyle the chapter/verse caption block in the left sidebar only.
- Keep the current text content and ordering.
- Do not touch audio, album routing, or other verse layout files.

Reason for Route A:
- This is a single-file visual tweak confined to `src/components/Sidebar.tsx`.

## Write Sets
- main: `STATE.md`
- hotfix slice: `src/components/Sidebar.tsx`

## Reviewer
reviewer: not required for Route A hotfix

## Last Update
2026-05-29 00:00:00 +09:00 - Published the verse-reader and album branches, then re-scoped the remaining work to the asset cleanup slice after confirming the learning-comic assets only exist in the dirty root worktree. 2026-05-29 17:30:00 +09:00 - Published the filtered learning-comic cleanup branch after rewriting history in a temporary clone and pushing it to GitHub. 2026-05-29 18:00:00 +09:00 - Re-scoped again to a main-ready non-MP3 branch. 2026-05-29 18:15:00 +09:00 - Tightened the publish contract to exclude all staged `mp3` assets, including the `Prayer` audio files. 2026-05-29 18:33:00 +09:00 - Rebased the clean publish worktree onto `origin/codex/gita-data-sync` and pushed commit `d80f0f8` successfully. 2026-05-29 18:40:00 +09:00 - Reclassified the next task as a Route A hotfix after noticing `showContentModeToggle` was not passed into `Header`. 2026-05-29 18:50:00 +09:00 - Promoted the pronunciation placement and font update to Route B because it needs coordinated updates in both `VerseView` and `SutraContent`. 2026-05-29 18:58:00 +09:00 - Expanded the Route B slice to include `AudioPlayer` spacing cleanup after reviewer feedback flagged stacked margins around the newly nested pronunciation player. 2026-05-29 19:05:00 +09:00 - Completed the pronunciation/audio spacing adjustment and reviewer re-check; the nested player now sits directly below the pronunciation text with a divider beneath it. 2026-05-29 19:25:00 +09:00 - Re-scoped to a Route A sidebar caption polish after the left sidebar chapter/verse caption was judged too flat versus the reference image.

## Open Review Item
- None.
