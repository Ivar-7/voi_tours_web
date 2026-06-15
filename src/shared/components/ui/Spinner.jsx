import { cn } from "@shared/utils/cn";

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function Spinner({ size = "md", className, label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent text-brand-500",
        sizes[size] ?? sizes.md,
        className,
      )}
    />
  );
}
