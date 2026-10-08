import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { getProfileLinks } from "@/lib/profile-links";

export function Footer() {
  const links = getProfileLinks();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-title font-semibold text-foreground">{profile.name}</p>
          <p className="text-meta text-foreground-secondary">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <ul className="-ml-1 flex flex-wrap gap-x-5 md:ml-0 md:-mr-1">
            {links.map((link) => (
              <li key={link.label}>
                <ArrowLink href={link.href} external={link.external}>
                  {link.label}
                </ArrowLink>
              </li>
            ))}
          </ul>
          <p className="font-mono text-meta text-foreground-muted">
            © {site.copyrightYear} {profile.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
