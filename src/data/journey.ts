import { profile } from "./profile";
import { projects } from "./projects";

const { education } = profile;

export type MilestoneStatus = "done" | "now" | "next";

export interface Milestone {
  /** Short marker: a year, or a stage name when no date is on record. */
  when: string;
  title: string;
  detail: string;
  status: MilestoneStatus;
}

export const journeySection = {
  index: "04",
  eyebrow: "Journey",
  title: "From first model to full systems.",
  description:
    "A short timeline of where I've been and what I'm building now, alongside live activity from my GitHub.",
} as const;

const deployed = projects.filter((p) => p.status === "deployed");
const inProgress = projects.filter((p) => p.status === "in-progress");

/**
 * Only verified milestones. Add internships, hackathons or certifications
 * here as new entries — the timeline renders whatever is listed.
 */
export const milestones: readonly Milestone[] = [
  {
    when: String(education.startYear),
    title: `Started B.Tech at ${education.university}`,
    detail: "Computer Science and Engineering (Business Systems).",
    status: "done",
  },
  ...deployed.map(
    (p): Milestone => ({
      when: "Shipped",
      title: `Deployed the ${p.title}`,
      detail: p.caseStudy.output,
      status: "done",
    }),
  ),
  {
    when: "Now",
    title: `Building ${inProgress.map((p) => p.title).join(" and ")}`,
    detail: inProgress.map((p) => p.subtitle).join("; ") + ".",
    status: "now",
  },
  {
    when: education.expectedGraduation,
    title: "Expected graduation",
    detail: `Heading into roles as ${profile.careerFocus.join(", ").replace(/, ([^,]*)$/, " or $1")}.`,
    status: "next",
  },
];
