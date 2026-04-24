# State

## Current Task
Completed: the desktop verse layout now stays open on lg+ widths so the left panel and title cannot disappear because of a stored closed state.

## Route
Route A

## Writer Slot
main: closed

## Contract Freeze
Completed. The desktop sidebar now opens automatically whenever the browser is at lg+ width, overriding any stored closed state so the title and left panel remain visible on desktop widths.

## Write Sets
- main: completed `src/context/UIContext.tsx`

## Reviewer
manual verification

## Last Update
2026-04-24 - Desktop widths now force the sidebar open so the title cannot disappear.
