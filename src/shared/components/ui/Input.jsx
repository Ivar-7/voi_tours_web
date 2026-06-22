import { forwardRef, useId } from "react";
import { cn } from "@shared/utils/cn";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    suffixIcon,
    className,
    id,
    type = "text",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            {icon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          className={cn(
            "h-11 w-full rounded-btn border border-border bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60",
            icon && "pl-10",
            suffixIcon && "pr-10",
            error && "border-status-cancelled focus:border-status-cancelled focus:outline-status-cancelled/20",
            className,
          )}
          {...props}
        />

        {suffixIcon ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            {suffixIcon}
          </span>
        ) : null}
      </div>

      {error || hint ? (
        <p
          id={`${inputId}-message`}
          className={cn(
            "mt-1.5 text-xs",
            error ? "text-status-cancelled" : "text-text-muted",
          )}
        >
          {error || hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
