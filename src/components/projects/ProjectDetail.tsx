"use client";

import { Info, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { TagList } from "@/components/ui/TagList";
import type { Project } from "@/data/projects";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { StatusBadge } from "./StatusBadge";

interface ProjectDetailProps {
  /** The project to show; `null` keeps the dialog closed. */
  project: Project | null;
  onClose: () => void;
}

const TITLE_ID = "project-detail-title";

/**
 * Case-study view for any project, built on the native <dialog>: it traps
 * focus, closes on Escape, makes the page inert and returns focus to the
 * card that opened it. Full-screen on mobile, a large modal from `sm` up.
 */
export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={TITLE_ID}
      onClose={onClose}
      // A click whose target is the dialog itself landed on the backdrop.
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-surface p-0 text-foreground-secondary backdrop:bg-background/80 backdrop:backdrop-blur-sm open:animate-dialog backdrop:animate-backdrop sm:m-auto sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-[calc(100%-3rem)] sm:max-w-5xl sm:rounded-2xl sm:border sm:border-border-strong"
    >
      {project && <CaseStudy project={project} onClose={() => dialogRef.current?.close()} />}
    </dialog>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const { caseStudy, links } = project;

  return (
    <article>
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-surface/90 py-2 pr-2 pl-5 backdrop-blur-md sm:pl-10">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-meta text-accent">{project.number}</span>
          <span className="eyebrow">{project.category}</span>
          <StatusBadge status={project.status} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${project.title} case study`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-col gap-10 px-5 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4">
          <h2 id={TITLE_ID} className="text-heading font-semibold">
            {project.title}
          </h2>
          <p className="text-title text-foreground-secondary">{project.subtitle}</p>
          <p className="max-w-reading text-lead">{project.overview ?? project.summary}</p>

          {project.highlight && (
            <p className="flex items-baseline gap-3">
              <span className="text-heading font-semibold text-foreground">{project.highlight.value}</span>
              <span className="eyebrow">{project.highlight.label}</span>
            </p>
          )}

          {(links.github || links.demo) && (
            <div className="mt-2 flex flex-wrap gap-3">
              {links.github && (
                <Button href={links.github} variant="secondary">
                  View code
                </Button>
              )}
              {links.demo && <Button href={links.demo}>Live demo</Button>}
            </div>
          )}
        </div>

        {(caseStudy.problem || caseStudy.approach) && (
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudy.problem && <Block title="The problem">{caseStudy.problem}</Block>}
            {caseStudy.approach && <Block title="The approach">{caseStudy.approach}</Block>}
          </div>
        )}

        <Block title="The system">
          <ArchitectureDiagram nodes={project.architecture} />
        </Block>

        <div className="grid gap-8 md:grid-cols-2">
          <Block title="The output">{caseStudy.output}</Block>
          {caseStudy.productLayer && <Block title="The product layer">{caseStudy.productLayer}</Block>}
          {project.targets && (
            <Block title="Target dimensions">
              <TagList items={project.targets} label="Target dimensions" />
            </Block>
          )}
          {project.models && (
            <Block title="Models compared">
              <TagList items={project.models} label="Models compared" />
            </Block>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Block title={project.status === "in-progress" ? "What I'm building" : "What I built"}>
            <ul className="flex flex-col gap-2.5">
              {caseStudy.built.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Tech stack">
            <TagList items={project.technologies} label="Tech stack" />
          </Block>
        </div>

        {caseStudy.note && (
          <p className="flex items-start gap-3 rounded-lg border border-border bg-background/40 px-4 py-3 text-meta text-foreground-muted">
            <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
            {caseStudy.note}
          </p>
        )}
      </div>
    </article>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="eyebrow text-foreground-muted">{title}</h3>
      <div className="text-body">{children}</div>
    </section>
  );
}
