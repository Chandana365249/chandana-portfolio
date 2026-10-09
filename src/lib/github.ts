import { profile } from "@/data/profile";

/*
 * Public GitHub data for the Journey section. Fetched on the server and cached
 * for an hour, so visitors never hit GitHub's rate limit themselves. An
 * optional GITHUB_TOKEN raises the limit at build time. Any failure returns
 * null and the UI falls back to a plain profile link.
 */

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubActivity {
  username: string;
  profileUrl: string;
  publicRepos: number;
  /** Every public, non-fork, non-archived repo — the pool for "Surprise me". */
  pool: readonly { name: string; url: string; description: string | null }[];
  /** Most-used languages across public, non-fork repos, most common first. */
  languages: readonly { name: string; count: number }[];
  recent: readonly GitHubRepo[];
}

interface ApiUser {
  login: string;
  html_url: string;
  public_repos: number;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

/** The username is the last path segment of the profile URL in profile.ts. */
export const githubUsername = profile.social.github?.replace(/\/$/, "").split("/").pop() ?? null;

async function getJson<T>(path: string): Promise<T | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const response = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      next: { revalidate: 3600 },
    });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function getGitHubActivity(): Promise<GitHubActivity | null> {
  if (!githubUsername) return null;

  const [user, repos] = await Promise.all([
    getJson<ApiUser>(`/users/${githubUsername}`),
    getJson<ApiRepo[]>(`/users/${githubUsername}/repos?sort=pushed&per_page=100`),
  ]);
  if (!user || !repos) return null;

  const own = repos.filter((repo) => !repo.fork && !repo.archived);

  const languageCounts = new Map<string, number>();
  for (const repo of own) {
    if (repo.language) languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
  }

  return {
    username: user.login,
    profileUrl: user.html_url,
    publicRepos: user.public_repos,
    pool: own.map((repo) => ({ name: repo.name, url: repo.html_url, description: repo.description })),
    languages: [...languageCounts]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    recent: own.slice(0, 4).map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
    })),
  };
}
