import Question from "../Question";
import type { ChallengeModule, ChallengeProps, QuizQuestion } from "../types";

export const cases = [
  { id: "a", nums: [2, 7, 11, 15], target: 9 },
  { id: "b", nums: [3, 2, 4], target: 6 },
  { id: "c", nums: [5, 1, 7], target: 8 },
  { id: "d", nums: [4, 3, 8], target: 11 },
];
export const question: QuizQuestion = {
  prompt:
    "This implementation claims to solve Two Sum. Which valid input makes it return an invalid answer?",
  code: `seen = {}
for i, value in enumerate(nums):
    seen[value] = i
    j = seen.get(target - value)
    if j is not None:
        return [j, i]
return []`,
  options: cases.map((c) => ({
    id: c.id,
    label: `nums = [${c.nums.join(", ")}], target = ${c.target}`,
  })),
  correctId: "b",
};
function Challenge(props: ChallengeProps) {
  return <Question {...question} {...props} />;
}
const challenge: ChallengeModule = {
  id: "01-one-number-short",
  problem: {
    title: "Two Sum",
    number: 1,
    url: "https://leetcode.com/problems/two-sum/",
    statement:
      "Find two different positions in an integer array whose values total the given target. Return their indices, in either order. Every input has exactly one valid pair.",
    constraints: ["2 ≤ nums.length ≤ 10⁴", "−10⁹ ≤ nums[i], target ≤ 10⁹"],
    example: { input: "nums = [4, 7, 2], target = 9", output: "[1, 2]" },
    goal: "Aim for expected O(n) time.",
  },
  tags: ["Hash map", "Complement lookup"],
  explanation: [
    "For [3, 2, 4] with target 6, the first iteration stores 3 → 0, then finds that same entry. It returns [0, 0], reusing one index. The valid pair is [1, 2].",
    "Look up the complement before inserting the current value. The map must contain only earlier indices. This invariant gives distinct indices in expected O(n) time with O(n) extra space.",
  ],
  code: `def two_sum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        j = seen.get(target - value)
        if j is not None:
            return [j, i]
        seen[value] = i`,
  Component: Challenge,
};
export default challenge;
