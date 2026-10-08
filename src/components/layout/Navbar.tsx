"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { openCommandPalette } from "./CommandPalette";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { navItems } from "@/data/site";
import { baseTransition } from "@/lib/motion";

const MOBILE_NAV_ID = "mobile-navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    // Close the mobile panel if the viewport grows into the desktop layout.
    const desktop = window.matchMedia("(min-width: 48rem)");

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", close);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <header className="animate-fade-in fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <Container className="flex h-header items-center justify-between gap-6">
        <a
          href="#home"
          className="group inline-flex items-center gap-3 text-nav font-semibold text-foreground"
          aria-label={`${profile.name} — back to top`}
        >
          <span
            aria-hidden="true"
            className="bg-brand inline-flex size-8 items-center justify-center rounded-lg font-mono text-meta font-bold text-accent-foreground transition-transform duration-300 ease-smooth group-hover:rotate-6"
          >
            {profile.initials}
          </span>
          {profile.name}
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-nav text-foreground-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open quick menu (Ctrl or Command + K)"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface/60 px-3 text-meta text-foreground-muted transition-colors duration-300 hover:border-border-strong hover:text-foreground"
          >
            <Command size={14} aria-hidden="true" />
            <kbd className="hidden font-mono text-eyebrow lg:inline">Ctrl K</kbd>
          </button>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface-elevated md:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id={MOBILE_NAV_ID}
            aria-label="Primary"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={baseTransition}
            className="border-t border-border bg-background/95 md:hidden"
          >
            <Container as="ul" className="flex flex-col py-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center text-lead text-foreground-secondary transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
