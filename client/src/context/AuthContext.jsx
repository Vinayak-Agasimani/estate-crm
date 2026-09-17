import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Check existing login
  |--------------------------------------------------------------------------
  */

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      const userData =
        response?.data?.data ||
        response?.data?.user ||
        response?.data;

      setUser(userData || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const userData =
      response?.data?.data ||
      response?.data?.user ||
      response?.data;

    setUser(userData || null);

    return response.data;
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Check authentication when app starts
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| useAuth Hook
|--------------------------------------------------------------------------
*/

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}