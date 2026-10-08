import { profile } from "./profile";
import { projects } from "./projects";
import { allSkills } from "./skills";

const { education } = profile;

export const aboutSection = {
  index: "01",
  eyebrow: "About",
  title: "Engineer at the intersection of models and products.",
} as const;

/** Narrative paragraphs — every claim traces back to the resume or projects.ts. */
export const aboutStory: readonly string[] = [
  `I'm ${profile.name}, a ${education.degree.replace("B.Tech — ", "B.Tech student in ")} at ${education.university}, graduating in ${education.expectedGraduation}.`,
  "My work spans the full path of a machine learning system: preprocessing and feature engineering, deep learning models such as CNNs and LSTMs, and the FastAPI and React layers that put predictions in front of people.",
  "I care about explainability and responsible use. My projects are built to support human decisions, with their limits stated plainly.",
];

/** Figures computed from the data files, so they never drift from the content. */
export const aboutStats = [
  { value: String(projects.length), label: "Featured projects" },
  { value: String(projects.filter((p) => p.status === "deployed").length), label: "Deployed" },
  { value: `${allSkills.length}+`, label: "Technologies" },
] as const;

/** The recruiter "at a glance" card. */
export const snapshot = {
  title: "At a glance",
  rows: [
    { label: "Focus", value: profile.careerFocus.join(" · ") },
    { label: "Education", value: `${education.universityShort} · B.Tech CSE (Business Systems)` },
    { label: "CGPA", value: education.cgpa },
    { label: "Graduating", value: education.expectedGraduation },
    { label: "Based in", value: profile.location },
  ],
  coreStack: ["Python", "PyTorch", "TensorFlow", "NLP", "FastAPI", "React", "SQL"],
} as const;
