# AlgoBits

Small algorithm challenges. Lasting little insights.

A mobile-first React + TypeScript PWA: three short, independent interactions inspired by **Two Sum**, **3Sum**, and **Find the Duplicate Number**. Play first; reveal the original problem, pattern, reasoning, and code afterward.

## Development

Node 22.13+ and npm:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The library, search and experience filters use public, non-spoiler metadata. Hash routes work on static hosting without server rewrites. Review shuffles a full deck before starting another and avoids an immediate repeat at the boundary. No accounts, analytics, scores, or persistence of learning progress.

## Add a bit

1. Copy `templates/challenge.tsx` to `src/challenges/04-your-slug/index.tsx`.
2. Give it a unique `id` and fill in the metadata and explanation.
3. Implement the component. Keep state local and call `onComplete()` on a correct answer.
4. Keep titles, prompts and descriptions free of pattern names and problem spoilers.
5. Verify the interaction and the math, then commit and push.

`src/challenges/index.ts` discovers all `src/challenges/*/index.tsx` default exports at build time with `import.meta.glob`. There is no manual registration list. The full TypeScript contract is in `src/challenges/types.ts`. The shell owns the reveal, original-problem links, navigation and review randomization; a module owns its interaction.

Content contract: `id`, `title`, `description`, `kind`, `minutes`, `date`, `accent`, `problem`, `tags`, `insight`, `explanation`, `code`, and `Component`. Public metadata appears before the reveal; `problem`, `tags`, `insight`, `explanation`, and `code` are rendered only afterward. Add an experience kind to the union and filter list if needed; interactions themselves are unrestricted React components.

## Offline and installation

The production build precaches the app shell, **all challenge modules**, fonts and icons using a generated Workbox service worker. Load the production site once with a connection and wait for “Ready for offline moments” in the footer. Then reload or visit any challenge offline. Development mode does not register a service worker; use `npm run build && npm run preview` for offline testing.

Install with your browser’s install / Add to Home Screen action. New releases wait until existing app tabs close, so an active review is not interrupted. LeetCode and GitHub links require a connection. Browser cache eviction can remove offline copies.

## GitHub Pages

The `Deploy AlgoBits` workflow runs tests, checks TypeScript, builds the PWA, and publishes `dist/` on each push to `main`. In repository Settings → Pages, use **GitHub Actions** as the build source. The workflow sets `BASE_PATH` to the repository name. For an account-level `username.github.io` repository or custom-domain root, change `BASE_PATH` to `/`.

For a local deployment-path check:

```sh
BASE_PATH=/algobits/ npm run build
BASE_PATH=/algobits/ npm run preview
```

Live site: https://ryanata.github.io/algobits/

## Verification

`npm test` covers algorithm edge cases and thousands of exhaustive small-array cases against independent brute-force or counting oracles. It also checks the registry and review deck behavior. Browser QA covers the three interactive flows, hidden reveal content, filters, mobile layout, deep links, and production offline reloads.

## Design and license

Original interface and illustrations. DM Sans and DM Serif Display are bundled locally through Fontsource under the SIL Open Font License; license files ship in the font packages. Lucide icons use the ISC license. Application source is MIT licensed.
