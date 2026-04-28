import axios from "axios";
import { getGraphqlUrl } from "./api-origin";
import { refreshAndApplySession } from "./authSession";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer ? getGraphqlUrl() : "/graphql",
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  async (response) => {

    const originalRequest = response.config as typeof response.config & {
      _retry?: boolean;
    };

    const graphQLErrors = response.data?.errors;
    const hasUnauthenticatedError =
      Array.isArray(graphQLErrors) &&
      graphQLErrors.some((e: any) => e.extensions?.code === "UNAUTHENTICATED");

    if (!hasUnauthenticatedError || originalRequest._retry) {
      return response;
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const token = await refreshAndApplySession();
      processQueue(null, token);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
  async (error) => {
    if (isServer) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const isHttpAuthError = error.response?.status === 401;

    if (!isHttpAuthError || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const token = await refreshAndApplySession();
      processQueue(null, token);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${token}`;

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