import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, UserCircle2, X } from "lucide-react";

import { useAuth } from "@features/auth/hooks/useAuth";
import { logout } from "@features/auth/api/auth.api";
import { ThemeToggle } from "@shared/components/ui";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/destinations", label: "Destinations" },
  { to: "/packages", label: "Packages" },
  { to: "/reviews", label: "Reviews" },
  { to: "/inquiry", label: "Inquiry" },
];

function navLinkClass({ isActive }) {
  return [
    "text-sm font-medium transition-colors",
    isActive
      ? "text-amber-600 dark:text-amber-400"
      : "text-stone-700 hover:text-amber-600 dark:text-stone-300 dark:hover:text-amber-300",
  ].join(" ");
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const initials = useMemo(() => {
    const name = user?.full_name || user?.email || "Guest";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/85 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-500/20 bg-amber-600/10 text-amber-600 dark:text-amber-300">
            <svg
              className="h-5 w-5"
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
              <path
                d="M9 9h.01M15 9h.01"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
          </span>

          <div className="leading-tight">
            <p className="font-serif text-sm font-bold tracking-wide text-stone-950 dark:text-white">
              Savanna Crown
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-amber-700 dark:text-amber-300/80">
              Tours & Travel
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hidden rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700 dark:border-stone-800 dark:text-stone-300 dark:hover:text-amber-300 md:inline-flex"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400 md:inline-flex"
              >
                Logout
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                {initials || <UserCircle2 className="h-5 w-5" />}
              </div>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="hidden rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400 md:inline-flex"
            >
              Login
            </Link>
          )}

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:text-stone-200 dark:hover:bg-stone-900 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-950 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-amber-700 dark:text-stone-300 dark:hover:bg-stone-900 dark:hover:text-amber-300"
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-amber-400"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
