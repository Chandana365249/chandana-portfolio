import { CountUp } from "@/components/game/CountUp";
import { FlipCard } from "@/components/game/FlipCard";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, achievementsSection, leadership } from "@/data/achievements";

const HEADING_ID = "achievements-title";

/** Flip cards for each achievement, then a leadership card with live counters. */
export function Achievements() {
  return (
    <Section id="achievements" aria-labelledby={HEADING_ID}>
      <Reveal>
        <SectionHeading
          id={HEADING_ID}
          index={achievementsSection.index}
          eyebrow={achievementsSection.eyebrow}
          title={achievementsSection.title}
          description={achievementsSection.description}
        />
      </Reveal>

      <ul className="mt-stack grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {achievements.map((achievement, i) => (
          <li key={achievement.id}>
            <Reveal delay={i * 0.07}>
              <FlipCard achievement={achievement} />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-6 lg:mt-8">
        <article
          data-spotlight
          aria-labelledby="leadership-title"
          className="relative isolate grid gap-8 overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:p-10"
        >
          <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
          <div>
            <p className="eyebrow text-pink">Leadership · {leadership.period}</p>
            <h3 id="leadership-title" className="mt-3 text-title font-semibold">
              {leadership.role}
            </h3>
            <p className="mt-1 text-foreground">{leadership.org}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {leadership.points.map((point) => (
                <li key={point} className="flex gap-3 text-meta sm:text-body">
                  <span aria-hidden="true" className="bg-brand mt-2.5 size-1.5 shrink-0 rounded-full" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-3 gap-3 self-center">
            {leadership.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse gap-2 rounded-xl border border-border bg-background/40 p-4 sm:p-5"
              >
                <dt className="text-meta leading-snug text-foreground-secondary">{stat.label}</dt>
                <dd className="text-gradient text-display font-bold">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </article>
      </Reveal>
    </Section>
  );
}
