import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  id: string;
  containerClassName?: string;
};

/** Page section with the standard vertical rhythm and an anchor id for navigation. */
export function Section({ className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn("relative py-section", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
