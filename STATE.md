# State

## Current Task
Completed: make chapter 1 learning-comic images reliably available for chapter 1 commentary toggling by tracking them under `src/assets/learning-comic/chapter-1` and wiring `VerseView.tsx` to that tracked asset path.

## Route
Route B

## Writer Slot
main: planner-only, asset-linked UI task

## Contract Freeze
Frozen scope:
- Confirm why the chapter 1 learning-comic linkage is not reliable in the deployed tree.
- Make the chapter 1 learning-comic images available to the app in a way that survives clone/build/deploy.
- Keep the rest of the verse layout unchanged.
- Do not touch the untracked root `.odt` reference files.
- Preserve the commentary icon toggle behavior for chapter 1.

Reason for Route B:
- This task now touches app code plus a learning-comic asset folder, so the scope is no longer a single safe slice.
- The deployed tree needs a durable asset path, not just a local workspace reference.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- worker_asset: `src/pages/VerseView.tsx`, `src/assets/learning-comic/chapter-1/**`

## Reviewer
not used: local verification only

## Last Update
2026-05-18 17:33:42 +09:00 - Moved the chapter 1 learning-comic images into tracked source assets and rewired `VerseView.tsx` to load them from `src/assets/learning-comic/chapter-1`.

## Open Review Item
- Resolved: the commentary header icon now toggles between text commentary and the chapter 1 learning-comic images, and the comic assets now come from tracked source files.
