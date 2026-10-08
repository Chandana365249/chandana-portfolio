/**
 * Single source of truth for candidate information.
 * Only verified details from the resume belong here.
 * Links set to `null` are placeholders: the UI hides them until a real URL is added.
 */

export interface Education {
  university: string;
  universityShort: string;
  degree: string;
  startYear: number;
  endYear: number;
  cgpa: string;
  expectedGraduation: string;
}

export interface SocialLinks {
  github: string | null;
  linkedin: string | null;
  leetcode: string | null;
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  location: string;
  education: Education;
  careerFocus: readonly string[];
  coreAreas: readonly string[];
  email: string;
  social: SocialLinks;
  resumeUrl: string | null;
}

export const profile: Profile = {
  name: "Chandana Gandla",
  shortName: "Chandana",
  initials: "CG",
  location: "Amaravati, India",
  education: {
    university: "VIT-AP University",
    universityShort: "VIT-AP",
    degree: "B.Tech — Computer Science and Engineering (Business Systems)",
    startYear: 2023,
    endYear: 2027,
    cgpa: "9.37 / 10",
    expectedGraduation: "May 2027",
  },
  careerFocus: ["AI/ML Engineer", "Data Scientist", "Software Developer"],
  coreAreas: [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Time Series Analysis",
    "Explainable AI",
    "Feature Engineering",
    "Model Evaluation",
    "Data Processing",
    "FastAPI",
    "React",
    "SQL",
    "Database Systems",
  ],
  email: "gandlachandana12@gmail.com",
  social: {
    github: "https://github.com/chandana365249",
    linkedin: "https://www.linkedin.com/in/chandana-gandla-914314320/",
    leetcode: null,
  },
  resumeUrl: null,
};
