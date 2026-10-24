# AlgoBits

A minimal React + TypeScript PWA for reviewing algorithm solutions.

Read the problem, answer one question about its algorithm, then check the reasoning. The first edition covers **Two Sum**, **3Sum**, and **Find the Duplicate Number**.

[Open AlgoBits](https://ryanata.github.io/algobits/)

## Development

Node 22.13+ and npm:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Hash routes work on static hosting without rewrites. Review shuffles the collection once per deck and avoids an immediate repeat between decks. There are no accounts, analytics, scores, or saved learning progress.

## Add a question

1. Copy `templates/challenge.tsx` into `src/challenges/04-your-slug/index.tsx`.
2. Add the problem statement, essential requirements, example, numeric limits, and source link. Use your own accurate restatement of the original problem.
3. Write a question that requires understanding the algorithm. A user should not be able to complete it simply by following instructions that the interface supplies.
4. Export an independent React component. Call `onAnswer("correct" | "incorrect" | "revealed")` when the user submits or asks to see the answer.
5. Verify that exactly one answer is correct and that the distractors fail, then commit and push.

`src/challenges/index.ts` discovers modules at build time. No manual registration is needed. The contract lives in `src/challenges/types.ts`: `id`, `problem`, `tags`, `explanation`, `code`, and `Component`. The shell shows the problem before the interaction and the explanation after answering. Algorithm tags remain metadata. `Question.tsx` provides optional multiple-choice UI; modules can use their own interactions.

The three questions test a hash-map invariant, safe pointer movement, and Floyd’s cycle-entrance phase. Tests run the actual displayed code against independent oracles and verify that the initial page includes the statement and requirements without exposing the answer.

## Offline

Production builds precache the shell, every module, fonts and icons. Load once online; “Available offline” confirms readiness. The browser’s install / Add to Home Screen action installs the PWA. External LeetCode and GitHub links need a connection. Browser cache eviction can remove offline copies.

New releases wait until you choose Reload or close existing app tabs, preserving an active review. Development mode does not register the service worker.

## GitHub Pages

Each push to `main` runs tests, type checking and the build, then deploys `dist/`. Repository Settings → Pages uses GitHub Actions. The workflow sets `BASE_PATH` to the repository name.

```sh
BASE_PATH=/algobits/ npm run build
BASE_PATH=/algobits/ npm run preview
```

## License

Application source: MIT. DM Sans is bundled through Fontsource under the SIL Open Font License. Lucide icons use ISC.
