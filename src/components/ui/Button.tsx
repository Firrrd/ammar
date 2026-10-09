import type { ComponentProps } from "react";

type Variant = "outline" | "filled";

type ButtonProps = { variant?: Variant } & (
  | ({ href: string } & ComponentProps<"a">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

const base =
  "slide-btn inline-flex h-8 items-center gap-2 rounded-md border px-3 font-mono text-xs transition duration-300 active:scale-[0.96] active:duration-75 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  outline:
    "border-border bg-surface text-text-secondary [--slide-bg:var(--color-accent)] hover:border-accent hover:text-bg focus-visible:border-accent focus-visible:text-bg",
  filled:
    "border-accent bg-accent font-medium text-bg [--slide-bg:var(--color-surface)] hover:text-text-primary focus-visible:text-text-primary",
};

export function Button({ variant = "outline", className = "", ...props }: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (props.href !== undefined) {
    const external = /^https?:\/\//.test(props.href);
    return (
      <a
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
        className={classes}
      />
    );
  }

  return <button type="button" {...props} className={classes} />;
}
