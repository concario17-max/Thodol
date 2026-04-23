# State

## Current Task
Completed: the verse route now swaps body and commentary in the main area via the `본문 / 해설` header toggle, with the right commentary panel removed and browser smoke verifying the real UI.

## Route
Route A

## Writer Slot
main: closed

## Contract Freeze
Completed. The verse route swaps body/commentary in the main area, keeps the audio state coherent across mode changes, and `scripts/browser_smoke.mjs` verifies the real UI behavior.

## Write Sets
- main: completed `src/App.tsx`, `src/components/Header.tsx`, `src/context/UIContext.tsx`, `src/pages/VerseView.tsx`, `scripts/browser_smoke.mjs`

## Reviewer
reviewed by `Turing`

## Last Update
2026-04-23 - Body/commentary toggle completed, audio state preserved across mode changes, and verification passed with `typecheck`, `build`, and `qa:browser`.
