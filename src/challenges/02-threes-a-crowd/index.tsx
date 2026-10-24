import Question from "../Question";
import type { ChallengeModule, ChallengeProps, QuizQuestion } from "../types";

export const question: QuizQuestion = {
  prompt:
    "In the O(n²) solution, nums is sorted and i is fixed. Which line completes the negative-sum branch without losing any possible triplet?",
  code: `while left < right:
    total = nums[i] + nums[left] + nums[right]
    if total < 0:
        # your answer
    elif total > 0:
        right -= 1
    else:
        record(nums[i], nums[left], nums[right])
        skip_equal_values()`,
  options: [
    { id: "a", label: "right -= 1" },
    { id: "b", label: "left, right = left + 1, right - 1" },
    { id: "c", label: "left += 1" },
    { id: "d", label: "return result" },
  ],
  correctId: "c",
};
function Challenge(props: ChallengeProps) {
  return <Question {...question} {...props} />;
}
const challenge: ChallengeModule = {
  id: "02-threes-a-crowd",
  problem: {
    title: "3Sum",
    number: 15,
    url: "https://leetcode.com/problems/3sum/",
    statement:
      "Find every distinct triplet of values that totals zero. Each triplet must use three different array positions. Include each value triplet once; its order and the order of the results do not matter.",
    constraints: ["3 ≤ nums.length ≤ 3000", "−10⁵ ≤ nums[i] ≤ 10⁵"],
    example: {
      input: "nums = [-2, 0, 1, 1, 2]",
      output: "[[-2, 0, 2], [-2, 1, 1]]",
    },
    goal: "Use O(n²) time for this exercise.",
  },
  tags: ["Two pointers", "Sorting"],
  explanation: [
    "Move left forward. With i and left fixed, the current right is already the largest remaining endpoint. If their sum is negative, every smaller right also gives a negative sum. None of those pairs can work.",
    "Discarding that left value is safe. Decreasing right could discard a valid triplet: in [-4, -2, -1, 0, 1, 2, 3], the first sum is −3, but keeping right at 3 eventually finds [-4, 1, 3]. A linear scan per fixed value gives O(n²) time.",
  ],
  code: `def three_sum(nums):
    a = sorted(nums)
    result = []
    for i in range(len(a) - 2):
        if i > 0 and a[i] == a[i - 1]:
            continue
        left, right = i + 1, len(a) - 1
        while left < right:
            total = a[i] + a[left] + a[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([a[i], a[left], a[right]])
                l, r = a[left], a[right]
                while left < right and a[left] == l:
                    left += 1
                while left < right and a[right] == r:
                    right -= 1
    return result`,
  Component: Challenge,
};
export default challenge;
