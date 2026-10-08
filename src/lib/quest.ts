/*
 * The exploration quest: visitors unlock badges by exploring the portfolio.
 * Any component calls `unlock(id)`. Progress lives in a tiny external store
 * (read with useSyncExternalStore) backed by localStorage; an event lets the
 * QuestTracker show a toast. Progress is a nicety, so storage failures are
 * ignored.
 */

export type BadgeId =
  | "about"
  | "projects"
  | "playground"
  | "skills"
  | "achievements"
  | "journey"
  | "contact"
  | "case-study"
  | "terminal"
  | "triage"
  | "quick-menu"
  | "secret";

export interface Badge {
  id: BadgeId;
  emoji: string;
  title: string;
  hint: string;
}

export const badges: readonly Badge[] = [
  { id: "about", emoji: "👋", title: "Nice to meet you", hint: "Read the About section" },
  { id: "projects", emoji: "🛠️", title: "Project scout", hint: "Scroll through Projects" },
  { id: "case-study", emoji: "🔍", title: "Deep diver", hint: "Open a project case study" },
  { id: "playground", emoji: "🎮", title: "Player one", hint: "Visit the Playground" },
  { id: "terminal", emoji: "💻", title: "Hacker mode", hint: "Run a command in the terminal" },
  { id: "triage", emoji: "🚨", title: "First responder", hint: "Triage a report in the demo" },
  { id: "skills", emoji: "🧠", title: "Stack tracer", hint: "Explore the Skills section" },
  { id: "achievements", emoji: "🏆", title: "Card flipper", hint: "Flip an achievement card" },
  { id: "journey", emoji: "🧭", title: "Time traveller", hint: "Follow the Journey" },
  { id: "contact", emoji: "📬", title: "Let's talk", hint: "Reach the Contact section" },
  { id: "quick-menu", emoji: "⌨️", title: "Power user", hint: "Open the Ctrl + K menu" },
  { id: "secret", emoji: "🥚", title: "Easter egg hunter", hint: "Find the secret (try ↑↑↓↓←→←→BA)" },
];

export const UNLOCK_EVENT = "quest:unlock";
export const CONFETTI_EVENT = "quest:confetti";

export interface UnlockDetail {
  id: BadgeId;
  total: number;
}

const EMPTY: ReadonlySet<BadgeId> = new Set();
let state: ReadonlySet<BadgeId> | null = null;
const listeners = new Set<() => void>();

const read = () => (state ??= loadBadges());
const write = (next: ReadonlySet<BadgeId>) => {
  state = next;
  saveBadges(next);
  for (const listener of listeners) listener();
};

export const questStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => EMPTY,
};

export function unlock(id: BadgeId) {
  if (typeof window === "undefined") return;
  const current = read();
  if (current.has(id)) return;
  const next = new Set(current).add(id);
  write(next);
  window.dispatchEvent(new CustomEvent<UnlockDetail>(UNLOCK_EVENT, { detail: { id, total: next.size } }));
}

export function resetBadges() {
  write(new Set());
}

export function celebrate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONFETTI_EVENT));
}

const STORAGE_KEY = "chandana-portfolio:badges";

function loadBadges(): Set<BadgeId> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    const known = new Set(badges.map((b) => b.id));
    return new Set(Array.isArray(ids) ? ids.filter((id): id is BadgeId => known.has(id)) : []);
  } catch {
    return new Set();
  }
}

function saveBadges(ids: ReadonlySet<BadgeId>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Private mode or blocked storage: progress just won't persist.
  }
}
