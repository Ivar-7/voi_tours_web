import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          404
        </p>
        <h1 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          The page you requested does not exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-400"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
