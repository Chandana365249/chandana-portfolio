import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = "h1" | "h2" | "h3";

interface SectionHeadingProps {
  /** Small label above the heading, e.g. "About". */
  eyebrow?: string;
  /** Optional ordinal shown before the eyebrow, e.g. "01". */
  index?: string;
  title: ReactNode;
  /** Id for the heading, so a section can reference it with aria-labelledby. */
  id?: string;
  description?: ReactNode;
  /** Heading element; defaults to h2 so sections nest under the page h1. */
  as?: HeadingLevel;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  id,
  description,
  as: Heading = "h2",
  align = "start",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        centered && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="eyebrow flex items-center gap-2">
          {index && (
            <>
              <span className="text-gradient font-semibold">{index}</span>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span>{eyebrow}</span>
        </p>
      )}
      <Heading id={id} className="max-w-3xl text-heading font-semibold">
        {title}
      </Heading>
      {description && (
        <p className="max-w-reading text-lead text-foreground-secondary">{description}</p>
      )}
    </header>
  );
}
