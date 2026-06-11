import { Link } from "react-router-dom";

function getMessage(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return "Something went wrong.";
}

export default function ErrorHandler({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-300">
        Error
      </p>
      <h3 className="mt-2 text-lg font-semibold">
        We could not load this content
      </h3>
      <p className="mt-2 text-sm leading-6 text-red-800/90 dark:text-red-100/90">
        {getMessage(error)}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            Try again
          </button>
        ) : null}
        <Link
          to="/"
          className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:text-red-100 dark:hover:bg-red-900/30"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
