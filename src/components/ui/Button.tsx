import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "text";

const base =
  "group inline-flex items-center justify-center gap-2 font-medium text-nav whitespace-nowrap " +
  "transition-[color,background-color,border-color,transform,box-shadow] duration-300 ease-smooth " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "min-h-11 rounded-full px-5 bg-brand text-accent-foreground font-semibold " +
    "shadow-[0_8px_28px_-10px_rgb(167_139_250/0.7)] hover:shadow-[0_10px_36px_-8px_rgb(244_114_182/0.6)] " +
    "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
  secondary:
    "min-h-11 rounded-full px-5 border border-border-strong bg-surface text-foreground " +
    "hover:border-foreground-muted hover:bg-surface-elevated active:scale-[0.98]",
  text: "min-h-11 px-1 text-foreground-secondary hover:text-foreground",
};

interface SharedProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof SharedProps> & { href: string };

type NativeButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & { href?: never };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

/** App routes go through next/link; anchors, files and other schemes use a plain <a>. */
const isAppRoute = (href: string) => href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);

/**
 * Renders a link when `href` is given, otherwise a native <button>,
 * so semantics always match behaviour.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as LinkButtonProps;

    if (isAppRoute(href)) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {children}
        </Link>
      );
    }

    const opensNewTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(opensNewTab && { target: "_blank", rel: "noopener noreferrer" })}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
