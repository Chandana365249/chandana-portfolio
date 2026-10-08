import { cn } from "@/lib/utils";

interface TagListProps {
  items: readonly string[];
  /** Accessible name for the list, e.g. "Technologies". */
  label: string;
  className?: string;
}

/** Compact, quiet chips for technologies and other short facets. */
export function TagList({ items, label, className }: TagListProps) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-meta text-foreground-secondary"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
