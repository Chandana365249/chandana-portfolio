"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type CSSProperties } from "react";
import type { ArchitectureNode } from "@/data/projects";
import { easeSmooth } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Interactive system diagram. Desktop: a horizontal flow where hovering,
 * focusing or clicking a node shows its explanation in a live caption.
 * Mobile: a vertical flow with each explanation shown inline.
 */
export function ArchitectureDiagram({ nodes }: { nodes: readonly ArchitectureNode[] }) {
  const [active, setActive] = useState(0);
  const captionId = useId();
  const current = nodes[active];

  return (
    <div>
      <div className="relative">
        {/* Connector behind the nodes: vertical on mobile, horizontal on desktop */}
        <motion.span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-[1.375rem] w-px origin-top bg-linear-to-b from-accent/50 to-violet/50 lg:top-1/2 lg:right-[4%] lg:bottom-auto lg:left-[4%] lg:h-px lg:w-auto lg:origin-left lg:bg-linear-to-r"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: easeSmooth, delay: 0.15 }}
        />

        <ol
          className="relative grid gap-3 lg:grid-cols-[repeat(var(--nodes),minmax(0,1fr))]"
          style={{ "--nodes": nodes.length } as CSSProperties}
        >
          {nodes.map((node, i) => {
            const isActive = i === active;
            return (
              <motion.li
                key={node.label}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeSmooth, delay: 0.1 + i * 0.06 }}
              >
                <button
                  type="button"
                  aria-describedby={isActive ? captionId : undefined}
                  aria-pressed={isActive}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-lg border bg-surface px-3 py-2.5 text-left text-meta transition-colors duration-300 lg:h-full lg:flex-col lg:items-start lg:gap-1.5",
                    isActive
                      ? "border-accent/50 text-foreground"
                      : "border-border-strong text-foreground-secondary hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono transition-colors",
                      isActive ? "text-accent" : "text-foreground-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{node.label}</span>
                </button>
                <p className="pl-11 text-meta text-foreground-muted lg:hidden">{node.detail}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div
        id={captionId}
        aria-live="polite"
        className="mt-4 hidden min-h-16 items-center rounded-lg border border-border bg-background/40 px-4 py-3 lg:flex"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={current.label}
            className="text-body"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: easeSmooth }}
          >
            <span className="font-medium text-foreground">{current.label}</span>
            <span aria-hidden="true" className="mx-2 text-foreground-muted">
              —
            </span>
            {current.detail}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
