import { Reveal } from "@/components/motion/Reveal";
import { Terminal } from "@/components/game/Terminal";
import { TriageDemo } from "@/components/game/TriageDemo";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { playgroundSection } from "@/data/playground";

const HEADING_ID = "playground-title";

export function Playground() {
  return (
    <Section id="playground" aria-labelledby={HEADING_ID}>
      <Reveal>
        <SectionHeading
          id={HEADING_ID}
          index={playgroundSection.index}
          eyebrow={playgroundSection.eyebrow}
          title={playgroundSection.title}
          description={playgroundSection.description}
        />
      </Reveal>

      <div className="mt-stack grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal>
          <Terminal />
        </Reveal>
        <Reveal delay={0.1}>
          <TriageDemo />
        </Reveal>
      </div>
    </Section>
  );
}
