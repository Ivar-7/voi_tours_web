import Spinner from "@shared/components/ui/Spinner";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-6 text-text-primary">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-text-muted">{message}</p>
      </div>
    </div>
  );
}
