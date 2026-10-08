import { StepStrip } from "./StepStrip";

const WIDTH = 240;
const HEIGHT = 72;
const POINTS = 36;
/** Index where the highlighted input window starts. */
const WINDOW_START = 22;

/** Deterministic abstract series — illustrative shape only, not real data. */
const series = Array.from({ length: POINTS }, (_, i) => {
  const y = 38 + 12 * Math.sin(i * 0.45) + 7 * Math.sin(i * 1.3 + 1) + 4 * Math.sin(i * 2.7);
  return { x: (i / (POINTS + 4)) * WIDTH, y: Math.round(y * 10) / 10 };
});

const last = series[series.length - 1];
const step = WIDTH / (POINTS + 4);
const forecast = [last, { x: last.x + step * 2, y: last.y - 9 }, { x: last.x + step * 4, y: last.y - 4 }];
const toPath = (pts: ReadonlyArray<{ x: number; y: number }>) =>
  `M ${pts.map((p) => `${Math.round(p.x * 10) / 10},${p.y}`).join(" L ")}`;
const windowX = series[WINDOW_START].x;

/** Time-series view: a sequence window feeds the model, which projects ahead. */
export function SeriesVisual({ steps }: { steps: readonly string[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div aria-hidden="true" className="relative py-6">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-24 w-full overflow-visible"
        >
          <rect
            x={windowX}
            y={4}
            width={last.x - windowX}
            height={HEIGHT - 8}
            rx={3}
            fill="var(--color-accent)"
            fillOpacity={0.06}
            stroke="var(--color-accent)"
            strokeOpacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={toPath(series)}
            fill="none"
            stroke="var(--color-foreground-muted)"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={toPath(series.slice(WINDOW_START))}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={toPath(forecast)}
            fill="none"
            stroke="var(--color-violet)"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span
          className="eyebrow absolute top-0 text-accent/80"
          style={{ left: `${(windowX / WIDTH) * 100}%` }}
        >
          Sequence
        </span>
        <span className="eyebrow absolute right-0 bottom-0 text-violet/80">Prediction</span>
      </div>

      <StepStrip steps={steps} />
    </div>
  );
}
