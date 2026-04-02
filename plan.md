# Yoga Remediation Plan

Updated: 2026-03-20
Status: completed
Source of truth: `research.md`

This file tracks the full-project remediation pass requested after the latest repository-wide research review.

## 1. Guardrails and sequencing

- [x] Freeze scope to code, documentation, QA, and content mismatches found in `research.md`.
- [x] Avoid unrelated feature work during this pass.
- [x] Keep runtime behavior stable unless a stronger fix is required.
- [x] Execute work in this order:
- [x] content and encoding cleanup
- [x] stale documentation repair
- [x] stale QA and browser smoke repair
- [x] commentary and layout consistency cleanup
- [x] final verification sweep

## 2. Encoding and content cleanup

- [x] Audit the active `src/` tree for remaining encoding-corrupted user-facing strings.
- [x] Fix chapter metadata copy in `src/constants.ts`.
- [x] Fix the sidebar title in `src/components/Sidebar.tsx`.
- [x] Fix the sidebar empty state in `src/components/ui/SidebarMenu.tsx`.
- [x] Fix translation section headings in `src/components/verse/TranslationSection.tsx`.
- [x] Fix malformed and corrupted compendium copy in `src/components/CompendiumModal.tsx`.
- [x] Fix commentary study prompt copy in `src/components/CommentarySidebar.tsx`.
- [x] Normalize corrupted labels in active test fixtures.

## 3. Metadata integrity

- [x] Re-audit `YOGA_CHAPTERS_META`.
- [x] Confirm Korean chapter names match the intended wording.
- [x] Confirm English chapter names still match the runtime cards and sidebar labels.
- [x] Confirm descriptions are readable and free from encoding artifacts.
- [x] Reconfirm sutra counts match `public/data.json`.

## 4. Data loading and fallback quality

- [x] Re-review `src/utils/dataFetcher.ts` fetch-failure behavior.
- [x] Replace silent `{}` fallback with a thrown load error.
- [x] Surface provider load failures through `YogaDataContext`.
- [x] Show load error UI on the landing page in `src/pages/ChapterList.tsx`.
- [x] Show load error UI on the verse page in `src/pages/VerseView.tsx`.
- [x] Add explicit lexicon load failure UI in `src/components/LexiconModal.tsx`.
- [x] Update `src/utils/dataFetcher.test.ts` to reflect the stronger failure contract.

## 5. Commentary panel reality check

- [x] Reject the empty commentary shell as insufficient.
- [x] Define a minimum viable study-guide contract for commentary.
- [x] Implement chapter frame, key line, study prompts, and usage guidance in `src/components/CommentarySidebar.tsx`.
- [x] Keep mobile and desktop commentary drawer behavior unchanged while improving content.
- [x] Align documentation and QA expectations with the real commentary panel.

## 6. Documentation accuracy

- [x] Rewrite `README.md` to match the live app.
- [x] Remove stale reflections references from `README.md`.
- [x] Document the commentary-only right panel and current desktop frame rules.
- [x] Confirm build and QA commands in `README.md` match `package.json`.
- [x] Audit `docs/` for stale conflicting guidance.
- [x] Mark `docs/리서치.md` as historical.
- [x] Mark `docs/plan.md` as historical.

## 7. Browser smoke QA repair

- [x] Audit `scripts/browser_smoke.mjs` against the live UI.
- [x] Remove stale reflections and `textarea` assumptions.
- [x] Rewrite the smoke flow around:
- [x] landing page navigation
- [x] verse route loading
- [x] desktop commentary availability and persistence
- [x] mobile sidebar open and route selection
- [x] mobile commentary drawer open and close
- [x] Fix the storage-reset bug in the smoke script so reload-based persistence checks stay valid.

## 8. Layout and shared-frame follow-up

- [x] Reconfirm the desktop frame still uses:
- [x] `20 / 60 / 20`
- [x] `0 / 60 / 40`
- [x] `20 / 80 / 0`
- [x] `0 / 100 / 0`
- [x] Verify main-panel expansion still works when commentary is hidden.
- [x] Verify commentary gap fixes remain intact.
- [x] Keep reading-column padding readable after the earlier gap repair.
- [x] Add a targeted test for `desktopVerseLayout.ts`.

## 9. Verification

- [x] Run `npm run typecheck`.
- [x] Run `npm run test -- --run`.
- [x] Run `npm run build`.
- [x] Run `npm run qa:browser`.

## 10. Closeout

- [x] Update `research.md` to reflect the remediated repository state.
- [x] Rewrite `plan.md` so completion status is readable and current.
- [x] Keep historical notes in `docs/` but remove them as active guidance.
- [x] Record final scope and verification status in repository docs.

## 11. Chapter 4 Commentary Import

- [ ] Inspect `요가수트라 해설_4. 깨달음.odt` structure and confirm verse boundaries before generating any new data file.
- [ ] Extract chapter 4 commentary into a new `src/data/chapter4Commentary.ts` file using the shared `CommentaryBlock` / `CommentaryTable` structure.
- [ ] Preserve real tables as `table` blocks instead of flattening them into paragraphs.
- [ ] Preserve numbered list items so the shared sidebar can render `1. 2. 3.` markers rather than collapsing them into dot bullets.
- [ ] Remove non-content artifacts from the ODT import:
- [ ] `Plaintext` markers
- [ ] `Online Mode` / `Offline Mode` lines
- [ ] `참조 출처` / `Verified Sources`
- [ ] search-strategy and web-search meta labels
- [ ] other trailing reference/footer blocks that are not real commentary
- [ ] Verify chapter 4 verse keys align with the source document and that no verse numbers are skipped like the earlier missing chapter 2 verse 4 issue.
- [ ] Add chapter 4 support to the shared lookup in `src/components/CommentarySidebar.tsx` while keeping chapter 1/2/3 behavior unchanged.
- [ ] Keep the existing inline heading rule so the first title shows next to the `4.x` verse number and is not duplicated in the block list.
- [ ] Run a focused encoding audit on the generated chapter 4 file before merging, because the current `src/data/chapter3Commentary.ts` shows mojibake and the same generation path could repeat that corruption.
- [ ] Run `npm.cmd run typecheck`.
- [ ] Run `npm.cmd run build`.
- [ ] Smoke-check a few representative chapter 4 verses after import:
- [ ] one verse with a table
- [ ] one verse with numbered list items
- [ ] one verse with a trailing reference block removed
