# Yoga

Yoga is a React-based reading app for the Yoga Sutras. It brings together Sanskrit text, pronunciation, multiple translations, word meanings, audio, and personal notes in one interface.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Vitest
- Playwright

## Project layout

- `src/`: the active application code
- `public/`: runtime assets such as `data.json`, `lexicon.json`, and `mp3/`
- `data-source/`: source text files, token mapping JSON, and archived data snapshots
- `scripts/`: data generation, verification, and browser QA scripts
- `legacy/`: archived pre-React implementation kept for reference
- `docs/`: supporting notes and reports

## Runtime data flow

The app reads from `public/data.json`.

- Loader: `src/utils/dataFetcher.ts`
- Shared provider: `src/context/YogaDataContext.tsx`
- Source generator: `scripts/generate_data.ps1`
- Archived snapshot: `data-source/archive/data_updated_3_22_3_36.json`

## Local development

```bash
npm install
npm run dev
```

Core checks:

```bash
npm run typecheck
npm run test -- --run
npm run build
```

Browser smoke QA:

```bash
npm run dev -- --host 127.0.0.1 --port 4174
BASE_URL=http://127.0.0.1:4174 npm run qa:browser
```

## Current architecture notes

- The live app is the React code under `src/`.
- The password gateway has been removed. The app now opens directly.
- Verse pages use a shared shell with a header, left chapter sidebar, and a right panel that switches between reflections and commentary.
- Reflections are stored in `localStorage`.
- Commentary is now a guided study panel rather than an empty placeholder.
- Data access is centralized through `YogaDataProvider`, which reduces repeated fetch logic across pages and side panels.

## Data pipeline

Source texts live in `data-source/`. The main generation script is:

- `scripts/generate_data.ps1`

It parses the source `.txt` files and writes:

- `data.js`
- `public/data.json`

More details are documented in `scripts/README.md`.

## Deployment

This is a static build.

- Build command: `npm run build`
- Output directory: `dist`

Before deployment:

- confirm `public/data.json` is current
- run `npm run typecheck`
- run `npm run test -- --run`
- run `npm run build`
- optionally run `npm run qa:browser`

## Notes

- `legacy/legacy_web/` is reference material, not the active app.
- `research.md` contains a deep architecture report for the repository.
- `plan.md` tracks the implementation checklist derived from that report.
