"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { baseTransition } from "@/lib/motion";

interface RoleRotatorProps {
  prefix: string;
  phrases: readonly string[];
  /** Milliseconds each phrase stays on screen. */
  interval?: number;
}

/**
 * "I build ___" line that cycles through phrases. Screen readers get the full
 * list once instead of live updates; reduced motion keeps the first phrase.
 */
export function RoleRotator({ prefix, phrases, interval = 2600 }: RoleRotatorProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion !== false) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval);
    return () => clearInterval(id);
  }, [reduceMotion, phrases.length, interval]);

  return (
    <p className="font-mono text-meta text-foreground-secondary sm:text-nav">
      <span className="sr-only">
        {prefix} {phrases.join(", ")}.
      </span>
      <span aria-hidden="true" className="inline-flex items-center gap-2">
        <span className="text-accent">&gt;</span>
        {prefix}
        <span className="relative inline-flex h-[1.5em] items-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phrases[index]}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={baseTransition}
              className="font-medium whitespace-nowrap text-foreground"
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="animate-caret -ml-1 h-[1.1em] w-[0.55em] bg-pink/80" />
      </span>
    </p>
  );
}
