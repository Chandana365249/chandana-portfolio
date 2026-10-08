"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SkillCategoryCard } from "@/components/skills/SkillCategoryCard";
import type { ChipState, SkillInteraction } from "@/components/skills/SkillChip";
import { SkillProjects, type SkillFocus } from "@/components/skills/SkillProjects";
import { StackFlow } from "@/components/skills/StackFlow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProjectId } from "@/data/projects";
import {
  projectsUsing,
  skillCategories,
  skillsSection,
  skillsUsedBy,
  type SkillCategoryId,
  type SkillName,
} from "@/data/skills";

const HEADING_ID = "skills-title";

/**
 * Bento placement. On desktop AI / ML takes the wide right column with the
 * project panel beneath it, beside Languages and Web / Backend; Data and Tools
 * share the last row. `grid-flow-dense` keeps the tablet layout gap-free.
 */
const placement: Record<SkillCategoryId, string> = {
  languages: "lg:col-span-4 lg:row-start-1",
  "ai-ml": "md:col-span-2 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1",
  web: "lg:col-span-4 lg:row-span-2 lg:row-start-2",
  data: "lg:col-span-5 lg:row-start-4",
  tools: "lg:col-span-7 lg:col-start-6 lg:row-start-4",
};
const panelPlacement = "md:col-span-2 lg:col-span-8 lg:col-start-5 lg:row-start-3";

const sameFocus = (a: SkillFocus, b: SkillFocus) => JSON.stringify(a) === JSON.stringify(b);

export function Skills() {
  // Hover/focus previews a trace; click pins it until cleared or toggled.
  const [preview, setPreview] = useState<SkillFocus>(null);
  const [pinned, setPinned] = useState<SkillFocus>(null);
  const focus = preview ?? pinned;

  const focusProjects: readonly ProjectId[] =
    focus?.kind === "skill" ? projectsUsing(focus.skill) : focus?.kind === "project" ? [focus.id] : [];
  const traced = new Set(focusProjects.flatMap((id) => skillsUsedBy(id)));

  const toggle = (next: SkillFocus) => setPinned((current) => (sameFocus(current, next) ? null : next));

  const interaction: SkillInteraction = {
    stateOf: (skill): ChipState => {
      if (!focus) return "idle";
      if (focus.kind === "skill" && focus.skill === skill) return "active";
      if (traced.has(skill)) return focus.kind === "project" ? "active" : "related";
      return "dimmed";
    },
    isPinned: (skill) => pinned?.kind === "skill" && pinned.skill === skill,
    preview: (skill: SkillName | null) => setPreview(skill ? { kind: "skill", skill } : null),
    toggle: (skill) => toggle({ kind: "skill", skill }),
  };

  return (
    <Section id="skills" aria-labelledby={HEADING_ID}>
      <Reveal>
        <SectionHeading
          id={HEADING_ID}
          index={skillsSection.index}
          eyebrow={skillsSection.eyebrow}
          title={skillsSection.title}
          description={skillsSection.description}
        />
      </Reveal>

      <div className="mt-stack grid gap-4 md:grid-flow-dense md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {skillCategories.map((category, i) => (
          <Reveal key={category.id} delay={i * 0.06} className={placement[category.id]}>
            <SkillCategoryCard category={category} interaction={interaction} />
          </Reveal>
        ))}

        <Reveal className={panelPlacement}>
          <SkillProjects
            focus={focus}
            pinned={pinned}
            onPreview={setPreview}
            onToggle={toggle}
            onClear={() => setPinned(null)}
          />
        </Reveal>
      </div>

      <Reveal className="mt-stack">
        <StackFlow />
      </Reveal>
    </Section>
  );
}
