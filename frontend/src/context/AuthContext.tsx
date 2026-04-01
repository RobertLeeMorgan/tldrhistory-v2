import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";
import { setAccessToken } from "../lib/api";

interface AuthState {
  token: string | null;
  id: string | null;
  username: string | null;
  role: string | null;
}

interface AuthContextType {
  isAuth: AuthState;
  login: (token: string, user: { id: string; username: string; role: string }) => void;
  logout: (expired?: boolean) => void;
  loading: boolean;
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

  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSessionRef = useRef(false); // true if user ever logged in

  // --- decode expiry from JWT ---
  const getTokenExpiry = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  // --- schedule auto logout ---
  const scheduleLogout = (expiresAt: number) => {
    const timeout = expiresAt - Date.now();
    if (timeout <= 0) {
      handleExpiredSession();
      return;
    }
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(handleExpiredSession, timeout);
  };

  const handleExpiredSession = () => {
    setAccessToken(null);
    setIsAuth({ token: null, id: null, username: null, role: null });

    if (hasSessionRef.current) {
      addToast({
        message: "Session expired, please log in again.",
        type: "error",
      });
      hasSessionRef.current = false;
    }
  };

  // --- login ---
  function login(token: string, user: { id: string; username: string; role: string }) {
    hasSessionRef.current = true;
    setAccessToken(token);
    setIsAuth({ token, id: user.id, username: user.username, role: user.role });

    const expiresAt = getTokenExpiry(token);
    if (expiresAt) scheduleLogout(expiresAt);

    addToast({ message: "Welcome back!", type: "success" });
  }

  // --- logout ---
  async function logout(expired = false) {
    hasSessionRef.current = false;
    setAccessToken(null);
    setIsAuth({ token: null, id: null, username: null, role: null });

    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore errors
    }

    if (expired) {
      addToast({
        message: "Session expired, please log in again.",
        type: "error",
      });
    }
  }

  // --- initial token refresh ---
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await fetch("/api/refresh", { method: "POST", credentials: "include" });

        if (!res.ok) {
          setIsAuth({ token: null, id: null, username: null, role: null });
          return;
        }

        const data = await res.json();
        login(data.token, data.user);
      } catch {
        setIsAuth({ token: null, id: null, username: null, role: null });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // global listener for forced logout
    const handler = () => logout(true);
    window.addEventListener("auth:logout", handler);

    return () => {
      window.removeEventListener("auth:logout", handler);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, []);

  return <AuthContext.Provider value={{ isAuth, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}