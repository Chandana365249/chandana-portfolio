import { earlierEducation, leadership } from "./achievements";
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
  index: "06",
  eyebrow: "Journey",
  title: "From first model to full systems.",
  description:
    "A short timeline of where I've been and what I'm building now, alongside live activity from my GitHub.",
} as const;

const deployed = projects.filter((p) => p.status === "deployed");
const inProgress = projects.filter((p) => p.status === "in-progress");
const [intermediate, ssc] = earlierEducation;

/** Only verified milestones from the resume, in order. */
export const milestones: readonly Milestone[] = [
  {
    when: ssc.years,
    title: `${ssc.level} — ${ssc.score}`,
    detail: ssc.school + ".",
    status: "done",
  },
  {
    when: "2023",
    title: `${intermediate.level} — ${intermediate.score}`,
    detail: `${intermediate.school}, with a district top rank of 465/470.`,
    status: "done",
  },
  {
    when: String(education.startYear),
    title: `Started B.Tech at ${education.university}`,
    detail: "Computer Science and Engineering (Business Systems).",
    status: "done",
  },
  {
    when: "2024",
    title: `${leadership.role}`,
    detail: `${leadership.org}: 15+ webinars, 2 hackathons and the club website.`,
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
    when: "Aug 2026",
    title: "Microsoft Certified: Azure Fundamentals",
    detail: "AZ-900 certification from Microsoft.",
    status: "done",
  },
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
