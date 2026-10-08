import { profile } from "./profile";

export interface NavItem {
  label: string;
  href: `#${string}`;
}

/**
 * Canonical site URL. No production domain exists yet, so this reads
 * NEXT_PUBLIC_SITE_URL and falls back to the local dev server.
 * Set NEXT_PUBLIC_SITE_URL once the portfolio is deployed.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Disciplines shown in the hero eyebrow and the footer tagline. */
export const focusAreas = ["AI / ML", "Data Science", "Software Engineering"] as const;

export const site = {
  url: siteUrl,
  title: `${profile.name} | AI/ML Engineer & Data Science Portfolio`,
  description:
    "Portfolio of Chandana Gandla, a Computer Science & Business Systems student at VIT-AP building machine learning, AI, data science, and full-stack systems.",
  tagline: focusAreas.join(" • "),
  copyrightYear: 2026,
} as const;

/** Section anchors, in page order. */
export const navItems: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Playground", href: "#playground" },
  { label: "Skills", href: "#skills" },
  { label: "Achievements", href: "#achievements" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];
