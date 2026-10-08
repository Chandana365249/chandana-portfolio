import type { CSSProperties } from "react";
import { StepStrip } from "./StepStrip";

interface SignalVisualProps {
  targets: readonly string[];
  models: readonly string[];
  steps: readonly string[];
}

const WAVE_WIDTH = 200;
const WAVE_HEIGHT = 32;

/** Deterministic multi-frequency waveform, abstractly EEG-like. */
function wavePath(seed: number) {
  const points: string[] = [];
  for (let x = 0; x <= WAVE_WIDTH; x += 2) {
    const y =
      WAVE_HEIGHT / 2 +
      5 * Math.sin(x * 0.09 + seed) +
      3 * Math.sin(x * 0.23 + seed * 2.1) +
      2 * Math.sin(x * 0.51 + seed * 0.7);
    points.push(`${x},${Math.round(y * 10) / 10}`);
  }
  return `M ${points.join(" L ")}`;
}

/**
 * Signal-processing view: four abstract channels pass through the compared
 * model families into the four target dimensions.
 */
export function SignalVisual({ targets, models, steps }: SignalVisualProps) {
  return (
    <div className="flex flex-col gap-5">
      <div
        role="img"
        aria-label={`Signal channels processed by ${models.join(", ")} models into ${targets.join(", ")}.`}
        className="flex items-center gap-3"
      >
        {/* Channels with a slow scan line */}
        <div aria-hidden="true" className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex flex-col gap-2">
            {targets.map((target, i) => (
              <svg
                key={target}
                viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
                preserveAspectRatio="none"
                className="h-8 w-full transition-transform duration-700 ease-smooth group-hover:translate-x-1"
              >
                <path
                  d={wavePath(i * 1.7 + 0.4)}
                  fill="none"
                  stroke={i % 2 ? "var(--color-violet)" : "var(--color-accent)"}
                  strokeOpacity={0.55}
                  strokeWidth={1.25}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ))}
          </div>
          <span className="animate-scan absolute inset-y-0 w-px bg-linear-to-b from-transparent via-accent/60 to-transparent" />
        </div>

        {/* Model families */}
        <div aria-hidden="true" className="hidden items-center gap-3 sm:flex">
          <span className="reveal-line-x h-px w-5 bg-border-strong" />
          <div className="flex flex-col gap-1 rounded-lg border border-violet/30 bg-surface-elevated px-3 py-2.5 text-center font-mono text-meta text-foreground">
            {models.map((model) => (
              <span key={model}>{model}</span>
            ))}
          </div>
        </div>

        {/* Target dimensions */}
        <ul aria-hidden="true" className="flex flex-col gap-2">
          {targets.map((target, i) => (
            <li key={target} className="flex h-8 items-center gap-2">
              <span
                className="reveal-line-x h-px w-4 bg-border-strong"
                style={{ "--line-delay": `${0.4 + i * 0.1}s` } as CSSProperties}
              />
              <span className="eyebrow rounded-full border border-border-strong bg-surface px-2.5 py-1 text-foreground-secondary">
                {target}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <StepStrip steps={steps} />
    </div>
  );
}
