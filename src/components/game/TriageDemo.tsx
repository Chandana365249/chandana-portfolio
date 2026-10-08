"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, Sparkles } from "lucide-react";
import { useState } from "react";
import { baseTransition } from "@/lib/motion";
import { unlock } from "@/lib/quest";
import { highlight, sampleReports, triage, type Severity, type TriageResult } from "@/lib/triage";
import { cn } from "@/lib/utils";

const severityStyles: Record<Severity, { text: string; bar: string; glow: string }> = {
  Low: { text: "text-accent", bar: "from-accent to-accent", glow: "rgb(56 189 248 / 0.4)" },
  Moderate: { text: "text-violet", bar: "from-accent to-violet", glow: "rgb(167 139 250 / 0.45)" },
  High: { text: "text-pink", bar: "from-violet to-pink", glow: "rgb(244 114 182 / 0.5)" },
  Critical: { text: "text-[#fb7185]", bar: "from-pink to-[#fb7185]", glow: "rgb(251 113 133 / 0.6)" },
};

/**
 * Playable mini version of the ResQAI idea: type (or pick) an emergency report
 * and watch it become a structured incident with a severity score, a priority
 * and an explanation of which words drove the decision.
 */
export function TriageDemo() {
  const [report, setReport] = useState<string>(sampleReports[0]);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [analysed, setAnalysed] = useState("");

  const analyse = (text = report) => {
    if (!text.trim()) return;
    setReport(text);
    setAnalysed(text);
    setResult(triage(text));
    unlock("triage");
  };

  const styles = result ? severityStyles[result.severity] : null;

  return (
    <div
      data-spotlight
      className="relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border-strong bg-surface/70 p-5 sm:p-6"
    >
      <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-pink">Try it · ResQAI concept</p>
          <h3 className="mt-1.5 text-title font-semibold">Emergency triage simulator</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-eyebrow text-foreground-muted">
          <Sparkles size={12} aria-hidden="true" />
          In-browser
        </span>
      </header>

      <div className="flex flex-col gap-2">
        <label htmlFor="triage-report" className="eyebrow">
          Emergency report
        </label>
        <textarea
          id="triage-report"
          rows={3}
          value={report}
          onChange={(event) => setReport(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) analyse();
          }}
          className="w-full resize-none rounded-xl border border-border bg-background/60 p-3 text-meta text-foreground outline-none transition-colors placeholder:text-foreground-muted focus:border-violet/60 sm:text-body"
          placeholder="Describe an emergency…"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-eyebrow text-foreground-muted">Samples:</span>
          {sampleReports.map((sample, i) => (
            <button
              key={sample}
              type="button"
              onClick={() => analyse(sample)}
              className="rounded-md border border-border bg-background/50 px-2 py-0.5 font-mono text-eyebrow text-foreground-secondary transition-colors hover:border-violet/50 hover:text-foreground"
            >
              #{i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => analyse()}
            className="bg-brand ml-auto inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-meta font-semibold text-accent-foreground shadow-[0_8px_24px_-10px_rgb(167_139_250/0.8)] transition-transform hover:-translate-y-px active:scale-95"
          >
            Analyse report
          </button>
        </div>
      </div>

      <div aria-live="polite" className="min-h-48">
        <AnimatePresence mode="wait">
          {result && styles ? (
            <motion.div
              key={analysed}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={baseTransition}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-xl border border-border bg-background/50 p-4">
                <div
                  className="flex size-16 flex-col items-center justify-center rounded-xl border border-border-strong"
                  style={{ boxShadow: `0 0 32px -6px ${styles.glow}` }}
                >
                  <span className={cn("text-title font-bold", styles.text)}>{result.priority}</span>
                  <span className="text-[0.625rem] text-foreground-muted uppercase">priority</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className={cn("text-title font-semibold", styles.text)}>{result.severity}</span>
                    <span className="font-mono text-meta text-foreground-muted">
                      severity {result.score}/100
                    </span>
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-background/80">
                    <motion.div
                      className={cn("h-full rounded-full bg-linear-to-r", styles.bar)}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(4, result.score)}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-meta sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <dt className="eyebrow">Incident type</dt>
                  <dd className="mt-1 text-foreground">{result.types.join(", ") || "Unclear"}</dd>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <dt className="eyebrow">People affected</dt>
                  <dd className="mt-1 text-foreground">
                    {result.people ?? "Unknown"}
                    {result.vulnerable && <span className="text-pink"> · vulnerable</span>}
                  </dd>
                </div>
                <div className="col-span-2 rounded-xl border border-border bg-background/40 p-3 sm:col-span-1">
                  <dt className="eyebrow">Dispatch</dt>
                  <dd className="mt-1 text-foreground">{result.resources.join(" · ") || "Assess further"}</dd>
                </div>
              </dl>

              <div>
                <p className="eyebrow mb-2">Why? Highlighted words drove the score</p>
                <p className="rounded-xl border border-border bg-background/40 p-3 text-meta leading-relaxed">
                  {highlight(analysed, result.signals).map((chunk, i) =>
                    chunk.signal ? (
                      <mark
                        key={i}
                        title={`${chunk.signal.reason} (${chunk.signal.weight > 0 ? "+" : ""}${chunk.signal.weight})`}
                        className={cn(
                          "rounded px-0.5 text-foreground",
                          chunk.signal.weight < 0
                            ? "bg-accent/25"
                            : chunk.signal.weight >= 20
                              ? "bg-pink/30"
                              : "bg-violet/25",
                        )}
                      >
                        {chunk.text}
                      </mark>
                    ) : (
                      <span key={i}>{chunk.text}</span>
                    ),
                  )}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center"
            >
              <span aria-hidden="true" className="text-3xl">
                🚨
              </span>
              <p className="text-meta">Pick a sample or write your own report, then hit Analyse.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-auto flex items-start gap-2 text-eyebrow leading-snug text-foreground-muted">
        <Info size={12} aria-hidden="true" className="mt-0.5 shrink-0" />A playful keyword-based simulation of
        the ResQAI concept, not the actual model and not for real emergencies.
      </p>
    </div>
  );
}
