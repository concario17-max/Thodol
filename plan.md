# Yoga Refinement Plan

## 1. Global UI Fixes
- [ ] Fix Header title in `App.tsx` (Change "Default Title" to "Yoga Sutras").
- [ ] Adjust `SidebarMenu.tsx` layout to favor Verse list visibility (fixed height for Chapters 1-4).

## 2. Verse View Content Cleanup
- [ ] **SutraContent.tsx**:
    - [ ] Remove `showLexicon` state and toggle logic.
    - [ ] Remove "Word-by-Word" button and Lexicon grid.
- [ ] **TranslationSection.tsx**:
    - [ ] Create a merged section for "앨리스 A. 베일리" (Alice A. Bailey).
    - [ ] Create a merged section for "니콜라스 서튼" (Nicholas Sutton).
    - [ ] Ensure proper spacing and typography for merged blocks.
- [ ] **VerseView.tsx**:
    - [ ] Update props passed to sub-components to reflect new structure.

## 3. Verification & Push
- [ ] Verify all UI changes in both Light and Dark modes.
- [ ] Audit console for any stray logs.
- [ ] Auto-commit and push changes (Ray Standard).
