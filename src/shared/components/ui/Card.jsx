import { cn } from "@shared/utils/cn";

const variants = {
  default: "bg-surface border border-border",
  elevated: "bg-surface border border-border shadow-card",
  outlined: "bg-transparent border border-border-strong",
};

export default function Card({
  children,
  variant = "default",
  hover = false,
  as: Component = "div",
  className,
  ...props
}) {
  return (
    <Component
      className={cn(
        "rounded-card p-card-p text-text-primary",
        variants[variant] ?? variants.default,
        hover &&
          "transition-shadow duration-200 ease-smooth hover:shadow-card-hover",
        (Component === "a" || Component === "button") &&
          "block w-full text-left cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
