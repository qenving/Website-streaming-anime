import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LoginForm, SectionHeading } from "../components";
import SEO from "../components/SEO";
import { useAuthContext } from "../context/AuthContext";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      await queryClient.invalidateQueries();
      navigate("/profile");
    } catch (err) {
      setErrorMessage(err.response?.data?.message ?? "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    await handleSubmit({ email: "demo@neonwave.app", password: "DemoPass123!" });
  };

  return (
    <div className="container grid gap-12 pb-16 pt-8 lg:grid-cols-2">
      <SEO
        title="Login | NeonWave Anime"
        description="Access your NeonWave dashboard to manage favorites, premium perks, and community posts."
        url={`${SITE_URL}/login`}
        keywords={["neonwave login", "anime account", "anime favorites"]}
      />
      <div>
        <SectionHeading title="Welcome back" eyebrow="Login">
          Authenticate against the NeonWave Express API. JWT cookies keep you signed in across tabs while React Query keeps data in sync.
        </SectionHeading>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
          <p>
            Try the seeded demo credentials (<code>demo@neonwave.app</code> / <code>DemoPass123!</code>) or register your own account. Refresh tokens rotate automatically.
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 transition dark:border-white/10 dark:bg-white/5">
        <LoginForm onSubmit={handleSubmit} onGuest={handleGuest} isSubmitting={isSubmitting} errorMessage={errorMessage} />
        <p className="mt-6 text-center text-xs text-slate-600 transition dark:text-gray-400">
          Need an account? <Link to="/register" className="text-highlight">Register free</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
