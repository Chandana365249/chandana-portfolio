import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  /** Seconds to wait before animating, for simple staggering. */
  delay?: number;
  className?: string;
}

/**
 * Entrance fade for above-the-fold content. CSS-driven, so it runs on first
 * paint without JavaScript; the global reduced-motion rule neutralises it.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <div
      className={cn("animate-fade-up", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
