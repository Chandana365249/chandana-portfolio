import { allSkills } from "@/data/skills";

const dots = ["bg-accent", "bg-violet", "bg-pink"] as const;

/**
 * Decorative strip of every technology, scrolling slowly. The list is
 * duplicated so the loop is seamless; it pauses on hover and stops under
 * reduced motion. Hidden from assistive tech — the Skills section is the
 * accessible version of the same content.
 */
export function TechMarquee() {
  const items = [...allSkills, ...allSkills];

  return (
    <div
      aria-hidden="true"
      className="mask-fade-x group relative overflow-hidden border-y border-border bg-surface/30 py-4"
    >
      <ul className="animate-marquee flex w-max gap-8 group-hover:[animation-play-state:paused]">
        {items.map((skill, i) => (
          <li
            key={`${skill}-${i}`}
            className="flex items-center gap-3 font-mono text-meta whitespace-nowrap text-foreground-muted"
          >
            <span className={`size-1.5 rounded-full ${dots[i % dots.length]}`} />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
