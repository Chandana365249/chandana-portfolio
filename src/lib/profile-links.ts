import { profile } from "@/data/profile";

export interface ProfileLink {
  label: string;
  href: string;
  /** True for links that open another site in a new tab. */
  external: boolean;
}

/**
 * Contact and social links with a real URL. Placeholders (`null`) in
 * profile.ts are skipped, so links appear automatically once added.
 */
export function getProfileLinks(): ProfileLink[] {
  const candidates: Array<{ label: string; href: string | null }> = [
    { label: "GitHub", href: profile.social.github },
    { label: "LinkedIn", href: profile.social.linkedin },
    { label: "LeetCode", href: profile.social.leetcode },
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  return candidates.flatMap(({ label, href }) =>
    href ? [{ label, href, external: href.startsWith("http") }] : [],
  );
}
