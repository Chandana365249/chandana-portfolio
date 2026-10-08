import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactSection } from "@/data/contact";
import { profile } from "@/data/profile";

const HEADING_ID = "contact-title";

interface ContactChannel {
  label: string;
  /** What the visitor sees, e.g. the email address or profile handle. */
  value: string;
  href: string;
  icon: ReactNode;
  /** Tailwind classes for the icon tile's tint. */
  tint: string;
}

/** Shows a readable handle instead of the full profile URL. */
const handleOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Channels with a real URL; null placeholders in profile.ts are skipped. */
function getChannels(): ContactChannel[] {
  const { email, social } = profile;
  const channels: Array<ContactChannel | null> = [
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: <Mail size={20} aria-hidden="true" />,
      tint: "bg-accent/15 text-accent",
    },
    social.linkedin
      ? {
          label: "LinkedIn",
          value: handleOf(social.linkedin),
          href: social.linkedin,
          icon: <LinkedInIcon />,
          tint: "bg-violet/15 text-violet",
        }
      : null,
    social.github
      ? {
          label: "GitHub",
          value: handleOf(social.github),
          href: social.github,
          icon: <GitHubIcon />,
          tint: "bg-pink/15 text-pink",
        }
      : null,
  ];
  return channels.filter((channel) => channel !== null);
}

export function Contact() {
  const channels = getChannels();

  return (
    <Section id="contact" aria-labelledby={HEADING_ID}>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-6 sm:p-10 lg:p-14">
        <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(167_139_250/0.18),rgb(244_114_182/0.06)_60%,transparent)]"
        />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              id={HEADING_ID}
              index={contactSection.index}
              eyebrow={contactSection.eyebrow}
              title={contactSection.title}
              description={contactSection.description}
            />
            <p className="mt-6 inline-flex items-center gap-2 text-nav text-foreground-muted">
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-3" aria-label="Contact channels">
              {channels.map((channel) => {
                const external = channel.href.startsWith("http");
                return (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      data-spotlight
                      className="group relative isolate flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-background/50 p-4 transition-[border-color,translate,box-shadow] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-[0_16px_40px_-20px_rgb(167_139_250/0.5)] sm:p-5"
                    >
                      <span
                        className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ${channel.tint}`}
                      >
                        {channel.icon}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="eyebrow">{channel.label}</span>
                        <span className="truncate font-medium text-foreground">{channel.value}</span>
                      </span>
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="shrink-0 text-foreground-muted transition-[color,transform] duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                      {external && <span className="sr-only">(opens in a new tab)</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
