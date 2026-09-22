# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Aprender Piano" — a Spanish-language React SPA that teaches piano note reading. Users pick a level, pick a game, and practice identifying notes shown on a musical staff.

## Commands

```bash
npm run dev          # start Vite dev server
npm run build         # type-check (tsc -b) then production build
npm run preview       # preview the production build
npm run lint          # oxlint
npm test              # run all tests once (vitest run)
npm run test:watch    # vitest watch mode
```

Run a single test file: `npx vitest run src/music/notes.test.ts`
Run tests matching a name: `npx vitest run -t "test name"`

Vitest is configured with `globals: false` (see `vite.config.ts`), so test files must explicitly `import { describe, it, expect } from 'vitest'` rather than relying on globals. `src/test/setup.ts` wires up `jest-dom` matchers and runs `cleanup()` after each test.

## Architecture

**Routing** (`src/App.tsx`) has three routes, each backed by a page in `src/pages/`:
- `/` → `LevelsPage` — lists levels from `src/data/levels.ts`
- `/nivel/:levelId` → `GamesPage` — lists games for that level via `getGamesForLevel` in `src/data/games.ts`
- `/nivel/:levelId/juego/lectura-notas` → `NoteReadingGamePage` — the note-reading exercise

**Content catalog** (`src/data/levels.ts`, `src/data/games.ts`): levels and games are plain static arrays with an `available` flag for not-yet-built content. Adding a new game means adding an entry to `games.ts` (with its `path`), registering the route in `App.tsx`, and building the page — there's no dynamic registration.

**Music domain logic** (`src/music/`) is kept separate from rendering:
- `types.ts` — core domain types: `Clef` (`treble`/`bass`), `Hand`, `Note` (`letter` + `octave`), `NoteEvent`.
- `notes.ts` — note utilities and the hand/clef pairing rule: `treble` clef ↔ right hand (octave 4), `bass` clef ↔ left hand (octave 3). `getRandomNoteEvent()` is the source of randomness for exercises.
- `staffLayout.ts` — pure music theory: converts a `Note` to a diatonic index, then to a staff "step" (0 = bottom line, 8 = top line, one step per line/space) relative to each clef's bottom-line reference note. Also computes ledger-line steps and stem direction.
- `useNoteSequence.ts` — the exercise-navigation hook. Keeps a `history` array + `index`; "next" appends a freshly generated note unless the learner is stepping forward through notes they already went back through via "previous".

**Staff rendering** (`src/components/staff/`) is SVG-based and deliberately separate from the music-theory layer above:
- `staffGeometry.ts` holds pixel-space constants (`STEP_SIZE`, staff X bounds, `stepToY`, `VIEW_BOX`) — this is the only place staff-theory steps get mapped to SVG coordinates.
- `Staff.tsx` composes `StaffLines`, `ClefSymbol`, and `NoteHead`, calling `getStaffStep` (music theory) then letting the sub-components use `staffGeometry.ts` for pixel placement.

When changing staff visuals, prefer editing `staffGeometry.ts`/the `staff/` components; when changing note logic (which note comes next, diatonic distance, ledger lines), edit `src/music/`.

**UI components** (`src/components/`): `ArrowNav`, `GameCard`, `LevelCard`, `NoteNameReveal`, `Switch` — each co-located with its own `.css` and `.test.tsx`.
