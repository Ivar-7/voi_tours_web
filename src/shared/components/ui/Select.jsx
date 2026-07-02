import { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@shared/utils/cn";

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || hint ? `${selectId}-message` : undefined}
          className={cn(
            "h-11 w-full appearance-none rounded-btn border border-border bg-surface px-3.5 pr-10 text-sm text-text-primary transition-colors focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60",
            error &&
              "border-status-cancelled focus:border-status-cancelled focus:outline-status-cancelled/20",
            className,
          )}
          {...props}
        >
          {placeholder ? (
            <option
              value=""
              disabled
              hidden
              className="bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100"
            >
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-text-muted" />
      </div>

      {error || hint ? (
        <p
          id={`${selectId}-message`}
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

export default Select;
