import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterForm, SectionHeading } from "../components";
import SEO from "../components/SEO";
import { useAuthContext } from "../context/AuthContext";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const RegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, upgrade } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      await queryClient.invalidateQueries();
      navigate("/profile");
    } catch (err) {
      setErrorMessage(err.response?.data?.message ?? "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container grid gap-12 pb-16 pt-8 lg:grid-cols-2">
      <SEO
        title="Create NeonWave Account"
        description="Register for NeonWave to save favorites, unlock premium previews, and join community discussions."
        url={`${SITE_URL}/register`}
        keywords={["neonwave register", "anime signup", "anime account"]}
      />
      <div>
        <SectionHeading title="Create your NeonWave ID" eyebrow="Register">
          Accounts are persisted via the Express API. Swap in your billing provider to provision Prime upgrades instantly.
        </SectionHeading>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
          <p>
            Passwords are hashed with bcrypt before storage. Update the auth service or integrate OAuth providers without touching the UI.
          </p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 transition dark:border-white/10 dark:bg-white/5">
        <RegisterForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
        <p className="mt-6 text-center text-xs text-slate-600 transition dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-highlight">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
