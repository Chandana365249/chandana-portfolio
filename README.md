# Chandana Gandla — Portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion and Lucide.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Structure

```
src/
  app/            layout, page, global styles, generated icon and Open Graph image
  components/
    layout/       Navbar, Footer, Background
    motion/       MotionProvider (reduced-motion aware), FadeIn, Reveal (scroll reveal)
    projects/     ProjectCard, ProjectDetail (case-study dialog), ArchitectureDiagram, visuals/
    sections/     Hero, Projects, Skills
    skills/       SkillCategoryCard, SkillChip, SkillProjects (applied-in panel), StackFlow
    ui/           Button, ArrowLink, Container, Section, SectionHeading, TagList
  data/           profile.ts, site.ts, hero.ts, projects.ts, skills.ts (all content lives here)
  lib/            utils (cn), motion (shared easing/transitions)
```

## Updating content

- **Personal details and links:** `src/data/profile.ts`. Social links and the resume URL are `null` until real URLs are added; the UI hides them while they are `null`.
- **Projects:** `src/data/projects.ts`. Add `links.github` / `links.demo` to show code and demo buttons; they stay hidden until set.
- **Skills:** `src/data/skills.ts`. Skill-to-project links are derived from `projects.ts` automatically.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` to the production domain for canonical and Open Graph URLs (defaults to `http://localhost:3000`).
- **Design tokens:** colours, type scale, spacing and motion live in the `@theme` block of `src/app/globals.css`.
