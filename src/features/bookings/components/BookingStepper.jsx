import { Check } from "lucide-react";
import { cn } from "@shared/utils/cn";

const DEFAULT_STEPS = ["Details", "Review", "Confirm"];

/**
 * @param {{ currentStep: 1|2|3, steps?: string[] }} props
 */
export default function BookingStepper({ currentStep, steps = DEFAULT_STEPS }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isComplete &&
                    "border-brand-600 bg-brand-600 text-text-inverse",
                  isActive &&
                    "border-brand-600 text-brand-600 dark:text-brand-400",
                  !isComplete && !isActive && "border-border text-text-muted",
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-text-primary" : "text-text-muted",
                )}
              >
                {label}
              </span>
            </div>

            {stepNumber < steps.length ? (
              <span
                className={cn(
                  "h-px flex-1",
                  isComplete ? "bg-brand-600" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
