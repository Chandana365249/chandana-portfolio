/*
 * A deliberately tiny, rule-based stand-in for the ResQAI idea, so visitors can
 * play with "unstructured report → structured incident → severity" in the
 * browser. It is NOT the real ResQAI model: just weighted keywords, a few
 * regexes and transparent scoring, which also makes every output explainable.
 */

export type IncidentType = "Fire" | "Medical" | "Road accident" | "Flood" | "Structural" | "Violence";

export type Severity = "Low" | "Moderate" | "High" | "Critical";

export interface Signal {
  /** The matched text, as it appears in the report. */
  match: string;
  reason: string;
  weight: number;
}

export interface TriageResult {
  types: IncidentType[];
  people: number | null;
  vulnerable: boolean;
  score: number;
  severity: Severity;
  priority: "P4" | "P3" | "P2" | "P1";
  resources: string[];
  signals: Signal[];
}

interface Rule {
  pattern: RegExp;
  type?: IncidentType;
  weight: number;
  reason: string;
}

const rules: Rule[] = [
  { pattern: /\b(fire|flames?|burning|blaze)\b/gi, type: "Fire", weight: 22, reason: "fire reported" },
  { pattern: /\b(smoke|smoky)\b/gi, type: "Fire", weight: 10, reason: "smoke" },
  {
    pattern: /\b(explosion|exploded|blast|gas leak)\b/gi,
    type: "Fire",
    weight: 28,
    reason: "explosion / gas hazard",
  },
  {
    pattern: /\b(unconscious|not breathing|cardiac|heart attack|stroke|seizure)\b/gi,
    type: "Medical",
    weight: 30,
    reason: "life-threatening symptom",
  },
  {
    pattern: /\b(bleeding|blood|injur(?:ed|y|ies)|wounded|fracture|broken)\b/gi,
    type: "Medical",
    weight: 14,
    reason: "injuries",
  },
  {
    pattern: /\b(collapsed|fainted|dizzy|chest pain)\b/gi,
    type: "Medical",
    weight: 18,
    reason: "medical distress",
  },
  {
    pattern: /\b(crash|collision|accident|overturned|hit by)\b/gi,
    type: "Road accident",
    weight: 18,
    reason: "road incident",
  },
  {
    pattern: /\b(flood(?:ing|ed)?|water rising|submerged|drowning)\b/gi,
    type: "Flood",
    weight: 22,
    reason: "flooding / drowning",
  },
  {
    pattern: /\b(building collapse|collapse[ds]?|caved in|rubble|crack(?:s|ed)? in)\b/gi,
    type: "Structural",
    weight: 24,
    reason: "structural failure",
  },
  {
    pattern: /\b(gun|shot|shooting|knife|stabbed|attack(?:ed)?|assault|robbery)\b/gi,
    type: "Violence",
    weight: 26,
    reason: "violence or weapon",
  },
  { pattern: /\b(trapped|stuck|can't get out|pinned)\b/gi, weight: 18, reason: "people trapped" },
  {
    pattern: /\b(child(?:ren)?|kids?|baby|infant|elderly|old (?:man|woman)|pregnant)\b/gi,
    weight: 10,
    reason: "vulnerable people",
  },
  {
    pattern: /\b(spreading|getting worse|rapidly|urgent|immediately|help)\b/gi,
    weight: 6,
    reason: "escalating / urgent language",
  },
  {
    pattern: /\b(minor|small|no one (?:is )?hurt|nobody (?:is )?hurt|under control|contained)\b/gi,
    weight: -14,
    reason: "de-escalating language",
  },
];

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  several: 4,
  many: 8,
  dozens: 24,
  multiple: 3,
};

const peoplePattern =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|several|many|dozens|multiple)\s+(?:\w+\s)?(people|persons|victims|passengers|residents|students|workers|children|kids|injured|families)\b/gi;

const resourcesByType: Record<IncidentType, string[]> = {
  Fire: ["🚒 Fire brigade", "🚑 Ambulance"],
  Medical: ["🚑 Ambulance"],
  "Road accident": ["🚑 Ambulance", "🚓 Traffic police"],
  Flood: ["🛟 Rescue team", "🚑 Ambulance"],
  Structural: ["🏗️ Search & rescue", "🚒 Fire brigade", "🚑 Ambulance"],
  Violence: ["🚓 Police", "🚑 Ambulance"],
};

export const sampleReports = [
  "There's a fire in the apartment building on 5th street, smoke is spreading fast and two children are trapped on the third floor!",
  "Car crash near the highway exit, one person is bleeding and the other driver seems unconscious.",
  "Small kitchen fire at the cafe, it's already under control and no one is hurt.",
  "Water rising quickly in our colony after the heavy rain, several elderly residents can't get out of their homes.",
] as const;

export function triage(report: string): TriageResult {
  const signals: Signal[] = [];
  const typeScores = new Map<IncidentType, number>();

  for (const rule of rules) {
    for (const match of report.matchAll(rule.pattern)) {
      signals.push({ match: match[0], reason: rule.reason, weight: rule.weight });
      if (rule.type) typeScores.set(rule.type, (typeScores.get(rule.type) ?? 0) + rule.weight);
    }
  }

  let people: number | null = null;
  for (const match of report.matchAll(peoplePattern)) {
    const raw = match[1].toLowerCase();
    const n = Number.isNaN(Number(raw)) ? (numberWords[raw] ?? 1) : Number(raw);
    people = Math.max(people ?? 0, n);
  }
  if (people !== null && people > 1) {
    const weight = Math.min(20, Math.round(Math.log2(people) * 6));
    signals.push({ match: `${people} people`, reason: "multiple people affected", weight });
  }

  const vulnerable = signals.some((s) => s.reason === "vulnerable people");
  const raw = signals.reduce((sum, s) => sum + s.weight, 0);
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const severity: Severity =
    score >= 70 ? "Critical" : score >= 45 ? "High" : score >= 20 ? "Moderate" : "Low";
  const priority = ({ Critical: "P1", High: "P2", Moderate: "P3", Low: "P4" } as const)[severity];

  const types = [...typeScores]
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);

  const resources = [...new Set(types.flatMap((t) => resourcesByType[t]))];

  return { types, people, vulnerable, score, severity, priority, resources, signals };
}

/** Splits the report into plain and highlighted chunks for display. */
export function highlight(report: string, signals: readonly Signal[]) {
  const terms = [...new Set(signals.map((s) => s.match.toLowerCase()))].filter((t) => !/\d+ people/.test(t));
  if (terms.length === 0) return [{ text: report, signal: null as Signal | null }];
  const escaped = terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  const splitter = new RegExp(`(${escaped.join("|")})`, "gi");
  return report
    .split(splitter)
    .filter(Boolean)
    .map((text) => ({
      text,
      signal: signals.find((s) => s.match.toLowerCase() === text.toLowerCase()) ?? null,
    }));
}
