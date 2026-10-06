import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("pms_user") || "null"));
  const [loading, setLoading] = useState(false);

  const save = (data) => {
    localStorage.setItem("pms_token", data.token);
    localStorage.setItem("pms_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (form) => {
    setLoading(true);
    try { const { data } = await api.post("/auth/login", form); save(data); return data.user; }
    finally { setLoading(false); }
  };

  const register = async (form) => {
    setLoading(true);
    try { const { data } = await api.post("/auth/register", form); save(data); return data.user; }
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("pms_token");
    localStorage.removeItem("pms_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
