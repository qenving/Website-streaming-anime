import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200 ${className}`.trim()}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span className="hidden md:inline">{isDark ? "Light" : "Dark"} Mode</span>
    </button>
  );
};

export default ThemeToggle;
