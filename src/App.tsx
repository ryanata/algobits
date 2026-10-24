import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Shuffle } from "lucide-react";
import { challenges, shuffledIds } from "./challenges";
import type { AnswerResult, ChallengeModule } from "./challenges/types";

const ids = challenges.map((c) => c.id);
const getRoute = () => window.location.hash.slice(1) || "/";
const navigate = (path: string) => {
  window.location.hash = path;
};

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [ready, setReady] = useState(false);
  const [update, setUpdate] = useState(false);
  const queue = useRef<string[]>([]);
  const main = useRef<HTMLElement>(null);
  const challenge = challenges.find((c) => c.id === route.split("/")[2]);
  const review = route.startsWith("/review/");
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
    document.title = challenge
      ? `${challenge.problem.title} — AlgoBits`
      : "AlgoBits";
  }, [route, challenge]);
  useEffect(() => {
    const online = () => setOffline(false),
      offline = () => setOffline(true);
    const ready = () => setReady(true),
      update = () => setUpdate(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    window.addEventListener("algobits-offline-ready", ready);
    window.addEventListener("algobits-update-ready", update);
    navigator.serviceWorker
      ?.getRegistration()
      .then((r) => {
        if (r?.active) setReady(true);
        if (r?.waiting) setUpdate(true);
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      window.removeEventListener("algobits-offline-ready", ready);
      window.removeEventListener("algobits-update-ready", update);
    };
  }, []);
  const startReview = () => {
    queue.current = shuffledIds(ids, challenge?.id);
    navigate("/review/" + queue.current.shift());
  };
  const next = () => {
    if (review) {
      if (!queue.current.length)
        queue.current = shuffledIds(ids, challenge?.id);
      navigate("/review/" + queue.current.shift());
    } else {
      navigate("/bit/" + ids[(ids.indexOf(challenge!.id) + 1) % ids.length]);
    }
  };
  return (
    <div className="app">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#/">
          AlgoBits
        </a>
        <button className="text-button" onClick={startReview}>
          <Shuffle size={14} aria-hidden="true" /> Review
        </button>
      </header>
      {update && (
        <div className="notice" role="status">
          Update available.{" "}
          <button
            className="text-button"
            onClick={() =>
              window.dispatchEvent(new Event("algobits-apply-update"))
            }
          >
            Reload
          </button>
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        {route === "/" ? (
          <section className="library">
            <h1>Problems</h1>
            <div className="problem-list">
              {challenges.map((c) => (
                <a className="problem-row" href={"#/bit/" + c.id} key={c.id}>
                  <span className="problem-number">{c.problem.number}</span>
                  <span>{c.problem.title}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ) : challenge && (review || route.startsWith("/bit/")) ? (
          <ChallengePage key={route} challenge={challenge} onNext={next} />
        ) : (
          <section className="not-found">
            <h1>Page not found</h1>
            <a className="text-button" href="#/">
              Back to problems <ArrowRight size={15} />
            </a>
          </section>
        )}
      </main>
      <footer>
        <a
          href="https://github.com/ryanata/algobits"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span role="status">
          {offline ? "Offline" : ready ? "Available offline" : ""}
        </span>
      </footer>
    </div>
  );
}

export function ChallengePage({
  challenge: c,
  onNext,
}: {
  challenge: ChallengeModule;
  onNext: () => void;
}) {
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const Component = c.Component;
  return (
    <article className="challenge-page">
      <a className="back-link" href="#/">
        <ArrowLeft size={14} aria-hidden="true" /> Problems
      </a>
      <section className="problem-statement" aria-labelledby="problem-title">
        <div className="problem-heading">
          <h1 id="problem-title">{c.problem.title}</h1>
          <a
            href={c.problem.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`LeetCode problem ${c.problem.number}`}
          >
            <span>#{c.problem.number}</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
        <p>{c.problem.statement}</p>
        <pre className="example">
          <code>
            {c.problem.example.input + "\n→ " + c.problem.example.output}
          </code>
        </pre>
        <p className="goal">{c.problem.goal}</p>
        <details className="constraints">
          <summary>Constraints</summary>
          <ul>
            {c.problem.constraints.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </details>
      </section>
      <Component key={attempt} onAnswer={setResult} />
      {result && (
        <section className="answer" aria-live="polite" aria-atomic="true">
          <h2>
            {result === "correct"
              ? "Correct."
              : result === "incorrect"
                ? "Not quite."
                : "Answer"}
          </h2>
          {c.explanation.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <details className="reference">
            <summary>Reference solution</summary>
            <pre>
              <code>{c.code}</code>
            </pre>
          </details>
          <div className="answer-actions">
            <button
              className="text-button"
              onClick={() => {
                setAttempt((a) => a + 1);
                setResult(null);
              }}
            >
              Try again
            </button>
            <button className="primary" onClick={onNext}>
              Next problem <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}
    </article>
  );
}
