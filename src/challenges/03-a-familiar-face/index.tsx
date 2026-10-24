import Question from "../Question";
import type { ChallengeModule, ChallengeProps, QuizQuestion } from "../types";

export const question: QuizQuestion = {
  prompt:
    "The two pointers have met. Which line completes this algorithm so that it returns the duplicate for every valid input?",
  code: `slow = fast = 0
while True:
    slow = nums[slow]
    fast = nums[nums[fast]]
    if slow == fast:
        break

# your answer

while slow != fast:
    slow = nums[slow]
    fast = nums[fast]
return slow`,
  options: [
    { id: "a", label: "return slow" },
    { id: "b", label: "slow = nums[0]" },
    { id: "c", label: "fast = nums[fast]" },
    { id: "d", label: "slow = 0" },
  ],
  correctId: "d",
};
function Challenge(props: ChallengeProps) {
  return <Question {...question} {...props} />;
}
const challenge: ChallengeModule = {
  id: "03-a-familiar-face",
  problem: {
    title: "Find the Duplicate Number",
    number: 287,
    url: "https://leetcode.com/problems/find-the-duplicate-number/",
    statement:
      "An array of length n + 1 contains integers from 1 through n. Exactly one value occurs more than once; it may occur more than twice. Return that value. The array must remain unchanged, and additional memory must be O(1).",
    constraints: ["1 ≤ n ≤ 10⁵", "nums.length = n + 1", "1 ≤ nums[i] ≤ n"],
    example: { input: "nums = [1, 3, 4, 2, 2]", output: "2" },
    goal: "Use O(n) time and O(1) extra space.",
  },
  tags: ["Cycle detection", "Floyd’s algorithm"],
  explanation: [
    "Reset slow to index 0, then advance both pointers one step at a time. Their next meeting is the cycle entrance: the duplicate. The first meeting can be elsewhere; for [1, 3, 4, 2, 2], it is index 4, but the duplicate is 2.",
    "Treat nums[index] as a next pointer. Floyd’s meeting condition makes the distance from index 0 to the entrance equal, modulo the cycle length, to the distance from the meeting point to the entrance. Resetting to nums[0] instead changes that alignment for this initialization. The algorithm uses O(n) time and O(1) space without changing the array.",
  ],
  code: `def find_duplicate(nums):
    slow = fast = 0
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
  Component: Challenge,
};
export default challenge;
