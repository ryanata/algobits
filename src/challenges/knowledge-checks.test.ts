import { spawnSync } from "node:child_process";
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

// Validate the actual Python displayed to the user. Execution is test-only.
function python<T>(body: string, payload: unknown): T {
  const run = spawnSync(
    "python3",
    [
      "-c",
      "import json, sys, textwrap\npayload = json.load(sys.stdin)\n" + body,
    ],
    {
      input: JSON.stringify(payload),
      encoding: "utf8",
      timeout: 10000,
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  expect(run.error, run.error?.message).toBeUndefined();
  expect(run.status, run.stderr).toBe(0);
  return JSON.parse(run.stdout);
}
const scanPython = `
source = """left, right = i + 1, len(nums) - 1
result = []
def record(a, b, c):
    result.append([a, b, c])
def skip_equal_values():
    nonlocal left, right
    l, r = nums[left], nums[right]
    while left < right and nums[left] == l:
        left += 1
    while left < right and nums[right] == r:
        right -= 1
"""
source += payload["code"].replace("# your answer", payload["line"]) + "\\nreturn result"
scope = {}
exec("def solve(nums, i):\\n" + textwrap.indent(source, "    "), scope)
print(json.dumps([scope["solve"](job["nums"], job["i"]) for job in payload["jobs"]]))
`;
function scanFixed(
  jobs: { nums: number[]; i: number }[],
  optionId: string,
): number[][][] {
  return python(scanPython, {
    code: tripleQuestion.code,
    line: tripleQuestion.options.find((o) => o.id === optionId)!.label,
    jobs,
  });
}
function duplicateWith(jobs: number[][], optionId: string): (number | null)[] {
  return python(
    `
source = payload["code"].replace("# your answer", payload["line"])
# Some distractors never terminate. Bound their execution only in this test.
source = "steps = 0\\n" + source.replace("    slow = nums[slow]", "    steps += 1\\n    if steps > 100:\\n        return None\\n    slow = nums[slow]")
scope = {}
exec("def solve(nums):\\n" + textwrap.indent(source, "    "), scope)
print(json.dumps([scope["solve"](nums) for nums in payload["jobs"]]))
`,
    {
      code: duplicateQuestion.code,
      line: duplicateQuestion.options.find((o) => o.id === optionId)!.label,
      jobs,
    },
  );
}

describe("knowledge checks", () => {
  it("Two Sum has exactly one failing choice, and all choices are valid problem inputs", () => {
    const actual = python<number[][]>(
      `
scope = {}
exec("def solve(nums, target):\\n" + textwrap.indent(payload["code"], "    "), scope)
print(json.dumps([scope["solve"](c["nums"], c["target"]) for c in payload["cases"]]))
`,
      { code: pairQuestion.code, cases },
    );
    const failures: string[] = [];
    cases.forEach((c, index) => {
      const pairs: number[][] = [];
      for (let i = 0; i < c.nums.length; i++)
        for (let j = i + 1; j < c.nums.length; j++)
          if (c.nums[i] + c.nums[j] === c.target) pairs.push([i, j]);
      expect(pairs).toHaveLength(1);
      const [i, j] = actual[index];
      if (i === j || c.nums[i] + c.nums[j] !== c.target) failures.push(c.id);
    });
    expect(failures).toEqual([pairQuestion.correctId]);
  });
  it("3Sum's chosen branch preserves every possible fixed-anchor triplet", () => {
    const jobs: { nums: number[]; i: number }[] = [];
    const expected: string[][] = [];
    for (let length = 3; length <= 5; length++)
      for (const a of arrays(length, [-2, -1, 0, 1, 2])) {
        const nums = [...a].sort((x, y) => x - y);
        for (let i = 0; i < nums.length - 2; i++) {
          const triples = new Set<string>();
          for (let j = i + 1; j < nums.length; j++)
            for (let k = j + 1; k < nums.length; k++)
              if (nums[i] + nums[j] + nums[k] === 0)
                triples.add([nums[i], nums[j], nums[k]].join(","));
          jobs.push({ nums, i });
          expected.push([...triples].sort());
        }
      }
    scanFixed(jobs, tripleQuestion.correctId).forEach((result, index) => {
      const actual = result.map((t) => t.join(","));
      expect(actual.length).toBe(new Set(actual).size);
      expect(actual.sort()).toEqual(expected[index]);
    });
  });
  it("every wrong 3Sum branch loses a real solution", () => {
    for (const option of tripleQuestion.options) {
      const [result] = scanFixed(
        [{ nums: [-4, -2, -1, 0, 1, 2, 3], i: 0 }],
        option.id,
      );
      if (option.id === tripleQuestion.correctId)
        expect(result).toEqual([[-4, 1, 3]]);
      else expect(result).not.toEqual([[-4, 1, 3]]);
    }
  });
  it("the duplicate reset works for all valid small inputs, including more than two repeats", () => {
    const jobs: number[][] = [],
      expected: number[] = [];
    for (let n = 1; n <= 4; n++)
      for (const nums of arrays(
        n + 1,
        Array.from({ length: n }, (_, i) => i + 1),
      )) {
        const duplicates = [...new Set(nums)].filter(
          (v) => nums.filter((x) => x === v).length > 1,
        );
        if (duplicates.length !== 1) continue;
        jobs.push(nums);
        expected.push(duplicates[0]);
      }
    expect(duplicateWith(jobs, duplicateQuestion.correctId)).toEqual(expected);
    for (const option of duplicateQuestion.options) {
      const [result] = duplicateWith([[1, 3, 4, 2, 2]], option.id);
      if (option.id === duplicateQuestion.correctId) expect(result).toBe(2);
      else expect(result).not.toBe(2);
    }
  });
  it("executes the Python reference solutions, including zero-index partners and repeated values", () => {
    const fixtures: Record<
      number,
      { name: string; args: unknown[][]; expected: unknown[] }
    > = {
      1: {
        name: "two_sum",
        args: [
          [[2, 7, 11, 15], 9],
          [[3, 3], 6],
          [[-3, 0, 3], 0],
        ],
        expected: [
          [0, 1],
          [0, 1],
          [0, 2],
        ],
      },
      15: {
        name: "three_sum",
        args: [[[-1, 0, 1, 2, -1, -4]], [[0, 0, 0, 0]], [[1, 2, 3]]],
        expected: [
          [
            [-1, -1, 2],
            [-1, 0, 1],
          ],
          [[0, 0, 0]],
          [],
        ],
      },
      287: {
        name: "find_duplicate",
        args: [[[1, 3, 4, 2, 2]], [[1, 1]], [[3, 3, 3, 3, 3]]],
        expected: [2, 1, 3],
      },
    };
    for (const challenge of challenges) {
      const fixture = fixtures[challenge.problem.number];
      if (!fixture) continue;
      const actual = python(
        `
scope = {}
exec(payload["code"], scope)
print(json.dumps([scope[payload["name"]](*args) for args in payload["args"]]))
`,
        { ...fixture, code: challenge.code },
      );
      expect(actual).toEqual(fixture.expected);
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
