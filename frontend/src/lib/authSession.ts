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

let sessionVersion = 0;
let refreshBlocked = false;
let refreshInFlight: Promise<RefreshSessionResult> | null = null;

export class SessionChangedError extends Error {
  constructor() { super("Session changed during refresh"); }
}

export function beginLoginSession() {
  sessionVersion++;
  refreshBlocked = false;
}

export async function invalidateRefreshSession() {
  sessionVersion++;
  refreshBlocked = true;
  // Let the rotating response set its cookie before logout deletes that session.
  await refreshInFlight?.catch(() => undefined);
}

export function fetchRefreshSession(): Promise<RefreshSessionResult> {
  if (refreshBlocked) return Promise.reject(new SessionChangedError());
  if (refreshInFlight) return refreshInFlight;
  const version = sessionVersion;
  const request = (async () => {
    const res = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
      signal: AbortSignal.timeout(20_000),
    });
    if (version !== sessionVersion) throw new SessionChangedError();
    if (!res.ok) throw new Error("Refresh failed");
    const data = await res.json();
    if (version !== sessionVersion) throw new SessionChangedError();
    if (!data?.token || !data?.user) throw new Error("Invalid refresh payload");
    return { token: data.token, user: data.user };
  })();
  refreshInFlight = request;
  const clear = () => { if (refreshInFlight === request) refreshInFlight = null; };
  void request.then(clear, clear);
  return request;
}

export async function refreshAndApplySession() {
  const version = sessionVersion;
  const data = await fetchRefreshSession();
  if (version !== sessionVersion) throw new SessionChangedError();

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
