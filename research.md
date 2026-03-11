# Yoga Project Architecture & Design Research Report

## 1. System Architecture Overview
The project is a modern React web application built with **React 19**, **Vite 7**, and **Tailwind CSS 4**. It serves as a digital compendium for the Yoga Sutras, featuring a highly interactive, "Meta-Design" aesthetic.

### Core Tech Stack
- **Framework**: React 19 (using modern patterns like `lazy` loading and Context API).
- **Styling**: Tailwind CSS 4.0. The configuration is primarily handled via the `@theme` block in `src/index.css`, utilizing CSS variables for semantic coloring.
- **Routing**: `react-router-dom` v7.
- **State**: `UIContext` manages sidebar/panel states; `ThemeContext` manages light/dark mode.
- **Assets**: Static assets in `public/`. Data is stored in `public/data.json`.

## 2. Component Analysis
The UI follows a "Zero Monolith" approach, extracting logic into reusable UI components.

- **AppShell (`src/components/ui/AppShell.tsx`)**: The root layout wrapper providing a 100dvh container with an ambient radial spotlight background.
- **ChapterList (`src/pages/ChapterList.tsx`)**: The landing page displaying four main chapters of the Yoga Sutras.
- **GlassCard (`src/components/ui/GlassCard.tsx`)**: A premium, glassmorphic card component used for navigation.
- **VerseView (`src/pages/VerseView.tsx`)**: The core reading interface with audio playback and commentaries.

## 3. Design Audit & Identified Issues

### 3.1 Layout & Spacing
- **Grid Density**: `ChapterList` currently uses `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. For 4 chapters, this leaves a trailing card on a new line or skewed spacing.
- **Vertical Bloat**: Extensive use of `mb-16`, `pb-20`, and large `py` paddings makes the content exceed the viewport height on standard resolutions.

### 3.2 Visual Identity & Icons
- **Icon Mismatch**: The header icon references `gita_header_icon.png`, suggesting a leftover asset from a previous Gita project.
- **Visual Glitches**: The user noted "아이콘 찐빠" (icon glitches) above titles, likely referring to the alignment or sizing of these assets.

### 3.3 Color Palette (Current vs. Proposed)
The current "Bright Gold" theme uses high-luminance backgrounds:
- `gold-bg`: `#F9F6F0` (Too bright)
- `gold-primary`: `#D4AF37`
- `gold-surface`: `#F2EBE1`

**Proposed "Deep Gold" Palette:**
- Backgrounds should shift towards warmer, darker parchment or "Shadow Gold" tones.
- Accents should move towards "Antique Gold" (#B8860B) or "Burnished Gold" to reduce eye strain and increase premium feel.

## 4. Implementation Strategy
- **Theme**: Update `@theme` tokens in `index.css`.
- **Layout**: Refactor `ChapterList` grid to `lg:grid-cols-4` and tighten spacing tokens.
- **Component Refinement**: Adjust `GlassCard` internal padding and icon size to maintain elegance in a denser layout.
