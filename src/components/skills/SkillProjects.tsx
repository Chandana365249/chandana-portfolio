import { projects, type ProjectId } from "@/data/projects";
import { projectsUsing, skillsUsedBy, type SkillName } from "@/data/skills";
import { cn } from "@/lib/utils";

/** What the user is currently tracing: a technology, a project, or nothing. */
export type SkillFocus =
  | { kind: "skill"; skill: SkillName }
  | { kind: "project"; id: ProjectId }
  | null;

interface SkillProjectsProps {
  focus: SkillFocus;
  pinned: SkillFocus;
  onPreview: (focus: SkillFocus) => void;
  onToggle: (focus: SkillFocus) => void;
  onClear: () => void;
}

const titleOf = (id: ProjectId) => projects.find((p) => p.id === id)?.title ?? id;

function caption(focus: SkillFocus) {
  if (!focus) return "Select a technology marked with dots, or a project, to trace where it is applied.";
  if (focus.kind === "skill") {
    const used = projectsUsing(focus.skill);
    return `${focus.skill} — used in ${used.length} featured project${used.length === 1 ? "" : "s"}: ${used.map(titleOf).join(" · ")}`;
  }
  const count = skillsUsedBy(focus.id).length;
  return `${titleOf(focus.id)} — applies ${count} technologies from this stack`;
}

/** Featured projects with the stack technologies each one applies. */
export function SkillProjects({ focus, pinned, onPreview, onToggle, onClear }: SkillProjectsProps) {
  const highlighted: readonly ProjectId[] =
    focus?.kind === "skill" ? projectsUsing(focus.skill) : focus?.kind === "project" ? [focus.id] : [];

  return (
    <div className="h-full rounded-2xl border border-border bg-surface/40 p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h3 className="eyebrow text-foreground-secondary">Applied in featured projects</h3>
        <div className="flex items-baseline gap-4">
          <p aria-live="polite" className="text-meta text-foreground-secondary">
            {caption(focus)}
          </p>
          {pinned && (
            <button
              type="button"
              onClick={onClear}
              className="shrink-0 text-meta text-accent underline-offset-4 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {projects.map((project) => {
          const isHighlighted = highlighted.includes(project.id);
          const isPinned = pinned?.kind === "project" && pinned.id === project.id;
          const target: SkillFocus = { kind: "project", id: project.id };
          return (
            <li key={project.id}>
              <button
                type="button"
                aria-pressed={isPinned}
                onMouseEnter={() => onPreview(target)}
                onMouseLeave={() => onPreview(null)}
                onFocus={() => onPreview(target)}
                onBlur={() => onPreview(null)}
                onClick={() => onToggle(target)}
                className={cn(
                  "flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition-[border-color,background-color,opacity] duration-300",
                  isHighlighted
                    ? "border-accent/50 bg-accent/5"
                    : "border-border bg-background/40 hover:border-border-strong",
                  focus && !isHighlighted && "opacity-50",
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-meta text-accent">{project.number}</span>
                  <span className="font-medium text-foreground">{project.title}</span>
                </span>
                <span className="font-mono text-meta text-foreground-muted">
                  {skillsUsedBy(project.id).join(" · ")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
