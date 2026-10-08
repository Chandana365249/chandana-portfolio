import { Suspense } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { journeySection, milestones, type MilestoneStatus } from "@/data/journey";
import { cn } from "@/lib/utils";
import { GitHubFallback, GitHubPanel } from "./GitHubPanel";

const HEADING_ID = "journey-title";

const markerStyles: Record<MilestoneStatus, string> = {
  done: "border-accent bg-accent",
  now: "border-pink bg-pink shadow-[0_0_0_6px_rgb(244_114_182/0.15)]",
  next: "border-violet bg-background",
};

const statusLabel: Record<MilestoneStatus, string> = {
  done: "Completed",
  now: "In progress",
  next: "Upcoming",
};

/** Vertical timeline on the left, live GitHub activity on the right. */
export function Journey() {
  return (
    <Section id="journey" aria-labelledby={HEADING_ID}>
      <Reveal>
        <SectionHeading
          id={HEADING_ID}
          index={journeySection.index}
          eyebrow={journeySection.eyebrow}
          title={journeySection.title}
          description={journeySection.description}
        />
      </Reveal>

      <div className="mt-stack grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <ol className="relative flex flex-col gap-8 pl-8">
            <span
              aria-hidden="true"
              className="reveal-line-y absolute top-2 bottom-2 left-[0.4375rem] w-px bg-linear-to-b from-accent via-violet to-pink/40"
            />
            {milestones.map((milestone) => (
              <li key={milestone.title} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 -left-8 size-3.5 rounded-full border-2",
                    markerStyles[milestone.status],
                  )}
                />
                <p className="eyebrow flex items-center gap-3">
                  <span className={milestone.status === "now" ? "text-pink" : "text-accent"}>
                    {milestone.when}
                  </span>
                  <span className="sr-only">— {statusLabel[milestone.status]}</span>
                </p>
                <h3 className="mt-2 text-title font-semibold">{milestone.title}</h3>
                <p className="mt-1.5 max-w-reading text-foreground-secondary">{milestone.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1}>
          <Suspense fallback={<GitHubFallback loading />}>
            <GitHubPanel />
          </Suspense>
        </Reveal>
      </div>
    </Section>
  );
}
