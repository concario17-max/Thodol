# Error Log

- time: 2026-05-14 00:00:00 +09:00
  location: `npm run build`
  summary: PowerShell script execution policy blocked `npm.ps1`.
  details: The first build check failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran with `npm.cmd run build`, which succeeded.
  status: resolved

- time: 2026-04-23 15:53:48 +09:00
  location: `npm run typecheck`
  summary: PowerShell script execution policy blocked `npm.ps1`.
  details: `npm run typecheck` failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`.
  status: resolved

- time: 2026-04-23 15:42:26 +09:00
  location: `npm run typecheck`
  summary: PowerShell script execution policy blocked `npm.ps1`.
  details: `npm run typecheck` failed before running project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`.
  status: resolved

- time: 2026-04-23 15:42:26 +09:00
  location: `npm.cmd run typecheck`
  summary: Verified the same check through the `.cmd` shim after the PowerShell policy block.
  details: Re-ran typecheck with `npm.cmd` and it completed successfully.
  status: resolved

- time: 2026-04-23 15:43:00 +09:00
  location: `npm run build`
  summary: PowerShell script execution policy blocked `npm.ps1`.
  details: The first build attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran with `npm.cmd run build`, which succeeded.
  status: resolved

- time: 2026-04-23 16:01:28 +09:00
  location: `npm run typecheck`
  summary: PowerShell script execution policy blocked `npm.ps1`.
  details: `npm run typecheck` failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`.
  status: open

- time: 2026-04-23 16:01:28 +09:00
  location: `npm.cmd run typecheck`
  summary: Verified the same check through the `.cmd` shim after the PowerShell policy block.
  details: Re-ran typecheck with `npm.cmd` and it completed successfully.
  status: resolved

- time: 2026-04-23 16:01:28 +09:00
  location: `npm run typecheck`
  summary: Resolved the PowerShell policy block by rerunning through the `.cmd` shim.
  details: The initial `npm run typecheck` attempt was blocked by `npm.ps1`; the follow-up `npm.cmd run typecheck` succeeded.
  status: resolved

- time: 2026-04-23 16:01:28 +09:00
  location: `npm.cmd run build`
  summary: Verified the production build through the `.cmd` shim after the PowerShell policy block.
  details: Re-ran the build with `npm.cmd` and it completed successfully.
  status: resolved

- time: 2026-04-23 16:12:00 +09:00
  location: `npm run build`
  summary: PowerShell execution policy blocked `npm.ps1` again during verification.
  details: The first build attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. The build was rerun with `cmd /c npm run build` and completed successfully.
  status: resolved
## 2026-04-23
- time: 2026-04-23T16:56+09:00
- location: `C:\Users\roadsea\Desktop\yoga`
- summary: `npm run build` failed under PowerShell execution policy
- details: `npm.ps1` could not be loaded because script execution is disabled; reran verification with `cmd /c npm run build`, which passed.
- status: resolved
- time: 2026-04-23 16:59:50 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran with `cmd /c npm run typecheck`, which succeeded.
  status: resolved
- time: 2026-04-23 16:59:50 +09:00
  location: `cmd /c npm run qa:browser`
  summary: Browser smoke timed out after the verse mode persistence check left the page in commentary mode.
  details: The smoke test initially failed because the new persistence check kept the verse page in commentary mode before the translation label assertions. Updated the script to use visible verse-mode buttons and restore body mode before the remaining checks, then reran successfully.
  status: resolved
- time: 2026-04-23 17:03:49 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran with `npm.cmd run typecheck`, which succeeded.
  status: resolved
time: 2026-04-24T00:00:00+09:00
location: git commit step
summary: PowerShell command separator error while staging and committing
details: Used '&&' in PowerShell, which is not supported in this environment. No repository files were changed by the failed command. Retrying with separate commands.
status: resolved
time: 2026-04-24T00:00:00+09:00
location: subagent spawn
summary: Subagent thread limit blocked initial Route B delegation
details: Attempted to spawn worker and reviewer agents in parallel, but the workspace hit the maximum thread limit. Closed stale agents and retried successfully.
status: resolved
- time: 2026-04-24 17:27:05 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The initial typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the same check with `npm.cmd run typecheck`.
  status: resolved
- time: 2026-04-24 17:45:00 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first verification attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the check with `npm.cmd run typecheck`, which succeeded.
  status: resolved
- time: 2026-04-24 17:31:16 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the same check with `npm.cmd run typecheck`, which passed.
  status: resolved
- time: 2026-05-14 00:00:00 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran through `npm.cmd run typecheck`, which passed.
  status: resolved
- time: 2026-05-14 15:28:00 +09:00
  location: `npm run build`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first build attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the build with `npm.cmd run build`, which succeeded.
  status: resolved
- time: 2026-05-14 15:31:22 +09:00
  location: `npm run build`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first build attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the build with `cmd /c npm run build`, which succeeded.
  status: resolved
- time: 2026-05-14
  location: git commit step
  summary: PowerShell rejected chained command separator
  details: The combined `git add ... && git commit ...` command failed because this shell does not accept `&&` as a statement separator.
  status: resolved
- time: 2026-05-14 15:33:00 +09:00
  location: `npm run build`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first build attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the build with `npm.cmd run build`, which succeeded.
  status: resolved
- time: 2026-05-14 16:46:38 +09:00
  location: `npm run typecheck`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first typecheck attempt failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran with `cmd /c npm run typecheck`, which passed.
  status: resolved
- time: 2026-05-15 00:00:00 +09:00
  location: `src/components/ui/SidebarLayout.tsx`
  summary: duplicate `desktopBorderClass` declaration from sidebar gray refactor
  details: The shared-surface patch introduced a second `desktopBorderClass` declaration, which breaks both typecheck and build with TS2451. The file needs a small cleanup before verification can pass.
  status: open
- time: 2026-05-15 00:00:00 +09:00
  location: `src/components/ui/SidebarLayout.tsx`
  summary: duplicate `desktopBorderClass` declaration resolved
  details: Removed the extra `desktopBorderClass` declaration and kept the left-sidebar border behavior aligned with the warm-gray surface treatment. `typecheck` and `build` are green again.
  status: resolved
- time: 2026-05-18 15:47:38 +09:00
  location: `npm run typecheck` / `npm run build`
  summary: PowerShell execution policy blocked `npm.ps1` during verification.
  details: The first verification attempts failed before project checks because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran both checks with `npm.cmd`, which passed.
  status: resolved
[2026-05-19 00:00 +09:00] location: npm run build
summary: PowerShell execution policy blocked npm.ps1
details: Build verification could not start because PowerShell refused to load C:\Program Files\nodejs\npm.ps1. Retrying with npm.cmd is required.
status: open

[2026-05-19 00:00 +09:00] location: npm run build
summary: Build verification completed via npm.cmd
details: The same build finished successfully when invoked as `cmd /c npm.cmd run build`.
status: resolved
[2026-05-19 12:45 +09:00] location: npm.cmd run typecheck && npm.cmd run build
summary: PowerShell rejected `&&` in verification command
details: The combined verification command failed before execution because PowerShell treated `&&` as invalid syntax. Re-ran the checks as separate PowerShell statements with `npm.cmd`, and both passed.
status: resolved

- time: 2026-05-20 00:00:00 +09:00
  location: `npm.cmd run typecheck` / `npm.cmd run build`
  summary: Typecheck and build failed due to an unused `currentChapter` binding after refactoring the context picker
  details: The new draft-selection flow in `src/App.tsx` left `currentChapter` unused in `MainLayout`, which caused TS6133 and blocked both verification commands. Removing the unused binding should restore green checks.
  status: open

- time: 2026-05-20 00:00:00 +09:00
  location: `npm.cmd run typecheck` / `npm.cmd run build`
  summary: Verification failed again because `allChapters` became unused after simplifying the context picker flow
  details: After removing `currentChapter`, `MainLayout` still destructured `allChapters` from `useYogaData()` even though the new picker flow only needs `chapters` and `loading`. Removing the unused binding should unblock the build.
  status: open

- time: 2026-05-20 00:00:00 +09:00
  location: `npm.cmd run typecheck` / `npm.cmd run build`
  summary: `currentChapter` unused binding resolved
  details: Removed the unused `currentChapter` binding from `MainLayout` after switching the context picker to draft chapter selection. Typecheck and build passed again.
  status: resolved

- time: 2026-05-20 00:00:00 +09:00
  location: `npm.cmd run typecheck` / `npm.cmd run build`
  summary: `allChapters` unused binding resolved
  details: Removed the unused `allChapters` binding from `MainLayout` after the picker flow no longer needed it. Typecheck and build passed again.
  status: resolved

- time: 2026-05-27 15:43:09 +09:00
  location: `npm run typecheck` / `npm run build`
  summary: PowerShell blocked `npm.ps1` during verification
  details: Initial verification failed because PowerShell could not load `C:\Program Files\nodejs\npm.ps1`. Re-ran the checks with `npm.cmd` instead.
  status: resolved

- time: 2026-05-27 15:58:10 +09:00
  location: `src/components/commentary/CommentaryMarkdown.tsx`, `src/pages/VerseView.tsx`
  summary: Typecheck failed on dynamic heading rendering and nullable chapter access
  details: `CommentaryMarkdown` used a JSX namespace path TS could not resolve, and `VerseView` narrowed `currentChapter` too loosely for strict null checks. Both issues were fixed before rerunning verification.
  status: resolved

- time: 2026-05-28 00:00:00 +09:00
  location: `dist/gita.json`
  summary: Raw JSON parse failed because of a UTF-8 BOM
  details: A direct `JSON.parse` on `dist/gita.json` threw until the BOM was stripped first. The file is still usable, but the encoding detail matters for any loader that reads it verbatim.
  status: resolved
- time: 2026-05-28 16:11:29 +09:00
  location: `npm.cmd exec vitest run src/utils/dataFetcher.test.ts` / `npm.cmd run typecheck`
  summary: PowerShell blocked `npm.ps1` during verification
  details: Initial verification attempts failed because the shell policy would not load `C:\Program Files\nodejs\npm.ps1`. Re-ran both checks with `npm.cmd`, and they passed.
  status: resolved
- time: 2026-05-28 16:15:20 +09:00
  location: `cmd /c npm run typecheck` / `cmd /c npx vitest run src/utils/dataFetcher.test.ts` / `cmd /c npm run build`
  summary: Verification completed successfully after switching to the `.cmd` shim
  details: The PowerShell execution policy blocked the initial `npm`/`npx` invocations. Re-ran the typecheck, targeted vitest, and production build through `cmd /c`, and all three passed.
  status: resolved
- time: 2026-05-28 23:17:17 +09:00
  location: `cmd /c npx vitest run src/utils/dataFetcher.test.ts`
  summary: Targeted vitest failed on stale fixture expectations during the Ω…»≠ data refactor
  details: The new translation extraction code passed typecheck and build, but the test still expected the old appendix and section labels. Updated the fixture expectations to match the merged `book` + `prayers` contract and reran the test successfully.
  status: resolved

- time: 2026-05-29 00:09:44 +09:00
  location: public/prayers.json injection script
  summary: section-header parser misdetected verse lines and missed chapter headers
  details: initial title-based injection attempts failed because shell-embedded Korean literals were mangled and a loose numeric header regex matched verse lines; resolved by deriving section order from the source files themselves and using header-title order to map translations.
  status: resolved
## 2026-05-29 01:00:00 +09:00
- time: 2026-05-29 01:00:00 +09:00
- location: git push to origin/codex/gita-data-sync
- summary: Direct push from the main worktree was rejected, and the rebase retry failed because of disk-space and path-write issues.
- details: git push hit HTTP 500 from the remote. A rebase with autostash then failed while restoring tracked files, with no space left on device and path unlink/write errors. The branch was later pushed successfully from a clean shared clone at C:\Users\roadsea\Desktop\thodol-push-temp4.
- status: resolved## 2026-05-29 01:20:00 +09:00
- time: 2026-05-29 01:20:00 +09:00
- location: git push to origin/codex/gita-data-sync
- summary: The branch was finally published after cherry-picking the sidebar stack fix onto a clean clone of the remote branch.
- details: A direct push from the main worktree kept failing with HTTP 500 and a few temporary clone attempts were miswired to the local repository. The final push succeeded from C:\Users\roadsea\Desktop\thodol-push-temp6 after setting origin to GitHub, resolving one STATE.md cherry-pick conflict, and pushing commit 2981a79 to origin/codex/gita-data-sync.
- status: resolved## 2026-05-29 02:00:00 +09:00
- time: 2026-05-29 02:00:00 +09:00
- location: git force-push to origin/codex/gita-data-sync
- summary: History cleanup could not be completed because GitHub kept returning HTTP 500 during force-push attempts.
- details: Multiple push attempts from clean shared clones failed while trying to move codex/gita-data-sync from 70fe845 to 2e9472f. The local commit exists, but the remote branch pointer remains on the earlier commit because the server consistently terminated the send-pack session.
- status: open- time: 2026-05-29 15:00:00 +09:00
  location: C:\Users\roadsea\Desktop\tibet-1-publish
  summary: validation initially failed in the fresh worktree because npm scripts could not find local dependencies
  details: PowerShell blocked npm.ps1 first, then cmd/npm failed because the worktree had no node_modules until a junction to the parent worktree was created
  status: resolved
- time: 2026-05-29 17:30:00 +09:00
  location: `git push origin HEAD:codex/learning-comic-cleanup`
  summary: direct push from the cleanup branch failed with HTTP 500 until the history was rewritten in a temporary clone
  details: Initial push attempts from the raw cleanup worktree timed out and then failed with HTTP 500. The branch was cloned into a temporary repository, rewritten with git filter-branch to remove learning-comic assets from history, repointed to the GitHub remote, and then pushed successfully.
  status: resolved
- time: 2026-05-29 17:45:00 +09:00
  location: `gh auth status` / `gh repo view`
  summary: pull request creation blocked because GitHub CLI is not installed in this environment
  details: The publish branch was pushed successfully, but the PR creation workflow could not continue because the `gh` command is unavailable on PATH. A draft PR could not be opened through the preferred GitHub CLI path, and no authenticated fallback path is available in this session.
  status: open
2026-05-29 18:30:00 +09:00 | git push origin HEAD:main | HTTP 500 / remote hangup | Direct main push from the dirty root repo timed out with HTTP 500, then the publish was rebased onto origin/codex/gita-data-sync and pushed successfully as d80f0f8. | resolved
2026-05-29 18:42:00 +09:00 | npm run typecheck | PowerShell execution policy blocked npm.ps1 | Verification failed in PowerShell; use cmd /c npm run typecheck instead. | resolved
