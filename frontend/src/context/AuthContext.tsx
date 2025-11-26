import { createContext, useState, useContext, useEffect } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<AuthState>({
    token: null,
    id: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && id && username && role) {
      setIsAuth({ token, id, username, role });
    }
  }, []);

  function login(
    token: string,
    user: { id: string; username: string; role: string }
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("id", user.id);
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);

    setIsAuth({
      token,
      id: user.id,
      username: user.username,
      role: user.role,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setIsAuth({
      token: null,
      id: null,
      username: null,
      role: null,
    });
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
