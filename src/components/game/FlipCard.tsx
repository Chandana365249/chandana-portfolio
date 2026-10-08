"use client";

import { Award, BadgeCheck, GraduationCap, RotateCw, Users } from "lucide-react";
import { useState } from "react";
import type { Achievement, AchievementKind } from "@/data/achievements";
import { unlock } from "@/lib/quest";
import { cn } from "@/lib/utils";

const kindStyles: Record<AchievementKind, { icon: typeof Award; tint: string; label: string }> = {
  certification: { icon: BadgeCheck, tint: "bg-accent/15 text-accent", label: "Certification" },
  award: { icon: Award, tint: "bg-pink/15 text-pink", label: "Award" },
  academic: { icon: GraduationCap, tint: "bg-violet/15 text-violet", label: "Academic" },
  community: { icon: Users, tint: "bg-accent/15 text-accent", label: "Community" },
};

const face = "absolute inset-0 flex flex-col rounded-2xl border p-5 [backface-visibility:hidden] sm:p-6";

/** An achievement card that flips in 3D to reveal its details. */
export function FlipCard({ achievement }: { achievement: Achievement }) {
  const [flipped, setFlipped] = useState(false);
  const { icon: Icon, tint, label } = kindStyles[achievement.kind];

  return (
    <button
      type="button"
      aria-pressed={flipped}
      aria-label={`${achievement.title}. ${flipped ? "Showing details" : "Flip for details"}`}
      onClick={() => {
        setFlipped((f) => !f);
        unlock("achievements");
      }}
      className="group h-64 w-full text-left [perspective:1200px]"
    >
      <span
        className={cn(
          "relative block size-full transition-transform duration-700 ease-smooth [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
          !flipped && "group-hover:[transform:rotateY(8deg)]",
        )}
      >
        {/* Front */}
        <span
          aria-hidden={flipped}
          className={cn(face, "border-border bg-surface/70 transition-colors group-hover:border-violet/40")}
        >
          <span className="flex items-center justify-between">
            <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", tint)}>
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="eyebrow">{label}</span>
          </span>
          <span className="text-gradient mt-auto text-heading font-bold">{achievement.stat}</span>
          <span className="eyebrow mt-1">{achievement.statLabel}</span>
          <span className="mt-3 text-nav font-medium text-foreground">{achievement.title}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-eyebrow text-foreground-muted">
            <RotateCw
              size={11}
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:rotate-180"
            />
            Click to flip
          </span>
        </span>

        {/* Back */}
        <span
          aria-hidden={!flipped}
          className={cn(face, "[transform:rotateY(180deg)] border-violet/40 bg-surface-elevated")}
        >
          <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px rounded-t-2xl" />
          <span className="eyebrow text-accent">{achievement.issuer}</span>
          <span className="mt-2 text-title font-semibold text-foreground">{achievement.title}</span>
          <span className="mt-3 text-meta leading-relaxed text-foreground-secondary">
            {achievement.detail}
          </span>
          <span className="mt-auto flex flex-col gap-1 pt-3 font-mono text-eyebrow text-foreground-muted">
            {achievement.date && <span>Earned {achievement.date}</span>}
            {achievement.credentialId && <span>Credential ID {achievement.credentialId}</span>}
          </span>
        </span>
      </span>
    </button>
  );
}
