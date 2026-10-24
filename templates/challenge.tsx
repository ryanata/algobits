// Copy to src/challenges/04-your-slug/index.tsx; templates are not auto-discovered.
import Question from "../Question";
import type { ChallengeModule, ChallengeProps, QuizQuestion } from "../types";

const question: QuizQuestion = {
  prompt: "Ask about an algorithm invariant, correctness, or complexity.",
  code: "# Put the relevant Python code or algorithm state here.",
  options: [
    { id: "a", label: "A plausible mistake" },
    { id: "b", label: "The correct answer" },
  ],
  correctId: "b",
};
function Challenge(props: ChallengeProps) {
  return <Question {...question} {...props} />;
}
const challenge: ChallengeModule = {
  id: "04-your-slug",
  problem: {
    title: "Original problem name",
    number: 0,
    url: "https://leetcode.com/problems/your-problem/",
    statement:
      "Restate the real problem, including all essential requirements.",
    constraints: ["Numeric limits"],
    example: { input: "A valid input", output: "Its correct output" },
    goal: "The required time or space bound.",
  },
  tags: ["Underlying algorithm"],
  explanation: ["Explain the correct answer and why the distractors fail."],
  code: "# Complete, correct Python reference solution",
  Component: Challenge,
};
export default challenge;
