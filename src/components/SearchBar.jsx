import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  onSearch,
  onChange,
  placeholder = "Search anime, voice actors, or tags",
  defaultValue = "",
  className = "",
  autoFocus = false,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  const handleChange = (event) => {
    const next = event.target.value;
    setValue(next);
    onChange?.(next);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`group flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 backdrop-blur transition focus-within:border-highlight focus-within:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-200 ${className}`.trim()}
    >
      <Search className="h-4 w-4 text-highlight transition group-focus-within:scale-110 group-focus-within:text-highlight" />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-inherit outline-none placeholder:text-slate-400 dark:placeholder:text-gray-500"
        autoFocus={autoFocus}
      />
      <button
        type="submit"
        className="hidden rounded-full bg-highlight px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-highlight/90 md:inline-flex"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
