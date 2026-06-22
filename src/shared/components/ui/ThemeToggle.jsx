import { Moon, Sun } from "lucide-react";
import { useTheme } from "@shared/hooks/useTheme";
import { cn } from "@shared/utils/cn";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary",
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
