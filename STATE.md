# State

## Current Task
Adjust commentary typography so the title stays as-is, subtitles are one step smaller and lighter, and 핵심 키워드 keeps body size with its own accent styling.

## Route
Route A

## Writer Slot
main: direct

## Contract Freeze
Frozen scope:
- Keep the main commentary title size unchanged.
- Make commentary subtitles one step smaller and lighter than the title.
- Render 핵심 키워드 at the same body size as normal paragraphs, but give it a distinct accent treatment.
- Keep the verse-reader, audio, album, sidebar, comic, and ODT commentary content unchanged.

Reason for Route A:
- This is now a tight single-slice typography adjustment in the shared commentary renderer.

## Write Sets
- main: `STATE.md`, `MULTI_AGENT_LOG.md`
- feature slice: `src/components/commentary/CommentaryMarkdown.tsx`

## Reviewer
reviewer: pending

## Last Update
2026-05-30 00:00:00 +09:00 - Updated `CommentaryMarkdown` so body-internal titles stay prominent, subtitles are lighter/smaller, and 핵심 키워드 renders at body size with an accent block; `npm.cmd run typecheck` and `npm.cmd run build` both passed.

## Open Review Item
- None.
