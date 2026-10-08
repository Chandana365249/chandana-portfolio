"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Trophy, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { baseTransition } from "@/lib/motion";
import {
  badges,
  celebrate,
  questStore,
  resetBadges,
  unlock,
  UNLOCK_EVENT,
  type Badge,
  type BadgeId,
  type UnlockDetail,
} from "@/lib/quest";
import { cn } from "@/lib/utils";

/** Sections that award a badge simply by being scrolled into view. */
const sectionBadges: readonly BadgeId[] = ["about", "projects", "playground", "skills", "journey", "contact"];

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

interface Toast {
  key: number;
  badge: Badge | null; // null = quest complete
}

const RING = 2 * Math.PI * 15;

/**
 * Floating trophy button with a progress ring. Click it to see every badge
 * (locked ones show a hint). Unlocks pop a toast; finishing the quest fires
 * confetti and points the visitor at the contact section.
 */
export function QuestTracker() {
  const unlocked = useSyncExternalStore(
    questStore.subscribe,
    questStore.getSnapshot,
    questStore.getServerSnapshot,
  );
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = useCallback((badge: Badge | null) => {
    clearTimeout(toastTimer.current);
    setToast({ key: Date.now(), badge });
    toastTimer.current = setTimeout(() => setToast(null), badge ? 3200 : 6000);
  }, []);

  // Toast every new unlock from anywhere on the page.
  useEffect(() => {
    const onUnlock = (event: Event) => {
      const { id, total } = (event as CustomEvent<UnlockDetail>).detail;
      if (total === badges.length) {
        showToast(null);
        celebrate();
      } else {
        showToast(badges.find((b) => b.id === id) ?? null);
      }
    };
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(UNLOCK_EVENT, onUnlock);
  }, [showToast]);

  // Section badges: unlock once a section is well into view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) unlock(entry.target.id as BadgeId);
        }
      },
      { threshold: 0.25 },
    );
    for (const id of sectionBadges) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // The Konami code.
  useEffect(() => {
    let position = 0;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      position = key === KONAMI[position] ? position + 1 : key === KONAMI[0] ? 1 : 0;
      if (position === KONAMI.length) {
        position = 0;
        unlock("secret");
        celebrate();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const count = unlocked.size;
  const complete = count === badges.length;

  return (
    <div className="fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {/* Unlock toast */}
      <div aria-live="polite" className="pointer-events-none">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.key}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={baseTransition}
              className="relative flex max-w-xs items-center gap-3 overflow-hidden rounded-2xl border border-border-strong bg-surface-elevated/95 p-3 pr-4 shadow-[0_20px_50px_-20px_rgb(167_139_250/0.6)] backdrop-blur-md"
            >
              <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
              <span aria-hidden="true" className="text-2xl">
                {toast.badge ? toast.badge.emoji : "🎉"}
              </span>
              <span className="flex flex-col">
                <span className="eyebrow text-accent">
                  {toast.badge ? "Badge unlocked" : "Quest complete"}
                </span>
                <span className="text-nav font-medium text-foreground">
                  {toast.badge ? toast.badge.title : "You've explored everything. Let's talk!"}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="quest-panel"
            aria-label="Exploration badges"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={baseTransition}
            className="relative w-[min(22rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-border-strong bg-surface/95 shadow-[0_30px_70px_-30px_rgb(167_139_250/0.55)] backdrop-blur-xl"
          >
            <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
            <header className="flex items-start justify-between gap-4 p-4 pb-3">
              <div>
                <p className="eyebrow">Portfolio quest</p>
                <p className="mt-1 text-title font-semibold text-foreground">
                  {count} / {badges.length} badges
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close badges"
                className="-mt-1 -mr-1 inline-flex size-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>
            <div className="mx-4 h-1.5 overflow-hidden rounded-full bg-background/70">
              <div
                className="bg-brand h-full rounded-full transition-[width] duration-700 ease-smooth"
                style={{ width: `${(count / badges.length) * 100}%` }}
              />
            </div>
            <ul className="grid max-h-[50vh] grid-cols-2 gap-2 overflow-y-auto p-4">
              {badges.map((badge) => {
                const got = unlocked.has(badge.id);
                return (
                  <li
                    key={badge.id}
                    className={cn(
                      "flex flex-col gap-1 rounded-xl border p-3 transition-colors",
                      got ? "border-violet/40 bg-violet/10" : "border-border bg-background/40",
                    )}
                  >
                    <span aria-hidden="true" className={cn("text-xl", !got && "opacity-30 grayscale")}>
                      {badge.emoji}
                    </span>
                    <span
                      className={cn(
                        "text-meta font-medium",
                        got ? "text-foreground" : "text-foreground-muted",
                      )}
                    >
                      {got ? badge.title : "Locked"}
                      <span className="sr-only">{got ? " (unlocked)" : ` — ${badge.title}`}</span>
                    </span>
                    {!got && (
                      <span className="text-eyebrow leading-snug text-foreground-muted">{badge.hint}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <footer className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
              {complete ? (
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="text-nav font-medium text-accent"
                >
                  You did it — say hi →
                </a>
              ) : (
                <span className="text-meta text-foreground-muted">Explore to unlock them all.</span>
              )}
              <button
                type="button"
                onClick={resetBadges}
                className="inline-flex items-center gap-1.5 text-meta text-foreground-muted transition-colors hover:text-foreground"
              >
                <RotateCcw size={12} aria-hidden="true" />
                Reset
              </button>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Trophy button with progress ring */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="quest-panel"
        aria-label={`Exploration badges: ${count} of ${badges.length} unlocked`}
        className="group relative inline-flex size-14 items-center justify-center rounded-full border border-border-strong bg-surface-elevated/90 shadow-[0_12px_32px_-12px_rgb(167_139_250/0.7)] backdrop-blur-md transition-transform duration-300 ease-smooth hover:scale-105 active:scale-95"
      >
        <svg aria-hidden="true" viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90">
          <defs>
            <linearGradient id="quest-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" />
              <stop offset="50%" stopColor="var(--color-violet)" />
              <stop offset="100%" stopColor="var(--color-pink)" />
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-border)" strokeWidth="2" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#quest-ring)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - count / badges.length)}
            className="transition-[stroke-dashoffset] duration-700 ease-smooth"
          />
        </svg>
        <Trophy size={20} aria-hidden="true" className={complete ? "text-pink" : "text-foreground"} />
        <span
          aria-hidden="true"
          className="bg-brand absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full px-1 font-mono text-[0.625rem] font-bold text-accent-foreground"
        >
          {count}
        </span>
      </button>
    </div>
  );
}
