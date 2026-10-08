import type { CategoryEmphasis, SkillCategory } from "@/data/skills";
import { cn } from "@/lib/utils";
import { SkillChip, type SkillInteraction } from "./SkillChip";

const emphasisStyles: Record<CategoryEmphasis, string> = {
  primary: "border-accent/25 bg-surface/80",
  secondary: "border-border bg-surface/60",
  tertiary: "border-border bg-surface/30",
};

interface SkillCategoryCardProps {
  category: SkillCategory;
  interaction: SkillInteraction;
  className?: string;
}

export function SkillCategoryCard({ category, interaction, className }: SkillCategoryCardProps) {
  const primary = category.emphasis === "primary";

  return (
    <article
      aria-labelledby={`skills-${category.id}`}
      data-spotlight
      className={cn(
        "relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-2xl border p-6 sm:p-8",
        emphasisStyles[category.emphasis],
        className,
      )}
    >
      {primary && (
        <>
          <span
            aria-hidden="true"
            className="bg-brand absolute inset-x-0 top-0 h-px"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(167_139_250/0.12),transparent)]"
          />
        </>
      )}

      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-meta text-accent">{category.number}</span>
          {primary && <span className="eyebrow text-accent/80">Core focus</span>}
        </div>
        <h3 id={`skills-${category.id}`} className="text-title font-semibold">
          {category.title}
        </h3>
        <p className="max-w-reading text-meta text-foreground-secondary sm:text-body">
          {category.description}
        </p>
      </header>

      <div className={cn("flex flex-col gap-5", primary && "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6")}>
        {category.groups.map((group, i) => (
          <div key={group.label ?? i} className="flex flex-col gap-2.5">
            {group.label && <h4 className="eyebrow">{group.label}</h4>}
            <ul className="flex flex-wrap gap-2" aria-label={group.label ?? `${category.title} technologies`}>
              {group.skills.map((skill) => (
                <li key={skill}>
                  <SkillChip
                    skill={skill}
                    prominent={category.prominent?.includes(skill)}
                    interaction={interaction}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {category.pairsWith && (
        <p className="mt-auto text-meta text-foreground-muted">
          Pairs with{" "}
          <span className="text-foreground-secondary">{category.pairsWith.join(" · ")}</span> for
          model-ready datasets.
        </p>
      )}
    </article>
  );
}
