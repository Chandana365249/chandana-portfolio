import type { Transition } from "framer-motion";

/** Mirrors --ease-smooth in globals.css so CSS and JS motion feel identical. */
export const easeSmooth = [0.16, 1, 0.3, 1] as const;

export const baseTransition: Transition = {
  duration: 0.3,
  ease: easeSmooth,
};
