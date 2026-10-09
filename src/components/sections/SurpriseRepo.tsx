"use client";

import { ArrowUpRight, Dices } from "lucide-react";
import { useState } from "react";
import type { GitHubActivity } from "@/lib/github";

/**
 * Playful stat tile: roll the dice to land on a random public repo. Each roll
 * spins the die and never repeats the current pick.
 */
export function SurpriseRepo({ pool }: { pool: GitHubActivity["pool"] }) {
  const [pick, setPick] = useState<number | null>(null);
  const [rolls, setRolls] = useState(0);
  const repo = pick === null ? null : pool[pick];

  const roll = () => {
    let next = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && next === pick) next = (next + 1) % pool.length;
    setPick(next);
    setRolls((count) => count + 1);
  };

  return (
    <div className="flex h-full flex-col justify-between gap-1 rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-start justify-between gap-2">
        {repo ? (
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            title={repo.description ?? undefined}
            className="group inline-flex min-w-0 items-center gap-1 font-mono text-nav font-semibold text-foreground transition-colors hover:text-accent"
          >
            <span className="truncate">{repo.name}</span>
            <ArrowUpRight size={13} aria-hidden="true" className="shrink-0 text-foreground-muted group-hover:text-accent" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span aria-hidden="true" className="text-gradient text-heading font-semibold">
            ?
          </span>
        )}
        <button
          type="button"
          onClick={roll}
          aria-label={repo ? "Roll again for another random repository" : "Roll for a random repository"}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface text-foreground-secondary transition-[color,border-color,translate] duration-300 hover:-translate-y-px hover:border-accent/50 hover:text-accent"
        >
          <Dices
            size={18}
            aria-hidden="true"
            className="transition-[rotate] duration-500 ease-smooth"
            style={{ rotate: `${rolls * 360}deg` }}
          />
        </button>
      </div>
      <p className="eyebrow">{repo ? "Roll again" : "Surprise me"}</p>
      <p aria-live="polite" className="sr-only">
        {repo ? `Landed on ${repo.name}` : ""}
      </p>
    </div>
  );
}
