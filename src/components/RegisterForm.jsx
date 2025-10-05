import { useState } from "react";

const RegisterForm = ({ onSubmit, isSubmitting = false, errorMessage = "" }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    plan: "free",
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setValidationError("Please fill out all fields");
      return;
    }
    if (form.password !== form.confirm) {
      setValidationError("Passwords do not match");
      return;
    }
    setValidationError("");
    await onSubmit?.({ name: form.name, email: form.email, password: form.password, plan: form.plan });
  };

  const message = validationError || errorMessage;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Display Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
          placeholder="LunarRift"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
            placeholder="********"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Confirm</label>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
            placeholder="********"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Plan</label>
        <select
          name="plan"
          value={form.plan}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <option value="free">Free Explorer</option>
          <option value="premium">NeonWave Prime</option>
        </select>
      </div>
      {message && <p className="text-xs font-semibold text-red-500 dark:text-red-400">{message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Creating Account" : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
