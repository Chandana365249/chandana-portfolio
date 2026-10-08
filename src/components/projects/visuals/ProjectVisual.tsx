import type { ReactNode } from "react";
import type { Project, ProjectId } from "@/data/projects";
import { PipelineVisual } from "./PipelineVisual";
import { SeriesVisual } from "./SeriesVisual";
import { SignalVisual } from "./SignalVisual";

const stepsOf = (project: Project) => project.architecture.map((node) => node.label);

/** Each project has a bespoke visual; all content still comes from projects.ts. */
const visuals: Record<ProjectId, (project: Project) => ReactNode> = {
  resqai: (project) => (
    <PipelineVisual stages={project.pipeline ?? [{ stage: "Pipeline", steps: stepsOf(project) }]} />
  ),
  neurosense: (project) => (
    <SignalVisual
      targets={project.targets ?? []}
      models={project.models ?? []}
      steps={stepsOf(project)}
    />
  ),
  earthquake: (project) => <SeriesVisual steps={stepsOf(project)} />,
};

export function ProjectVisual({ project }: { project: Project }) {
  return visuals[project.id](project);
}
