# Yoga Project In-Depth Research Report (Refinement Phase)

## Architectural Overview
The project is a React-based SPA focusing on the Yoga Sutras. It uses a modular architecture with custom hooks for logic and specialized UI components for rendering.

## New Findings & Refinement Requirements

### 1. Header Navigation
- **Issue**: The `Header` component defaults to "Default Title" on the Verse View page because no title prop is passed in `App.tsx`.
- **Solution**: Pass `"Yoga Sutras"` or similar to the `Header` component in `App.tsx`'s `MainLayout`.

### 2. Sidebar Layout Balance
- **Requirement**: Move the divider below Chapter 4 to maximize Verse list visibility.
- **Analysis**: `SidebarMenu.tsx` currently splits the sidebar 50/50 using `flex-1` on both Chapter and Verse containers.
- **Optimization**: Change the Chapter container to a fixed or dynamic height that fits 4 chapters perfectly, and give the Verse container the remaining space.

### 3. Verse View Content Structure
- **Requirement**: Simplify the verse page and re-attribute translations.
- **SutraContent**:
    - Remove the "Word-by-Word" (Lexicon) toggler and grid to reduce visual clutter.
    - Ensure Sanskrit and Phonetics are the primary focus.
- **TranslationSection**:
    - **Alice A. Bailey**: Merge English and Korean 1 translations. This provides a unified view for her school of thought.
    - **Nicholas Sutton**: Merge the Oxford translation and Commentary fields. This centralizes his scholarly analysis.
    - **Commentary Payload**: Maintain the field structure but default to empty/placeholder as requested.

## Implementation Strategy
- Use the "Zero Monolith" principle to keep these changes isolated in their respective components (`SutraContent`, `TranslationSection`, `SidebarMenu`).
- Maintain the "Ray" persona's strict coding standards (no logs, clean types, premium UI).
