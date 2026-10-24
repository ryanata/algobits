import { useState } from "react";
import type { ChallengeProps, QuizQuestion } from "./types";

// Optional shared UI. Individual modules can still provide any interaction.
export default function Question({
  prompt,
  code,
  options,
  correctId,
  onAnswer,
}: QuizQuestion & ChallengeProps) {
  const [choice, setChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submit = (reveal = false) => {
    setSubmitted(true);
    onAnswer(
      reveal ? "revealed" : choice === correctId ? "correct" : "incorrect",
    );
  };
  return (
    <section className="question" aria-labelledby="question-heading">
      <h2 id="question-heading">Question</h2>
      <p>{prompt}</p>
      <pre className="question-code">
        <code className="language-python">{code}</code>
      </pre>
      <fieldset disabled={submitted}>
        <legend className="sr-only">Choose an answer</legend>
        {options.map((option) => (
          <label
            key={option.id}
            className={
              "option" +
              (submitted && option.id === correctId ? " correct" : "") +
              (submitted && choice === option.id && choice !== correctId
                ? " incorrect"
                : "")
            }
          >
            <input
              type="radio"
              name="answer"
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <code>{option.label}</code>
            {submitted && option.id === correctId && (
              <span className="answer-mark" aria-label="Correct answer">
                ✓
              </span>
            )}
          </label>
        ))}
      </fieldset>
      {!submitted && (
        <div className="question-actions">
          <button
            className="primary"
            disabled={!choice}
            onClick={() => submit()}
          >
            Check answer
          </button>
          <button className="text-button" onClick={() => submit(true)}>
            I don’t know
          </button>
        </div>
      )}
    </section>
  );
}
