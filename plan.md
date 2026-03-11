# Yoga Sutra UI Phase 3 - Scale & Depth Refinement Plan

## 1. Title & Header Spacing
- [x] Increase the main "YOGA SUTRAS" title font size by 5 points (Systematic scaling from `48px` to `53px` or equivalent Tailwind class).
- [x] Insert a vertical blank line (additional spacing) between "The Light of Yoga" and the navigation menu (Compendium, Lexicon, Commentaries).

## 2. Card Visual Depth (GlassCard)
- [x] Extend the card length by increasing the minimum height (`min-h-[400px]` -> `min-h-[460px]` or similar).
- [x] Enhance the readability of chapter descriptions inside the cards:
  - [x] Increase font size slightly (+1px/pt).
  - [x] Adjust line-height or font-weight for maximum clarity on the "Deep Gold" theme.
  - [x] Switch to a more readable sans-serif font for the descriptions.

## 3. Implementation Process
- [x] Modify `src/pages/ChapterList.tsx` for header and navigation spacing.
- [x] Modify `src/components/ui/GlassCard.tsx` for height and typography refinements.
- [x] Perform a final visual balance check on desktop.

## 4. Verification & Sync
- [x] Verify that the increased title size doesn't break the responsive layout.
- [x] Ensure the blank line between headers is visually consistent.
- [x] Auto-commit and push changes (Ray Standard).
