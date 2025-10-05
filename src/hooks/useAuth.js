import { useCallback, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  refreshSession,
  registerRequest,
  upgradeAccount,
} from "../utils/api";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const bootstrap = useCallback(async () => {
    setStatus("loading");
    try {
      await refreshSession();
      const current = await fetchCurrentUser();
      setUser(current);
      setIsPremium(current?.isPremium ?? false);
      setStatus("authenticated");
    } catch (err) {
      setUser(null);
      setIsPremium(false);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async ({ email, password }) => {
    setStatus("loading");
    setError(null);
    try {
      const { user: nextUser } = await loginRequest({ email, password });
      setUser(nextUser);
      setIsPremium(nextUser?.isPremium ?? false);
      setStatus("authenticated");
      return nextUser;
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.message ?? "Unable to login");
      setStatus("anonymous");
      throw err;
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setStatus("loading");
    setError(null);
    try {
      const { user: nextUser } = await registerRequest({ name, email, password });
      setUser(nextUser);
      setIsPremium(nextUser?.isPremium ?? false);
      setStatus("authenticated");
      return nextUser;
    } catch (err) {
      console.error("Registration failed", err);
      setError(err.response?.data?.message ?? "Unable to register");
      setStatus("anonymous");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsPremium(false);
      setStatus("anonymous");
    }
  }, []);

  const upgrade = useCallback(async () => {
    if (!user) return null;
    try {
      const next = await upgradeAccount();
      setUser(next);
      setIsPremium(true);
      return next;
    } catch (err) {
      console.error("Upgrade failed", err);
      throw err;
    }
  }, [user]);

  return {
    user,
    isPremium,
    status,
    error,
    login,
    register,
    logout,
    upgrade,
    refresh: bootstrap,
  };
};

export default useAuth;
