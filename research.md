# Yoga Project Deep Architecture & Phase 2 Refinement Report

## 1. Project Anatomy (Deep Dive)
The Yoga Sutras application is a specialized text-viewer with a strong emphasis on **aesthetic density** and **typography**.

### 1.1 State & Routing Mechanism
- **Selective Data Loading**: `fetchYogaData()` in `dataFetcher.ts` loads a static `data.json`. The application structure is hierarchical: `Chapter -> Sutra -> Tokens`.
- **URL-Based State**: Routing via `react-router-dom` ensures that the user's location is the primary source of truth for the verse being read, enabling direct links to specific sutras.

### 1.2 Design System (Tailwind 4)
- **Fluid Tokens**: The `@theme` block in `index.css` defines a strict palette of Deep Gold tones.
- **Glassmorphism Logic**: The `glass-panel` utility uses `backdrop-filter: blur(16px)` and variable opacities (`rgba`) to create depth without clutter.

## 2. Phase 2 Refinement Analysis

### 2.1 Typography & Scaling
- **Global Scaling**: A 1pt increase across the board suggests shifting the base rem or systematically updating utility classes.
- **Title hierarchy**: Increasing title size by 3 levels (e.g., `text-lg` -> `text-2xl`) targets the main chapter cards.
- **Readability**: The user noted Korean text readability. `Noto Serif KR` is elegant but can be dense; increasing `line-height` (leading) is the primary solution.

### 2.2 Iconography (Semantic Mapping)
Replacing the generic `֍` symbol with unique, thematic icons from `Lucide` or custom SVGs:
- **Chapter 1 (Samadhi)**: `Target` or `Focus` - symbolizing concentration.
- **Chapter 2 (Sadhana)**: `Zap` or `Activity` - symbolizing practice and action.
- **Chapter 3 (Vibhuti)**: `Sparkles` or `Award` - symbolizing supernatural accomplishments.
- **Chapter 4 (Kaivalya)**: `Cloud` or `Mountain` - symbolizing absolute freedom and transcendence.

### 2.3 Layout Compression Strategy
- **Selector Height**: Currently `p-4 sm:p-5`. Reducing to `p-3 sm:p-4` and shrinking internal vertical paddings by 1/3.
- **Density**: Halving the `mb-10` between selector and grid to `mb-5`.
- **Card Aspect Ratio**: Moving from `min-h-[250px]` to `min-h-[400px]` to create more vertical presence for the detailed descriptions.

## 3. Data Enhancement
The `description` field in `constants.ts` needs a significant content boost (2-3 sentences) to provide real value and fill the longer cards.
- **Samadhi Pāda**: Describes the nature of yoga and the means of reaching union (Samadhi). It explores the functions of the mind and how to still the internal whirlpools of thought.
- **Sadhana Pāda**: Details the practical steps of yoga, including the famous eight limbs (Ashtanga). It focuses on the discipline needed to overcome suffering and attain wisdom.
- **Vibhuti Pāda**: Discusses the extraordinary powers and mental focus achieved through advanced practice. It warns that these powers are side effects, not the end goal of liberation.
- **Kaivalya Pāda**: Explains the culmination of the journey—absolute independence and liberation from the cycle of birth and death, where the seer abides in their own true nature.
