import type { ComponentType } from "react";
export interface ChallengeProps {
  onComplete: () => void;
}
export interface ChallengeModule {
  id: string;
  title: string;
  description: string;
  kind: "Counterexample" | "Next move" | "Follow the trail";
  minutes: string;
  date: string;
  accent: "peach" | "sage" | "lavender";
  problem: { title: string; number: number; url: string };
  tags: string[];
  insight: string;
  explanation: string[];
  code: string;
  Component: ComponentType<ChallengeProps>;
}
