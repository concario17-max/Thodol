# State

## Current Task
Active: reorder the verse mode toggle to `해설 / 심화` and make the verse page open in `해설` mode by default.

## Route
Route B

## Writer Slot
main: planner-only

## Contract Freeze
Frozen scope:
- Update the verse mode toggle labels/order in `src/components/Header.tsx` to `해설` first and `심화` second.
- Update the default verse content mode in `src/context/UIContext.tsx` so the verse page opens in `해설` mode.
- Keep the rest of the app layout, routing, sidebar, and data flow unchanged.

Reason for Route B:
- The request crosses the header and shared UI state, so it needs coordinated changes in more than one file.
- The default first-screen mode is controlled outside the header.

## Write Sets
- main: `STATE.md`
- worker_shared: `src/context/UIContext.tsx`
- worker_feature: `src/components/Header.tsx`

## Reviewer
pending

## Last Update
2026-05-15 - Reclassified the header mode-order/default-mode task to Route B because it touches shared UI state and the header together.
