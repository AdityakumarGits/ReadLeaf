import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bookleaf_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem("bookleaf_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (formData) => {
    const response = await api.post("/auth/login", formData);
    localStorage.setItem("bookleaf_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const signup = async (formData) => {
    const response = await api.post("/auth/signup", formData);
    localStorage.setItem("bookleaf_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("bookleaf_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
