import { useState } from "react";
import type { ChallengeModule, ChallengeProps } from "../types";
function Challenge({ onComplete }: ChallengeProps) {
  const [moved, setMoved] = useState(false),
    [answer, setAnswer] = useState<number | null>(null);
  return (
    <div className="exercise">
      <div className="exercise-top">
        <span>THE LINEUP</span>
        <span>
          TARGET <b>0</b>
        </span>
      </div>
      <div className="number-deck compact">
        {[-2, 0, 0, 2, 2].map((n, i) => (
          <div
            key={i}
            className={
              "number-tile " +
              (i === 0 ? "fixed " : "") +
              ((!moved && (i === 1 || i === 4)) ||
              (moved && (i === 2 || i === 3))
                ? "selected"
                : "")
            }
          >
            <span>{n}</span>
            <small>
              {i === 0
                ? "fixed"
                : (!moved && i === 1) || (moved && i === 2)
                  ? "L"
                  : (!moved && i === 4) || (moved && i === 3)
                    ? "R"
                    : "·"}
            </small>
          </div>
        ))}
      </div>
      <div className="recorded">
        <span>ALREADY RECORDED</span>
        <code>[-2, 0, 2]</code>
        <span>✓ sums to 0</span>
      </div>
      <h2>New cards. New answer?</h2>
      <p>
        The marked cards make zero. You’ve saved their values. Move both markers
        inward and decide what belongs in the results.
      </p>
      {!moved ? (
        <button className="primary check" onClick={() => setMoved(true)}>
          Move the markers <span>→ ←</span>
        </button>
      ) : (
        <>
          <div className="choices stacked">
            {[
              "Record [-2, 0, 2] again",
              "Skip it — the values are the same",
              "Record [-2, 2, 2]",
            ].map((text, i) => (
              <button
                className={"choice " + (answer === i ? "chosen" : "")}
                key={text}
                disabled={answer === 1}
                onClick={() => {
                  setAnswer(i);
                  if (i === 1) onComplete();
                }}
              >
                <strong>{text}</strong>
                <span>{String.fromCharCode(65 + i)}</span>
              </button>
            ))}
          </div>
          {answer !== null && (
            <div
              className={"feedback " + (answer === 1 ? "correct" : "incorrect")}
              role="status"
            >
              {answer === 1
                ? "Yes. Different indices can still describe the very same triplet."
                : answer === 0
                  ? "Those cards moved, but their values didn’t. Results must be unique by value."
                  : "That adds up to 2, not 0. Look at the two marked cards."}
            </div>
          )}
        </>
      )}
    </div>
  );
}
const challenge: ChallengeModule = {
  id: "02-threes-a-crowd",
  title: "Three’s a crowd",
  description:
    "The cards have moved. Decide whether you’ve found something new.",
  kind: "Next move",
  minutes: "30–45 sec",
  date: "2026-10-23",
  accent: "sage",
  problem: {
    title: "3Sum",
    number: 15,
    url: "https://leetcode.com/problems/3sum/",
  },
  tags: ["Two pointers", "Sorting", "Deduplication"],
  insight: "New positions don’t always mean a new triplet.",
  explanation: [
    "3Sum asks for unique value triplets, not every possible combination of indices. In [-2, 0, 0, 2, 2], the only unique answer is [-2, 0, 2].",
    "Sort the array, fix one value, then move a left and a right pointer. A sum below zero needs a larger left value; a sum above zero needs a smaller right value.",
    "After a match, move past all repeats of both endpoint values. Skip repeated fixed values too. That prevents duplicate triplets without a separate results set. The scan takes O(n²) time; sorting costs depend on the implementation.",
  ],
  code: `// After recording [nums[i], nums[left], nums[right]]:
const a = nums[left], b = nums[right];
while (left < right && nums[left] === a) left++;
while (left < right && nums[right] === b) right--;
// Also skip repeated fixed values in the outer loop.`,
  Component: Challenge,
};
export default challenge;
