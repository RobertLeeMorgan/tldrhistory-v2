import axios from "axios";

let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

const api = axios.create({ baseURL: "/graphql", timeout: 10000, withCredentials: true });

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  else delete config.headers.Authorization;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthError =
      error.response?.status === 401 ||
      error.response?.data?.errors?.some((e: any) => e.extensions?.code === "UNAUTHENTICATED");

    if (!isAuthError || originalRequest._retry) return Promise.reject(error);

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await fetch("/api/refresh", { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();

      setAccessToken(data.token);
      processQueue(null, data.token);

      originalRequest.headers.Authorization = `Bearer ${data.token}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export { api };