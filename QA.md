# First edition verification

- Production build passes TypeScript and Vite with `/algobits/` as the deployment base.
- Eight Vitest test groups pass: exhaustive small inputs checked against independent oracles, fixture edge cases, registry discovery, shuffled decks.
- Dependency audit: zero reported vulnerabilities after updating the test runner.
- Browser: Two Sum wrong answer, retry, correct answer, and reveal.
- Browser: 3Sum marker movement, repeated-triplet feedback, correct answer, and reveal.
- Browser: Find Duplicate full trail, incorrect choice, correct choice, and reveal.
- Original problem links and pattern tags are absent until the reveal.
- Search and experience filters select the expected cards.
- Review covers each bit once per deck and avoids an immediate repeat at a deck boundary.
- Responsive checks at 390 and 320 pixels: no horizontal page overflow.
- Offline: stopped the production preview server, reloaded the current challenge, then revealed its explanation successfully from the service worker cache.
- Fonts and app icons are bundled with the offline shell.

GitHub Pages publication is verified separately once repository visibility is approved and deployment is complete.
