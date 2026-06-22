import { useContext } from "react";
import { ThemeContext } from "@shared/providers/ThemeContext";

/**
 * @returns {{ theme: "light"|"dark", setTheme: Function, toggleTheme: () => void }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
