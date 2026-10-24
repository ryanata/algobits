// Copy into src/challenges/04-your-slug/index.tsx; this template is not auto-discovered.
import { useState } from 'react';
import type { ChallengeModule, ChallengeProps } from '../types';
function Challenge({ onComplete }: ChallengeProps) {
  const [answered, setAnswered] = useState(false);
  return <div className="exercise">
    <div className="exercise-top"><span>YOUR INTERACTION</span></div>
    <h2>A small question, without naming the technique.</h2>
    <p>Replace this with a tested, self-contained interaction.</p>
    <button className="primary check" disabled={answered} onClick={() => { setAnswered(true); onComplete(); }}>Your answer</button>
  </div>;
}
const challenge: ChallengeModule = {
  id: '04-your-slug', title: 'A spoiler-free title', description: 'A short invitation to interact.',
  kind: 'Counterexample', minutes: '30–60 sec', date: '2026-10-23', accent: 'sage',
  problem: { title: 'Problem title', number: 0, url: 'https://leetcode.com/problems/your-problem/' },
  tags: ['Pattern revealed after playing'], insight: 'One memorable sentence.',
  explanation: ['Explain the example.', 'Explain why the approach works.', 'Describe constraints and complexity.'],
  code: '// A small, correct reference snippet', Component: Challenge,
};
export default challenge;
