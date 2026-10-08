import { Mail } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TagList } from "@/components/ui/TagList";
import { aboutSection, aboutStats, aboutStory, snapshot } from "@/data/about";
import { profile } from "@/data/profile";
import { getProfileLinks } from "@/lib/profile-links";

const HEADING_ID = "about-title";

/** Story on the left; a skimmable "at a glance" card for recruiters on the right. */
export function About() {
  const links = getProfileLinks().filter((link) => link.label !== "Email");

  return (
    <Section id="about" aria-labelledby={HEADING_ID}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            id={HEADING_ID}
            index={aboutSection.index}
            eyebrow={aboutSection.eyebrow}
            title={aboutSection.title}
          />
          <div className="mt-8 flex max-w-reading flex-col gap-5 text-lead">
            {aboutStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-10 grid max-w-reading grid-cols-3 gap-3">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                data-spotlight
                className="relative isolate flex flex-col-reverse gap-1 overflow-hidden rounded-xl border border-border bg-surface/50 p-4"
              >
                <dt className="eyebrow">{stat.label}</dt>
                <dd className="text-gradient text-heading font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <aside
            aria-labelledby="snapshot-title"
            data-spotlight
            className="relative isolate overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 sm:p-8"
          >
            <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />

            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="bg-brand inline-flex size-14 shrink-0 items-center justify-center rounded-2xl font-mono text-title font-bold text-accent-foreground shadow-[0_10px_30px_-10px_rgb(167_139_250/0.7)]"
              >
                {profile.initials}
              </span>
              <div className="min-w-0">
                <p className="eyebrow" id="snapshot-title">
                  {snapshot.title}
                </p>
                <p className="text-title font-semibold text-foreground">{profile.name}</p>
              </div>
            </div>

            <dl className="mt-6 flex flex-col divide-y divide-border border-y border-border">
              {snapshot.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 py-3">
                  <dt className="eyebrow pt-0.5">{row.label}</dt>
                  <dd className="text-nav text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>

            <p className="eyebrow mt-6 mb-3">Core stack</p>
            <TagList items={snapshot.coreStack} label="Core stack" />

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-4">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center gap-2 text-nav font-medium text-foreground transition-colors hover:text-accent"
              >
                <Mail size={16} aria-hidden="true" />
                {profile.email}
              </a>
              {links.map((link) => (
                <ArrowLink key={link.label} href={link.href} external={link.external}>
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          </aside>
        </Reveal>
      </div>
    </Section>
  );
}
