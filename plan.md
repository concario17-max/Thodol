# Yoga Sutra UI Phase 2 - Density & Typography Refinement Plan

## 1. Global Typography & Readability
- [x] Increase global font size by 1pt (approx. 6.25%) across the application.
- [x] Refine Korean text readability by increasing `line-height` (leading) for descriptions.
- [x] Implement font size increase (+3 levels) for main chapter titles in cards.

## 2. Dynamic Chapter Iconography
- [x] Replace generic `֍` icon with unique, thematic icons from `Lucide`:
  - Chapter 1: `Target` (Samadhi - Concentration)
  - Chapter 2: `Zap` (Sadhana - Practice)
  - Chapter 3: `Sparkles` (Vibhuti - Powers)
  - Chapter 4: `Cloud` (Kaivalya - Liberation)

## 3. Home Page (ChapterList) Layout Refinement
- [x] Reduce Chapter/Verse selector box height by 1/3 (tighten internal padding).
- [x] Halve the margin between the selector box and the chapter cards (`mb-10` -> `mb-5`).
- [x] Refactor chapter title display:
  - Remove parentheses from the Korean title below the English title.
  - Apply the +3 font size scaling to English titles.
- [x] Update `src/constants.ts` with significantly longer, more academic descriptions for each chapter.

## 4. Enhanced Card Design (GlassCard)
- [x] Increase minimum card height (`min-h`) to accommodate longer descriptions and create a more elegant vertical presence.
- [x] Adjust internal spacing to maintain balance with larger titles and longer text.

## 5. Verification & Sync
- [x] Verify "one-page" visual balance on desktop.
- [x] Ensure font scaling is consistent across ChapterList and VerseView.
- [x] Auto-commit and push changes (Ray Standard).
