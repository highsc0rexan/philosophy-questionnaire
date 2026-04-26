import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  QUESTIONS,
  PHILOSOPHIES,
  computeScores,
  INTRO_TEXT,
  INTRO_RELIGION,
  INTRO_RESULTS,
  type Question,
} from "./quiz";

type Stage = "intro" | "quiz" | "results";

const REPO_URL = "https://github.com/highsc0rexan/philosophy-questionnaire";

function visibleQuestions(answers: Record<string, number>): Question[] {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
}

export default function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  const questions = useMemo(() => visibleQuestions(answers), [answers]);
  const total = questions.length;
  const current = questions[step];

  function selectOption(idx: number) {
    if (!current) return;
    const next = { ...answers, [current.id]: idx };
    setAnswers(next);
    const newQuestions = visibleQuestions(next);
    if (step + 1 >= newQuestions.length) {
      setStage("results");
    } else {
      setStep(step + 1);
    }
  }

  function back() {
    if (step === 0) {
      setStage("intro");
    } else {
      setStep(step - 1);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setStage("intro");
  }

  return (
    <div className="min-h-full text-zinc-100">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Philosophy Questionnaire
          </h1>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-200 underline-offset-2 hover:underline"
          >
            GitHub
          </a>
        </header>

        {stage === "intro" && (
          <Intro onStart={() => { setStage("quiz"); setStep(0); }} />
        )}

        {stage === "quiz" && current && (
          <QuizScreen
            question={current}
            step={step}
            total={total}
            selected={answers[current.id]}
            onSelect={selectOption}
            onBack={back}
          />
        )}

        {stage === "results" && (
          <Results answers={answers} onRestart={restart} />
        )}

        <footer className="mt-16 text-center text-xs text-zinc-500">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-300"
          >
            View source on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6 leading-relaxed text-zinc-300">
      <p>{INTRO_TEXT}</p>
      <div>
        <h2 className="text-zinc-100 font-semibold tracking-wide uppercase text-sm mb-2">
          Religion
        </h2>
        <p>{INTRO_RELIGION}</p>
      </div>
      <div>
        <h2 className="text-zinc-100 font-semibold tracking-wide uppercase text-sm mb-2">
          Results
        </h2>
        <p>{INTRO_RESULTS}</p>
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onStart}
          className="px-5 py-3 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition"
        >
          Start the questionnaire
        </button>
      </div>
    </div>
  );
}

function QuizScreen({
  question,
  step,
  total,
  selected,
  onSelect,
  onBack,
}: {
  question: Question;
  step: number;
  total: number;
  selected: number | undefined;
  onSelect: (idx: number) => void;
  onBack: () => void;
}) {
  const progressPct = ((step) / total) * 100;
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>
            Question {step + 1} of {total}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-zinc-400 hover:text-zinc-200"
          >
            ← Back
          </button>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded">
          <div
            className="h-full bg-indigo-500 rounded transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-medium mb-5 leading-snug">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              className={
                "w-full text-left px-4 py-3 rounded-md border transition " +
                (isSelected
                  ? "border-indigo-400 bg-indigo-500/10"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800")
              }
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Results({
  answers,
  onRestart,
}: {
  answers: Record<string, number>;
  onRestart: () => void;
}) {
  const { scores } = useMemo(() => computeScores(answers), [answers]);

  // Build chart data with full names, sorted by score descending.
  const data = useMemo(
    () =>
      PHILOSOPHIES.map((p) => ({
        name: p.name,
        score: Math.round(scores[p.key]),
      })).sort((a, b) => b.score - a.score),
    [scores],
  );

  const top = data[0];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-medium mb-1">Your results</h2>
        <p className="text-sm text-zinc-400 mb-4">
          {top
            ? `Strongest match: ${top.name}.`
            : "No matches found."}
        </p>

        <div className="w-full h-[520px] bg-zinc-900/60 rounded-lg p-4 border border-zinc-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 8, right: 24, bottom: 8, left: 8 }}
            >
              <CartesianGrid stroke="#27272a" horizontal={false} />
              <XAxis
                type="number"
                domain={[-200, 200]}
                ticks={[-200, -100, 0, 100, 200]}
                stroke="#a1a1aa"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                stroke="#a1a1aa"
                tick={{ fill: "#e4e4e7", fontSize: 13 }}
              />
              <ReferenceLine x={0} stroke="#52525b" />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {data.map((d, i) => (
                  <Cell
                    key={i}
                    fill={d.score >= 0 ? "#818cf8" : "#f472b6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm"
          >
            Take it again
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">About each philosophy</h2>
        <div className="space-y-5">
          {PHILOSOPHIES.map((p) => (
            <div key={p.key}>
              <h3 className="font-semibold text-zinc-100">{p.name}</h3>
              <p className="text-zinc-300 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
