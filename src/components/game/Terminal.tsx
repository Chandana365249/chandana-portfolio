"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { achievements, coursework, earlierEducation, leadership } from "@/data/achievements";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { navItems } from "@/data/site";
import { skillCategories } from "@/data/skills";
import { celebrate, unlock } from "@/lib/quest";

interface Line {
  id: number;
  kind: "input" | "output";
  content: ReactNode;
}

const PROMPT = "chandana@portfolio:~$";

const Accent = ({ children }: { children: ReactNode }) => <span className="text-accent">{children}</span>;
const Violet = ({ children }: { children: ReactNode }) => <span className="text-violet">{children}</span>;
const Pink = ({ children }: { children: ReactNode }) => <span className="text-pink">{children}</span>;
const Dim = ({ children }: { children: ReactNode }) => (
  <span className="text-foreground-muted">{children}</span>
);

const sectionIds = navItems.map((item) => item.href.slice(1));

const commandHelp: ReadonlyArray<[string, string]> = [
  ["whoami", "who is Chandana?"],
  ["education", "degrees, scores and coursework"],
  ["projects", "what I'm building"],
  ["skills", "my tech stack"],
  ["achievements", "certifications and awards"],
  ["leadership", "Blockchain Club, VIT-AP"],
  ["contact", "how to reach me"],
  ["resume", "open my resume (PDF)"],
  ["neofetch", "system info, portfolio edition"],
  ["cd <section>", "jump to a section, e.g. cd projects"],
  ["clear", "clear the screen"],
];

const secretHelp = "psst… try `sudo hire-me`";

function run(raw: string): { output: ReactNode; clear?: boolean } {
  const input = raw.trim();
  const [cmd = "", ...args] = input.split(/\s+/);
  const command = cmd.toLowerCase();

  switch (command) {
    case "":
      return { output: null };
    case "help":
    case "?":
      return {
        output: (
          <div className="flex flex-col gap-0.5">
            <span>Available commands:</span>
            {commandHelp.map(([name, desc]) => (
              <span key={name}>
                <Accent>{name.padEnd(14, " ")}</Accent>
                <Dim>{desc}</Dim>
              </span>
            ))}
            <Dim>{secretHelp}</Dim>
          </div>
        ),
      };
    case "whoami":
    case "about":
      return {
        output: (
          <span>
            <Pink>{profile.name}</Pink> — CSE (Business Systems) @ {profile.education.universityShort}, CGPA{" "}
            <Accent>{profile.education.cgpa}</Accent>. I build ML and NLP pipelines and the full-stack apps
            around them. Aspiring {profile.careerFocus.join(" / ")}.
          </span>
        ),
      };
    case "education":
      return {
        output: (
          <div className="flex flex-col gap-1">
            <span>
              <Accent>▸</Accent> {profile.education.university} — B.Tech CSE (Business Systems){" "}
              <Dim>{`${profile.education.startYear}–${profile.education.endYear}`}</Dim> · CGPA{" "}
              <Pink>{profile.education.cgpa}</Pink>
            </span>
            {earlierEducation.map((e) => (
              <span key={e.school}>
                <Accent>▸</Accent> {e.school} — {e.level} · <Pink>{e.score}</Pink> <Dim>{e.years}</Dim>
              </span>
            ))}
            <span>
              <Dim>coursework:</Dim> {coursework.join(", ")}
            </span>
          </div>
        ),
      };
    case "projects":
    case "ls":
      if (command === "ls" && args[0] !== "projects") {
        return {
          output: (
            <span>
              {sectionIds.map((id) => (
                <span key={id} className="mr-4">
                  <Violet>{id}/</Violet>
                </span>
              ))}
              <Accent>resume.pdf</Accent>
            </span>
          ),
        };
      }
      return {
        output: (
          <div className="flex flex-col gap-1">
            {projects.map((p) => (
              <span key={p.id}>
                <Accent>{p.number}</Accent> <span className="text-foreground">{p.title}</span>{" "}
                <Dim>— {p.subtitle}</Dim>{" "}
                {p.status === "deployed" ? <Accent>[deployed]</Accent> : <Pink>[in progress]</Pink>}
              </span>
            ))}
            <Dim>tip: `cd projects` to see the case studies</Dim>
          </div>
        ),
      };
    case "skills":
      return {
        output: (
          <div className="flex flex-col gap-1">
            {skillCategories.map((c) => (
              <span key={c.id}>
                <Violet>{c.title.padEnd(22, " ")}</Violet>
                {c.groups.flatMap((g) => g.skills).join(", ")}
              </span>
            ))}
          </div>
        ),
      };
    case "achievements":
    case "awards":
      return {
        output: (
          <div className="flex flex-col gap-1">
            {achievements.map((a) => (
              <span key={a.id}>
                <Pink>★</Pink> <span className="text-foreground">{a.title}</span> <Dim>— {a.issuer}</Dim>
                {a.date && <Dim> · {a.date}</Dim>}
              </span>
            ))}
          </div>
        ),
      };
    case "leadership":
      return {
        output: (
          <div className="flex flex-col gap-1">
            <span>
              <Accent>{leadership.role}</Accent> — {leadership.org} <Dim>{leadership.period}</Dim>
            </span>
            {leadership.points.map((point) => (
              <span key={point}>
                <Dim>•</Dim> {point}
              </span>
            ))}
          </div>
        ),
      };
    case "contact":
    case "socials":
      return {
        output: (
          <div className="flex flex-col gap-0.5">
            <span>
              <Dim>email </Dim>
              <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </span>
            {profile.social.linkedin && (
              <span>
                <Dim>linkedin </Dim>
                <a
                  className="text-violet underline-offset-4 hover:underline"
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.social.linkedin.replace(/^https:\/\/(www\.)?/, "")}
                </a>
              </span>
            )}
            {profile.social.github && (
              <span>
                <Dim>github </Dim>
                <a
                  className="text-pink underline-offset-4 hover:underline"
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.social.github.replace(/^https:\/\//, "")}
                </a>
              </span>
            )}
          </div>
        ),
      };
    case "resume":
    case "cv":
      if (profile.resumeUrl) window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
      return { output: <span>Opening resume.pdf in a new tab… 📄</span> };
    case "linkedin":
    case "github": {
      const href = profile.social[command];
      if (href) window.open(href, "_blank", "noopener,noreferrer");
      return { output: <span>Opening {command}… 🚀</span> };
    }
    case "cd": {
      const target = (args[0] ?? "").replace(/\/$/, "").toLowerCase();
      if (!target || target === "~") return { output: <Dim>you&apos;re already home.</Dim> };
      if (!sectionIds.includes(target)) return { output: <span>cd: no such section: {target}</span> };
      document.getElementById(target)?.scrollIntoView();
      return {
        output: (
          <span>
            Jumping to <Violet>{target}/</Violet>…
          </span>
        ),
      };
    }
    case "neofetch":
      return {
        output: (
          <div className="flex flex-wrap gap-6">
            <pre aria-hidden="true" className="text-gradient leading-tight font-bold">
              {
                "  ██████╗  ██████╗ \n ██╔════╝ ██╔════╝ \n ██║      ██║  ███╗\n ██║      ██║   ██║\n ╚██████╗ ╚██████╔╝\n  ╚═════╝  ╚═════╝ "
              }
            </pre>
            <div className="flex flex-col gap-0.5">
              <span>
                <Pink>chandana</Pink>@<Accent>portfolio</Accent>
              </span>
              <Dim>-----------------</Dim>
              <span>
                <Accent>OS</Accent>: VIT-AP B.Tech CSE (BS)
              </span>
              <span>
                <Accent>Uptime</Accent>: {profile.education.startYear} →{" "}
                {profile.education.expectedGraduation}
              </span>
              <span>
                <Accent>CGPA</Accent>: {profile.education.cgpa}
              </span>
              <span>
                <Accent>Shell</Accent>: Python, TypeScript, C++
              </span>
              <span>
                <Accent>Packages</Accent>: PyTorch, TensorFlow, FastAPI, React
              </span>
              <span>
                <Accent>Certs</Accent>: Azure AZ-900
              </span>
              <span>
                <Accent>Location</Accent>: {profile.location}
              </span>
            </div>
          </div>
        ),
      };
    case "sudo":
      if (args.join(" ").toLowerCase() === "hire-me" || args.join(" ").toLowerCase() === "hire me") {
        unlock("secret");
        celebrate();
        return {
          output: (
            <span>
              <Accent>[sudo]</Accent> permission granted 🎉 Excellent decision. Next step:{" "}
              <a className="text-pink underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </span>
          ),
        };
      }
      return { output: <span>Nice try. This incident will be reported. 👀</span> };
    case "date":
      return { output: <span>{new Date().toString()}</span> };
    case "echo":
      return { output: <span>{args.join(" ")}</span> };
    case "coffee":
      return { output: <span>☕ Brewing… the best models are trained on caffeine.</span> };
    case "rm":
      return { output: <span>Let&apos;s not. 🙅 This portfolio took a while to build.</span> };
    case "exit":
      return {
        output: (
          <span>
            There is no escape. Try <Accent>help</Accent> instead. 😄
          </span>
        ),
      };
    case "clear":
    case "cls":
      return { output: null, clear: true };
    default:
      return {
        output: (
          <span>
            command not found: {command}. Type <Accent>help</Accent> to see what I can do.
          </span>
        ),
      };
  }
}

const completions = [
  ...commandHelp.map(([name]) => name.split(" ")[0]),
  "help",
  "github",
  "linkedin",
  ...sectionIds.map((id) => `cd ${id}`),
];

let nextId = 0;

const welcome: Line[] = [
  {
    id: nextId++,
    kind: "output",
    content: (
      <span>
        Welcome! I&apos;m an interactive terminal. Type <Accent>help</Accent> to start, or click a command
        below. 👇
      </span>
    ),
  },
];

const quickCommands = ["whoami", "projects", "achievements", "neofetch", "sudo hire-me"];

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(welcome);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (text: string) => {
    unlock("terminal");
    const { output, clear } = run(text);
    setHistory((h) => (text.trim() ? [...h, text] : h));
    setCursor(-1);
    setValue("");
    if (clear) {
      setLines([]);
      return;
    }
    setLines((current) => [
      ...current,
      { id: nextId++, kind: "input", content: text },
      ...(output ? [{ id: nextId++, kind: "output" as const, content: output }] : []),
    ]);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit(value);
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown" && cursor !== -1) {
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === "Tab" && value.trim()) {
      const match = completions.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match) {
        event.preventDefault();
        setValue(match);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      data-spotlight
      className="relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-border-strong bg-[#070a0f]/95 shadow-[0_30px_80px_-40px_rgb(56_189_248/0.5)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="size-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="size-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-meta text-foreground-muted">chandana — zsh</span>
      </div>

      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-80 flex-1 cursor-text overflow-y-auto p-4 font-mono text-meta leading-relaxed text-foreground-secondary sm:h-96"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output" className="flex flex-col gap-2">
          {lines.map((line) =>
            line.kind === "input" ? (
              <div key={line.id}>
                <span className="text-pink">{PROMPT}</span>{" "}
                <span className="text-foreground">{line.content}</span>
              </div>
            ) : (
              <div key={line.id} className="break-words whitespace-pre-wrap">
                {line.content}
              </div>
            ),
          )}
        </div>
        <label className="mt-2 flex items-center gap-2">
          <span className="shrink-0 text-pink">{PROMPT}</span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full min-w-0 bg-transparent text-foreground caret-accent outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border p-3">
        {quickCommands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              submit(command);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="rounded-md border border-border bg-background/50 px-2.5 py-1 font-mono text-eyebrow text-foreground-secondary transition-colors hover:border-accent/50 hover:text-foreground"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
