import { ArrowDown, Download, Gamepad2, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { RoleRotator } from "@/components/motion/RoleRotator";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { hero } from "@/data/hero";
import { profile } from "@/data/profile";
import { focusAreas } from "@/data/site";
import { getProfileLinks } from "@/lib/profile-links";
import { HeroVisual } from "./HeroVisual";

/*
 * Text is server-rendered and animated with CSS (FadeIn), so it is visible
 * without JavaScript; only the decorative visual depends on hydration.
 */
export function Hero() {
  const links = getProfileLinks();

  return (
    <section id="home" aria-labelledby="hero-title" className="relative">
      <Container className="grid items-center gap-x-12 gap-y-16 pt-12 pb-20 sm:pt-16 lg:min-h-viewport lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:py-16">
        <div className="flex flex-col">
          <FadeIn>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2">
              <span aria-hidden="true" className="bg-brand h-px w-8" />
              {/* Each separator travels with its item, so wrapping never strands a bullet. */}
              {focusAreas.map((area, i) => (
                <span key={area} className="inline-flex items-center gap-3 whitespace-nowrap">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-accent/70">
                      •
                    </span>
                  )}
                  {area}
                </span>
              ))}
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 id="hero-title" className="mt-6 max-w-2xl text-display font-semibold">
              {hero.headline.before} <span className="text-gradient">{hero.headline.highlight}</span>{" "}
              {hero.headline.after}
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mt-5">
              <RoleRotator prefix={hero.rotator.prefix} phrases={hero.rotator.phrases} />
            </div>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-5 max-w-reading text-lead text-foreground-secondary">
              {hero.intro.beforeUniversity} <span className="whitespace-nowrap">{hero.intro.university}</span>
              {hero.intro.afterUniversity}
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <dl className="mt-10 grid max-w-md grid-cols-3 rounded-2xl border border-border bg-surface/50 px-5 py-4 backdrop-blur-sm">
              {hero.highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col-reverse gap-1.5 border-l border-border pl-4 first:border-l-0 first:pl-0 sm:pl-6"
                >
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="text-title font-semibold whitespace-nowrap text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowDown
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-smooth group-hover:translate-y-0.5"
                />
              </Button>
              {profile.resumeUrl && (
                <Button href={profile.resumeUrl} variant="secondary" download>
                  <Download size={16} aria-hidden="true" />
                  {hero.resumeCtaLabel}
                </Button>
              )}
              <Button href={hero.playCta.href} variant="text">
                <Gamepad2
                  size={16}
                  aria-hidden="true"
                  className="text-pink transition-transform duration-300 ease-smooth group-hover:rotate-12"
                />
                {hero.playCta.label}
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-5">
              <p className="inline-flex min-h-11 items-center gap-2 text-nav text-foreground-muted">
                <MapPin size={14} aria-hidden="true" />
                {profile.location}
              </p>
              <ul className="-ml-1 flex flex-wrap gap-x-5" aria-label="Contact and profiles">
                {links.map((link) => (
                  <li key={link.label}>
                    <ArrowLink href={link.href} external={link.external}>
                      {link.label}
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.3} className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
          <HeroVisual />
        </FadeIn>
      </Container>
    </section>
  );
}
