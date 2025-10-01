import { useEffect, useState } from "react";
import { computeAccuracyByTense, computeFamiliarityByWord, estimateLevel, overallSummary, computeGrammarScore } from "../utils/progress.js";
import { vocabGroups, type CEFR } from "../content/vocabGroups.js";
import { LanguageSelector } from "./LanguageSelector.js";
import { ProgressTree } from "./ProgressTree";

type Familiarity = ReturnType<typeof computeFamiliarityByWord>[number];
type TenseStat = ReturnType<typeof computeAccuracyByTense>[number];

export function ProgressDashboard() {
  const [summary, setSummary] = useState<{ attempts: number; accuracy: number }>({ attempts: 0, accuracy: 0 });
  const [familiarity, setFamiliarity] = useState<Familiarity[]>([]);
  const [tenses, setTenses] = useState<TenseStat[]>([]);
  const [level, setLevel] = useState<ReturnType<typeof estimateLevel>>({ label: "A1", progressToNext: 0, score: 0 });
  const [grammarScore, setGrammarScore] = useState<number>(0);
  const [language, setLanguage] = useState<string>("es");

  useEffect(() => {
    setSummary(overallSummary());
    setFamiliarity(computeFamiliarityByWord(1).slice(0, 10));
    setTenses(computeAccuracyByTense());
    setLevel(estimateLevel());
    setGrammarScore(computeGrammarScore());
    try {
      const stored = localStorage.getItem("language");
      if (stored) setLanguage(stored);
    } catch {}
  }, []);

  function onLanguageChange(code: string) {
    setLanguage(code);
    try {
      localStorage.setItem("language", code);
      window.dispatchEvent(new CustomEvent("language-changed", { detail: code }));
    } catch {}
    // Future: recompute progress per-language when multi-lang is supported
  }

  return (
    <div className={"grid grid-cols-1 gap-4"}>
      <div className={"flex items-center justify-between gap-3"}>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"}>Language</div>
        <LanguageSelector selected={language} onChange={onLanguageChange} />
      </div>
      <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
        <Card>
          <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"}>Overall</div>
          <div className={"flex items-end justify-between mt-1"}>
            <div className={"text-3xl font-semibold tabular-nums"}>{summary.accuracy}%</div>
            <div className={"text-xs text-gray-600 dark:text-gray-400"}>{summary.attempts} attempts</div>
          </div>
          <GradientMeter value={summary.accuracy} />
        </Card>
        <Card>
          <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400"}>Estimated level</div>
          <div className={"mt-2 flex items-center gap-3"}>
            <Ring value={level.progressToNext} label={level.label} />
            <div>
              <div className={"text-lg font-semibold"}>{level.label}</div>
              <div className={"text-xs text-gray-600 dark:text-gray-400"}>{level.progressToNext}% to next</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Familiarity by word</div>
        <ul className={"divide-y divide-gray-100 dark:divide-gray-800"}>
          {familiarity.map((f) => (
            <li key={`${f.type}:${f.word}`} className={"py-2 flex items-center gap-3"}>
              <div className={"w-24 shrink-0 text-sm text-gray-700 dark:text-gray-200"}>{f.word}</div>
              <div className={"flex-1"}>
                <Bar value={f.score} />
              </div>
              <div className={"w-24 shrink-0 text-right text-xs text-gray-600 dark:text-gray-400 tabular-nums"}>
                {f.accuracy}% · {f.attempts}x
              </div>
            </li>
          ))}
          {familiarity.length === 0 ? (
            <li className={"py-2 text-gray-500 dark:text-gray-400"}>No data yet. Do a few exercises.</li>
          ) : null}
        </ul>
      </Card>

      <Card>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Accuracy by tense</div>
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
          {tenses.map((t) => (
            <div key={t.tense} className={"flex items-center gap-3"}>
              <div className={"w-36 shrink-0 text-sm text-gray-700 dark:text-gray-200 capitalize"}>
                {t.tense.replaceAll("_", " ")}
              </div>
              <div className={"flex-1"}>
                <Bar value={t.accuracy} />
              </div>
              <div className={"w-16 shrink-0 text-right text-xs text-gray-600 dark:text-gray-400 tabular-nums"}>
                {t.accuracy}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Grammar score</div>
        <div className={"flex items-center gap-3"}>
          <Ring value={grammarScore} label={`${grammarScore}%`} />
          <div className={"text-sm text-gray-700 dark:text-gray-300"}>
            Weighted by level; higher levels emphasize more tenses
          </div>
        </div>
      </Card>

      <Card>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Vocabulary categories</div>
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
          {vocabGroups.map((g) => (
            <div key={g.id} className={"p-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/40"}>
              <div className={"text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"}>{g.title}</div>
              <div className={"flex flex-wrap gap-1"}>
                {(Object.keys(g.tiers) as CEFR[]).sort().map((tier) => (
                  <span key={tier} className={"inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300"}>
                    {tier}: {(g.tiers[tier]?.length || 0)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className={"text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"}>Learning map</div>
        <ProgressTree />
      </Card>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const width = Math.max(2, Math.min(100, Math.round(value)));
  return (
    <div className={"h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden"}>
      <div
        className={"h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600"}
        style={{ width: `${width}%` }}
        aria-hidden
      />
    </div>
  );
}

function GradientMeter({ value }: { value: number }) {
  const width = Math.max(2, Math.min(100, Math.round(value)));
  return (
    <div className={"mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden"}>
      <div
        className={"h-full bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-400"}
        style={{ width: `${width}%` }}
        aria-hidden
      />
    </div>
  );
}

function Ring({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
      <circle cx="28" cy="28" r={r} fill="none" className={"stroke-gray-200 dark:stroke-gray-800"} strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="url(#g)"
        strokeWidth="6"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <text x="28" y="32" textAnchor="middle" fontSize="10" fill="currentColor">
        {label}
      </text>
    </svg>
  );
}

// level intensity mapping moved to SpanishWorldMap component


