import { forwardRef, useId } from "react";
import { cn } from "@shared/utils/cn";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error || hint ? `${textareaId}-message` : undefined}
        className={cn(
          "w-full resize-y rounded-btn border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-500 focus:outline focus:outline-2 focus:outline-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60",
          error &&
            "border-status-cancelled focus:border-status-cancelled focus:outline-status-cancelled/20",
          className,
        )}
        {...props}
      />

      {error || hint ? (
        <p
          id={`${textareaId}-message`}
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

export default Textarea;
