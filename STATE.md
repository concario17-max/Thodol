# State

## Current Task
Completed: fix the mobile reading flow so the left panel appears before the main body and the header is cleaner, including the mobile selector controls.

## Route
Route B
Reason: User explicitly constrained the work to the shared Route B write set only.

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Make the mobile reading flow show the left reading panel before the main body instead of behaving like a hidden drawer.
- Keep the mobile sidebar from consuming the full viewport height so the body can follow beneath it.
- Tweak the header so the mobile controls fit the new order cleanly.
- Make the mobile header controls wrap cleanly and stay usable.
- Keep desktop behavior intact unless a shared layout primitive needs a minimal adjustment.

Completed. The mobile reading flow now stacks the left panel before the main body, and the mobile controls wrap cleanly.

## Write Sets
- worker_shared: `src/components/ui/AppShell.tsx`, `src/components/ui/SidebarLayout.tsx`, `src/components/Header.tsx`
- worker_feature: `src/App.tsx`

## Reviewer
reviewer done

## Last Update
2026-04-24 - Finished the mobile reading-flow cleanup and verified typecheck/build.
