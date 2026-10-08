import { ArrowRight } from "lucide-react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { TagList } from "@/components/ui/TagList";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { ProjectVisual } from "./visuals/ProjectVisual";

interface ProjectCardProps {
  project: Project;
  /** Wide two-column layout with a larger title, for the lead project. */
  featured?: boolean;
  onOpen: () => void;
}

/**
 * The whole card opens the case study: the title is a real <button> whose
 * hit area is stretched over the card. Optional links sit above it (z-10).
 */
export function ProjectCard({ project, featured = false, onOpen }: ProjectCardProps) {
  const { links } = project;

  const visual = (
    <div className="transition-transform duration-700 ease-smooth group-hover:-translate-y-0.5">
      <ProjectVisual project={project} />
    </div>
  );

  return (
    <article
      data-spotlight
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60",
        "transition-[translate,border-color,box-shadow] duration-500 ease-smooth",
        "hover:-translate-y-1 hover:border-violet/40 hover:shadow-[0_24px_56px_-24px_rgb(167_139_250/0.4)]",
        "has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-accent",
        featured && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
      )}
    >
      {/* Soft corner glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(167_139_250/0.16),rgb(244_114_182/0.06)_60%,transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />

      <span
        aria-hidden="true"
        className="bg-brand absolute inset-x-0 top-0 h-px opacity-40 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-meta text-accent">{project.number}</span>
            <span className="eyebrow">{project.category}</span>
          </div>
          <StatusBadge status={project.status} />
        </div>

        <h3 className={cn("mt-6 font-semibold", featured ? "text-heading" : "text-title")}>
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
            <span className="sr-only"> — open case study</span>
          </button>
        </h3>
        <p className={cn("mt-2", featured ? "text-lead text-foreground" : "text-foreground")}>
          {project.subtitle}
        </p>

        {project.highlight && (
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-gradient text-heading font-semibold">{project.highlight.value}</span>
            <span className="eyebrow">{project.highlight.label}</span>
          </p>
        )}

        <p className="mt-4 max-w-reading">{project.summary}</p>

        {!featured && <div className="mt-8">{visual}</div>}

        <div className="mt-auto flex flex-col gap-6 pt-8">
          <TagList items={project.technologies} label={`${project.title} technologies`} />
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-2 text-nav font-medium text-foreground transition-colors duration-300 group-hover:text-accent"
            >
              View case study
              <ArrowRight
                size={16}
                className="transition-transform duration-300 ease-smooth group-hover:translate-x-0.5"
              />
            </span>
            {(links.github || links.demo) && (
              <div className="relative z-10 flex gap-4">
                {links.github && (
                  <ArrowLink href={links.github} external>
                    Code
                  </ArrowLink>
                )}
                {links.demo && (
                  <ArrowLink href={links.demo} external>
                    Live demo
                  </ArrowLink>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {featured && (
        <div className="flex items-center border-t border-border bg-background/30 p-6 sm:p-8 lg:border-t-0 lg:border-l lg:p-10">
          <div className="w-full">{visual}</div>
        </div>
      )}
    </article>
  );
}
