"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, projectsSection, type ProjectId } from "@/data/projects";

const HEADING_ID = "projects-title";

/** Featured project first at full width, then the rest side by side. */
export function Projects() {
  const [openId, setOpenId] = useState<ProjectId | null>(null);
  const openProject = projects.find((project) => project.id === openId) ?? null;
  const [featured, ...supporting] = projects;

  return (
    <Section id="projects" aria-labelledby={HEADING_ID}>
      <Reveal>
        <SectionHeading
          id={HEADING_ID}
          index={projectsSection.index}
          eyebrow={projectsSection.eyebrow}
          title={projectsSection.title}
          description={projectsSection.description}
        />
      </Reveal>

      <div className="mt-stack flex flex-col gap-6 lg:gap-8">
        <Reveal>
          <ProjectCard project={featured} featured onOpen={() => setOpenId(featured.id)} />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
          {supporting.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} onOpen={() => setOpenId(project.id)} />
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectDetail project={openProject} onClose={() => setOpenId(null)} />
    </Section>
  );
}
