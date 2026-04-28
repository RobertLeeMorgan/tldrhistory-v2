import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useToast } from "./ToastContext";
import { setAccessToken } from "../lib/api";
import {
  registerAuthHandlers,
  clearAuthHandlers,
  fetchRefreshSession,
  type AuthUser,
} from "../lib/authSession";

interface AuthState {
  token: string | null;
  id: string | null;
  username: string | null;
  role: string | null;
  emailVerifiedAt: string | null;
}

interface AuthContextType {
  isAuth: AuthState;
  login: (token: string, user: AuthUser, showToast?: boolean) => void;
  logout: (expired?: boolean) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const emptyAuth: AuthState = {
  token: null,
  id: null,
  username: null,
  role: null,
  emailVerifiedAt: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<AuthState>(emptyAuth);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSessionRef = useRef(false);
  const logoutInFlightRef = useRef(false);

  const clearRefreshTimer = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  const getTokenExpiry = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return null;
      const expiry = payload.exp * 1000;
      return expiry > Date.now() ? expiry : null;
    } catch {
      return null;
    }
  };

  const scheduleRefresh = (expiresAt: number) => {
    clearRefreshTimer();

    const timeout = Math.max(expiresAt - Date.now() - 30_000, 0);
    refreshTimer.current = setTimeout(() => {
      void silentRefresh();
    }, timeout);
  };

  const applySession = (token: string, user: AuthUser, showToast = true) => {
    hasSessionRef.current = true;
    setAccessToken(token);
    setIsAuth({
      token,
      id: user.id,
      username: user.username,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
    });

    const expiresAt = getTokenExpiry(token);
    if (expiresAt) {
      scheduleRefresh(expiresAt);
    }

    if (showToast) {
      addToast({ message: "Welcome back!", type: "success" });
    }
  };

  const logout = async (expired = false) => {
    if (logoutInFlightRef.current) return;
    if (!hasSessionRef.current && !isAuth.token) return;

    logoutInFlightRef.current = true;
    hasSessionRef.current = false;

    clearRefreshTimer();
    setAccessToken(null);
    setIsAuth(emptyAuth);

    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    if (expired) {
      addToast({
        message: "Session expired, please log in again.",
        type: "error",
      });
    }

    logoutInFlightRef.current = false;
  };

  const login = (token: string, user: AuthUser, showToast = true) => {
    applySession(token, user, showToast);
  };

  const silentRefresh = async () => {
    try {
      const data = await fetchRefreshSession();
      applySession(data.token, data.user, false);
    } catch {
      await logout(true);
    }
  };

  useEffect(() => {
    let mounted = true;

    registerAuthHandlers({
      applySession,
      logout,
    });

    const initializeAuth = async () => {
      try {
        const data = await fetchRefreshSession();

        if (mounted) {
          applySession(data.token, data.user, false);
        }
      } catch {
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const handleForcedLogout = () => {
      void logout(true);
    };

    void initializeAuth();
    window.addEventListener("auth:logout", handleForcedLogout);

    return () => {
      mounted = false;
      window.removeEventListener("auth:logout", handleForcedLogout);
      clearRefreshTimer();
      clearAuthHandlers();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
