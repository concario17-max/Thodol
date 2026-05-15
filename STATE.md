# State

## Current Task
Completed: expose a commentary-only header icon that opens the `학습만화` right panel, keep the verse mode toggle ordered as `해설 / 심화`, and make the desktop right panel occupy a real grid column.

## Route
Route B

## Writer Slot
main: planner-only

## Contract Freeze
Frozen scope completed:
- Keep the verse mode toggle in `src/components/Header.tsx` as `해설 / 심화`.
- Add a commentary-only header icon in `src/App.tsx` that opens the right-side `학습만화` panel.
- Update `src/context/UIContext.tsx` so the right panel closes when verse mode leaves `commentary`.
- Update `src/components/CommentarySidebar.tsx` to present as `학습만화`.
- Update `src/components/ui/AppShell.tsx` and `src/components/ui/desktopVerseLayout.ts` so the desktop right panel gets a dedicated rail/column instead of wrapping under the main content.
- Keep the rest of the app layout, routing, sidebar, and data flow unchanged.

Reason for Route B:
- The request crosses shared UI state, the app shell, the desktop grid, and the right-side panel content.
- The icon visibility and panel close behavior depend on shared state, and the desktop right rail needed grid-level changes.

## Write Sets
- main: `STATE.md`
- worker_shared: `src/context/UIContext.tsx`, `src/App.tsx`, `src/components/ui/AppShell.tsx`, `src/components/ui/desktopVerseLayout.ts`
- worker_feature: `src/components/CommentarySidebar.tsx`

## Reviewer
No findings.

## Last Update
2026-05-15 - Completed the commentary icon / learning-comic panel task, including the desktop right rail fix, after reviewer pass with no findings.
