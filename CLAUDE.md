# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Variora** is a mobile-first, client-only web app that generates printable math
worksheets. The audience is parents and teachers; the UI is in Russian. For this
POC there is a single task type: arithmetic examples (`+ − × ÷`) for grades 4–5 —
natural numbers only, division without remainder, non-negative results. The user
picks parameters (count, max number, which operations, shuffle) and gets two PDFs:
one worksheet to write answers into, and one answer key.

**No server / no backend state.** Everything (generation + PDF) runs in the browser;
the app is a static bundle deployed to GitHub Pages.

## Commands

- `npm install` — install dependencies.
- `npm run dev` — Vite dev server.
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`.
- `npm run preview` — serve the production build locally.
- `npm test` — run unit tests once (Vitest).
- `npm run test:watch` — Vitest in watch mode.
- Single test file: `npx vitest run src/generator/arithmetic.test.ts`.

## Architecture

Stack: React 18 + Vite + TypeScript + Tailwind CSS v3; PDF via jsPDF.

- `src/types.ts` — shared types: `Operation`, `TaskParams`, `Problem`.
- `src/generator/arithmetic.ts` — pure generation logic. `generateProblems(params)`
  distributes the requested count across selected operations, enforces the math
  invariants (natural numbers, no remainder, everything ≤ `maxNumber`), and
  optionally shuffles (best-effort: avoids two identical operations in a row).
  This is the core logic and is covered by `arithmetic.test.ts`.
- `src/pdf/buildPdf.ts` — `buildWorksheet()` / `buildAnswers()` lay problems out in
  two columns on A4 and trigger downloads (`variora-primery.pdf` / `variora-otvety.pdf`).
- `src/pdf/fonts/dejavu.ts` + `DejaVuSans.ttf` — **Cyrillic support.** jsPDF's
  built-in fonts have no Cyrillic glyphs, so the TTF is imported via Vite `?url`,
  fetched at runtime, base64-encoded, and registered with `addFileToVFS` / `addFont`.
  This makes the PDF builders async. Keep PDF text going through this font.
- `src/i18n/` — `t(key)` lookup over `ru.ts`. All user-visible strings (UI and PDF
  titles) go through `t()` so other languages can be added later without touching
  components.
- `src/components/` — `ParamsForm`, `NumberField`, `OperationToggle`. Form state is
  lifted into `App.tsx`, which caches the generated problem set (keyed by a params
  signature) so the worksheet and answer key downloaded for the same params match.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on push
to `main`. `vite.config.ts` sets `base: '/variora/'` for the Pages subpath — change
this if the repo/site path changes.
