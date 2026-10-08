import { projectsUsing, type SkillName } from "@/data/skills";
import { cn } from "@/lib/utils";

export type ChipState = "idle" | "active" | "related" | "dimmed";

/** Shared highlight state and handlers, provided by the Skills section. */
export interface SkillInteraction {
  stateOf: (skill: SkillName) => ChipState;
  isPinned: (skill: SkillName) => boolean;
  preview: (skill: SkillName | null) => void;
  toggle: (skill: SkillName) => void;
}

const stateStyles: Record<ChipState, string> = {
  idle: "",
  active: "border-accent/60 bg-accent/10 text-foreground",
  related: "border-accent/30 text-foreground",
  dimmed: "opacity-40",
};

interface SkillChipProps {
  skill: SkillName;
  /** Visual prominence for skills central to the portfolio's projects. */
  prominent?: boolean;
  interaction: SkillInteraction;
}

/**
 * A technology chip. Skills used in a featured project are buttons (with one
 * dot per project) that trace where they are applied; others are plain text.
 */
export function SkillChip({ skill, prominent = false, interaction }: SkillChipProps) {
  const count = projectsUsing(skill).length;
  const state = interaction.stateOf(skill);

  const classes = cn(
    "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-meta transition-[color,border-color,background-color,opacity,translate,box-shadow] duration-300 ease-smooth",
    prominent
      ? "border-border-strong bg-surface-elevated font-medium text-foreground"
      : "border-border bg-background/40 text-foreground-secondary",
    stateStyles[state],
  );

  if (count === 0) return <span className={classes}>{skill}</span>;

  return (
    <button
      type="button"
      aria-pressed={interaction.isPinned(skill)}
      onMouseEnter={() => interaction.preview(skill)}
      onMouseLeave={() => interaction.preview(null)}
      onFocus={() => interaction.preview(skill)}
      onBlur={() => interaction.preview(null)}
      onClick={() => interaction.toggle(skill)}
      className={cn(
        classes,
        "min-h-8 cursor-pointer hover:-translate-y-px hover:border-accent/50 hover:shadow-[0_0_14px_-6px_var(--color-accent)]",
      )}
    >
      {skill}
      <span aria-hidden="true" className="flex gap-0.5">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="size-1 rounded-full bg-accent/80" />
        ))}
      </span>
      <span className="sr-only">
        , used in {count} featured project{count === 1 ? "" : "s"}
      </span>
    </button>
  );
}
