import React, { useMemo, useState } from "react";

const questions = {
  broad: [
    {
      id: "b1",
      type: "rating",
      text: "I am interested in conflicts between powerful countries.",
      score: (v) => ({
        arms: v >= 4 ? 1 : v === 3 ? 0.5 : 0,
        korea: v >= 4 ? 1 : v === 3 ? 0.5 : 0,
        southAfrica: 0,
      }),
    },
    {
      id: "b2",
      type: "rating",
      text: "I think it matters to study how people fight unfair rules or treatment.",
      score: (v) => ({
        arms: 0,
        korea: 0,
        southAfrica: v >= 4 ? 1 : v === 3 ? 0.5 : 0,
      }),
    },
    {
      id: "b3",
      type: "rating",
      text: "I am interested in how weapons or military power shape decisions.",
      score: (v) => ({
        arms: v >= 4 ? 1 : v === 3 ? 0.5 : 0,
        korea: v >= 4 ? 0.5 : 0,
        southAfrica: 0,
      }),
    },
    {
      id: "b4",
      type: "rating",
      text: "I want to understand how outside countries affect what happens in another country.",
      score: (v) => ({
        arms: 0,
        korea: v >= 4 ? 1 : v === 3 ? 0.5 : 0,
        southAfrica: 0,
      }),
    },
    {
      id: "b5",
      type: "rating",
      text: "I am most interested in times when people or countries try to gain, keep, or challenge power.",
      score: (v) => ({
        arms: v >= 4 ? 1 : 0,
        korea: v >= 4 ? 1 : 0,
        southAfrica: v >= 4 ? 1 : 0,
      }),
    },
  ],
  meso: [
    {
      id: "m1",
      type: "choice",
      prompt: "I am more interested in times when",
      a: "powerful countries compete",
      b: "people fight unfair rules or treatment",
      score: (ans) =>
        ans === "A"
          ? { arms: 2, korea: 2, southAfrica: 0 }
          : { arms: 0, korea: 0, southAfrica: 2 },
    },
    {
      id: "m2",
      type: "choice",
      prompt: "I am more interested in conflicts shaped by",
      a: "military power, fear, or threat",
      b: "protest, resistance, or demands for change",
      score: (ans) =>
        ans === "A"
          ? { arms: 2, korea: 1, southAfrica: 0 }
          : { arms: 0, korea: 0, southAfrica: 2 },
    },
    {
      id: "m3",
      type: "choice",
      prompt: "I am more interested in how",
      a: "global competition affects smaller places",
      b: "local people try to shape their own future",
      score: (ans) =>
        ans === "A"
          ? { arms: 0, korea: 2, southAfrica: 0 }
          : { arms: 0, korea: 1, southAfrica: 2 },
    },
    {
      id: "m4",
      type: "choice",
      prompt: "I am more interested in how",
      a: "governments show strength to each other",
      b: "people challenge governments and systems",
      score: (ans) =>
        ans === "A"
          ? { arms: 2, korea: 1, southAfrica: 0 }
          : { arms: 0, korea: 1, southAfrica: 2 },
    },
    {
      id: "m5",
      type: "choice",
      prompt: "I would rather study a conflict where",
      a: "outside countries play a big role",
      b: "the main story is people resisting injustice",
      score: (ans) =>
        ans === "A"
          ? { arms: 0, korea: 2, southAfrica: 0 }
          : { arms: 0, korea: 0, southAfrica: 2 },
    },
  ],
  final: [
    {
      id: "f1",
      type: "choice",
      prompt: "I would rather study how",
      a: "countries use weapons, fear, or technology to show strength",
      b: "people organize to challenge unfair systems",
      score: (ans) =>
        ans === "A"
          ? { arms: 3, korea: 0, southAfrica: 0 }
          : { arms: 0, korea: 0, southAfrica: 3 },
    },
    {
      id: "f2",
      type: "choice",
      prompt: "I am more interested in a conflict shaped mostly by",
      a: "competition between powerful countries",
      b: "people trying to change who has power",
      score: (ans) =>
        ans === "A"
          ? { arms: 1, korea: 3, southAfrica: 0 }
          : { arms: 0, korea: 1, southAfrica: 3 },
    },
    {
      id: "f3",
      type: "choice",
      prompt: "I would rather study how power is",
      a: "shown by governments to other countries",
      b: "challenged by people inside a society",
      score: (ans) =>
        ans === "A"
          ? { arms: 3, korea: 1, southAfrica: 0 }
          : { arms: 0, korea: 1, southAfrica: 3 },
    },
    {
      id: "f4",
      type: "choice",
      prompt: "I am more interested in how",
      a: "powerful countries show strength directly",
      b: "powerful countries affect and influence a conflict in another country",
      score: (ans) =>
        ans === "A"
          ? { arms: 3, korea: 0, southAfrica: 0 }
          : { arms: 0, korea: 4, southAfrica: 0 },
    },
  ],
};

const topics = {
  arms: {
    key: "arms",
    title: "Arms Race / Space Race",
    type: "Military Power",
    question:
      "How were the arms and space races used by the USA and USSR to show power during the Cold War?",
    why: "you seemed most interested in how governments use weapons, technology, fear, and competition to show strength.",
  },
  korea: {
    key: "korea",
    title: "Korea",
    type: "Superpower Conflict",
    question:
      "Was the Korean War mainly a proxy war between two superpowers, or a Korean struggle for power that used those superpowers?",
    why: "you seemed most interested in how powerful countries affect conflicts in other places and how local struggles connect to larger global competition.",
  },
  southAfrica: {
    key: "southAfrica",
    title: "South Africa",
    type: "Resistance and Change",
    question:
      "How did different forms of resistance challenge apartheid in South Africa?",
    why: "you seemed most interested in how people challenge unfair systems and try to create change from within a society.",
  },
};

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildRun() {
  return [...shuffle(questions.broad), ...shuffle(questions.meso), ...shuffle(questions.final)];
}

function Progress({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [run, setRun] = useState(buildRun());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({ arms: 0, korea: 0, southAfrica: 0 });
  const [done, setDone] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const total = run.length;
  const current = run[index];

  const ranking = useMemo(() => {
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return entries.map(([key]) => topics[key]);
  }, [scores]);

  function applyDelta(delta) {
    setScores((prev) => ({
      arms: prev.arms + (delta.arms || 0),
      korea: prev.korea + (delta.korea || 0),
      southAfrica: prev.southAfrica + (delta.southAfrica || 0),
    }));
  }

  function answer(value) {
    if (!current || answers[current.id] != null) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    applyDelta(current.score(value));

    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((n) => n + 1);
    }
  }

  function restart() {
    setRun(buildRun());
    setIndex(0);
    setAnswers({});
    setScores({ arms: 0, korea: 0, southAfrica: 0 });
    setDone(false);
  }

  if (done) {
    const best = ranking[0];
    const alt = ranking[1];
    return (
      <div className="page">
        <div className="container wide">
          <section className="card">
            <p className="eyebrow">Your best match is…</p>
            <h1>{best.title}</h1>
            <p className="lead">
              Based on your answers, you would probably find <strong>{best.title} — {best.type}</strong> the most interesting because {best.why}
            </p>
            <div className="question-box">
              <p className="question-label">Essential Question</p>
              <p className="question-text">{best.question}</p>
            </div>
            <p className="alt-text">
              You may also find <strong>{alt.title}</strong> interesting based on your other answers.
            </p>
            <div className="button-row">
              <button className="primary-btn" onClick={restart}>Try Again</button>
              <button className="ghost-btn" onClick={() => setShowDebug((v) => !v)}>
                {showDebug ? "Hide Debug Scores" : "Show Debug Scores"}
              </button>
            </div>
            {showDebug && (
              <pre className="debug-box">{JSON.stringify(scores, null, 2)}</pre>
            )}
          </section>

          <section>
            <h2>All 3 Final DBQ Options</h2>
            <div className="card-grid">
              {Object.values(topics).map((topic) => (
                <article key={topic.key} className="mini-card">
                  <h3>{topic.title}</h3>
                  <p className="mini-type">{topic.type}</p>
                  <p className="mini-question">{topic.question}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <section className="card">
          <h1>World History Topic Matcher</h1>
          <p className="subtext">
            Answer one question at a time. At the end, you will get a recommended DBQ topic and one alternate topic.
          </p>
          <Progress current={index + 1} total={total} />
        </section>

        <section className="card">
          {current.type === "rating" ? (
            <>
              <p className="question-main">{current.text}</p>
              <div className="rating-grid">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className="rating-btn" onClick={() => answer(n)}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="rating-labels">
                <span>Strongly disagree</span>
                <span>Disagree</span>
                <span>Not sure</span>
                <span>Agree</span>
                <span>Strongly agree</span>
              </div>
            </>
          ) : (
            <>
              <p className="prompt">{current.prompt}</p>
              <div className="choice-stack">
                <button className="choice-btn" onClick={() => answer("A")}>
                  <span className="choice-letter">A</span>
                  <span className="choice-text">{current.a}</span>
                </button>
                <button className="choice-btn" onClick={() => answer("B")}>
                  <span className="choice-letter">B</span>
                  <span className="choice-text">{current.b}</span>
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
