import type { ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProjectStatus, { label: string; dot: string }> = {
  "in-progress": { label: "In progress", dot: "bg-violet" },
  deployed: { label: "Deployed", dot: "bg-accent" },
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const { label, dot } = statusStyles[status];

  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-2.5 py-1 text-foreground-secondary",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot)} />
      <span>
        <span className="sr-only">Status: </span>
        {label}
      </span>
    </span>
  );
}
