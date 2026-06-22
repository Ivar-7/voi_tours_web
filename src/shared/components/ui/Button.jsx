import { forwardRef } from "react";
import { cn } from "@shared/utils/cn";
import Spinner from "./Spinner";

const variants = {
  primary:
    "bg-brand-600 text-text-inverse hover:bg-brand-700 focus-visible:outline-brand-600 disabled:bg-brand-600/50",
  secondary:
    "bg-surface-raised text-text-primary border border-border hover:bg-border/40 focus-visible:outline-border-strong",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface-raised focus-visible:outline-border-strong",
  danger:
    "bg-status-cancelled text-text-inverse hover:bg-status-cancelled/90 focus-visible:outline-status-cancelled",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
};

const spinnerSizes = { sm: "sm", md: "sm", lg: "md" };

const Button = forwardRef(function Button(
  {
    as: Component = "button",
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    type = "button",
    className,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  // Non-<button> elements (e.g. react-router's <Link>) don't accept a
  // native `disabled`/`type` attribute — fall back to aria-disabled and
  // swallow clicks instead.
  const isButtonTag = Component === "button";

  return (
    <Component
      ref={ref}
      type={isButtonTag ? type : undefined}
      disabled={isButtonTag ? isDisabled : undefined}
      aria-disabled={!isButtonTag && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-btn font-semibold transition-colors duration-150 ease-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        !isButtonTag && isDisabled && "pointer-events-none opacity-60",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size={spinnerSizes[size] ?? "sm"} /> : null}
      {children}
    </Component>
  );
});

export default Button;
