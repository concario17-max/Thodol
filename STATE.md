# State

## Current Task
Completed: redesign the Yoga app layout and visual system to mirror the calendar site as closely as possible.

## Route
Route B

## Writer Slot
main: closed

## Contract Freeze
Frozen scope:
- Rebuild the Yoga reading experience so it follows the calendar site's frame language, surface logic, typography balance, and asymmetrical two-column composition.
- Keep Yoga content and routes intact, but replace the current visual hierarchy with a calendar-like editorial shell.
- Preserve the mobile single-column fallback.
- Keep the current data sources and verse/commentary content models unless a layout requirement forces a light shape change.

Completed. The app now uses a calendar-like editorial shell with softer surfaces, tighter header controls, asymmetrical desktop framing, and preserved mobile stacking.

Reason for Route B:
- This request spans shared shell, header, reading panels, typography, spacing, color tokens, and responsive behavior.
- It touches multiple directories and requires coordinated layout, content, and QA work.
- The goal is visual parity with another site, so the contract must be frozen before implementation starts.

## Write Sets
- worker_shared: completed `src/components/ui/AppShell.tsx`, `src/components/ui/SidebarLayout.tsx`, `src/components/ui/desktopVerseLayout.ts`, `src/index.css`
- worker_content: completed `src/App.tsx`, `src/components/Header.tsx`, `src/components/Sidebar.tsx`, `src/pages/VerseView.tsx`, `src/components/CommentarySidebar.tsx`, `src/components/verse/SutraHeader.tsx`, `src/components/verse/TranslationSection.tsx`, `src/components/verse/SutraContent.tsx`, `src/components/verse/WordMeanings.tsx`

## Reviewer
reviewer done

## Last Update
2026-05-13 - Finished the calendar-style Yoga layout overhaul, fixed the pronunciation regex regression, and passed final typecheck, build, and review.
