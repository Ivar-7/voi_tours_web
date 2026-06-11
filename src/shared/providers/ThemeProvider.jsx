import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const isDark = storedTheme
      ? storedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return children;
}
