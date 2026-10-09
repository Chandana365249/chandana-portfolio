import { ArrowUpRight, Star } from "lucide-react";
import { GitHubIcon } from "@/components/ui/BrandIcons";
import { getGitHubActivity, githubUsername } from "@/lib/github";
import { cn } from "@/lib/utils";
import { SurpriseRepo } from "./SurpriseRepo";

/** GitHub's own language colours for the common cases; others use violet. */
const languageColors: Record<string, string> = {
  Python: "#3572A5",
  "Jupyter Notebook": "#DA5B0B",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  HTML: "#e34c26",
  CSS: "#663399",
};

const colorOf = (language: string) => languageColors[language] ?? "var(--color-violet)";

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function updatedAgo(iso: string) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86_400_000);
  if (days > -1) return "today";
  if (days > -30) return relativeTime.format(days, "day");
  if (days > -365) return relativeTime.format(Math.round(days / 30), "month");
  return relativeTime.format(Math.round(days / 365), "year");
}

const panelClasses =
  "relative isolate overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 sm:p-8";

function PanelHeader({ live }: { live: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="flex items-center gap-3 text-title font-semibold text-foreground">
        <GitHubIcon size={22} />
        GitHub
      </p>
      {live && (
        <span className="eyebrow inline-flex items-center gap-2 text-foreground-secondary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Live
        </span>
      )}
    </div>
  );
}

/** Shown while loading and whenever GitHub can't be reached. */
export function GitHubFallback({ loading = false }: { loading?: boolean }) {
  const href = githubUsername ? `https://github.com/${githubUsername}` : null;
  return (
    <div className={panelClasses} data-spotlight aria-busy={loading || undefined}>
      <PanelHeader live={false} />
      <p className="mt-4 text-meta sm:text-body">
        {loading ? "Loading recent activity…" : "Code, experiments and works in progress."}
      </p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-nav font-medium text-foreground transition-colors hover:text-accent"
        >
          github.com/{githubUsername}
          <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

export async function GitHubPanel() {
  const activity = await getGitHubActivity();
  if (!activity) return <GitHubFallback />;

  const totalLanguageCount = activity.languages.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className={panelClasses} data-spotlight>
      <span aria-hidden="true" className="bg-brand absolute inset-x-0 top-0 h-px" />
      <PanelHeader live />

      <div className={cn("mt-6 grid gap-3", activity.pool.length > 0 && "grid-cols-2")}>
        <dl className="flex flex-col-reverse gap-1 rounded-xl border border-border bg-background/40 p-4">
          <dt className="eyebrow">Public repos</dt>
          <dd className="text-gradient text-heading font-semibold">{activity.publicRepos}</dd>
        </dl>
        {activity.pool.length > 0 && <SurpriseRepo pool={activity.pool} />}
      </div>

      {activity.languages.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-3">Languages</p>
          <div aria-hidden="true" className="flex h-2 overflow-hidden rounded-full bg-background/60">
            {activity.languages.map((l) => (
              <span
                key={l.name}
                style={{
                  width: `${(l.count / totalLanguageCount) * 100}%`,
                  backgroundColor: colorOf(l.name),
                }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-meta">
            {activity.languages.map((l) => (
              <li key={l.name} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ backgroundColor: colorOf(l.name) }}
                />
                {l.name}
                <span className="sr-only">
                  , {l.count} repo{l.count === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activity.recent.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-3">Recently updated</p>
          <ul className="flex flex-col gap-2">
            {activity.recent.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 rounded-xl border border-border bg-background/40 p-3.5 transition-[border-color,translate] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-violet/40"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-nav font-medium text-foreground">
                      {repo.name}
                    </span>
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="shrink-0 text-foreground-muted transition-colors group-hover:text-accent"
                    />
                  </span>
                  {repo.description && <span className="line-clamp-1 text-meta">{repo.description}</span>}
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-eyebrow text-foreground-muted">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: colorOf(repo.language) }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stars > 0 && (
                      <span className={cn("inline-flex items-center gap-1")}>
                        <Star size={11} aria-hidden="true" />
                        {repo.stars}
                        <span className="sr-only"> stars</span>
                      </span>
                    )}
                    <span>Updated {updatedAgo(repo.pushedAt)}</span>
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a
        href={activity.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 items-center gap-2 text-nav font-medium text-foreground transition-colors hover:text-accent"
      >
        View all on GitHub
        <ArrowUpRight size={14} aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
