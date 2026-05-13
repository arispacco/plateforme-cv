# V-Pitch (plateforme-cv)

Local-first CV and portfolio platform built with React + TypeScript.  
Candidate data is persisted in IndexedDB through Dexie.

## Commands

- `npm run dev` — start local dev server
- `npm run lint` — run ESLint
- `npm run build` — type-check and build production bundle

## Architecture notes

- `src/types/cv.ts` contains the `Experience` and `CandidateProfile` source-of-truth interfaces.
- `src/services/cvService.ts` is the single Dexie persistence layer.
- `src/hooks/useCVSync.ts` is the UI sync hook used by components.
- UI components never call Dexie directly.
