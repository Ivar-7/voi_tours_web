import { cn } from "@shared/utils/cn";

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

function SkeletonBlock({ className, height, rounded, width }) {
  return (
    <span
      aria-hidden="true"
      style={{ height, width }}
      className={cn(
        "block animate-pulse bg-border/70 dark:bg-border-strong/60",
        roundedClasses[rounded] ?? roundedClasses.md,
        className,
      )}
    />
  );
}

export default function Skeleton({
  className,
  count = 1,
  height,
  rounded = "md",
  width,
}) {
  if (count <= 1) {
    return (
      <SkeletonBlock
        className={className}
        height={height}
        rounded={rounded}
        width={width}
      />
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock
          key={index}
          className={className}
          height={height}
          rounded={rounded}
          width={width}
        />
      ))}
    </div>
  );
}
