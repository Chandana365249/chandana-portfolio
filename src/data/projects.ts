/**
 * Featured projects — the single source of truth for every project card and
 * case study. Content is limited to what the resume states; optional fields
 * (links, highlight, facets) render only when present.
 */

export type ProjectId = "resqai" | "neurosense" | "earthquake";

export type ProjectStatus = "in-progress" | "deployed";

/** One node of the interactive architecture diagram in the case study. */
export interface ArchitectureNode {
  label: string;
  /** One-line explanation shown when the node is hovered or focused. */
  detail: string;
}

/** A group of pipeline steps shown on a project card's visual. */
export interface PipelineStage {
  stage: string;
  steps: readonly string[];
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
}

export interface Project {
  id: ProjectId;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  status: ProjectStatus;
  /** Short description for the card. */
  summary: string;
  /** Longer lead paragraph for the case study; falls back to `summary`. */
  overview?: string;
  technologies: readonly string[];
  /** Case-study architecture, in data-flow order. */
  architecture: readonly ArchitectureNode[];
  /** Card visual pipeline, when it differs from the architecture nodes. */
  pipeline?: readonly PipelineStage[];
  /** A verified headline figure, e.g. a reported accuracy. */
  highlight?: { value: string; label: string };
  /** Prediction targets, e.g. the emotion dimensions. */
  targets?: readonly string[];
  /** Model families explored. */
  models?: readonly string[];
  caseStudy: {
    problem?: string;
    approach?: string;
    output: string;
    productLayer?: string;
    built: readonly string[];
    /** Responsible-use caveat shown at the end of the case study. */
    note?: string;
  };
  links: ProjectLinks;
}

export const projectsSection = {
  index: "02",
  eyebrow: "Selected Work",
  title: "Projects built to solve real problems.",
  description:
    "From emergency-response intelligence to EEG-based emotion recognition and time-series prediction, I build systems that connect machine learning with usable software.",
} as const;

/** Ordered by prominence: the first project is featured. */
export const projects: readonly Project[] = [
  {
    id: "resqai",
    number: "01",
    title: "ResQAI",
    subtitle: "AI-Assisted Emergency Response & Decision Support System",
    category: "NLP / Machine Learning",
    status: "in-progress",
    summary:
      "An AI-assisted system that transforms unstructured emergency reports into structured incident information for severity prediction, response prioritization, and resource-matching support.",
    overview:
      "ResQAI is an NLP and machine learning pipeline that converts unstructured emergency reports into structured incident attributes to predict incident severity and response priority — built to support human decision-making, not replace it.",
    technologies: ["Python", "NLP", "Machine Learning", "Feature Engineering", "FastAPI"],
    pipeline: [
      { stage: "Ingest", steps: ["Emergency Report", "NLP Processing", "Structured Incident"] },
      { stage: "Model", steps: ["Feature Engineering", "Severity Model", "Priority Assessment"] },
      { stage: "Act", steps: ["Resource Matching", "Decision Support"] },
    ],
    architecture: [
      { label: "Report", detail: "An unstructured emergency report enters the pipeline as free text." },
      { label: "Parser", detail: "NLP processing extracts structured incident attributes from the report." },
      { label: "Feature Adapter", detail: "Feature engineering turns incident attributes into model-ready inputs." },
      { label: "Severity Model", detail: "A machine learning model predicts incident severity and response priority." },
      { label: "Location / Resource Engine", detail: "Geospatial matching recommends suitable response resources." },
      { label: "Decision Output", detail: "Explainable severity, priority and resource suggestions for a human decision-maker." },
    ],
    caseStudy: {
      problem:
        "Emergency reports are often unstructured, making consistent prioritization difficult.",
      approach:
        "Use NLP, preprocessing, feature engineering, and machine learning to transform reports into structured incident information.",
      output: "Severity and priority predictions with explainable outputs.",
      built: [
        "Data preprocessing and feature engineering for incident attributes",
        "Model training and evaluation for severity prediction",
        "Severity-based prioritization of incidents",
        "Geospatial resource-matching recommendations",
        "A FastAPI backend and an analytics dashboard",
        "Explainable outputs that support human decision-making",
      ],
      note: "A student engineering project in progress — not deployed with emergency services.",
    },
    links: {},
  },
  {
    id: "neurosense",
    number: "02",
    title: "NeuroSense AI",
    subtitle: "EEG-Based Emotion Recognition",
    category: "Deep Learning / Signals",
    status: "in-progress",
    summary:
      "A deep learning pipeline for classifying emotional states from EEG signals using the DEAP dataset.",
    technologies: ["Python", "PyTorch", "TensorFlow", "MNE", "Explainable AI", "FastAPI", "React"],
    targets: ["Valence", "Arousal", "Dominance", "Liking"],
    models: ["CNN", "LSTM", "CNN-LSTM"],
    architecture: [
      { label: "EEG Signal", detail: "EEG recordings from the DEAP dataset are the input." },
      { label: "Preprocessing", detail: "Structured preprocessing prepares the raw signals for modelling." },
      { label: "Representation", detail: "Feature engineering builds model inputs from the processed signals." },
      { label: "CNN / LSTM / CNN-LSTM", detail: "Three model families are compared through iterative evaluation." },
      { label: "Emotion Classification", detail: "Predicts valence, arousal, dominance and liking." },
      { label: "Explainability", detail: "An explainability layer accompanies the predictions." },
      { label: "Web Interface", detail: "A FastAPI backend serves the results to a React interface." },
    ],
    caseStudy: {
      problem:
        "Emotion recognition from EEG signals requires meaningful preprocessing and model design.",
      approach:
        "Use the DEAP dataset with structured preprocessing, feature engineering, and comparison of CNN, LSTM, and CNN-LSTM approaches.",
      output: "Emotion-state predictions with an explainability layer.",
      productLayer: "A FastAPI backend with a React interface.",
      built: [
        "Structured preprocessing of DEAP EEG signals",
        "Feature engineering for model inputs",
        "CNN, LSTM and CNN-LSTM models with iterative evaluation",
        "An explainability layer for predictions",
        "A FastAPI backend and React interface",
      ],
      note: "A research-style student project — not a medical or clinical tool.",
    },
    links: {},
  },
  {
    id: "earthquake",
    number: "03",
    title: "Earthquake Prediction System",
    subtitle: "LSTM-Based Time-Series Prediction",
    category: "Time Series / Deep Learning",
    status: "deployed",
    summary: "Experimental LSTM-based time-series prediction system.",
    technologies: ["LSTM", "Time Series", "Deep Learning"],
    highlight: { value: "~85%", label: "Reported accuracy" },
    architecture: [
      { label: "Historical Data", detail: "Historical records form the input series." },
      { label: "Sequence Preparation", detail: "Data is arranged into ordered sequences for the model." },
      { label: "LSTM", detail: "An LSTM network models patterns across each sequence." },
      { label: "Prediction", detail: "The model outputs a prediction — approximately 85% reported accuracy." },
    ],
    caseStudy: {
      output: "Predictions from an LSTM model, with approximately 85% reported accuracy.",
      built: ["An LSTM-based time-series prediction model", "A deployed version of the system"],
      note: "An experimental project — not a reliable real-world earthquake warning system.",
    },
    links: {},
  },
];
