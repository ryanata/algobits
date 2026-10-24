import { useState } from "react";
import type { ChallengeModule, ChallengeProps } from "../types";
const nums = [1, 3, 4, 2, 2];
function Challenge({ onComplete }: ChallengeProps) {
  const [path, setPath] = useState([0]),
    [answer, setAnswer] = useState<number | null>(null);
  const current = path[path.length - 1],
    looped = path.slice(0, -1).includes(current);
  return (
    <div className="exercise">
      <div className="exercise-top">
        <span>THE ADDRESS BOOK</span>
        <span>
          START <b>0</b>
        </span>
      </div>
      <div className="number-deck compact">
        {nums.map((n, i) => (
          <div
            key={i}
            className={
              "number-tile " +
              (current === i ? "selected" : "") +
              (path.includes(i) ? " visited" : "")
            }
          >
            <small>address {i}</small>
            <span>{n}</span>
          </div>
        ))}
      </div>
      <h2>Every number points somewhere.</h2>
      <p>
        Start at address 0. Read its number, then go to that address. Keep
        following the trail. What number is causing the loop?
      </p>
      <div className="trail" aria-label="Visited addresses">
        {path.map((n, i) => (
          <span key={i}>
            {i > 0 && <b>→</b>}
            <em className={i === path.length - 1 ? "active" : ""}>{n}</em>
          </span>
        ))}
      </div>
      {!looped ? (
        <button
          className="primary check"
          onClick={() => setPath([...path, nums[current]])}
        >
          Go to address {nums[current]} <span>→</span>
        </button>
      ) : (
        <>
          <p className="loop-notice">
            Back at address {current}. You’ve been here before.
          </p>
          <div className="choices">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                className={"choice " + (answer === n ? "chosen" : "")}
                disabled={answer === 2}
                onClick={() => {
                  setAnswer(n);
                  if (n === 2) onComplete();
                }}
              >
                <strong>{n}</strong>
                <span>The repeat</span>
              </button>
            ))}
          </div>
          {answer !== null && (
            <div
              className={"feedback " + (answer === 2 ? "correct" : "incorrect")}
              role="status"
            >
              {answer === 2
                ? "Found it. Two different cards point to address 2."
                : `Check which number appears on two cards. Address ${answer} has only one incoming card.`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
const challenge: ChallengeModule = {
  id: "03-a-familiar-face",
  title: "A familiar face",
  description:
    "Follow a little trail of numbers. Something will start to look familiar.",
  kind: "Follow the trail",
  minutes: "45–60 sec",
  date: "2026-10-23",
  accent: "lavender",
  problem: {
    title: "Find the Duplicate Number",
    number: 287,
    url: "https://leetcode.com/problems/find-the-duplicate-number/",
  },
  tags: ["Cycle detection", "Floyd’s algorithm"],
  insight: "An array can hide a linked list.",
  explanation: [
    "Treat each index as an address and its value as the next address. Here the path is 0 → 1 → 3 → 2 → 4 → 2. Both address 3 and address 4 contain the value 2, so the path enters a cycle at address 2.",
    "This relies on the problem’s contract: n + 1 values, each in [1, n], with exactly one distinct value repeated. Address 0 has no incoming edge; the repeated value is the entrance to the reachable cycle.",
    "The trail above stores history to illustrate the idea. To solve with O(1) extra space, Floyd’s algorithm moves one pointer one step and another two steps until they meet. Reset one to 0, then move both one step at a time; their next meeting is the duplicate. Time is O(n), and the array stays unchanged.",
  ],
  code: `let slow = 0, fast = 0;
do {
  slow = nums[slow];
  fast = nums[nums[fast]];
} while (slow !== fast);
slow = 0;
while (slow !== fast) {
  slow = nums[slow];
  fast = nums[fast];
}
return slow;`,
  Component: Challenge,
};
export default challenge;
