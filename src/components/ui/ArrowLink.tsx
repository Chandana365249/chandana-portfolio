import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  href: string;
  /** Opens in a new tab and announces it to screen readers. */
  external?: boolean;
  className?: string;
  children: ReactNode;
}

/** Quiet text link with a trailing arrow that nudges on hover. */
export function ArrowLink({ href, external = false, className, children }: ArrowLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-1 px-1 text-nav text-foreground-secondary transition-colors duration-300 hover:text-foreground",
        className,
      )}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
      <ArrowUpRight
        size={14}
        aria-hidden="true"
        className="text-foreground-muted transition-[color,transform] duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
      />
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
