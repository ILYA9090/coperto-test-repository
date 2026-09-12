import type { HTMLAttributes } from "react";

type BadgeVariant = "neutral" | "stopped";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-foreground/10 text-foreground",
  stopped: "bg-accent/10 text-accent",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
