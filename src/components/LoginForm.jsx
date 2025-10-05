import { useState } from "react";

const LoginForm = ({ onSubmit, onGuest, defaultValues = {}, isSubmitting = false, errorMessage = "" }) => {
  const [form, setForm] = useState({
    email: defaultValues.email ?? "",
    password: defaultValues.password ?? "",
    remember: defaultValues.remember ?? true,
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setValidationError("Email and password are required");
      return;
    }
    setValidationError("");
    await onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Email</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Password</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
          placeholder="********"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
            className="rounded border-slate-300 text-highlight focus:ring-highlight dark:border-white/20 dark:bg-white/5"
          />
          Remember me
        </label>
        <button type="button" className="text-highlight transition hover:text-highlight/80">
          Forgot password?
        </button>
      </div>
      {(validationError || errorMessage) && (
        <p className="text-xs font-semibold text-red-500 dark:text-red-400">{validationError || errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing In" : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => onGuest?.()}
        disabled={isSubmitting}
        className="w-full rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-highlight hover:text-highlight disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:text-gray-200"
      >
        Enter as Guest
      </button>
    </form>
  );
};

export default LoginForm;
