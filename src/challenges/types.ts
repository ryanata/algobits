import type { ComponentType } from "react";

export type AnswerResult = "correct" | "incorrect" | "revealed";
export interface ChallengeProps {
  onAnswer: (result: AnswerResult) => void;
}
export interface QuizQuestion {
  prompt: string;
  code: string;
  options: { id: string; label: string }[];
  correctId: string;
}
export interface ChallengeModule {
  id: string;
  problem: {
    title: string;
    number: number;
    url: string;
    statement: string;
    constraints: string[];
    example: { input: string; output: string };
    goal: string;
  };
  tags: string[];
  explanation: string[];
  code: string;
  Component: ComponentType<ChallengeProps>;
}
