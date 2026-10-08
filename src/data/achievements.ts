/**
 * Achievements, certifications, leadership and earlier education — all taken
 * verbatim from the resume. Used by the Achievements section, the Journey
 * timeline and the terminal.
 */

export type AchievementKind = "certification" | "award" | "academic" | "community";

export interface Achievement {
  id: string;
  kind: AchievementKind;
  /** The big figure on the card front. */
  stat: string;
  statLabel: string;
  title: string;
  issuer: string;
  /** Revealed when the card is flipped. */
  detail: string;
  date?: string;
  credentialId?: string;
}

export const achievementsSection = {
  index: "05",
  eyebrow: "Achievements",
  title: "Proof, not just promises.",
  description: "Certifications, awards and leadership. Flip a card to see the story behind each number.",
} as const;

export const achievements: readonly Achievement[] = [
  {
    id: "az-900",
    kind: "certification",
    stat: "AZ-900",
    statLabel: "Microsoft Certified",
    title: "Azure Fundamentals",
    issuer: "Microsoft",
    detail: "Microsoft Certified: Azure Fundamentals, covering cloud concepts and core Azure services.",
    date: "August 2026",
    credentialId: "54B50F6CF6CF104D",
  },
  {
    id: "academic-excellence",
    kind: "award",
    stat: "Top 10",
    statLabel: "In the department",
    title: "Student Academic Excellence Award",
    issuer: "VIT-AP University",
    detail:
      "Awarded for outstanding academic performance, placing in the top 10 of the department with a 9.41/10 CGPA.",
  },
  {
    id: "district-rank",
    kind: "academic",
    stat: "465/470",
    statLabel: "Intermediate (MPC)",
    title: "District top rank",
    issuer: "Nucleus Junior College, Nandyal",
    detail:
      "Achieved a district top rank of 465/470 in Intermediate (MPC), reflecting consistent academic excellence.",
  },
  {
    id: "blockchain-member",
    kind: "community",
    stat: "Certified",
    statLabel: "Club member",
    title: "Certified Member, Blockchain Club",
    issuer: "VIT-AP",
    detail: "Awarded for active contribution and for developing the club's website.",
  },
];

export const leadership = {
  role: "Technical Lead & Event Management Lead",
  org: "Blockchain Club, VIT-AP",
  period: "2024 – Present",
  stats: [
    { value: 15, suffix: "+", label: "Technical webinars hosted" },
    { value: 2, suffix: "", label: "Hackathons directed" },
    { value: 1, suffix: "", label: "Club website built & maintained" },
  ],
  points: [
    "Led the technical team; designed, developed and maintained the official club website used for member sign-ups and event announcements.",
    "Organized and hosted 15+ technical webinars, coordinating speakers, scheduling, promotion and participant communication.",
    "Directed end-to-end execution of 2 hackathons, managing volunteer teams, judging logistics and participant support.",
  ],
} as const;

export const earlierEducation = [
  {
    school: "Nucleus Junior College, Nandyal",
    level: "Intermediate (MPC)",
    score: "96.2%",
    years: "2021 – 2023",
  },
  { school: "Good Shepherd English Medium School, Nandyal", level: "SSC", score: "94%", years: "2021" },
] as const;

export const coursework = [
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Financial Management",
  "Business Strategy",
] as const;
