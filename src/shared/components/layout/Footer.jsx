import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/packages', label: 'Packages' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/inquiry', label: 'Inquiry' },
];

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 px-6 py-12 text-stone-50 dark:border-stone-800 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/40 bg-amber-600/20">
                <svg
                  className="h-5 w-5 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    strokeLinecap="round"
                  />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round" />
                  <path d="M9 9h.01M15 9h.01" strokeLinecap="round" strokeWidth="2.5" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-sm font-bold">Savanna Crown</p>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70">
                  Tours & Travel
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-400">
              Voi Town, Taita Taveta County, Kenya. Tailor-made safaris, transfers,
              beach escapes, and group travel plans with a warm local touch.
            </p>
            <p className="mt-2 text-xs text-stone-500">info@savannacrowntours.com</p>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-stone-400 transition-colors hover:text-amber-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">
              Contact
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-stone-400">
              <span>Voi Town, Taita Taveta County</span>
              <a
                href="mailto:info@savannacrowntours.com"
                className="hover:text-amber-400"
              >
                info@savannacrowntours.com
              </a>
              <a href="tel:+254700000000" className="hover:text-amber-400">
                +254 700 000 000
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800 pt-8">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} Savanna Crown Tours & Travel. All rights reserved.
          </p>
          <p className="text-xs text-stone-700">Designed in Voi Town</p>
        </div>
      </div>
    </footer>
  );
}
