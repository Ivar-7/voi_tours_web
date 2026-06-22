import { useEffect, useMemo } from "react";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { ThemeContext } from "./ThemeContext";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    "voi-tours-theme",
    getSystemTheme(),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
