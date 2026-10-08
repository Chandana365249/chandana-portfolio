"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/*
 * Abstract "data → insight" system. Geometry lives in a 100×100 viewBox so
 * SVG coordinates double as CSS percentages for the HTML labels on top.
 * Stroke widths are in viewBox units (0.25 ≈ 1px at desktop size); strokes
 * avoid non-scaling-stroke because it breaks pathLength-based dashing.
 *
 * The entrance is CSS (fade/draw with staggered delays), so the visual is
 * server-rendered complete and needs no JavaScript to appear. Framer Motion
 * drives only the ongoing core pulse, which is skipped under reduced motion.
 */

type Tone = "accent" | "violet" | "pink";

interface StageNode {
  label: string;
  /** Degrees clockwise from 3 o'clock. */
  angle: number;
  radius: number;
  tone: Tone;
}

const CENTER = 50;
const CORE_RING = 22;
const INNER_ORBIT = 30;

/** Pipeline stages, in flow order. The loop closes INSIGHT back into DATA. */
const stages: StageNode[] = [
  { label: "Data", angle: 190, radius: 38, tone: "accent" },
  { label: "Features", angle: 235, radius: 39, tone: "accent" },
  { label: "Model", angle: 305, radius: 38, tone: "violet" },
  { label: "API", angle: 355, radius: 38, tone: "accent" },
  { label: "Prediction", angle: 50, radius: 36, tone: "pink" },
  { label: "Insight", angle: 128, radius: 37, tone: "violet" },
];

/** Small static markers on the inner orbit. */
const satellites: ReadonlyArray<{ angle: number; tone: Tone }> = [
  { angle: 28, tone: "accent" },
  { angle: 96, tone: "violet" },
  { angle: 160, tone: "pink" },
  { angle: 218, tone: "violet" },
  { angle: 275, tone: "accent" },
  { angle: 332, tone: "pink" },
];

const toneColor: Record<Tone, string> = {
  accent: "var(--color-accent)",
  violet: "var(--color-violet)",
  pink: "var(--color-pink)",
};

const round = (n: number) => Math.round(n * 100) / 100;

const polar = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: round(CENTER + radius * Math.cos(rad)), y: round(CENTER + radius * Math.sin(rad)) };
};

const points = stages.map((stage) => ({ ...stage, ...polar(stage.angle, stage.radius) }));

/** Closed Catmull-Rom spline through every stage, as cubic Béziers. */
function closedCurve(pts: ReadonlyArray<{ x: number; y: number }>) {
  const at = (i: number) => pts[(i + pts.length) % pts.length];
  const segments = pts.map((p1, i) => {
    const p0 = at(i - 1);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = round(p1.x + (p2.x - p0.x) / 6);
    const c1y = round(p1.y + (p2.y - p0.y) / 6);
    const c2x = round(p2.x - (p3.x - p1.x) / 6);
    const c2y = round(p2.y - (p3.y - p1.y) / 6);
    return `C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  });
  return `M ${pts[0].x} ${pts[0].y} ${segments.join(" ")} Z`;
}

const flowPath = closedCurve(points);

/** Entrance timeline in seconds, beginning as the hero text settles. */
const T = { rings: 0.4, satellites: 0.7, spokes: 0.8, stages: 0.9, flow: 1.0, core: 1.4, signal: 2.6, pulse: 3 };

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/** Shared props for strokes drawn with the `animate-draw` utility. */
const drawn = { pathLength: 1, strokeDasharray: 1, className: "animate-draw" } as const;

export function HeroVisual({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Diagram of a machine learning system: data flows through features, a model, an API and predictions into insight, around a central intelligence core."
      className={cn("relative aspect-square w-full", className)}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(56_189_248/0.2),rgb(167_139_250/0.12)_50%,rgb(244_114_182/0.05)_75%,transparent)]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
        strokeWidth={0.25}
      >
        <defs>
          <linearGradient id="hero-flow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="50%" stopColor="var(--color-violet)" />
            <stop offset="100%" stopColor="var(--color-pink)" />
          </linearGradient>
          <radialGradient id="hero-core">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbits */}
        <g className="animate-fade-in" style={delay(T.rings)}>
          <circle cx={CENTER} cy={CENTER} r={47} stroke="var(--color-border-strong)" strokeDasharray="0.3 1.7" />
          <circle cx={CENTER} cy={CENTER} r={INNER_ORBIT} stroke="var(--color-border)" />
          <circle cx={CENTER} cy={CENTER} r={CORE_RING} stroke="var(--color-border-strong)" strokeDasharray="1 1.5" />
          <circle cx={CENTER} cy={CENTER} r={CORE_RING - 4} fill="url(#hero-core)" />
        </g>

        {satellites.map((s, i) => {
          const p = polar(s.angle, INNER_ORBIT);
          return (
            <circle
              key={s.angle}
              cx={p.x}
              cy={p.y}
              r={0.7}
              fill={toneColor[s.tone]}
              fillOpacity={0.7}
              className="animate-fade-in"
              style={delay(T.satellites + i * 0.08)}
            />
          );
        })}

        {/* Spokes: each stage connects to the core ring */}
        {points.map((p, i) => {
          const end = polar(p.angle, CORE_RING);
          return (
            <line
              key={p.label}
              x1={p.x}
              y1={p.y}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-border-strong)"
              {...drawn}
              style={delay(T.spokes + i * 0.07)}
            />
          );
        })}

        {/* Pipeline loop */}
        <path
          d={flowPath}
          stroke="url(#hero-flow)"
          strokeOpacity={0.6}
          {...drawn}
          style={{ ...delay(T.flow), animationDuration: "2.4s" }}
        />

        {/* One slow signal travelling the loop; reduced motion stills it */}
        <g className="animate-fade-in" style={delay(T.signal)}>
          <path
            d={flowPath}
            pathLength={100}
            stroke="url(#hero-flow)"
            strokeWidth={0.45}
            strokeLinecap="round"
            strokeDasharray="5 95"
            className="animate-flow"
          />
        </g>

        {/* Gentle pulse from the core (the only JS-driven motion) */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={CORE_RING}
          stroke="var(--color-accent)"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ opacity: 0, scale: 1 }}
          animate={
            reduceMotion === false
              ? { opacity: [0, 0.35, 0], scale: [1, 1.18, 1.32] }
              : undefined
          }
          transition={{ delay: T.pulse, duration: 4, ease: "easeOut", repeat: Infinity, repeatDelay: 3 }}
        />
      </svg>

      {/* Labels are HTML so text stays crisp and legible at any size */}
      <div aria-hidden="true">
        {points.map((p, i) => (
          <span
            key={p.label}
            className="animate-fade-in absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-border-strong bg-surface/90 px-3 py-1.5 whitespace-nowrap"
            style={{ left: `${p.x}%`, top: `${p.y}%`, ...delay(T.stages + i * 0.09) }}
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: toneColor[p.tone] }} />
            <span className="eyebrow text-foreground-secondary">{p.label}</span>
          </span>
        ))}

        <span
          className="animate-fade-in absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-accent/40 bg-surface-elevated px-4 py-2 shadow-[0_0_40px_-6px_rgb(167_139_250/0.6)]"
          style={delay(T.core)}
        >
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="eyebrow text-foreground">Intelligence</span>
        </span>
      </div>
    </div>
  );
}
