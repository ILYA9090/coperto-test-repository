import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent/90",
  secondary:
    "bg-white text-foreground border border-foreground/15 hover:bg-foreground/5",
  ghost: "bg-transparent text-foreground hover:bg-foreground/5",
};

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      <span className={isLoading ? "invisible" : ""}>{children}</span>
      {isLoading && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
    </button>
  );
}
