import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  isAuthenticated as hasStoredAuth,
  login as authLogin,
  logout as authLogout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const authenticated = hasStoredAuth();

    setUser(storedUser);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  async function login(usernameOrEmail, password) {
    const session = await authLogin(usernameOrEmail, password);
    setUser(session.user);
    setIsAuthenticated(true);
    return session;
  }

  function logout() {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb des AuthProvider verwendet werden");
  }
  return context;
}
