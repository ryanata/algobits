import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ChallengePage } from "../App";
import { challenges } from "./index";
import { cases, question as pairQuestion } from "./01-one-number-short";
import { question as tripleQuestion } from "./02-threes-a-crowd";
import { question as duplicateQuestion } from "./03-a-familiar-face";

function* arrays(length: number, values: number[]): Generator<number[]> {
  if (!length) {
    yield [];
    return;
  }
  for (const prefix of arrays(length - 1, values))
    for (const value of values) yield [...prefix, value];
}

// Execute exactly the trusted snippet shown in the question, not a separate implementation.
const proposedTwoSum = new Function("nums", "target", pairQuestion.code) as (
  nums: number[],
  target: number,
) => number[];
function scanFixed(nums: number[], i: number, optionId: string): number[][] {
  const option = tripleQuestion.options.find((o) => o.id === optionId)!;
  const body = `
    let left = i + 1, right = nums.length - 1;
    const result = [];
    function record(a, b, c) { result.push([a, b, c]); }
    function skipEqualValues() {
      const l = nums[left], r = nums[right];
      while (left < right && nums[left] === l) left++;
      while (left < right && nums[right] === r) right--;
    }
    ${tripleQuestion.code.replace("// your answer", option.label)}
    return result;
  `;
  return new Function("nums", "i", body)(nums, i);
}
function duplicateWith(nums: number[], optionId: string): number | null {
  const option = duplicateQuestion.options.find((o) => o.id === optionId)!;
  // A wrong reset can loop forever. Bound only test execution, never the shipped solution.
  const body =
    "let steps = 0;" +
    duplicateQuestion.code
      .replace("// your answer", option.label)
      .replaceAll(
        "slow = nums[slow];",
        "if (++steps > 100) return null; slow = nums[slow];",
      );
  return new Function("nums", body)(nums);
}

describe("knowledge checks", () => {
  it("Two Sum has exactly one failing choice, and all choices are valid problem inputs", () => {
    const failures: string[] = [];
    for (const c of cases) {
      const pairs: number[][] = [];
      for (let i = 0; i < c.nums.length; i++)
        for (let j = i + 1; j < c.nums.length; j++)
          if (c.nums[i] + c.nums[j] === c.target) pairs.push([i, j]);
      expect(pairs).toHaveLength(1);
      const [i, j] = proposedTwoSum(c.nums, c.target);
      if (i === j || c.nums[i] + c.nums[j] !== c.target) failures.push(c.id);
    }
    expect(failures).toEqual([pairQuestion.correctId]);
  });
  it("3Sum's chosen branch preserves every possible fixed-anchor triplet", () => {
    for (let length = 3; length <= 5; length++)
      for (const a of arrays(length, [-2, -1, 0, 1, 2])) {
        const nums = [...a].sort((x, y) => x - y);
        for (let i = 0; i < nums.length - 2; i++) {
          const expected = new Set<string>();
          for (let j = i + 1; j < nums.length; j++)
            for (let k = j + 1; k < nums.length; k++)
              if (nums[i] + nums[j] + nums[k] === 0)
                expected.add([nums[i], nums[j], nums[k]].join(","));
          const actual = scanFixed(nums, i, tripleQuestion.correctId).map((t) =>
            t.join(","),
          );
          expect(actual.length).toBe(new Set(actual).size);
          expect(actual.sort()).toEqual([...expected].sort());
        }
      }
  });
  it("every wrong 3Sum branch loses a real solution", () => {
    for (const option of tripleQuestion.options) {
      const result = scanFixed([-4, -2, -1, 0, 1, 2, 3], 0, option.id);
      if (option.id === tripleQuestion.correctId)
        expect(result).toEqual([[-4, 1, 3]]);
      else expect(result).not.toEqual([[-4, 1, 3]]);
    }
  });
  it("the duplicate reset works for all valid small inputs, including more than two repeats", () => {
    for (let n = 1; n <= 4; n++)
      for (const nums of arrays(
        n + 1,
        Array.from({ length: n }, (_, i) => i + 1),
      )) {
        const duplicates = [...new Set(nums)].filter(
          (v) => nums.filter((x) => x === v).length > 1,
        );
        if (duplicates.length !== 1) continue;
        expect(duplicateWith(nums, duplicateQuestion.correctId)).toBe(
          duplicates[0],
        );
      }
    for (const option of duplicateQuestion.options) {
      const result = duplicateWith([1, 3, 4, 2, 2], option.id);
      if (option.id === duplicateQuestion.correctId) expect(result).toBe(2);
      else expect(result).not.toBe(2);
    }
  });
  it("shows the problem and its requirements before the question, keeping the answer hidden", () => {
    for (const challenge of challenges) {
      const html = renderToStaticMarkup(
        createElement(ChallengePage, { challenge, onNext: () => {} }),
      );
      expect(html).toContain(challenge.problem.title);
      expect(html).toContain(challenge.problem.statement);
      expect(html.indexOf('class="problem-statement"')).toBeLessThan(
        html.indexOf('id="question-heading"'),
      );
      expect(html).toContain(challenge.problem.goal);
      expect(html).not.toContain('class="answer"');
      expect(html).not.toContain("Reference solution");
      expect(html).toContain("Check answer");
    }
  });
});
