# Verification

## Minimal interface and algorithm questions

- The library contains the three problem names and one Review action.
- Every exercise starts with the actual problem identity, a complete restatement, an example, and its required complexity. Numeric limits are available under Constraints.
- Two Sum tests lookup/insertion order with one failing input among four valid inputs.
- 3Sum tests the safe negative-sum branch in a sorted scan.
- Find Duplicate tests the reset required between the meeting phase and entrance phase.
- Thirteen tests pass. They include exhaustive small-array oracles, actual displayed-code checks, distractor validation, review shuffling, and initial HTML assertions that the problem precedes its question while the explanation stays hidden.
- Browser checks: wrong and correct answers, retry, “I don’t know,” next-problem navigation, constraints and reference-solution disclosure, and random review.
- Phone layouts checked at 390 and 320 pixels; no horizontal page overflow. Question code wraps on small screens.
- Production service-worker offline reload and GitHub Pages deployment checked separately before handoff.

## Initial edition

The original production shell was verified offline by stopping its preview server and reloading a cached challenge. This revision retains that PWA infrastructure and stable challenge URLs.
