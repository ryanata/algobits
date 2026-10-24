import { useState } from "react";
import type { ChallengeModule, ChallengeProps } from "../types";
function Challenge({ onComplete }: ChallengeProps) {
  const [choice, setChoice] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const options = [
    { pair: [0, 0], text: "3 + 3", detail: "Cards 0 and 0" },
    { pair: [1, 2], text: "2 + 4", detail: "Cards 1 and 2" },
    { pair: [], text: "No pair", detail: "Keep searching" },
  ];
  return (
    <div className="exercise">
      <div className="exercise-top">
        <span>THE DECK</span>
        <span>
          TARGET <b>6</b>
        </span>
      </div>
      <div className="number-deck">
        {[3, 2, 4].map((n, i) => (
          <div
            key={i}
            className={
              "number-tile " +
              (choice !== null && options[choice].pair.includes(i)
                ? "selected"
                : "")
            }
          >
            <span>{n}</span>
            <small>card {i}</small>
          </div>
        ))}
      </div>
      <h2>Six is the goal. Which pair counts?</h2>
      <p>
        You may use each card once. A quick sketch suggests “3 + 3.” Make the
        call.
      </p>
      <div className="choices">
        {options.map((o, i) => (
          <button
            key={o.text}
            className={"choice " + (choice === i ? "chosen" : "")}
            disabled={done}
            onClick={() => setChoice(i)}
            aria-pressed={choice === i}
          >
            <strong>{o.text}</strong>
            <span>{o.detail}</span>
          </button>
        ))}
      </div>
      <button
        className="primary check"
        disabled={choice === null || done}
        onClick={() => {
          setDone(true);
          if (choice === 1) onComplete();
        }}
      >
        Check my pair <span>↗</span>
      </button>
      {done && (
        <div
          className={"feedback " + (choice === 1 ? "correct" : "incorrect")}
          role="status"
        >
          {choice === 1
            ? "Exactly. Two different cards, one target."
            : "The total is only half the story. You need two distinct cards: 2 + 4."}
          {choice !== 1 && (
            <button
              className="text-button"
              onClick={() => {
                setDone(false);
                setChoice(null);
              }}
            >
              Try again →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
const challenge: ChallengeModule = {
  id: "01-one-number-short",
  title: "One number short",
  description:
    "A pair looks perfect on paper. But does it actually play by the rules?",
  kind: "Counterexample",
  minutes: "30–45 sec",
  date: "2026-10-23",
  accent: "peach",
  problem: {
    title: "Two Sum",
    number: 1,
    url: "https://leetcode.com/problems/two-sum/",
  },
  tags: ["Hash map", "Complement lookup"],
  insight: "A number can’t be its own partner.",
  explanation: [
    "Two Sum needs two distinct indices. For [3, 2, 4] with target 6, [0, 0] reuses the same card. The valid answer is [1, 2].",
    "Look for target − current in the numbers you have already seen, then store the current number. Inserting first can make a number match itself. Two separate cards with the same value, such as [3, 3], are valid.",
    "A hash map gives O(n) expected time and O(n) space. The order of lookup and insertion is the small detail that makes the solution correct.",
  ],
  code: `const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const partner = seen.get(target - nums[i]);
  if (partner !== undefined) return [partner, i];
  seen.set(nums[i], i);
}`,
  Component: Challenge,
};
export default challenge;
