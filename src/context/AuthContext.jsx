import { createContext, useContext, useMemo } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext({
  user: null,
  isPremium: false,
  status: "idle",
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  upgrade: async () => {},
  refresh: async () => {},
});

export const AuthProvider = ({ children }) => {
  const { user, isPremium, status, error, login, register, logout, upgrade, refresh } = useAuth();

  const value = useMemo(
    () => ({ user, isPremium, status, error, login, register, logout, upgrade, refresh }),
    [user, isPremium, status, error, login, register, logout, upgrade, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);