import { useState } from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@shared/utils/cn";

const variants = {
  info: {
    wrapper:
      "bg-accent-50 border-accent-400/30 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400",
    icon: Info,
  },
  success: {
    wrapper:
      "bg-status-completed/10 border-status-completed/30 text-status-completed",
    icon: CheckCircle2,
  },
  warning: {
    wrapper:
      "bg-status-pending/10 border-status-pending/30 text-status-pending",
    icon: AlertTriangle,
  },
  error: {
    wrapper:
      "bg-status-cancelled/10 border-status-cancelled/30 text-status-cancelled",
    icon: XCircle,
  },
};

export default function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}) {
  const [dismissed, setDismissed] = useState(false);
  const config = variants[variant] ?? variants.info;
  const Icon = config.icon;

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-card border px-4 py-3.5 text-sm",
        config.wrapper,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 text-text-primary">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? (
          <div className="text-text-secondary">{children}</div>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-0.5 text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
