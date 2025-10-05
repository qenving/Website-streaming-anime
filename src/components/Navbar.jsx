import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, Menu, Sparkles, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ThemeToggle from "./ThemeToggle";
import { useAuthContext } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/genres", label: "Genres" },
  { to: "/community", label: "Community" },
  { to: "/premium", label: "Premium" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, status, logout } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/");
  };

  const isAuthenticated = status === "authenticated" && user;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition dark:border-white/5 dark:bg-midnight/80">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-highlight/20 text-highlight shadow-neon">
            <Sparkles />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-highlight/80">NeonWave</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">Full-stack anime hub</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold uppercase tracking-wide transition hover:text-highlight ${
                  isActive ? "text-highlight" : "text-slate-600 dark:text-gray-300"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
              >
                <User size={16} /> {user.name ?? "Profile"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-white/95 transition dark:border-white/5 dark:bg-midnight/95 lg:hidden"
          >
            <div className="container flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-highlight/10 hover:text-highlight ${
                      isActive ? "bg-highlight/20 text-highlight" : "text-slate-700 dark:text-gray-200"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <LogIn size={16} /> Login / Register
                </Link>
              )}
              <ThemeToggle className="w-full justify-center" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
