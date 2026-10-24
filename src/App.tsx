import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  Search,
  X,
  Check,
  WifiOff,
  BookOpen,
  Sparkles,
  Code2,
} from "lucide-react";
import { challenges, shuffledIds } from "./challenges";
import type { ChallengeModule } from "./challenges/types";

const ids = challenges.map((c) => c.id);
const getRoute = () => window.location.hash.slice(1) || "/";
const navigate = (path: string) => {
  window.location.hash = path;
};
function Artwork({
  variant,
  large = false,
}: {
  variant: string;
  large?: boolean;
}) {
  return (
    <div
      className={"artwork " + variant + (large ? " large" : "")}
      aria-hidden="true"
    >
      <div className="art-grid" />
      {variant === "peach" ? (
        <>
          <span className="scribble top">a little discovery</span>
          <div className="art-equation">
            <i>3</i>
            <b>+</b>
            <i>?</i>
            <b>=</b>
            <i className="answer">6</i>
          </div>
          <svg className="arc" viewBox="0 0 200 60">
            <path d="M15 50 Q100 -25 181 38 M168 39l14 0-2-14" />
          </svg>
          <span className="scribble bottom">look a little closer ↗</span>
        </>
      ) : variant === "sage" ? (
        <>
          <div className="art-triplets">
            <span>−2</span>
            <span>0</span>
            <span>2</span>
          </div>
          <div className="art-triplets ghost">
            <span>−2</span>
            <span>0</span>
            <span>2</span>
            <i>?</i>
          </div>
          <span className="tiny-note">same, same… different?</span>
        </>
      ) : (
        <>
          <div className="art-trail">
            <i>0</i>
            <b>→</b>
            <i>1</i>
            <b>→</b>
            <i>3</i>
            <b>↴</b>
            <i className="loop">2</i>
            <b>⇄</b>
            <i>4</i>
          </div>
          <span className="tiny-note">haven’t we met before?</span>
        </>
      )}
    </div>
  );
}
function App() {
  const [route, setRoute] = useState(getRoute),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All bits");
  const [offline, setOffline] = useState(!navigator.onLine),
    [offlineReady, setOfflineReady] = useState(false),
    [updateReady, setUpdateReady] = useState(false);
  const queue = useRef<string[]>([]),
    library = useRef<HTMLElement>(null),
    main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const off = () => setOffline(true),
      on = () => setOffline(false),
      ready = () => setOfflineReady(true),
      update = () => setUpdateReady(true);
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    window.addEventListener("algobits-offline-ready", ready);
    window.addEventListener("algobits-update-ready", update);
    navigator.serviceWorker
      ?.getRegistration()
      .then((r) => {
        if (r?.active) setOfflineReady(true);
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("offline", off);
      window.removeEventListener("online", on);
      window.removeEventListener("algobits-offline-ready", ready);
      window.removeEventListener("algobits-update-ready", update);
    };
  }, []);
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
  }, [route]);
  const review = route.startsWith("/review/"),
    single = route.startsWith("/bit/"),
    about = route === "/about";
  const challenge = challenges.find((c) => c.id === route.split("/")[2]);
  const startReview = () => {
    queue.current = shuffledIds(ids, challenge?.id);
    navigate("/review/" + queue.current.shift());
  };
  const nextReview = () => {
    if (!queue.current.length) queue.current = shuffledIds(ids, challenge?.id);
    navigate("/review/" + queue.current.shift());
  };
  const results = challenges.filter(
    (c) =>
      (filter === "All bits" || c.kind === filter) &&
      `${c.title} ${c.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  useEffect(() => {
    document.title = challenge
      ? `${challenge.title} — AlgoBits`
      : about
        ? "About — AlgoBits"
        : "AlgoBits — small challenges, lasting insights";
  }, [challenge, about]);
  return (
    <>
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
        <a className="brand" href="#/" aria-label="AlgoBits home">
          <span className="brand-icon">
            <Code2 size={23} />
          </span>
          algo<span className="brand-serif">bits</span>
          <span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a className={!review && !about ? "active" : ""} href="#/">
            Library
          </a>
          <button className={review ? "active" : ""} onClick={startReview}>
            Review <Shuffle size={14} />
          </button>
          <a className={about ? "active" : ""} href="#/about">
            About
          </a>
        </nav>
        <span className="header-note">A LITTLE PRACTICE, OFTEN.</span>
      </header>
      {(offline || updateReady) && (
        <div className="connection-notice" role="status">
          {offline ? (
            <>
              <WifiOff size={14} />
              You’re offline. Your downloaded bits are ready to play.
            </>
          ) : (
            <>A fresh edition is ready. Close and reopen AlgoBits to load it.</>
          )}
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        {route === "/" ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="orange-dash" /> A PERSONAL ALGORITHM NOTEBOOK
                </div>
                <h1>
                  Small challenges.
                  <br />
                  <em>
                    Lasting little
                    <br className="desktop-break" /> insights.
                  </em>
                </h1>
                <p>
                  For the moments when something clicks.
                  <br />A collection of bite-sized challenges to play,
                  <br className="desktop-break" /> understand, and come back to.
                </p>
                <div className="hero-actions">
                  <button className="primary" onClick={startReview}>
                    <Shuffle size={17} /> Start a random review{" "}
                    <ArrowUpRight size={18} />
                  </button>
                  <button
                    className="text-button browse"
                    onClick={() =>
                      library.current?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Explore the collection <ArrowRight size={15} />
                  </button>
                </div>
                <div className="hero-footnote">
                  <span className="little-stack">
                    <i />
                    <i />
                    <i />
                  </span>
                  One small idea. Less than a minute.
                </div>
              </div>
              <a href={"#/bit/" + ids[0]} className="featured">
                <div className="featured-label">
                  <span>
                    <span className="live-dot" /> FRESH FROM THE NOTEBOOK
                  </span>
                  <ArrowUpRight size={19} />
                </div>
                <Artwork variant="peach" large />
                <div className="featured-bottom">
                  <div>
                    <span className="eyebrow">BIT 001 · COUNTEREXAMPLE</span>
                    <h2>One number short</h2>
                    <p>A pair looks perfect. Is it?</p>
                  </div>
                  <span className="circle-arrow">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
              </a>
            </section>
            <section className="collection" ref={library} id="collection">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">THE GROWING COLLECTION</div>
                  <h2>
                    A few bits to think about
                    <span className="count">
                      {challenges.length.toString().padStart(2, "0")}
                    </span>
                  </h2>
                </div>
                <span className="section-note">
                  Made with curiosity. Kept for later.
                </span>
              </div>
              <div className="library-toolbar">
                <div className="filters" aria-label="Filter by experience">
                  {[
                    "All bits",
                    "Counterexample",
                    "Next move",
                    "Follow the trail",
                  ].map((f) => (
                    <button
                      key={f}
                      aria-pressed={filter === f}
                      className={filter === f ? "selected" : ""}
                      onClick={() => setFilter(f)}
                    >
                      {f === "Counterexample"
                        ? "Counterexamples"
                        : f === "Next move"
                          ? "Next moves"
                          : f === "Follow the trail"
                            ? "Follow the trail"
                            : f}
                    </button>
                  ))}
                </div>
                <label className="search">
                  <Search size={16} />
                  <input
                    aria-label="Search challenges"
                    placeholder="Find a little idea…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </label>
              </div>
              <div className="challenge-grid">
                {results.map((c) => (
                  <a className="library-bit" href={"#/bit/" + c.id} key={c.id}>
                    <div className="art-wrap">
                      <Artwork variant={c.accent} />
                      <span className="bit-index">
                        {c.id.slice(0, 2).padStart(3, "0")}
                      </span>
                      <span className="art-launch">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>
                    <div className="bit-meta">
                      <span>{c.kind}</span>
                      <span>{c.minutes}</span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <span className="play-link">
                      Give it a go <ArrowRight size={15} />
                    </span>
                  </a>
                ))}
              </div>
              {!results.length && (
                <div className="empty">
                  <Search size={25} />
                  <h3>No bits found just yet.</h3>
                  <p>Try another phrase or clear the filters.</p>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSearch("");
                      setFilter("All bits");
                    }}
                  >
                    Show all bits →
                  </button>
                </div>
              )}
            </section>
            <section className="closing-note">
              <span className="note-asterisk">✳</span>
              <p>
                Not another problem set.
                <br />
                <em>A place to keep the little things you learn.</em>
              </p>
              <span className="note-line" />
            </section>
          </>
        ) : about ? (
          <section className="about-page">
            <a className="back-link" href="#/">
              <ArrowLeft size={15} /> Back to the notebook
            </a>
            <div className="eyebrow">A NOTE ON THIS NOTEBOOK</div>
            <h1>
              Keep the things
              <br />
              <em>that click.</em>
            </h1>
            <p>
              Solving a problem is one thing. Keeping its little insight with
              you is another.
            </p>
            <p>
              AlgoBits is a personal collection of small, interactive ideas
              inspired by algorithm problems. Each bit starts with something to
              try. The problem, the pattern, and the explanation stay tucked
              away until you’re ready to reveal them.
            </p>
            <div className="about-principles">
              <div>
                <span>01</span>
                <h2>Play first.</h2>
                <p>Make a prediction. Follow a trail. Find a counterexample.</p>
              </div>
              <div>
                <span>02</span>
                <h2>Find the idea.</h2>
                <p>
                  Reveal the reasoning and connect it to the original problem.
                </p>
              </div>
              <div>
                <span>03</span>
                <h2>Come back.</h2>
                <p>Shuffle the collection whenever you have a spare minute.</p>
              </div>
            </div>
            <p className="about-small">
              No accounts, scores, or streaks. After your first full load, this
              notebook works offline. On your phone, use your browser’s “Add to
              Home Screen” option to keep it close.
            </p>
            <button className="primary" onClick={startReview}>
              Try a random bit <ArrowUpRight size={18} />
            </button>
          </section>
        ) : (review || single) && challenge ? (
          <ChallengePage
            key={route}
            challenge={challenge}
            review={review}
            onNext={
              review
                ? nextReview
                : () =>
                    navigate(
                      "/bit/" +
                        ids[(ids.indexOf(challenge.id) + 1) % ids.length],
                    )
            }
          />
        ) : (
          <section className="empty not-found">
            <BookOpen size={30} />
            <h1>This page slipped out.</h1>
            <p>There are still a few good ideas in the notebook.</p>
            <a className="primary" href="#/">
              Back to the collection <ArrowRight size={17} />
            </a>
          </section>
        )}
      </main>
      <footer>
        <a href="#/" className="footer-brand">
          algobits<span>.</span>
        </a>
        <p>A little wiser, one bit at a time.</p>
        <span className="offline-label">
          <span
            className={offlineReady ? "status-dot" : "status-dot pending"}
          />
          {offlineReady
            ? "Ready for offline moments"
            : "Your pocket-sized notebook"}
        </span>
        <a
          href="https://github.com/ryanata/algobits"
          target="_blank"
          rel="noreferrer"
        >
          View source <ArrowUpRight size={13} />
        </a>
      </footer>
    </>
  );
}
function ChallengePage({
  challenge: c,
  review,
  onNext,
}: {
  challenge: ChallengeModule;
  review: boolean;
  onNext: () => void;
}) {
  const [complete, setComplete] = useState(false),
    [revealed, setRevealed] = useState(false),
    [attempt, setAttempt] = useState(0);
  const reveal = useRef<HTMLElement>(null);
  const Component = c.Component;
  const showInsight = () => {
    setRevealed(true);
    setTimeout(
      () =>
        reveal.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      40,
    );
  };
  return (
    <div className="challenge-page">
      <div className="challenge-navigation">
        <a href="#/" className="back-link">
          <ArrowLeft size={15} />
          {review ? "Exit review" : "The collection"}
        </a>
        <span>
          {review ? (
            <>
              <Shuffle size={14} /> SHUFFLE MODE
            </>
          ) : (
            "FROM THE NOTEBOOK"
          )}
          <span className="nav-divider">/</span>
          {c.minutes}
        </span>
      </div>
      <div className="challenge-heading">
        <div className="eyebrow">
          BIT {c.id.slice(0, 2).padStart(3, "0")} <span>·</span>{" "}
          {c.kind.toUpperCase()}
        </div>
        <h1>{c.title}</h1>
        <p>{c.description}</p>
      </div>
      <div className="challenge-layout">
        <div>
          <div className={"exercise-shell " + c.accent}>
            <Component key={attempt} onComplete={() => setComplete(true)} />
          </div>
          <div className="reveal-controls">
            <button
              className={complete ? "primary" : "secondary"}
              onClick={showInsight}
              disabled={revealed}
            >
              {revealed ? <Check size={17} /> : <Sparkles size={17} />}{" "}
              {revealed
                ? "Insight revealed"
                : complete
                  ? "Reveal the insight"
                  : "Skip to the insight"}
              {!revealed && <ArrowUpRight size={17} />}
            </button>
            <button
              className="text-button"
              onClick={() => {
                setAttempt((a) => a + 1);
                setComplete(false);
                setRevealed(false);
              }}
            >
              Start over
            </button>
          </div>
          {revealed && (
            <section className="insight" ref={reveal}>
              <div className="eyebrow">
                <Sparkles size={15} /> THE LITTLE INSIGHT
              </div>
              <h2>{c.insight}</h2>
              <div className="tags">
                {c.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {c.explanation.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <details>
                <summary>
                  A look at the code <Code2 size={16} />
                </summary>
                <pre>
                  <code>{c.code}</code>
                </pre>
              </details>
              <a
                className="problem-link"
                href={c.problem.url}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <span>THE ORIGINAL PROBLEM</span>
                  <strong>
                    #{c.problem.number} · {c.problem.title}
                  </strong>
                </div>
                <ArrowUpRight size={21} />
              </a>
            </section>
          )}
          <div className="next-row">
            <span>
              {revealed
                ? "A little idea to take with you."
                : "Take your time. There’s no score."}
            </span>
            <button className="text-button" onClick={onNext}>
              {review ? "Next random bit" : "Next bit"} <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <aside className="margin-note">
          <span className="note-asterisk">✳</span>
          <h2>A small invitation</h2>
          <p>Try it before you name it.</p>
          <p>
            The problem and its pattern are tucked away until you reveal the
            insight.
          </p>
          <div className="margin-rule" />
          <span>
            {complete
              ? "Nicely spotted. The insight is ready."
              : "No timer. No streak. Just a little curiosity."}
          </span>
        </aside>
      </div>
    </div>
  );
}
export default App;
