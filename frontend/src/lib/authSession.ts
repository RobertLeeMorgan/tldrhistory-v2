import { setAccessToken } from "./api";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
   emailVerifiedAt: string | null;
}

export interface RefreshSessionResult {
  token: string;
  user: AuthUser;
}

type ApplySessionFn = (
  token: string,
  user: AuthUser,
  showToast?: boolean,
) => void;

type LogoutFn = (expired?: boolean) => Promise<void>;

let applySessionRef: ApplySessionFn | null = null;
let logoutRef: LogoutFn | null = null;

export function registerAuthHandlers(handlers: {
  applySession: ApplySessionFn;
  logout: LogoutFn;
}) {
  applySessionRef = handlers.applySession;
  logoutRef = handlers.logout;
}

export function clearAuthHandlers() {
  applySessionRef = null;
  logoutRef = null;
}

export async function fetchRefreshSession(): Promise<RefreshSessionResult> {
  const res = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();

  if (!data?.token || !data?.user) {
    throw new Error("Invalid refresh payload");
  }

  return {
    token: data.token,
    user: data.user,
  };
}

export async function refreshAndApplySession() {
  const data = await fetchRefreshSession();

  if (!applySessionRef) {
    setAccessToken(data.token);
    return data.token;
  }

  applySessionRef(data.token, data.user, false);
  return data.token;
}

export async function logoutFromSession(expired = false) {
  if (logoutRef) {
    await logoutRef(expired);
    return;
  }

  setAccessToken(null);
}
