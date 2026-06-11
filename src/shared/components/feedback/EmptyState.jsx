export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-stone-50 px-6 py-12 text-center dark:border-stone-800 dark:bg-stone-900/40">
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">
        {description}
      </p>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
