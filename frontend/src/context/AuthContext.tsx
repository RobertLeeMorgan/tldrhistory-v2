import { createContext, useState, useContext, useEffect } from "react";
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
    user: { id: string; username: string; role: string }
  ) => void;
  logout: () => void;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && id && username && role && expiresAt) {
      if (Date.now() > Number(expiresAt)) {
        logout(true);
      } else {
        setIsAuth({ token, id, username, role });
      }
    }

    setLoading(false);
  }, []);

  function login(
    token: string,
    user: { id: string; username: string; role: string }
  ) {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("id", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    localStorage.setItem("expiresAt", expiresAt.toString());

    addToast({ message: "Welcome back!", type: "success" });
    setIsAuth({ token, id: user.id, username: user.username, role: user.role });
  }

  function logout(expired = false) {
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
      addToast({ message: "Session expired, please log in again.", type: "error" });
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
    <AuthContext.Provider value={{ isAuth, login, logout, loading, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
