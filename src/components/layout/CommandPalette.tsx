"use client";

import { ArrowUpRight, Copy, CornerDownLeft, Hash, Search } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";
import { navItems } from "@/data/site";
import { unlock } from "@/lib/quest";
import { cn } from "@/lib/utils";

/** Fire this event (e.g. from the navbar button) to open the palette. */
export const OPEN_COMMAND_PALETTE = "command-palette:open";

export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE));

interface Command {
  id: string;
  group: "Navigate" | "Connect";
  label: string;
  icon: ReactNode;
  /** Shown on the right, e.g. "Copied!" feedback. */
  hint?: string;
  run: () => void | "keep-open";
}

const LIST_ID = "command-list";
const optionId = (id: string) => `command-${id}`;

const openExternal = (href: string) => {
  window.open(href, "_blank", "noopener,noreferrer");
};

/**
 * Ctrl/⌘ + K quick menu: jump to a section, copy the email address or open a
 * profile. Built on the native <dialog> (focus trap, Escape, inert page) with
 * a combobox/listbox pattern for keyboard and screen-reader users.
 */
export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const close = () => dialogRef.current?.close();

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => {
      close();
      document.querySelector(href)?.scrollIntoView();
      history.replaceState(null, "", href);
    };
    const list: Command[] = navItems.map((item) => ({
      id: item.href.slice(1),
      group: "Navigate",
      label: item.label,
      icon: <Hash size={16} aria-hidden="true" />,
      run: go(item.href),
    }));

    list.push({
      id: "copy-email",
      group: "Connect",
      label: "Copy email address",
      icon: <Copy size={16} aria-hidden="true" />,
      hint: copied ? "Copied!" : profile.email,
      run: () => {
        void navigator.clipboard?.writeText(profile.email).then(() => setCopied(true));
        return "keep-open";
      },
    });
    if (profile.social.linkedin) {
      const href = profile.social.linkedin;
      list.push({
        id: "linkedin",
        group: "Connect",
        label: "Open LinkedIn",
        icon: <LinkedInIcon size={16} />,
        run: () => openExternal(href),
      });
    }
    if (profile.social.github) {
      const href = profile.social.github;
      list.push({
        id: "github",
        group: "Connect",
        label: "Open GitHub",
        icon: <GitHubIcon size={16} />,
        run: () => openExternal(href),
      });
    }
    return list;
  }, [copied]);

  const term = query.trim().toLowerCase();
  const results = term ? commands.filter((c) => c.label.toLowerCase().includes(term)) : commands;
  const current = results[Math.min(active, results.length - 1)];

  useEffect(() => {
    const open = () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      setQuery("");
      setActive(0);
      setCopied(false);
      dialog.showModal();
      inputRef.current?.focus();
      unlock("quick-menu");
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE, open);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE, open);
    };
  }, []);

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    if (command.run() !== "keep-open") close();
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (Math.min(i, results.length - 1) + step + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      runCommand(current);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Quick menu"
      onClick={(event) => event.target === event.currentTarget && close()}
      className="m-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-2xl border border-border-strong bg-surface/95 p-0 text-foreground-secondary shadow-[0_40px_80px_-30px_rgb(167_139_250/0.45)] backdrop-blur-xl backdrop:bg-background/70 backdrop:backdrop-blur-sm open:animate-dialog backdrop:animate-backdrop"
    >
      <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
      <div className="flex items-center gap-3 border-b border-border px-4">
        <Search size={18} aria-hidden="true" className="shrink-0 text-foreground-muted" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={LIST_ID}
          aria-activedescendant={current ? optionId(current.id) : undefined}
          aria-label="Search sections and actions"
          placeholder="Jump to a section or connect…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKeyDown}
          className="h-14 w-full bg-transparent text-body text-foreground outline-none placeholder:text-foreground-muted"
        />
        <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 font-mono text-eyebrow text-foreground-muted sm:inline">
          Esc
        </kbd>
      </div>

      <ul id={LIST_ID} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && (
          <li className="px-3 py-6 text-center text-meta">No matches for “{query}”.</li>
        )}
        {results.map((command, i) => {
          const selected = command === current;
          const showGroup = i === 0 || results[i - 1].group !== command.group;
          return (
            <li key={command.id} role="presentation">
              {showGroup && (
                <p role="presentation" className="eyebrow px-3 pt-3 pb-1.5">
                  {command.group}
                </p>
              )}
              <div
                id={optionId(command.id)}
                role="option"
                aria-selected={selected}
                onMouseMove={() => setActive(i)}
                onClick={() => runCommand(command)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-nav transition-colors",
                  selected ? "bg-surface-elevated text-foreground" : "text-foreground-secondary",
                )}
              >
                <span className={cn("shrink-0", selected ? "text-accent" : "text-foreground-muted")}>
                  {command.icon}
                </span>
                <span className="flex-1">{command.label}</span>
                {command.hint && (
                  <span
                    className={cn(
                      "truncate font-mono text-eyebrow",
                      copied && command.id === "copy-email" ? "text-accent" : "text-foreground-muted",
                    )}
                  >
                    {command.hint}
                  </span>
                )}
                {selected &&
                  (command.group === "Connect" && command.id !== "copy-email" ? (
                    <ArrowUpRight size={14} aria-hidden="true" className="shrink-0 text-foreground-muted" />
                  ) : (
                    <CornerDownLeft size={14} aria-hidden="true" className="shrink-0 text-foreground-muted" />
                  ))}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="flex items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-eyebrow text-foreground-muted">
        <span>↑↓ to move</span>
        <span>↵ to select</span>
        <span className="ml-auto">Ctrl / ⌘ + K</span>
      </p>
    </dialog>
  );
}
