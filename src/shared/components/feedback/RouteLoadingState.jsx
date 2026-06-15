import Spinner from "@shared/components/ui/Spinner";
import Skeleton from "@shared/components/ui/Skeleton";
import { cn } from "@shared/utils/cn";

const variantCopy = {
  public: "Preparing the next page...",
  dashboard: "Loading your workspace...",
  admin: "Loading management tools...",
  auth: "Loading secure access...",
};

const variantStyles = {
  public: "min-h-[70dvh] bg-surface text-text-primary",
  dashboard: "min-h-[28rem] bg-transparent text-text-primary",
  admin: "dark min-h-[28rem] bg-transparent text-stone-50",
  auth: "min-h-[24rem] bg-transparent text-text-primary",
};

function PublicSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5">
        <Skeleton className="h-5 w-28" rounded="full" />
        <Skeleton className="h-12 w-11/12 max-w-2xl" rounded="lg" />
        <Skeleton className="h-12 w-3/4 max-w-xl" rounded="lg" />
        <Skeleton count={3} className="h-4 max-w-2xl" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32" rounded="full" />
          <Skeleton className="h-11 w-28" rounded="full" />
        </div>
      </div>
      <Skeleton className="h-72 w-full" rounded="lg" />
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" rounded="full" />
          <Skeleton className="h-9 w-64" rounded="lg" />
        </div>
        <Skeleton className="h-10 w-36" rounded="full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" rounded="lg" />
        <Skeleton className="h-28" rounded="lg" />
        <Skeleton className="h-28" rounded="lg" />
      </div>
      <Skeleton className="h-72" rounded="lg" />
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <Skeleton className="h-8 w-48" rounded="lg" />
      <Skeleton className="h-4 w-64" rounded="full" />
      <div className="space-y-4 pt-3">
        <Skeleton className="h-11" rounded="lg" />
        <Skeleton className="h-11" rounded="lg" />
        <Skeleton className="h-11 w-36" rounded="full" />
      </div>
    </div>
  );
}

export default function RouteLoadingState({ message, variant = "public" }) {
  const resolvedMessage = message ?? variantCopy[variant] ?? variantCopy.public;
  const isWorkspace = variant === "dashboard" || variant === "admin";

  return (
    <div
      className={cn(
        "flex w-full items-center px-section-x py-section-y",
        variantStyles[variant] ?? variantStyles.public,
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center gap-3 text-sm font-medium text-text-muted dark:text-stone-400">
          <Spinner size="sm" />
          <span>{resolvedMessage}</span>
        </div>
        {variant === "auth" ? (
          <AuthSkeleton />
        ) : isWorkspace ? (
          <WorkspaceSkeleton />
        ) : (
          <PublicSkeleton />
        )}
      </div>
    </div>
  );
}
