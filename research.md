# Yoga Project Research Report

## 1. Project Overview
The **YOGA SUTRAS (The Light of Yoga)** project is a single-page modern web application designed for reading, studying, and listening to the Yoga Sutras. It provides a highly polished, aesthetic, and interactive interface to explore ancient texts with multiple translations, word-by-word breakdowns, and audio pronunciations.

### Tech Stack
- **Core Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4, Framer Motion (Animations)
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React

## 2. Core Architecture

### Routing & Navigation
The application uses `react-router-dom` with a lazy-loaded component architecture for performance optimization:
- `/` - **ChapterList**: The home page displaying the list of chapters, introductory modals (Compendium, Lexicon, Commentaries), and chapter/sutra selection.
- `/chapter/:chapterNum/verse/:verseNum` - **VerseView**: A detailed, focused view for a specific sutra.

### Layout System
A global `AppShell` component wraps the content. In `VerseView`, it injects the `Header`, `Sidebar` (for chapter navigation), and `Reflections` (for commentaries/notes) panels. 

### State Management
State is handled primarily by the **React Context API**, ensuring lightweight and prop-drilling-free management:
- **`UIContext`**: Manages the open/close state of the Sidebar and Reflections panels across mobile and desktop. It utilizes `localStorage` (`gita-desktop-sidebar`, `gita-desktop-reflections`) to persist the user's layout preferences across sessions.
- **`ThemeContext`**: Controls Light/Dark mode toggling.
- **Authentication**: A lightweight client-side gate (`PasswordGateway`) protects the application, utilizing a `yoga_authenticated` flag in `localStorage`.

## 3. Data Flow & Content Management

### The Data Pipeline
The texts are managed outside of the JavaScript bundle in raw text format. A robust set of **PowerShell scripts** (e.g., `generate_data.ps1`, `split_iast.ps1`, `merge_tokens.ps1`) acts as a build pipeline. 
These scripts read various source files:
- `1.sans.txt` (Sanskrit text and Pronunciation)
- `2.english.txt` (English Translation)
- `3.korean-1.txt`, `5.bae_jik.txt`, `6.bae_uu.txt` (Various Korean translations)
- `7.dan.txt` (Word definitions)
- `8. ox.txt`, `9. ox-en.txt` (Oxford translations and commentaries)

The scripts compile these disjointed text files into a master structured JSON output representing an array of precise sutra objects.

### Data Fetching
In the application, `src/utils/dataFetcher.ts` asynchronously fetches `public/data.json`. It fetches the flat array of sutras, groups them by chapter, sorts them sequentially, and caches them in memory to prevent redundant network requests.

### Data Models (`types.ts`)
- **`YogaChapter`**: Holds metadata (`name_korean`, `description`, etc.) and a nested array of `sutras`.
- **`YogaSutra`**: A rich object representing a single verse. It contains raw text strings, a `word_meanings` dictionary, and parsed `tokens` for detailed lexical display.

## 4. Key Features & User Interface

- **Custom Audio Player**: The `VerseView` includes a custom-built HTML5 audio player interface mapping to `/mp3/{chapter}-{sutra}.mp3`. A backend Node script (`check_audio_mismatch.js`) exists in the repository to validate that all generated sutras have corresponding audio files, ensuring data integrity.
- **Word-by-Word Lexicon**: A collapsible interactive "Word-by-Word" UI component maps Sanskrit tokens to their Korean meanings. 
- **Multi-Translation Display**: The interface gracefully stacks multiple scholarly translations (Classical, Literal, Oxford) with distinct typographic styles (`font-crimson`, `font-noto-kr`, `font-inter`).
- **Glassmorphism Design**: Extensive use of backdrop filters (`backdrop-blur-sm`), custom gold borders, and subtle opacity transitions define the premium aesthetic of the application.

## 5. Development Infrastructure
- The repository relies on strict development guidelines referenced in the `.agent/workflows/ray_standard.md` file, which enforces high-quality standard commits, and specific architectural norms.
- The project uses Vite's fast HMR (Hot Module Replacement) and is heavily typed with TypeScript to ensure the complex data models mapping the sutras remain strictly defined throughout the component tree.
