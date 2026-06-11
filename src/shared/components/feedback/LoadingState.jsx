export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-6 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500 dark:border-stone-800" />
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {message}
        </p>
      </div>
    </div>
  );
}
