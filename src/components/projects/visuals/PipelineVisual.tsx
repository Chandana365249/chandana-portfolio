import { Fragment, type CSSProperties } from "react";
import type { PipelineStage } from "@/data/projects";

/**
 * Layered system pipeline: each stage is a lane of numbered steps, joined by
 * connectors that draw in on reveal and carry a slow travelling signal.
 */
export function PipelineVisual({ stages }: { stages: readonly PipelineStage[] }) {
  const allSteps = stages.flatMap((s) => s.steps);
  // Global step numbering continues across lanes.
  const offsets = stages.map((_, i) =>
    stages.slice(0, i).reduce((count, s) => count + s.steps.length, 0),
  );

  return (
    <div role="img" aria-label={`Pipeline: ${allSteps.join(", then ")}.`} className="flex flex-col">
      {stages.map((stage, i) => (
        <Fragment key={stage.stage}>
          <div className="rounded-xl border border-border bg-background/50 p-4 transition-colors duration-500 group-hover:border-border-strong sm:p-5">
            <div className="mb-3 flex items-center gap-3" aria-hidden="true">
              <span className="eyebrow text-accent/80">{stage.stage}</span>
              <span
                className="reveal-line-x h-px flex-1 bg-border"
                style={{ "--line-delay": `${0.3 + i * 0.25}s` } as CSSProperties}
              />
            </div>
            <ol className="flex flex-wrap gap-2" aria-hidden="true">
              {stage.steps.map((step, j) => (
                <li key={step}>
                  <span className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 py-1.5 text-meta text-foreground">
                    <span className="font-mono text-foreground-muted">
                      {String(offsets[i] + j + 1).padStart(2, "0")}
                    </span>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {i < stages.length - 1 && (
            <div aria-hidden="true" className="relative mx-auto h-8 w-px">
              <span
                className="reveal-line-y absolute inset-0 bg-linear-to-b from-accent/50 to-violet/50"
                style={{ "--line-delay": `${0.45 + i * 0.25}s` } as CSSProperties}
              />
              <span
                className="animate-travel-y absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
                style={{ animationDelay: `${i * 1.6}s` }}
              />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
