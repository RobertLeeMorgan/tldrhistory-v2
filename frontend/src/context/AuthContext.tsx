import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";

interface AuthState {
  token: string | null;
  id: string | null;
  username: string | null;
  role: string | null;
}

interface AuthContextType {
  isAuth: AuthState;
  login: (
    token: string,
    user: { id: string; username: string; role: string },
  ) => void;
  logout: (expired?: boolean) => void;
  loading: boolean;
  verifyToken: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<AuthState>({
    token: null,
    id: null,
    username: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const hasLoggedOut = useRef(false);

  function getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && id && username && role && expiresAt) {
      if (Date.now() <= Number(expiresAt)) {
        setIsAuth({ token, id, username, role });
      } else {
        logout(true);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleAutoLogout = () => {
      logout(true);
    };

    window.addEventListener("auth:logout", handleAutoLogout);
    return () => window.removeEventListener("auth:logout", handleAutoLogout);
  }, []);

  function login(
    token: string,
    user: { id: string; username: string; role: string },
  ) {
    hasLoggedOut.current = false;
    const expiresAt = getTokenExpiry(token);

    if (!expiresAt) {
      logout(true);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("id", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    localStorage.setItem("expiresAt", expiresAt.toString());

    setIsAuth({
      token,
      id: user.id,
      username: user.username,
      role: user.role,
    });

    addToast({ message: "Welcome back!", type: "success" });
  }

  function logout(expired = false) {
    if (expired && hasLoggedOut.current) return;

    if (expired) {
      hasLoggedOut.current = true;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresAt");

    setIsAuth({
      token: null,
      id: null,
      username: null,
      role: null,
    });

    if (expired) {
      addToast({
        message: "Session expired, please log in again.",
        type: "error",
      });
    }
  }

  function verifyToken(): boolean {
    const expiresAt = localStorage.getItem("expiresAt");

    if (!expiresAt || Date.now() > Number(expiresAt)) {
      logout(true);
      return false;
    }

    return true;
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, loading, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
