import { profile } from "./profile";

const { education } = profile;

export const hero = {
  /** `highlight` is rendered in the brand gradient. */
  headline: {
    before: "Building",
    highlight: "intelligent systems",
    after: "that turn complex problems into useful solutions.",
  },
  /** Split around the university so the UI can keep "VIT-AP" from breaking at its hyphen. */
  intro: {
    beforeUniversity: `Hi, I'm ${profile.shortName} — a Computer Science & Business Systems student at`,
    university: education.universityShort,
    afterUniversity:
      ", focused on machine learning, data-driven systems, and full-stack development.",
  },
  highlights: [
    { value: education.cgpa, label: "CGPA" },
    { value: education.universityShort, label: "University" },
    { value: String(education.endYear), label: "Graduation" },
  ],
  rotator: {
    prefix: "I build",
    phrases: [
      "machine learning pipelines",
      "deep learning models",
      "NLP systems",
      "explainable AI",
      "full-stack apps",
    ],
  },
  primaryCta: { label: "Explore My Work", href: "#projects" },
  resumeCtaLabel: "Download Resume",
} as const;
