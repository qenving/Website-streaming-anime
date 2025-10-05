import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFooterContent } from "../utils/apiPlaceholders";

const Footer = () => {
  const {
    data: content,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["content", "footer"],
    queryFn: fetchFooterContent,
  });

  const productLinks = content?.product ?? [];
  const companyLinks = content?.company ?? [];
  const connectLinks = content?.connect ?? [];

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white transition dark:border-white/5 dark:bg-midnight-700/40">
      <div className="container grid gap-12 py-12 text-slate-700 transition dark:text-gray-300 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">NeonWave</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Crafted for fans who vibe with synthwave nights and lightning-fast watchlists. Drop in your APIs and ship your anime
            universe.
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-500">(c) {new Date().getFullYear()} NeonWave Labs. Production-ready
            scaffolding for indie streaming teams.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-300">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-gray-400">
            {isLoading && productLinks.length === 0 && (
              <li className="text-xs text-slate-400 dark:text-gray-500">Loading links...</li>
            )}
            {productLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="transition hover:text-highlight">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-300">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-gray-400">
            {isLoading && companyLinks.length === 0 && (
              <li className="text-xs text-slate-400 dark:text-gray-500">Loading links...</li>
            )}
            {companyLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className="transition hover:text-highlight">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-300">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-gray-400">
            {isError && (
              <li className="text-xs text-red-500 dark:text-red-400">
                {error?.response?.data?.message ?? "Unable to load links"}
              </li>
            )}
            {!isError && isLoading && connectLinks.length === 0 && (
              <li className="text-xs text-slate-400 dark:text-gray-500">Loading links...</li>
            )}
            {!isError &&
              connectLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="transition hover:text-highlight">
                    {item.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
