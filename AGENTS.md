# AlgoBits

React + TypeScript PWA published to GitHub Pages from `main`.

## Product principles

- Keep the whole interface minimal. Avoid marketing copy, decorative illustrations, extra sections, and repeated instructions. The home page is a short list of problems.
- Show the actual problem identity and an accurate, self-contained restatement **before** its question. Include an example and make essential constraints visible; numeric limits can be collapsed.
- Questions must test understanding of the algorithm: an invariant, a correctness bug, a safe state transition, or a complexity requirement. Do not make guided games that teach the steps needed to answer while playing.
- Reveal the answer and reasoning only after submission or an explicit “I don’t know.”
- Do not add accounts, scores, streaks, progress tracking, or runtime AI.

## Content architecture

Each `src/challenges/*/index.tsx` default-exports a `ChallengeModule`. Discovery is automatic. Modules own their interaction; the shell owns the statement, answer explanation, and navigation. `Question.tsx` is an optional shared multiple-choice component. A module may use a different interaction when the question benefits from it.

Keep existing IDs stable so published deep links continue to work. Start new modules from `templates/challenge.tsx`. Test that a question has one correct answer and that its distractors are actually wrong; use independent algorithm oracles where practical.

## Checks

Run `npm test` and `npm run build`. For the deployed subpath, build and preview with `BASE_PATH=/algobits/`. Check desktop and phone layouts. Test production offline behavior with the generated service worker. Keep this working without a backend.
