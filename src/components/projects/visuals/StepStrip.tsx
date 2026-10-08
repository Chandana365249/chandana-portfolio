import { ChevronRight } from "lucide-react";

/** Compact one-line flow of pipeline steps (wraps on narrow screens). */
export function StepStrip({ steps }: { steps: readonly string[] }) {
  return (
    <ol
      aria-label={`Pipeline: ${steps.join(", then ")}.`}
      className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-meta text-foreground-muted"
    >
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} aria-hidden="true" className="text-foreground-muted/60" />}
          <span className={i === steps.length - 1 ? "text-foreground-secondary" : undefined}>
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
