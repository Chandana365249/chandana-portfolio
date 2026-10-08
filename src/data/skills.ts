import { projects, type Project, type ProjectId } from "./projects";

/**
 * Technical skills — only technologies listed on the resume. Every skill name
 * comes from `allSkills`, so categories and the stack flow are type-checked
 * against one list and cannot drift or introduce new technologies.
 */

export const allSkills = [
  // Languages
  "Python", "C++", "JavaScript", "TypeScript", "SQL",
  // AI / Machine Learning
  "PyTorch", "TensorFlow", "scikit-learn",
  "CNN", "LSTM", "RNN",
  "Deep Learning", "NLP", "Time Series Analysis", "Feature Engineering",
  "Data Preprocessing", "Model Evaluation", "Explainable AI",
  "NumPy", "Pandas", "Data Visualization",
  // Web / Backend
  "React.js", "Node.js", "Express.js", "Flask", "FastAPI",
  "HTML5", "CSS3", "Tailwind CSS", "REST APIs", "JWT Authentication",
  // Databases
  "MySQL", "MongoDB", "PostgreSQL",
  // Tools / Platforms
  "Git", "GitHub", "Vercel", "Google Colab", "Jupyter Notebook",
  "Docker", "Microsoft Azure", "Claude Code", "Claude Cowork",
] as const;

export type SkillName = (typeof allSkills)[number];

export type SkillCategoryId = "ai-ml" | "web" | "languages" | "data" | "tools";

/** Narrative emphasis in the layout — not a proficiency ranking. */
export type CategoryEmphasis = "primary" | "secondary" | "tertiary";

export interface SkillGroup {
  /** Optional sub-heading, e.g. "Frameworks". */
  label?: string;
  skills: readonly SkillName[];
}

export interface SkillCategory {
  id: SkillCategoryId;
  number: string;
  title: string;
  description: string;
  emphasis: CategoryEmphasis;
  groups: readonly SkillGroup[];
  /** Skills given visual prominence because the portfolio's projects rely on them. */
  prominent?: readonly SkillName[];
  /** Skills from another category this one works closely with (shown as a note, not duplicated). */
  pairsWith?: readonly SkillName[];
}

export const skillsSection = {
  index: "03",
  eyebrow: "Technical Expertise",
  title: "Tools I use to turn ideas into systems.",
  description:
    "From model development and data processing to APIs, interfaces, and databases, I work across the layers required to build complete technical solutions.",
} as const;

/** In numbered order; the layout gives AI / ML the most visual weight. */
export const skillCategories: readonly SkillCategory[] = [
  {
    id: "languages",
    number: "01",
    title: "Languages",
    description:
      "Core programming and query languages I use to build algorithms, applications, and data workflows.",
    emphasis: "secondary",
    groups: [{ skills: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] }],
    prominent: ["Python"],
  },  {
    id: "ai-ml",
    number: "02",
    title: "AI / Machine Learning",
    description:
      "Building predictive systems through preprocessing, feature engineering, deep learning, model evaluation, and explainability.",
    emphasis: "primary",
    groups: [
      { label: "Frameworks", skills: ["PyTorch", "TensorFlow", "scikit-learn"] },
      { label: "Models", skills: ["CNN", "LSTM", "RNN"] },
      {
        label: "Methods",
        skills: [
          "Deep Learning",
          "NLP",
          "Time Series Analysis",
          "Feature Engineering",
          "Data Preprocessing",
          "Model Evaluation",
          "Explainable AI",
        ],
      },
      { label: "Data", skills: ["NumPy", "Pandas", "Data Visualization"] },
    ],
  },  {
    id: "web",
    number: "03",
    title: "Web / Backend",
    description:
      "Turning models and business logic into usable applications through APIs, services, and interfaces.",
    emphasis: "secondary",
    groups: [
      { label: "Services", skills: ["FastAPI", "Flask", "Node.js", "Express.js", "REST APIs", "JWT Authentication"] },
      { label: "Interfaces", skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS"] },
    ],
    prominent: ["FastAPI", "React.js"],
  },  {
    id: "data",
    number: "04",
    title: "Data / Databases",
    description: "Working with structured data, persistence, querying, and model-ready datasets.",
    emphasis: "tertiary",
    groups: [{ skills: ["SQL", "MySQL", "PostgreSQL", "MongoDB"] }],
    pairsWith: ["Pandas", "NumPy"],
  },  {
    id: "tools",
    number: "05",
    title: "Tools / Platforms",
    description:
      "Tools that support experimentation, version control, deployment, and AI-assisted development.",
    emphasis: "tertiary",
    groups: [
      {
        skills: [
          "Git",
          "GitHub",
          "Jupyter Notebook",
          "Google Colab",
          "Docker",
          "Vercel",
          "Microsoft Azure",
          "Claude Code",
          "Claude Cowork",
        ],
      },
    ],
  },];

/** Conceptual layers of a complete ML application — not a claim about any one project. */
export const stackLayers: readonly { layer: string; skills: readonly SkillName[] }[] = [
  { layer: "Data", skills: ["Pandas", "NumPy", "SQL"] },
  { layer: "Processing", skills: ["Feature Engineering", "Data Preprocessing"] },
  { layer: "Model", skills: ["PyTorch", "TensorFlow", "CNN", "LSTM"] },
  { layer: "API", skills: ["FastAPI", "REST APIs"] },
  { layer: "Interface", skills: ["React.js", "TypeScript", "Tailwind CSS"] },
  { layer: "Insight", skills: ["Model Evaluation", "Explainable AI", "Data Visualization"] },
];

/* ---------------------------------------------------------------------------
 * Project associations — derived from projects.ts, never hand-written.
 * A skill is linked to a project when the project's technologies, models or
 * category name it (using the project's own spelling via `projectSpelling`).
 * ------------------------------------------------------------------------- */

/** Where projects.ts spells a technology differently from the skill list. */
const projectSpelling: Partial<Record<SkillName, string>> = {
  "React.js": "React",
  "Time Series Analysis": "Time Series",
};

const projectTerms = (project: Project) =>
  new Set([
    ...project.technologies,
    ...(project.models ?? []),
    ...project.category.split(" / "),
  ]);

const termsByProject = new Map(projects.map((p) => [p.id, projectTerms(p)]));

const projectsBySkill = new Map<SkillName, readonly ProjectId[]>(
  allSkills.map((skill) => {
    const term = projectSpelling[skill] ?? skill;
    return [skill, projects.filter((p) => termsByProject.get(p.id)?.has(term)).map((p) => p.id)];
  }),
);

/** Featured projects that use a skill (empty when none do). */
export const projectsUsing = (skill: SkillName): readonly ProjectId[] =>
  projectsBySkill.get(skill) ?? [];

/** Skills from this list that a featured project uses. */
export const skillsUsedBy = (projectId: ProjectId): readonly SkillName[] =>
  allSkills.filter((skill) => projectsUsing(skill).includes(projectId));
