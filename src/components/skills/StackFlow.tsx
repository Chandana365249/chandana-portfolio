import type { CSSProperties } from "react";
import { stackLayers } from "@/data/skills";
import { cn } from "@/lib/utils";

/**
 * "How the pieces connect": the conceptual layers of a complete ML
 * application, with representative technologies under each. Vertical on
 * mobile, horizontal from `lg`; connectors draw in when revealed.
 */
export function StackFlow() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-title font-semibold">How the pieces connect.</h3>
        <p className="text-meta text-foreground-muted">
          A conceptual map of the stack — not every tool is used in every project.
        </p>
      </div>

      <ol className="grid gap-6 lg:grid-cols-6 lg:gap-6">
        {stackLayers.map((layer, i) => {
          const last = i === stackLayers.length - 1;
          const lineDelay = { "--line-delay": `${0.3 + i * 0.12}s` } as CSSProperties;
          return (
            <li key={layer.layer} className="relative flex flex-col gap-2 pl-8 lg:pt-8 lg:pl-0">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1 left-0 size-2.5 rounded-full border lg:top-0",
                  last ? "border-accent bg-accent" : "border-accent/70 bg-background",
                )}
              />
              {!last && (
                <>
                  <span
                    aria-hidden="true"
                    style={lineDelay}
                    className="reveal-line-y absolute top-5 -bottom-5 left-[4.5px] w-px bg-linear-to-b from-accent/40 to-violet/40 lg:hidden"
                  />
                  <span
                    aria-hidden="true"
                    style={lineDelay}
                    className="reveal-line-x absolute top-[4.5px] -right-6 left-5 hidden h-px bg-linear-to-r from-accent/40 to-violet/40 lg:block"
                  />
                </>
              )}
              <span className="eyebrow text-accent/90">
                <span className="text-foreground-muted">{String(i + 1).padStart(2, "0")} </span>
                {layer.layer}
              </span>
              <span className="text-meta text-foreground-secondary">{layer.skills.join(" · ")}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
