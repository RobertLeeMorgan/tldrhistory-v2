import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useNavigate, useLocation, Link, Outlet, UNSAFE_withComponentProps, Meta, Links, Scripts, useRouteError, isRouteErrorResponse, UNSAFE_withErrorBoundaryProps, useSearchParams, useParams, useLoaderData, Navigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient, useMutation, infiniteQueryOptions, useInfiniteQuery, queryOptions } from "@tanstack/react-query";
import { createContext, useContext, useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback, lazy, Suspense, forwardRef, memo, createRef, useReducer, useId } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import axios from "axios";
import { GiCaveEntrance, GiWheat, GiStoneAxe, GiAnvil, GiAxeSword, GiLaurelCrown, GiTempleGate, GiCastle, GiFlame, GiPalette, GiFactory, GiVisoredHelm, GiFallingBomb, GiSubmarineMissile, GiWireframeGlobe, GiCaveman, GiFootprint, GiCompass, GiDiploma, GiMountains, GiQuillInk, GiPalmTree, GiScrollUnfurled, GiGreekSphinx, GiMountainRoad, GiEgyptianPyramids, GiTank, GiModernCity, GiRevolver, GiMusket, GiTreasureMap, GiSouthAmerica, GiSpearFeather, GiFemale, GiFist, GiLightBulb, GiAnchor, GiHolyGrail, GiCanoe, GiCaravan, GiDjembe, GiBrazilFlag, GiGalleon, GiJapan, GiSamuraiHelmet, GiJapaneseBridge, GiPirateFlag, GiMusicalNotes, GiArabicDoor, GiPagoda, GiWingedEmblem, GiLotusFlower, GiMountaintop, GiMayanPyramid, GiCeremonialMask, GiCrossedSabres, GiEarthAmerica, GiByzantinTemple, GiHorseHead, GiTotem, GiVikingHelmet, GiSamaraMosque, GiStoneWall, GiColiseum, GiSailboat } from "react-icons/gi";
import { gql } from "graphql-request";
import { geoNaturalEarth1, geoPath, geoCentroid } from "d3-geo";
import { select } from "d3-selection";
import { feature } from "topojson-client";
import { scaleSqrt } from "d3-scale";
import "d3-transition";
import { FaTree, FaScroll, FaTheaterMasks, FaCoins, FaGavel, FaPalette } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { MdOutlineScience, MdVerifiedUser } from "react-icons/md";
import { useInfiniteLoader, Masonry } from "masonic";
import { z } from "zod";
import { IoMdInformationCircleOutline } from "react-icons/io";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const queryClient = new QueryClient();
const ToastContext = createContext(void 0);
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const duration = toast.duration ?? 3e3;
    setToasts((prev) => [...prev, { ...toast, id, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { addToast }, children: [
    children,
    /* @__PURE__ */ jsx("div", { className: "toast toast-bottom toast-center z-50", children: /* @__PURE__ */ jsx(AnimatePresence, { children: toasts.map((toast) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25 },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: `alert ${toast.type === "success" ? "bg-gradient-to-br from-stone-800 to-stone-900 border-stone-950/90 text-gold shadow-lg shadow-black/30 rounded" : toast.type === "error" ? "bg-gradient-to-br to-gold from-[#ead04c] border-stone-950/90 text-stone-950 shadow-lg shadow-black/30 rounded" : "bg-gradient-to-br from-stone-800 to-stone-900 border-stone-950/90 text-gold shadow-lg shadow-black/30 rounded"} shadow-lg shadow-black/40 text-lg font-serif border text-shadow-sm font-semibold`,
            children: /* @__PURE__ */ jsx("span", { children: toast.message })
          }
        )
      },
      toast.id
    )) }) })
  ] });
};
function getApiOrigin() {
  if (typeof window === "undefined") {
    return process.env.VITE_API_ORIGIN || "http://localhost:5000";
  }
  return "";
}
function getGraphqlUrl() {
  return `${getApiOrigin()}/graphql`;
}
let applySessionRef = null;
function registerAuthHandlers(handlers) {
  applySessionRef = handlers.applySession;
}
function clearAuthHandlers() {
  applySessionRef = null;
}
async function fetchRefreshSession() {
  const res = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include"
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
    user: data.user
  };
}
async function refreshAndApplySession() {
  const data = await fetchRefreshSession();
  if (!applySessionRef) {
    setAccessToken(data.token);
    return data.token;
  }
  applySessionRef(data.token, data.user, false);
  return data.token;
}
let accessToken = null;
function setAccessToken(token) {
  accessToken = token;
}
const isServer = typeof window === "undefined";
const api = axios.create({
  baseURL: isServer ? getGraphqlUrl() : "/graphql",
  timeout: 1e4,
  withCredentials: true
});
let isRefreshing = false;
let failedQueue = [];
function processQueue(error, token = null) {
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
    const originalRequest = response.config;
    const graphQLErrors = response.data?.errors;
    const hasUnauthenticatedError = Array.isArray(graphQLErrors) && graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED");
    if (!hasUnauthenticatedError || originalRequest._retry) {
      return response;
    }
    originalRequest._retry = true;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject
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
    const originalRequest = error.config;
    const isHttpAuthError = error.response?.status === 401;
    if (!isHttpAuthError || originalRequest?._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject
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
const AuthContext = createContext(void 0);
const emptyAuth = {
  token: null,
  id: null,
  username: null,
  role: null,
  emailVerifiedAt: null
};
function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(emptyAuth);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const refreshTimer = useRef(null);
  const hasSessionRef = useRef(false);
  const logoutInFlightRef = useRef(false);
  const clearRefreshTimer = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return null;
      const expiry = payload.exp * 1e3;
      return expiry > Date.now() ? expiry : null;
    } catch {
      return null;
    }
  };
  const scheduleRefresh = (expiresAt) => {
    clearRefreshTimer();
    const timeout = Math.max(expiresAt - Date.now() - 3e4, 0);
    refreshTimer.current = setTimeout(() => {
      void silentRefresh();
    }, timeout);
  };
  const applySession = (token, user, showToast = true) => {
    hasSessionRef.current = true;
    setAccessToken(token);
    setIsAuth({
      token,
      id: user.id,
      username: user.username,
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt
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
        credentials: "include"
      });
    } catch {
    }
    if (expired) {
      addToast({
        message: "Session expired, please log in again.",
        type: "error"
      });
    }
    logoutInFlightRef.current = false;
  };
  const login2 = (token, user, showToast = true) => {
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
      applySession
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
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { isAuth, login: login2, logout, loading }, children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
function UserIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsx("g", { transform: "translate(-10,0)", children: /* @__PURE__ */ jsx("path", { d: "M208 192c0-35.346 28.686-64 64-64s64 28.654 64 64-28.686 64-64 64-64-28.654-64-64Z" }) }),
        /* @__PURE__ */ jsx("path", { d: "M183 304c19-5 46-8 81-8s62 3 81 8c21 7 32 18 32 32H151c0-14 11-25 32-32Z" }),
        /* @__PURE__ */ jsx("path", { d: "M492.224,300.58c-4.706,1.479-10.46,3.506-16.54,4.506c-2.594,0.432-5.235,0.672-7.877,0.653 c0.086-0.288,0.173-0.576,0.26-0.865c1.709-5.812,3.179-11.864,4.226-16.82c1.056-4.947,1.72-8.78,1.988-10.163 c0.808-4.044,1.354-6.964,2.277-9.02c0.931-2.066,2.248-3.276,4.466-3.948c8.914-2.171,17.079-7.992,22.794-16.762 c5.726-8.712,8.934-20.326,8.032-32.774c-0.586-7.819-2.287-11.219-4.563-11.872c-2.296-0.653-5.235,1.412-8.866,4.352 c-3.64,2.949-8.002,6.743-13.006,9.768c-2.142,1.306-4.41,2.469-6.772,3.392c-0.51-5.38-1.24-10.807-1.97-15.245 c-0.768-4.735-1.489-8.347-1.719-9.663c-1.364-7.704-1.941-11.076,1.585-13.765c7.175-4.937,12.468-12.834,14.611-22.506 c2.171-9.635,1.133-20.998-3.775-31.708c-3.104-6.724-5.735-9.154-7.974-8.972c-2.257,0.173-4.197,2.978-6.464,6.781 c-2.267,3.823-4.89,8.636-8.338,12.987c-1.478,1.874-3.112,3.65-4.898,5.254c-1.969-4.044-4.025-7.972-5.841-11.248 c-2.2-3.977-4.015-6.974-4.63-8.079c-3.679-6.446-5.254-9.279-2.949-12.795c4.871-6.686,7.127-15.398,6.071-24.687 c-1.028-9.269-5.408-19.066-13.025-27.126c-4.803-5.052-7.886-6.426-9.836-5.59c-1.979,0.855-2.891,3.947-3.785,8.059 c-0.893,4.112-1.806,9.232-3.573,14.188c-0.749,2.104-1.662,4.159-2.757,6.119c-2.181-2.191-4.313-4.265-6.224-6.052 c-3.324-3.112-5.956-5.418-6.888-6.272c-5.476-5.005-7.848-7.214-6.734-11.268c2.594-7.857,2.075-16.849-1.777-25.359 c-3.812-8.51-10.998-16.502-20.729-21.834c-6.128-3.344-9.49-3.718-11.094-2.306c-1.623,1.411-1.538,4.64-1.124,8.828 c0.394,3.995,1.057,8.875,0.971,13.89c-3.305-3.862-7.82-6.849-12.892-9.193c-5.936-2.767-14.821-4.582-22.496-3.987 c-7.694,0.558-14.024,3.439-15.504,8.76c-1.498,5.351,2.094,10.941,6.964,15.869c4.918,4.899,11.162,9.251,16.187,11.585 c4.485,2.064,8.942,3.611,13.64,3.909c-0.212,0.163-0.423,0.326-0.634,0.49c-4.092,3.103-8.222,5.696-11.383,8.078 c-3.16,2.363-5.36,4.495-5.716,6.532c-0.355,2.046,1.134,3.947,5.341,6.253c6.676,3.66,14.015,5.11,21.632,4.765 c7.589-0.375,15.446-2.526,22.458-6.744c3.593-1.949,6.158-0.249,11.182,4.39c0.855,0.788,3.151,3.065,5.994,6.148 c1.624,1.758,3.41,3.785,5.236,5.928c-1.931,0.912-3.91,1.7-5.879,2.391c-4.841,1.691-9.568,2.892-13.304,4.178 c-3.746,1.288-6.484,2.622-7.455,4.458c-0.96,1.844-0.125,4.12,3.18,7.598c5.245,5.553,11.786,9.183,19.135,11.191 c7.339,1.979,15.484,2.325,23.448,0.461c4.025-0.758,5.936,1.643,9.288,7.599c0.576,1.018,2.066,3.89,3.823,7.684 c1.451,3.141,3.074,6.936,4.582,10.797c-2.421,0.317-4.85,0.432-7.233,0.46c-5.389,0.068-10.499-0.317-14.659-0.278 c-4.149,0.038-7.339,0.471-8.914,1.96c-1.586,1.509-1.538,4.025,0.547,8.55c3.295,7.184,8.521,12.929,15.1,17.396 c6.59,4.428,14.543,7.588,23.093,8.52c4.255,0.663,5.312,3.708,6.531,10.778c0.202,1.201,0.663,4.563,1.048,8.943 c0.365,4.112,0.643,9.106,0.71,14.034c-2.449-0.586-4.832-1.345-7.128-2.171c-5.34-1.921-10.249-4.169-14.36-5.63 c-4.102-1.479-7.407-2.209-9.51-1.316c-2.114,0.893-2.997,3.362-2.614,8.54c0.596,8.213,3.602,15.792,8.435,22.593 c4.832,6.772,11.479,12.824,19.538,16.944c1.979,1.124,2.929,2.517,3.209,4.573c0.288,2.056-0.087,4.745-0.846,8.444 c-0.25,1.258-1.066,4.725-2.363,9.154c-1.278,4.428-3.045,9.808-5.014,14.928c-0.105,0.26-0.202,0.51-0.298,0.759 c-2.142-1.518-4.139-3.18-6.051-4.861c-4.457-3.967-8.376-8.059-11.824-11.076c-3.448-3.026-6.388-5.014-8.79-4.975 c-2.431,0.038-4.236,2.084-5.86,7.194c-2.612,8.107-2.622,16.504-0.633,24.994c2.007,8.454,6.022,16.993,12.179,24.264 c2.91,3.775,1.441,7.022-3.006,13.563c-0.759,1.114-2.978,4.131-6.042,7.887c-3.054,3.746-6.993,8.213-11.018,12.343 c-0.644,0.672-1.296,1.326-1.941,1.97c-1.393-2.344-2.622-4.765-3.737-7.166c-2.622-5.706-4.668-11.287-6.733-15.648 c-2.046-4.37-4.064-7.511-6.388-8.5c-2.344-0.98-4.938,0.192-8.626,4.39c-5.898,6.628-9.423,14.64-11.104,23.62 c-1.643,8.933-1.441,18.856,1.316,28.482c1.172,4.879-1.643,7.348-8.742,11.671c-1.21,0.73-4.64,2.651-9.202,4.888 c-4.563,2.249-10.269,4.765-15.917,6.907c-5.648,2.171-13.352,5.485-17.454,6.926c-53.436,18.78-117.757,26.886-157.582,56.156 c-6.206,4.562,6.128,22.122,11.574,20.757c5.447-1.354,44.591-24.84,142.579-51.64c4.11-1.45,24.004-7.934,30.085-10.844 c6.1-2.901,12.199-6.206,17.059-9.04c4.861-2.843,8.502-5.196,9.846-6.003c3.91-2.401,6.706-4.16,9.097-4.956 c2.382-0.806,4.361-0.663,6.589,0.634c4.265,2.786,9.116,4.726,14.361,5.696c5.245,0.961,10.893,0.942,16.647-0.134 c5.744-1.086,11.612-3.228,17.204-6.456c5.6-3.218,10.941-7.512,15.599-12.766c5.86-6.638,7.252-10.691,6.004-12.997 c-1.258-2.334-5.196-3.026-10.364-3.593c-5.178-0.547-11.594-1.018-17.876-2.622c-2.651-0.672-5.273-1.546-7.78-2.669 c0.663-0.778,1.316-1.566,1.969-2.364c4.072-4.928,8.011-10.181,11.076-14.543c3.064-4.37,5.283-7.829,6.118-9.058 c4.851-7.224,6.964-10.384,11.864-9.855c9.538,1.518,19.855-0.856,28.99-7.147c4.553-3.14,8.8-7.242,12.402-12.16 c3.612-4.909,6.58-10.653,8.616-16.964c2.536-7.954,2.19-11.988,0.23-13.516C500.62,298.227,496.932,299.101,492.224,300.58z" }),
        " ",
        /* @__PURE__ */ jsx("path", { d: "M196.722,450.987c12.325-4.765,25.34-8.808,38.529-12.565c-14.168-3.862-28.202-7.886-41.554-12.574 c-4.102-1.441-11.805-4.755-17.453-6.926c-5.648-2.142-11.354-4.658-15.916-6.907c-4.563-2.238-7.992-4.159-9.203-4.888 c-7.099-4.323-9.913-6.792-8.741-11.671c2.757-9.626,2.958-19.549,1.316-28.482c-1.681-8.98-5.206-16.992-11.104-23.62 c-3.688-4.198-6.282-5.37-8.625-4.39c-2.326,0.989-4.342,4.13-6.389,8.5c-2.065,4.361-4.12,9.942-6.733,15.648 c-1.114,2.401-2.344,4.822-3.737,7.166c-0.644-0.644-1.296-1.298-1.941-1.97c-4.025-4.13-7.962-8.597-11.018-12.343 c-3.064-3.756-5.283-6.772-6.042-7.887c-4.448-6.541-5.927-9.788-3.007-13.563c6.158-7.271,10.173-15.811,12.18-24.264 c1.988-8.49,1.978-16.887-0.635-24.994c-1.623-5.11-3.429-7.156-5.859-7.194c-2.401-0.038-5.341,1.95-8.789,4.975 c-3.448,3.017-7.368,7.108-11.825,11.076c-1.911,1.681-3.909,3.343-6.051,4.861c-0.096-0.25-0.193-0.5-0.288-0.759 c-1.979-5.12-3.746-10.499-5.024-14.928c-1.296-4.428-2.113-7.896-2.362-9.154c-0.758-3.698-1.133-6.388-0.845-8.444 c0.278-2.056,1.23-3.448,3.208-4.573c8.06-4.12,14.707-10.172,19.548-16.944c4.822-6.801,7.838-14.38,8.424-22.593 c0.394-5.178-0.5-7.647-2.612-8.54c-2.104-0.893-5.408-0.163-9.51,1.316c-4.112,1.461-9.02,3.708-14.351,5.63 c-2.306,0.826-4.688,1.584-7.137,2.171c0.077-4.928,0.346-9.923,0.711-14.034c0.384-4.38,0.845-7.742,1.046-8.943 c1.22-7.069,2.277-10.115,6.532-10.778c8.549-0.932,16.502-4.092,23.092-8.52c6.58-4.467,11.806-10.211,15.101-17.396 c2.084-4.525,2.132-7.041,0.547-8.55c-1.575-1.488-4.764-1.921-8.914-1.96c-4.16-0.038-9.27,0.346-14.658,0.278 c-2.382-0.028-4.813-0.144-7.234-0.46c1.508-3.862,3.132-7.656,4.582-10.797c1.758-3.794,3.247-6.666,3.824-7.684 c3.352-5.956,5.264-8.357,9.288-7.599c7.963,1.864,16.109,1.518,23.448-0.461c7.349-2.008,13.89-5.638,19.135-11.191 c3.305-3.477,4.14-5.753,3.18-7.598c-0.971-1.835-3.708-3.17-7.454-4.458c-3.737-1.287-8.463-2.488-13.305-4.178 c-1.969-0.692-3.947-1.48-5.878-2.391c1.824-2.142,3.612-4.17,5.245-5.928c2.834-3.082,5.13-5.36,5.984-6.148 c5.023-4.639,7.588-6.339,11.181-4.39c7.012,4.218,14.87,6.369,22.458,6.744c7.617,0.345,14.956-1.105,21.632-4.765 c4.208-2.306,5.696-4.207,5.341-6.253c-0.355-2.037-2.556-4.17-5.716-6.532c-3.16-2.382-7.29-4.975-11.382-8.078 c-0.212-0.164-0.423-0.327-0.634-0.49c4.697-0.298,9.154-1.844,13.64-3.909c5.024-2.334,11.268-6.686,16.186-11.585 c4.87-4.928,8.462-10.518,6.974-15.869c-1.489-5.322-7.82-8.203-15.514-8.76c-7.675-0.595-16.56,1.22-22.497,3.987 c-5.072,2.344-9.586,5.331-12.89,9.193c-0.086-5.014,0.576-9.894,0.97-13.89c0.413-4.188,0.5-7.417-1.124-8.828 c-1.604-1.413-4.966-1.038-11.094,2.306c-9.731,5.331-16.915,13.323-20.729,21.834c-3.852,8.51-4.371,17.502-1.778,25.359 c1.114,4.054-1.258,6.263-6.734,11.268c-0.931,0.854-3.564,3.16-6.886,6.272c-1.912,1.787-4.044,3.862-6.225,6.052 c-1.095-1.96-2.008-4.015-2.756-6.119c-1.768-4.956-2.68-10.076-3.574-14.188c-0.893-4.112-1.806-7.204-3.785-8.059 c-1.95-0.836-5.033,0.538-9.836,5.59c-7.617,8.06-11.998,17.858-13.025,27.126c-1.056,9.29,1.201,18.002,6.071,24.687 c2.306,3.516,0.73,6.349-2.949,12.795c-0.615,1.105-2.431,4.102-4.63,8.079c-1.816,3.276-3.872,7.204-5.841,11.248 c-1.786-1.604-3.419-3.381-4.898-5.254c-3.449-4.351-6.071-9.164-8.338-12.987c-2.266-3.804-4.207-6.608-6.464-6.781 c-2.238-0.183-4.87,2.248-7.963,8.972c-4.918,10.711-5.955,22.074-3.784,31.708c2.141,9.673,7.434,17.57,14.61,22.506 c3.525,2.689,2.949,6.061,1.576,13.765c-0.222,1.316-0.942,4.928-1.72,9.663c-0.721,4.438-1.451,9.866-1.96,15.245 c-2.363-0.923-4.63-2.085-6.781-3.392c-4.995-3.026-9.356-6.82-12.996-9.768c-3.631-2.94-6.571-5.005-8.866-4.352 c-2.276,0.653-3.977,4.054-4.562,11.872c-0.903,12.449,2.305,24.062,8.03,32.774c5.715,8.77,13.88,14.591,22.795,16.762 c2.218,0.673,3.534,1.883,4.467,3.948c0.922,2.056,1.469,4.976,2.276,9.02c0.269,1.383,0.931,5.216,1.989,10.163 c1.047,4.956,2.516,11.008,4.226,16.82c0.087,0.288,0.173,0.576,0.26,0.865c-2.641,0.018-5.283-0.222-7.877-0.653 c-6.08-1-11.834-3.027-16.541-4.506c-4.706-1.478-8.395-2.353-10.384-0.816c-1.96,1.528-2.306,5.562,0.231,13.516 c2.036,6.311,5.005,12.054,8.616,16.964c3.602,4.918,7.848,9.02,12.402,12.16c9.135,6.292,19.451,8.665,28.989,7.147 c4.9-0.529,7.012,2.631,11.864,9.855c0.836,1.23,3.054,4.688,6.119,9.058c3.064,4.362,7.002,9.615,11.075,14.543 c0.654,0.798,1.307,1.586,1.969,2.364c-2.506,1.123-5.129,1.998-7.78,2.669c-6.282,1.604-12.699,2.076-17.876,2.622 c-5.167,0.568-9.106,1.259-10.365,3.593c-1.248,2.306,0.145,6.359,6.004,12.997c4.659,5.254,10,9.548,15.6,12.766 c5.591,3.227,11.46,5.37,17.204,6.456c5.754,1.075,11.402,1.095,16.647,0.134c5.245-0.97,10.096-2.91,14.361-5.696 c2.229-1.296,4.207-1.44,6.589-0.634c2.392,0.797,5.188,2.556,9.097,4.956c1.344,0.807,4.986,3.16,9.846,6.003 c4.86,2.834,10.96,6.139,17.06,9.04C172.939,443.1,191.862,449.297,196.722,450.987z" }),
        " ",
        /* @__PURE__ */ jsx("path", { d: "M314.729,462.456c-15.379,4.246-29.259,8.414-41.756,12.411c43.447,15.647,63.004,26.963,66.731,27.894 c5.446,1.364,17.78-16.195,11.566-20.757C340.626,474.175,328.216,467.874,314.729,462.456z" }),
        " "
      ]
    }
  );
}
function RomanHelmet() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 512 512",
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: /* @__PURE__ */ jsxs("g", { children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M209.145,273.343c-8.941-6.364-17.106-12.295-23.094-16.882c-8.357-6.395-19.547-15.92-31.763-26.711 \r\n          c-12.223-10.79-25.447-22.83-37.654-34.084c-8.925-8.237-17.306-16.05-24.35-22.662L22.853,410.503l25.23-0.008l34.052-95.839 \r\n          h70.617l-15.129,45.394l-45.402-1.265l-39.095,148.19c0,0,152.601,17.026,168.994-30.898c7.54-22.053,14.544-44.354,19.916-62.028 \r\n          l22.845-101.931C254.659,305.122,229.853,288.088,209.145,273.343z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M473.083,471.043c-49.189-54.872,6.308-141.266,6.308-261.065C479.391,90.18,382.903,0,263.104,0 \r\n          C196.49,0,126.001,20.004,70.552,57.041c-6.876,4.595-10.862,15.177,2.746,19.307c22.108,6.692,56.113,21.741,82.336,54.448 \r\n          c22.061-6.996,50.918-13.464,81.952-13.488c25.471,0,52.455,4.41,77.966,16.802c25.503,12.359,49.372,32.771,68.319,63.869 \r\n          c6.524,10.678,10.99,21.7,13.808,32.707c2.834,11.006,4.01,21.997,4.01,32.667c-0.024,29.337-8.837,56.256-17.522,75.964 \r\n          c-1.745,3.947-3.49,7.589-5.156,10.919c12.263,4.674,20.172,20.444,24.711,56.481c8.829,69.993,37.822,87.418,58.01,100.258 \r\n          C482.536,520.224,505.277,506.943,473.083,471.043z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M346.97,386.537c-1.705-17.034,3.498-28.856,11.719-34.38c2.841-5.02,6.38-11.744,9.902-19.724 \r\n          c8.108-18.315,16.097-43.218,16.073-69.08c0-9.414-1.041-18.963-3.466-28.433c-2.441-9.477-6.251-18.883-11.854-28.072 \r\n          c-17.435-28.521-38.583-46.403-61.236-57.425c-22.653-11.015-46.988-15.089-70.522-15.089c-26.295-0.024-51.47,5.131-71.561,11.087 \r\n          c5.459,8.716,10.374,18.402,14.472,29.257c0,0-15.009,9.653-33.172,25.983c6.172,5.588,12.327,11.119,18.219,16.33 \r\n          c12.07,10.662,23.117,20.044,30.849,25.951c4.98,3.811,11.791,8.781,19.348,14.184c7.556,5.412,15.873,11.262,23.91,16.874 \r\n          c16.089,11.222,31.114,21.525,36.99,25.527c1.673,1.152,2.602,1.776,2.602,1.776l4.787,3.258l-21.197,94.567 \r\n          c15.545,25.736,48.796,66.552,101.796,63.077c16.401,0,15.136-17.658,15.136-17.658S349.491,411.76,346.97,386.537z"
          }
        )
      ] })
    }
  );
}
function SortIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-5 h-5",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M7 3v14" }),
        /* @__PURE__ */ jsx("path", { d: "M3 7l4-4 4 4" }),
        /* @__PURE__ */ jsx("path", { d: "M17 21V7" }),
        /* @__PURE__ */ jsx("path", { d: "M13 17l4 4 4-4" })
      ]
    }
  );
}
function FilterIcon() {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-5 h-5",
      children: /* @__PURE__ */ jsx("path", { d: "M4 4h16l-6 8v6l-4 2v-8L4 4z" })
    }
  );
}
function SearchIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-5 h-5",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsx("line", { x1: "16", y1: "16", x2: "21", y2: "21" })
      ]
    }
  );
}
function CloseIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "w-5 h-5",
      children: [
        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ]
    }
  );
}
function Nav() {
  const { isAuth, logout, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isProfile = location.pathname === `/user/${isAuth.id}`;
  async function handleLogout() {
    try {
      logout();
      addToast({
        message: "You are logged out, bye for now!",
        type: "info"
      });
      navigate("/timeline");
    } catch (error) {
      console.error(error);
    }
  }
  return /* @__PURE__ */ jsx("nav", { className: "navbar fixed top-0 z-40 w-full p-2 sm:p-4 md:p-6 pointer-events-none", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between w-full md:px-6", children: [
    /* @__PURE__ */ jsx("div", { className: "navbar-start text-stone-700", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/timeline",
        "aria-label": "timeline",
        className: "w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex place-content-center items-center rounded-full cursor-pointer pointer-events-auto",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "/tldr-logo-512.png",
            alt: "TLDR History logo",
            className: "w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 flex place-content-center items-center justify-center hover:bg-stone-900 rounded-full transition-colors duration-300"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 lg:hidden" }),
    /* @__PURE__ */ jsx("div", { className: "navbar-end flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "dropdown dropdown-end", children: [
      loading ? /* @__PURE__ */ jsx("div", { className: "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg text-gold " }) }) : /* @__PURE__ */ jsx(
        motion.div,
        {
          whileHover: {
            scale: 1.05
          },
          transition: { type: "spring", stiffness: 260, damping: 18 },
          children: /* @__PURE__ */ jsx(
            "div",
            {
              tabIndex: 0,
              role: "button",
              className: "btn btn-ghost btn-circle w-12 h-12 md:w-18 md:h-18 avatar hover:bg-stone-950 transition-colors duration-300 cursor-pointer pointer-events-auto",
              "aria-label": "user menu",
              children: /* @__PURE__ */ jsx("div", { className: "text-gold place-items-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14", children: isAuth.token ? /* @__PURE__ */ jsx(RomanHelmet, {}) : /* @__PURE__ */ jsx(UserIcon, {}) })
            }
          )
        }
      ),
      !loading && /* @__PURE__ */ jsx(
        "ul",
        {
          tabIndex: 0,
          className: "mt-3 z-50 p-2 shadow opacity-100 menu menu-sm dropdown-content bg-stone-950/80 backdrop-blur-md rounded-box w-52 cursor-pointer pointer-events-auto",
          children: isAuth.token ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("li", { className: `${isProfile ? "hidden" : "block"} `, children: /* @__PURE__ */ jsx(Link, { to: `/user/${isAuth.id}`, children: "Profile" }) }),
            /* @__PURE__ */ jsx(
              "li",
              {
                className: `${isAuth.role === "ADMIN" || isAuth.role === "MODERATOR" ? "block" : "hidden"}`,
                children: /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: `/review-suggestions`,
                    "aria-label": "review suggestions",
                    children: "Review Suggestions"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "li",
              {
                className: `${isAuth.role === "ADMIN" || isAuth.role === "MODERATOR" || isAuth.role === "USER" ? "block" : "hidden"}`,
                children: /* @__PURE__ */ jsx(Link, { to: "/articles/create", "aria-label": "Create Article", children: "Create Article" })
              }
            ),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms", "aria-label": "Terms", children: "Terms" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy", "aria-label": "Privacy", children: "Privacy" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { onClick: handleLogout, "aria-label": "logout", children: "Logout" }) })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("li", { className: `${isLogin ? "hidden" : "block"}`, children: /* @__PURE__ */ jsx(Link, { to: "/login", "aria-label": "login", children: "Login" }) }),
            /* @__PURE__ */ jsx("li", { className: `${isRegister ? "hidden" : "block"}`, children: /* @__PURE__ */ jsx(Link, { to: "/register", "aria-label": "register", children: "Register" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/terms", "aria-label": "Terms", children: "Terms" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/privacy", "aria-label": "Privacy", children: "Privacy" }) })
          ] })
        }
      )
    ] }) })
  ] }) });
}
function Background() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-0 pointer-events-none bg-cover bg-no-repeat bg-right-top",
        style: { backgroundImage: `url("/bg-home.webp")` }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-0 pointer-events-none bg-overlay/35" })
  ] });
}
function RootLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen w-full relative", children: [
    /* @__PURE__ */ jsx(Background, {}),
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "flex-1 relative z-10 w-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.25 },
        children: /* @__PURE__ */ jsx(Outlet, {})
      }
    )
  ] });
}
function ScrollManager() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
const links = () => [{
  rel: "icon",
  type: "image/png",
  href: "/tldr-logo-192.png"
}, {
  rel: "apple-touch-icon",
  href: "/tldr-logo-192.png"
}, {
  rel: "manifest",
  href: "/manifest.webmanifest"
}, {
  rel: "preload",
  as: "image",
  href: "/bg-home.webp",
  type: "image/webp"
}];
function AppProviders({
  children
}) {
  return /* @__PURE__ */ jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsx(ToastProvider, {
      children: /* @__PURE__ */ jsx(AuthProvider, {
        children
      })
    })
  });
}
function Layout({
  children,
  nonce
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {
        nonce
      })]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(Scripts, {
        nonce
      })]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsxs(AppProviders, {
    children: [/* @__PURE__ */ jsx(ScrollManager, {}), /* @__PURE__ */ jsx(RootLayout, {})]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Button({
  label,
  primary,
  onClick,
  isLoading = false,
  type = "button",
  loading = "Submitting...",
  to
}) {
  const className = `btn rounded-lg w-32 sm:w-40 self-center shadow-sm shadow-stone-950/30 hover:shadow-lg transition-all duration-300 ${primary ? "bg-gold text-stone-100 hover:bg-gold-hover" : "btn-outline text-stone-100 bg-stone-900 border-stone-200 hover:border-gold hover:text-gold hover:bg-stone-950/90"}`;
  if (to) {
    return /* @__PURE__ */ jsx(Link, { to, className, "aria-label": label, children: label });
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      className,
      disabled: isLoading,
      "aria-label": label,
      onClick,
      type,
      children: isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-md" }),
        loading
      ] }) : label
    }
  );
}
function PageContainer({ children }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "flex flex-col min-h-screen items-center justify-center overflow-hidden",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
      children
    }
  );
}
function ErrorPage() {
  const error = useRouteError();
  let title = "Oops!";
  let message = "Something went wrong.";
  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    if (typeof error.data === "string") {
      message = error.data;
    } else if (error.data && typeof error.data === "object" && "message" in error.data && typeof error.data.message === "string") {
      message = error.data.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  return /* @__PURE__ */ jsx(PageContainer, { children: /* @__PURE__ */ jsxs("div", { className: "text-center z-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-5xl font-bold text-gold mb-4 text-shadow-md", children: title }),
    /* @__PURE__ */ jsx("p", { className: "text-2xl text-stone-300 mb-6", children: message }),
    /* @__PURE__ */ jsx(Button, { label: "Go Home", primary: true, to: "/" })
  ] }) });
}
const appLayout = UNSAFE_withComponentProps(function AppLayout() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2() {
  return /* @__PURE__ */ jsx(ErrorPage, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: appLayout
}, Symbol.toStringTag, { value: "Module" }));
const SITE_NAME = "TLDR History";
const SITE_URL = "https://tldrhistory.xyz";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;
function buildMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  robots = "index, follow",
  type = "website"
}) {
  const url = `${SITE_URL}${path}`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    { name: "author", content: "Rob Morgan" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image }
  ];
}
function meta$f({}) {
  return buildMeta({
    title: "TLDR History – Interactive Human History Timeline",
    description: "TLDR History is an interactive visual timeline of human history, exploring civilisations, population changes, and influential events across eras.",
    path: "/",
    type: "website"
  });
}
const topGroups = [{
  slug: "ancient-china",
  label: "Ancient China",
  years: "2100 BCE – 220 CE",
  blurb: "Dynasties, philosophy, warfare, and imperial foundations."
}, {
  slug: "?c=NorthAmerica%2CSouthAmerica&ys=-3000&ye=1572",
  label: "Pre-Columbian Americas",
  years: "3000 BCE – 1572 CE",
  blurb: "From Olmec and Maya worlds to the Aztec and Inca, explore Andean civilizations and Mesoamerica."
}, {
  slug: "black-history",
  label: "Black History",
  years: "1500 CE – 2025 CE",
  blurb: "Resistance, culture, emancipation, civil rights, and global Black history."
}, {
  slug: "feminism",
  label: "Feminism",
  years: "1792 CE – 2025 CE",
  blurb: "Ideas, movements, rights, and struggles for gender equality."
}, {
  slug: "wwii",
  label: "WWII",
  years: "1939 CE – 1945 CE",
  blurb: "Global war, occupation, genocide, resistance, and a remade world order."
}, {
  slug: "medieval-europe",
  label: "Medieval Europe",
  years: "500 CE – 1500 CE",
  blurb: "Faith, warfare, kingship, and everyday life in the medieval West."
}];
const lenses = [{
  title: "Intellectual history",
  to: "/timeline?t=person,event&s=intellectual",
  blurb: "Thinkers, schools, philosophy, science, and ideas across time."
}, {
  title: "Art and culture",
  to: "/timeline?t=person,event&s=art",
  blurb: "Music, visual art, literature, and cultural development through history."
}, {
  title: "Military history",
  to: "/timeline?t=landmark,event&s=military",
  blurb: "Wars, campaigns, leaders, and the evolution of conflict."
}, {
  title: "Religion and belief",
  to: "/timeline?t=event,person&s=religion",
  blurb: "Faith, institutions, movements, and spiritual transformation."
}];
const timeSlices = [{
  title: "Explosive Eurasian Convergence",
  years: "1200–1300",
  blurb: "War, trade, science, and empire colliding across connected Eurasia.",
  detail: "Mongol conquests, Crusades, Islamic knowledge production, Song Dynasty technology and economy, and Angkor at its peak.",
  to: "/timeline?ys=1200&ye=1300"
}, {
  title: "The World Connects",
  years: "1490–1530",
  blurb: "Independent worlds suddenly collide as the Americas enter the global system.",
  detail: "Columbus, Spanish conquest of the Aztec Empire, Ottoman expansion, Ming inward turn, and Vijayanagara thriving.",
  to: "/timeline?ys=1490&ye=1530"
}, {
  title: "Simultaneous Intellectual Explosion",
  years: "around 500 BCE",
  blurb: "Different civilisations independently producing foundational philosophies and ideas.",
  detail: "Classical Greece, Warring States China, Buddha’s teachings, and Achaemenid imperial dominance.",
  to: "/timeline?ys=-550&ye=-400"
}, {
  title: "Collapse Everywhere",
  years: "around 1350",
  blurb: "A global systemic shock, not just one region collapsing.",
  detail: "Black Death devastation, Mongol fragmentation, Yuan instability, and trade-network shock.",
  to: "/timeline?ys=1340&ye=1399"
}, {
  title: "Birth of the Modern World",
  years: "1800–1820",
  blurb: "Modern politics, industry, and nationalism ignite while some regions remain more static.",
  detail: "French Revolution aftermath, Napoleonic Wars, Industrial Revolution acceleration, Latin American independence movements, and Tokugawa Japan still isolated.",
  to: "/timeline?ys=1800&ye=1820"
}, {
  title: "Total Global Crisis",
  years: "1917–1920",
  blurb: "War, revolution, pandemic, and geopolitical reset in one tight window.",
  detail: "World War I ending, Russian Revolution, Spanish flu, and collapsing empires.",
  to: "/timeline?ys=1917&ye=1920"
}, {
  title: "Parallel Superpowers",
  years: "70–220 CE",
  blurb: "Massive empires linked by trade routes and shared Eurasian systems.",
  detail: "Roman peak, Han peak, Kushan Empire, and the Silk Road in full use.",
  to: "/timeline?ys=70&ye=220"
}];
const overlapFacts = [{
  eyebrow: "Same-time fact",
  title: "Medieval Europe and the Islamic Golden Age overlapped",
  body: "Europe fragmented and feudal while scholarship, medicine, and astronomy flourished elsewhere.",
  to: "/timeline?ys=750&ye=1250"
}, {
  eyebrow: "Same-time fact",
  title: "Samurai and cowboys shared the nineteenth century",
  body: "Japan’s samurai era and the American Wild West existed in the same broad historical moment.",
  to: "/timeline?ys=1800&ye=1900"
}, {
  eyebrow: "Same-time fact",
  title: "Oxford is older than the Aztec Empire",
  body: "A medieval university predates one of the most famous empires in the Americas.",
  to: "/timeline?ys=1096&ye=1521"
}];
const startHere = [{
  slug: "ancient-egypt",
  eyebrow: "Early civilization",
  label: "Ancient Egypt",
  blurb: "Dynasties, religion, pharaohs, and life shaped by the Nile."
}, {
  slug: "ancient-greece",
  eyebrow: "Classical world",
  label: "Ancient Greece",
  blurb: "City-states, philosophy, warfare, and the classical world."
}, {
  slug: "ancient-rome",
  eyebrow: "Empire and power",
  label: "Ancient Rome",
  blurb: "Republic, empire, conquest, and the remaking of the Mediterranean."
}];
const home = UNSAFE_withComponentProps(function HomeRoute() {
  return /* @__PURE__ */ jsxs(PageContainer, {
    children: [/* @__PURE__ */ jsx("section", {
      className: "px-4 py-20 sm:px-6 lg:px-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid w-full gap-10 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "max-w-3xl rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8 lg:p-10",
          children: [/* @__PURE__ */ jsx("p", {
            className: "mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-gold",
            children: "TLDR History"
          }), /* @__PURE__ */ jsx("h1", {
            className: "max-w-2xl font-serif text-4xl font-semibold leading-tight text-stone-100 sm:text-5xl lg:text-6xl",
            children: "Explore history as a connected timeline"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg",
            children: "Follow people, events, cultures, and empires across eras. Move through time visually, compare what was happening at once, and jump into the parts of history that interest you most."
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-8 flex flex-col gap-3 sm:flex-row",
            children: [/* @__PURE__ */ jsx(Link, {
              to: "/timeline",
              className: "inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-gold",
              children: "Open the timeline"
            }), /* @__PURE__ */ jsx(Link, {
              to: "/timeline/modern-era",
              className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10",
              children: "Start with the modern era"
            })]
          })]
        }), /* @__PURE__ */ jsxs("aside", {
          className: "rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md sm:p-7",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs font-semibold uppercase tracking-[0.22em] text-gold",
            children: "Start here"
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-5 space-y-4",
            children: startHere.map((item) => /* @__PURE__ */ jsxs(Link, {
              to: `/timeline/${item.slug}`,
              className: "block rounded-2xl border border-stone-100/10 bg-stone-100/5 p-4 transition hover:bg-stone-100/10",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-xs uppercase tracking-[0.18em] text-stone-400",
                children: item.eyebrow
              }), /* @__PURE__ */ jsx("h2", {
                className: "mt-2 text-lg font-semibold text-stone-100",
                children: item.label
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-2 text-sm leading-6 text-stone-300",
                children: item.blurb
              })]
            }, item.slug))
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 max-w-2xl",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-xs font-semibold uppercase tracking-[0.22em] text-gold",
          children: "Featured paths"
        }), /* @__PURE__ */ jsx("h2", {
          className: "mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl",
          children: "Good places to begin"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-4 text-base leading-7 text-stone-300",
          children: "These curated themes work better than throwing new visitors directly into every possible filter at once."
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
        children: topGroups.map((theme) => /* @__PURE__ */ jsxs(Link, {
          to: `/timeline/${theme.slug}`,
          className: "group rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:-translate-y-1 hover:bg-stone-900/70",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs uppercase tracking-[0.18em] text-stone-400",
            children: theme.years
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-3 text-2xl font-semibold text-stone-100",
            children: theme.label
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-sm leading-6 text-stone-300",
            children: theme.blurb
          }), /* @__PURE__ */ jsx("span", {
            className: "mt-6 inline-flex items-center text-sm font-medium text-gold transition group-hover:text-gold",
            children: "Explore theme →"
          })]
        }, theme.slug))
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md sm:p-8",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs font-semibold uppercase tracking-[0.22em] text-gold",
            children: "Why this is different"
          }), /* @__PURE__ */ jsx("h2", {
            className: "mt-3 font-serif text-3xl font-semibold text-stone-100",
            children: "See what was happening at the same time"
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-4 text-base leading-7 text-stone-300",
            children: "History makes more sense when events are placed beside one another rather than sealed inside separate chapters. Use the timeline to compare societies, ideas, conflicts, and cultural movements across the same centuries."
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-8",
            children: /* @__PURE__ */ jsx(Link, {
              to: "/timeline",
              className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10",
              children: "Compare eras in the timeline"
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "grid gap-4",
          children: timeSlices.map((item) => /* @__PURE__ */ jsxs(Link, {
            to: item.to,
            className: "rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-xs uppercase tracking-[0.18em] text-stone-400",
              children: item.years
            }), /* @__PURE__ */ jsx("h3", {
              className: "mt-2 text-xl font-semibold text-stone-100",
              children: item.title
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-3 text-sm leading-6 text-stone-300",
              children: item.blurb
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-3 text-sm leading-6 text-stone-400",
              children: item.detail
            })]
          }, item.title))
        })]
      })
    }), /* @__PURE__ */ jsxs("section", {
      className: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "mb-8 max-w-2xl",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-xs font-semibold uppercase tracking-[0.22em] text-gold",
          children: "Browse by lens"
        }), /* @__PURE__ */ jsx("h2", {
          className: "mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl",
          children: "Start with a filter, not a blank slate"
        }), /* @__PURE__ */ jsx("p", {
          className: "mt-4 text-base leading-7 text-stone-300",
          children: "Keep this lighter than the main app filter UI. It should feel like a guided starting point, not the full controls panel."
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid gap-4 lg:grid-cols-2",
        children: lenses.map((group) => /* @__PURE__ */ jsxs(Link, {
          to: group.to,
          className: "rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "text-lg font-semibold text-stone-100",
            children: group.title
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-4 text-sm leading-6 text-stone-300",
            children: group.blurb
          })]
        }, group.title))
      })]
    }), /* @__PURE__ */ jsx("section", {
      className: "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14",
      children: /* @__PURE__ */ jsx("div", {
        className: "grid gap-4 lg:grid-cols-3",
        children: overlapFacts.map((item) => /* @__PURE__ */ jsxs(Link, {
          to: item.to,
          className: "rounded-3xl border border-stone-100/10 bg-stone-950/80 p-6 backdrop-blur-md transition hover:bg-stone-900/70",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs uppercase tracking-[0.18em] text-stone-400",
            children: item.eyebrow
          }), /* @__PURE__ */ jsx("h3", {
            className: "mt-2 text-xl font-semibold text-stone-100",
            children: item.title
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-sm leading-6 text-stone-300",
            children: item.body
          })]
        }, item.title))
      })
    }), /* @__PURE__ */ jsx("section", {
      className: "mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20",
      children: /* @__PURE__ */ jsxs("div", {
        className: "rounded-[2rem] border border-stone-100/10 bg-stone-950/80 p-8 text-center backdrop-blur-md sm:p-10",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-xs font-semibold uppercase tracking-[0.22em] text-gold",
          children: "Ready to explore"
        }), /* @__PURE__ */ jsx("h2", {
          className: "mt-3 font-serif text-3xl font-semibold text-stone-100 sm:text-4xl",
          children: "Open the full timeline of human history"
        }), /* @__PURE__ */ jsx("p", {
          className: "mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-300",
          children: "Jump between eras, compare cultures, and follow the people and events that shaped the world."
        }), /* @__PURE__ */ jsxs("div", {
          className: "mt-8 flex flex-col justify-center gap-3 sm:flex-row",
          children: [/* @__PURE__ */ jsx(Link, {
            to: "/timeline",
            className: "inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-gold",
            children: "Open timeline"
          }), /* @__PURE__ */ jsx(Link, {
            to: "/timeline?t=person,event&s=culture",
            className: "inline-flex min-h-11 items-center justify-center rounded-full border border-stone-100/15 bg-stone-100/5 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:bg-stone-100/10",
            children: "Explore culture"
          })]
        })]
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$f
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_TIMELINE_FILTER = {
  type: [],
  subject: [],
  continent: [],
  yearStart: -3e5,
  yearEnd: 2025,
  search: void 0,
  sortBy: true,
  group: 0
};
function parseNumber(value) {
  if (value == null || value.trim() === "") return void 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : void 0;
}
function parseStringArray(value) {
  if (!value) return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}
function searchParamsToPartialFilter(searchParams) {
  const search = searchParams.get("q") || void 0;
  const yearStart = parseNumber(searchParams.get("ys"));
  const yearEnd = parseNumber(searchParams.get("ye"));
  const sortParam = searchParams.get("o");
  const sortBy = sortParam === "desc" ? false : sortParam === "asc" ? true : DEFAULT_TIMELINE_FILTER.sortBy;
  return {
    type: parseStringArray(searchParams.get("t")),
    subject: parseStringArray(searchParams.get("s")),
    continent: parseStringArray(searchParams.get("c")),
    yearStart,
    yearEnd,
    search,
    sortBy
  };
}
function filterToSearchParams(filter, existingSearchParams) {
  const params = new URLSearchParams(existingSearchParams);
  params.delete("t");
  params.delete("s");
  params.delete("c");
  params.delete("ys");
  params.delete("ye");
  params.delete("q");
  params.delete("o");
  if (filter.type.length) {
    params.set("t", filter.type.join(","));
  }
  if (filter.subject.length) {
    params.set("s", filter.subject.join(","));
  }
  if (filter.continent.length) {
    params.set("c", filter.continent.join(","));
  }
  const isDefaultYearRange = filter.yearStart === DEFAULT_TIMELINE_FILTER.yearStart && filter.yearEnd === DEFAULT_TIMELINE_FILTER.yearEnd;
  if (!isDefaultYearRange) {
    if (typeof filter.yearStart === "number") {
      params.set("ys", String(filter.yearStart));
    }
    if (typeof filter.yearEnd === "number") {
      params.set("ye", String(filter.yearEnd));
    }
  }
  if (filter.search) {
    params.set("q", filter.search);
  }
  if (filter.sortBy !== DEFAULT_TIMELINE_FILTER.sortBy) {
    params.set("o", filter.sortBy ? "asc" : "desc");
  }
  return params;
}
const collapseData = [
  {
    title: "Type",
    options: [
      { value: "person", labelText: "People", name: "type" },
      { value: "landmark", labelText: "Landmark", name: "type" },
      { value: "event", labelText: "Event", name: "type" },
      { value: "period", labelText: "Period", name: "type" }
    ]
  },
  {
    title: "Subject",
    options: [
      { value: "military", labelText: "Military", name: "subject" },
      { value: "politics", labelText: "Politics", name: "subject" },
      { value: "culture", labelText: "Culture", name: "subject" },
      { value: "intellectual", labelText: "Intellectual", name: "subject" },
      { value: "art", labelText: "Art", name: "subject" },
      { value: "maritime", labelText: "Maritime", name: "subject" },
      { value: "religion", labelText: "Religion", name: "subject" },
      { value: "environment", labelText: "Environment", name: "subject" },
      { value: "economic", labelText: "Economic", name: "subject" }
    ]
  },
  {
    title: "Continent",
    options: [
      { value: "Asia", labelText: "Asia", name: "continent" },
      { value: "Africa", labelText: "Africa", name: "continent" },
      { value: "Antarctica", labelText: "Antarctica", name: "continent" },
      { value: "Europe", labelText: "Europe", name: "continent" },
      { value: "MiddleEast", labelText: "Middle East", name: "continent" },
      { value: "NorthAmerica", labelText: "North America", name: "continent" },
      { value: "Oceania", labelText: "Oceania", name: "continent" },
      { value: "SouthAmerica", labelText: "South America", name: "continent" }
    ]
  }
];
const themes = {
  options: [
    {
      value: 5,
      slug: "ancient-china",
      labelText: "Ancient China",
      name: "group",
      fallbackYears: [-2100, 220],
      fallbackHeadline: "Dynasties, philosophy, warfare, and the foundations of imperial rule"
    },
    {
      value: 1,
      slug: "ancient-egypt",
      labelText: "Ancient Egypt",
      name: "group",
      fallbackYears: [-3100, -30],
      fallbackHeadline: "Dynasties, pharaohs, religion, and life along the Nile"
    },
    {
      value: 2,
      slug: "ancient-greece",
      labelText: "Ancient Greece",
      name: "group",
      fallbackYears: [-800, -146],
      fallbackHeadline: "City-states, philosophy, warfare, and the classical Mediterranean world"
    },
    {
      value: 20,
      slug: "ancient-india",
      labelText: "Ancient India",
      name: "group",
      fallbackYears: [-2500, 550],
      fallbackHeadline: "Early civilizations, empires, religions, and intellectual traditions of South Asia"
    },
    {
      value: 3,
      slug: "ancient-rome",
      labelText: "Ancient Rome",
      name: "group",
      fallbackYears: [-753, 476],
      fallbackHeadline: "Republic, empire, conquest, and the transformation of the Mediterranean"
    },
    {
      value: 19,
      slug: "andean-civilizations",
      labelText: "Andean Civilizations",
      name: "group",
      fallbackYears: [-3e3, 1572],
      fallbackHeadline: "States, roads, ritual life, and power in the Andes from Caral to the Inca"
    },
    {
      value: 24,
      slug: "baroque",
      labelText: "Baroque",
      name: "group",
      fallbackYears: [1600, 1750],
      fallbackHeadline: "Art, religion, monarchy, and spectacle in the early modern world"
    },
    {
      value: 41,
      slug: "black-history",
      labelText: "Black History",
      name: "group",
      fallbackYears: [1500, 2025],
      fallbackHeadline: "Resistance, culture, emancipation, civil rights, and global Black history"
    },
    {
      value: 12,
      slug: "byzantine-empire",
      labelText: "Byzantine Empire",
      name: "group",
      fallbackYears: [330, 1453],
      fallbackHeadline: "Emperors, Orthodoxy, war, and the eastern continuation of Rome"
    },
    {
      value: 26,
      slug: "classical-japan",
      labelText: "Classical Japan",
      name: "group",
      fallbackYears: [794, 1185],
      fallbackHeadline: "Court culture, literature, religion, and aristocratic rule in early Japan"
    },
    {
      value: 39,
      slug: "cold-war",
      labelText: "Cold War",
      name: "group",
      fallbackYears: [1947, 1991],
      fallbackHeadline: "Ideological rivalry, proxy conflicts, nuclear tension, and global realignment"
    },
    {
      value: 30,
      slug: "colonial-brazil",
      labelText: "Colonial and Imperial Brazil",
      name: "group",
      fallbackYears: [1500, 1889],
      fallbackHeadline: "Colonization, slavery, monarchy, and the making of Brazil"
    },
    {
      value: 45,
      slug: "colonial-north-america",
      labelText: "Colonial North America",
      name: "group",
      fallbackYears: [1492, 1776],
      fallbackHeadline: "Settlement, empire, trade, conflict, and the roots of new nations"
    },
    {
      value: 37,
      slug: "colonial-southeast-asia",
      labelText: "Colonial Southeast Asia",
      name: "group",
      fallbackYears: [1500, 1945],
      fallbackHeadline: "Empire, trade, resistance, and colonial rule across Southeast Asia"
    },
    {
      value: 29,
      slug: "colonial-spanish-america",
      labelText: "Colonial Spanish America",
      name: "group",
      fallbackYears: [1492, 1825],
      fallbackHeadline: "Conquest, viceroyalties, extraction, conversion, and colonial society"
    },
    {
      value: 23,
      slug: "early-islamic-period",
      labelText: "Early Islamic Period",
      name: "group",
      fallbackYears: [610, 1258],
      fallbackHeadline: "Revelation, caliphates, expansion, and the formation of Islamic civilization"
    },
    {
      value: 35,
      slug: "early-modern-europe",
      labelText: "Early Modern Europe",
      name: "group",
      fallbackYears: [1450, 1789],
      fallbackHeadline: "States, commerce, religion, science, and empire in a changing Europe"
    },
    {
      value: 46,
      slug: "early-republic",
      labelText: "Early Republic",
      name: "group",
      fallbackYears: [1776, 1828],
      fallbackHeadline: "Founding, constitutions, expansion, and politics in the early United States"
    },
    {
      value: 42,
      slug: "feminism",
      labelText: "Feminism",
      name: "group",
      fallbackYears: [1792, 2025],
      fallbackHeadline: "Ideas, movements, rights, and struggles for gender equality across eras"
    },
    {
      value: 27,
      slug: "feudal-japan",
      labelText: "Feudal Japan",
      name: "group",
      fallbackYears: [1185, 1868],
      fallbackHeadline: "Shoguns, samurai, warfare, and order in medieval and early modern Japan"
    },
    {
      value: 47,
      slug: "gilded-age",
      labelText: "Gilded Age",
      name: "group",
      fallbackYears: [1870, 1900],
      fallbackHeadline: "Industry, inequality, migration, labor, and politics in a transforming society"
    },
    {
      value: 40,
      slug: "globalization",
      labelText: "Globalization",
      name: "group",
      fallbackYears: [1800, 2025],
      fallbackHeadline: "Trade, technology, empire, finance, and the growing interconnection of the world"
    },
    {
      value: 22,
      slug: "imperial-china",
      labelText: "Imperial China",
      name: "group",
      fallbackYears: [221, 1912],
      fallbackHeadline: "Dynasties, administration, culture, and statecraft across imperial China"
    },
    {
      value: 14,
      slug: "industrial-revolution",
      labelText: "Industrial Revolution",
      name: "group",
      fallbackYears: [1760, 1914],
      fallbackHeadline: "Factories, machines, labor, cities, and the remaking of modern life"
    },
    {
      value: 8,
      slug: "islamic-golden-age",
      labelText: "Islamic Golden Age",
      name: "group",
      fallbackYears: [750, 1258],
      fallbackHeadline: "Scholarship, science, medicine, and culture across the Islamic world"
    },
    {
      value: 6,
      slug: "medieval-europe",
      labelText: "Medieval Europe",
      name: "group",
      fallbackYears: [500, 1500],
      fallbackHeadline: "Kings, faith, warfare, peasants, and power in the medieval West"
    },
    {
      value: 18,
      slug: "mesoamerica",
      labelText: "Mesoamerica",
      name: "group",
      fallbackYears: [-2e3, 1521],
      fallbackHeadline: "Cities, rituals, agriculture, and empires in ancient Mesoamerica"
    },
    {
      value: 4,
      slug: "mesopotamia",
      labelText: "Mesopotamia",
      name: "group",
      fallbackYears: [-3500, -539],
      fallbackHeadline: "Cities, kings, writing, and law between the Tigris and Euphrates"
    },
    {
      value: 48,
      slug: "modern-china",
      labelText: "Modern China",
      name: "group",
      fallbackYears: [1912, 2025],
      fallbackHeadline: "Revolution, war, socialism, reform, and China’s modern transformation"
    },
    {
      value: 15,
      slug: "modern-era",
      labelText: "Modern Era",
      name: "group",
      fallbackYears: [1800, 2025],
      fallbackHeadline: "Industry, empire, ideology, war, and the shaping of the contemporary world"
    },
    {
      value: 28,
      slug: "modern-japan",
      labelText: "Modern Japan",
      name: "group",
      fallbackYears: [1868, 2025],
      fallbackHeadline: "Reform, empire, war, reconstruction, and economic transformation"
    },
    {
      value: 11,
      slug: "mongol-empire",
      labelText: "Mongol Empire",
      name: "group",
      fallbackYears: [1206, 1368],
      fallbackHeadline: "Conquest, mobility, exchange, and empire across Eurasia"
    },
    {
      value: 16,
      slug: "ottoman-empire",
      labelText: "Ottoman Empire",
      name: "group",
      fallbackYears: [1299, 1922],
      fallbackHeadline: "Sultans, conquest, administration, and imperial life across three continents"
    },
    {
      value: 21,
      slug: "persian-empire",
      labelText: "Persian Empire",
      name: "group",
      fallbackYears: [-550, 651],
      fallbackHeadline: "Kingship, empire, religion, and power from Achaemenids to Sasanians"
    },
    {
      value: 25,
      slug: "pirates",
      labelText: "Pirates",
      name: "group",
      fallbackYears: [1650, 1730],
      fallbackHeadline: "Raiders, sailors, empires, and law on the early modern seas"
    },
    {
      value: 34,
      slug: "polynesia-oceania",
      labelText: "Polynesia and Oceania",
      name: "group",
      fallbackYears: [-1500, 2025],
      fallbackHeadline: "Voyaging, settlement, exchange, and colonial encounters across the Pacific"
    },
    {
      value: 44,
      slug: "post-independence-south-america",
      labelText: "Post-Independence South America",
      name: "group",
      fallbackYears: [1810, 2025],
      fallbackHeadline: "Republics, reform, conflict, and nation-building after independence"
    },
    {
      value: 43,
      slug: "pre-columbian-brazil",
      labelText: "Pre-Columbian Brazil",
      name: "group",
      fallbackYears: [-12e3, 1500],
      fallbackHeadline: "Peoples, lifeways, exchange, and societies before European colonization"
    },
    {
      value: 10,
      slug: "precolonial-north-america",
      labelText: "Precolonial North America",
      name: "group",
      fallbackYears: [-12e3, 1492],
      fallbackHeadline: "Peoples, trade, migration, and societies before European conquest"
    },
    {
      value: 31,
      slug: "precolonial-southeast-asia",
      labelText: "Precolonial Southeast Asia",
      name: "group",
      fallbackYears: [-500, 1500],
      fallbackHeadline: "Kingdoms, trade, religion, and cultural exchange before colonial rule"
    },
    {
      value: 49,
      slug: "prehistory",
      labelText: "Prehistory",
      name: "group",
      fallbackYears: [-3e5, -3500],
      fallbackHeadline: "Human origins, migration, tools, ritual, and life before written records"
    },
    {
      value: 36,
      slug: "reformation-religious-wars",
      labelText: "Reformation and Religious Wars",
      name: "group",
      fallbackYears: [1517, 1648],
      fallbackHeadline: "Faith, power, reform, and conflict in early modern Europe"
    },
    {
      value: 7,
      slug: "renaissance",
      labelText: "Renaissance",
      name: "group",
      fallbackYears: [1350, 1600],
      fallbackHeadline: "Art, learning, humanism, and cultural renewal in Europe and beyond"
    },
    {
      value: 33,
      slug: "silk-road",
      labelText: "Silk Road",
      name: "group",
      fallbackYears: [-130, 1453],
      fallbackHeadline: "Trade, travel, religion, and exchange across Afro-Eurasia"
    },
    {
      value: 17,
      slug: "sub-saharan-kingdoms",
      labelText: "Sub-Saharan Kingdoms",
      name: "group",
      fallbackYears: [300, 1900],
      fallbackHeadline: "Kingship, trade, faith, and state formation across sub-Saharan Africa"
    },
    {
      value: 38,
      slug: "enlightenment",
      labelText: "The Enlightenment",
      name: "group",
      fallbackYears: [1685, 1815],
      fallbackHeadline: "Reason, reform, science, and political thought in the Atlantic world"
    },
    {
      value: 9,
      slug: "viking-age",
      labelText: "Viking Age",
      name: "group",
      fallbackYears: [793, 1066],
      fallbackHeadline: "Raids, trade, exploration, and state formation in the Norse world"
    },
    {
      value: 32,
      slug: "west-african-empires",
      labelText: "West African Empires",
      name: "group",
      fallbackYears: [300, 1600],
      fallbackHeadline: "Gold, trade, scholarship, and imperial power in West Africa"
    },
    {
      value: 50,
      slug: "wwii",
      labelText: "WWII",
      name: "group",
      fallbackYears: [1939, 1945],
      fallbackHeadline: "Global war, occupation, genocide, resistance, and a remade world order"
    }
  ]
};
const groupSlugToIdMap = new Map(
  themes.options.map((group) => [group.slug, group.value])
);
const groupIdToSlugMap = new Map(
  themes.options.map((group) => [group.value, group.slug])
);
new Map(
  themes.options.map((group) => [group.value, group.labelText])
);
function getGroupIdFromSlug(slug) {
  return slug ? groupSlugToIdMap.get(slug) : void 0;
}
function getGroupSlugFromId(id) {
  return typeof id === "number" && id !== 0 ? groupIdToSlugMap.get(id) : void 0;
}
const TimelineFilterContext = createContext(null);
function normalizeFilter$1(filter) {
  return {
    ...filter,
    search: filter.search || void 0,
    sortBy: filter.sortBy ?? DEFAULT_TIMELINE_FILTER.sortBy,
    type: filter.type ?? [],
    subject: filter.subject ?? [],
    continent: filter.continent ?? [],
    group: filter.group ?? DEFAULT_TIMELINE_FILTER.group,
    yearStart: filter.yearStart ?? DEFAULT_TIMELINE_FILTER.yearStart,
    yearEnd: filter.yearEnd ?? DEFAULT_TIMELINE_FILTER.yearEnd
  };
}
const DEFAULT_OPTIONS = {
  replace: true
};
function buildPath(group) {
  const slug = getGroupSlugFromId(group);
  return slug ? `/timeline/${slug}` : "/timeline";
}
function TimelineFilterProvider({ children }) {
  const [searchParams] = useSearchParams();
  const { groupSlug } = useParams();
  const navigate = useNavigate();
  const filter = useMemo(() => {
    const partial = searchParamsToPartialFilter(searchParams);
    const group = getGroupIdFromSlug(groupSlug ?? null) ?? DEFAULT_TIMELINE_FILTER.group;
    return normalizeFilter$1({
      ...DEFAULT_TIMELINE_FILTER,
      ...partial,
      group
    });
  }, [searchParams, groupSlug]);
  const setFilter = useCallback(
    (next, options = DEFAULT_OPTIONS) => {
      const normalized = normalizeFilter$1(next);
      const pathname = buildPath(normalized.group);
      const search = filterToSearchParams(normalized, searchParams).toString();
      navigate(
        {
          pathname,
          search: search ? `?${search}` : ""
        },
        { replace: options.replace ?? true }
      );
    },
    [navigate, searchParams]
  );
  const patchFilter = useCallback(
    (patch, options = DEFAULT_OPTIONS) => {
      const next = normalizeFilter$1({
        ...filter,
        ...patch
      });
      const pathname = buildPath(next.group);
      const search = filterToSearchParams(next, searchParams).toString();
      navigate(
        {
          pathname,
          search: search ? `?${search}` : ""
        },
        { replace: options.replace ?? true }
      );
    },
    [filter, navigate, searchParams]
  );
  const resetFilter = useCallback(
    (options = DEFAULT_OPTIONS) => {
      navigate(
        {
          pathname: "/timeline",
          search: ""
        },
        { replace: options.replace ?? true }
      );
    },
    [navigate]
  );
  const value = useMemo(
    () => ({
      filter,
      setFilter,
      patchFilter,
      resetFilter
    }),
    [filter, setFilter, patchFilter, resetFilter]
  );
  return /* @__PURE__ */ jsx(TimelineFilterContext.Provider, { value, children });
}
function useTimelineFilter() {
  const context = useContext(TimelineFilterContext);
  if (!context) {
    throw new Error("useTimelineFilter must be used within TimelineFilterProvider");
  }
  return context;
}
const HISTORICAL_RANGES = [
  // Prehistory & Early Civilizations
  {
    label: "Paleolithic Era",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Origins of Humanity and the Stone Age"
  },
  {
    label: "Mesolithic Era",
    start: -1e4,
    end: -5e3,
    icon: GiCaveman,
    headline: "Transitional Hunter‑Gatherers"
  },
  {
    label: "Neolithic Revolution",
    start: -5e3,
    end: -3e3,
    icon: GiStoneAxe,
    headline: "Spread of Farming and Early Villages"
  },
  // Bronze Age
  {
    label: "Early Bronze Age",
    start: -3e3,
    end: -2e3,
    icon: GiAnvil,
    headline: "Metalwork and Monarchy"
  },
  {
    label: "Middle Bronze Age",
    start: -2e3,
    end: -1500,
    icon: GiEgyptianPyramids,
    headline: "Empires Forge Ahead"
  },
  {
    label: "Late Bronze Age",
    start: -1500,
    end: -1200,
    icon: GiFallingBomb,
    headline: "Civilizations in Turmoil"
  },
  // Iron Age & Classical
  {
    label: "Iron Age",
    start: -1200,
    end: -500,
    icon: GiAxeSword,
    headline: "Tools of Power"
  },
  {
    label: "Classical Antiquity",
    start: -500,
    end: 300,
    icon: GiLaurelCrown,
    headline: "Rise of the Roman Empire"
  },
  {
    label: "Late Antiquity",
    start: 300,
    end: 500,
    icon: GiTempleGate,
    headline: "The Twilight of Empires"
  },
  // Medieval
  {
    label: "Early Middle Ages",
    start: 500,
    end: 1e3,
    icon: GiVisoredHelm,
    headline: "Kings and Conquests"
  },
  {
    label: "High Middle Ages",
    start: 1e3,
    end: 1300,
    icon: GiCastle,
    headline: "Castles and Crusades"
  },
  {
    label: "Late Middle Ages",
    start: 1300,
    end: 1500,
    icon: GiCastle,
    headline: "Plague and War"
  },
  // Renaissance → Early Modern
  {
    label: "Renaissance & Age of Discovery",
    start: 1500,
    end: 1600,
    icon: GiPalette,
    headline: "Exploration and Enlightenment"
  },
  {
    label: "Scientific Revolution",
    start: 1600,
    end: 1700,
    icon: GiCompass,
    headline: "Reason Reigns"
  },
  {
    label: "Enlightenment & Imperial Expansion",
    start: 1700,
    end: 1800,
    icon: GiQuillInk,
    headline: "Revolutions and Reason"
  },
  // Industrial → Modern
  {
    label: "Industrial Revolution",
    start: 1800,
    end: 1870,
    icon: GiFactory,
    headline: "Machines Transform Lives"
  },
  {
    label: "Age of Empire & Globalization",
    start: 1870,
    end: 1914,
    icon: GiPalmTree,
    headline: "The World Connects"
  },
  {
    label: "World War Era",
    start: 1914,
    end: 1945,
    icon: GiFallingBomb,
    headline: "Global Conflict Engulfs Nations"
  },
  {
    label: "Cold War",
    start: 1945,
    end: 1990,
    icon: GiSubmarineMissile,
    headline: "Ideologies Clash"
  },
  {
    label: "Information Age",
    start: 1990,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "Digital Revolution"
  }
];
const EAST_ASIA_RANGES = [
  {
    label: "Lower Paleolithic East Asia",
    start: -3e5,
    end: -1e5,
    icon: GiCaveEntrance,
    headline: "Early Homo erectus and stone tools"
  },
  {
    label: "Middle Paleolithic East Asia",
    start: -1e5,
    end: -25e3,
    icon: GiCaveman,
    headline: "Hunter-gatherers and regional traditions"
  },
  {
    label: "Upper Paleolithic East Asia",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Refined tools and early art"
  },
  {
    label: "Early Neolithic East Asia",
    start: -1e4,
    end: -2e3,
    icon: GiStoneAxe,
    headline: "Rise of farming and pottery"
  },
  {
    label: "Early Dynastic China",
    start: -2e3,
    end: -220,
    icon: GiWheat,
    headline: "Shang and Zhou foundations"
  },
  {
    label: "Qin–Han Imperial China",
    start: -220,
    end: 220,
    icon: GiMountainRoad,
    headline: "Unification and imperial formation"
  },
  {
    label: "Age of Division",
    start: 220,
    end: 590,
    icon: GiFlame,
    headline: "Fragmented kingdoms and Buddhism"
  },
  {
    label: "Sui–Tang Golden Age",
    start: 590,
    end: 907,
    icon: GiLaurelCrown,
    headline: "Cosmopolitan empire and Silk Road"
  },
  {
    label: "Song Commercial Peak",
    start: 907,
    end: 1280,
    icon: GiWheat,
    headline: "Urbanisation and economic expansion"
  },
  {
    label: "Yuan Mongol Rule",
    start: 1280,
    end: 1368,
    icon: GiAxeSword,
    headline: "Mongol rule over China"
  },
  {
    label: "Ming–Qing Late Imperial China",
    start: 1368,
    end: 1912,
    icon: GiTempleGate,
    headline: "Gunpowder states and global trade"
  },
  {
    label: "Republican & Modern China",
    start: 1912,
    end: 2025,
    icon: GiQuillInk,
    headline: "Revolution, war, and reform"
  }
];
const ISLAMIC_WORLD_RANGES = [
  {
    label: "Lower Paleolithic Near East",
    start: -3e5,
    end: -1e5,
    icon: GiCaveEntrance,
    headline: "Early humans in the Fertile Crescent"
  },
  {
    label: "Middle Paleolithic Near East",
    start: -1e5,
    end: -25e3,
    icon: GiCaveman,
    headline: "Neanderthals and early sapiens"
  },
  {
    label: "Upper Paleolithic Near East",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Early symbolic culture and rituals"
  },
  {
    label: "Early Neolithic Near East",
    start: -1e4,
    end: -3e3,
    icon: GiStoneAxe,
    headline: "Villages and early farming"
  },
  {
    label: "Bronze Age Near East",
    start: -3e3,
    end: -1200,
    icon: GiAnvil,
    headline: "City-states and early empires"
  },
  {
    label: "Iron Age Near East",
    start: -1200,
    end: -600,
    icon: GiAxeSword,
    headline: "Assyria and regional states"
  },
  {
    label: "Classical & Hellenistic Near East",
    start: -600,
    end: 600,
    icon: GiLaurelCrown,
    headline: "Greek, Roman, and late antique worlds"
  },
  {
    label: "Rise of Islam",
    start: 600,
    end: 750,
    icon: GiDiploma,
    headline: "Muhammad, Rashidun, and Umayyads"
  },
  {
    label: "Classical Abbasid Caliphate",
    start: 750,
    end: 945,
    icon: GiTempleGate,
    headline: "Islamic Golden Age"
  },
  {
    label: "Fragmentation & Regional Sultanates",
    start: 945,
    end: 1258,
    icon: GiCastle,
    headline: "Fatimids, Seljuks, and regional powers"
  },
  {
    label: "Post-Abbasid Fragmentation",
    start: 1258,
    end: 1500,
    icon: GiTempleGate,
    headline: "Mamluks, Timurids, and successor states"
  },
  {
    label: "Gunpowder Empires",
    start: 1500,
    end: 1800,
    icon: GiAxeSword,
    headline: "Ottomans, Safavids, and Mughals"
  },
  {
    label: "Colonial & Nationalist Era",
    start: 1800,
    end: 1918,
    icon: GiMountains,
    headline: "European pressure and reform"
  },
  {
    label: "Modern Middle East",
    start: 1918,
    end: 2025,
    icon: GiQuillInk,
    headline: "Nation-states and contemporary conflicts"
  }
];
const WEST_AFRICA_RANGES = [
  {
    label: "Paleolithic Era",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Early human presence within broader African Paleolithic developments"
  },
  {
    label: "Early Holocene Transformations",
    start: -1e4,
    end: -3e3,
    icon: GiFootprint,
    headline: "Saharan green phase, foraging expansion, and early pastoralism"
  },
  {
    label: "Proto-West African Complex Societies",
    start: -3e3,
    end: -500,
    icon: GiStoneAxe,
    headline: "Dhar Tichitt, early metallurgy, and emergent regional networks"
  },
  {
    label: "Iron Age West Africa & Nok Horizon",
    start: -500,
    end: 300,
    icon: GiAxeSword,
    headline: "Nok culture, early ironworking, and proto-urban developments"
  },
  {
    label: "Sahelian Kingdom Formation",
    start: 300,
    end: 1200,
    icon: GiTempleGate,
    headline: "Ghana Empire, early trans-Saharan trade, and state formation"
  },
  {
    label: "Mali Empire & Sahelian High Civilisation",
    start: 1200,
    end: 1450,
    icon: GiCastle,
    headline: "Mali Empire peak, Mansa Musa era, Islamic scholarship networks"
  },
  {
    label: "Songhai Expansion & Forest States",
    start: 1450,
    end: 1600,
    icon: GiCompass,
    headline: "Songhai Empire, Hausa states, and forest kingdom consolidation"
  },
  {
    label: "Atlantic Trade Transformation",
    start: 1600,
    end: 1800,
    icon: GiPalmTree,
    headline: "Atlantic slave trade and restructuring of coastal and inland states"
  },
  {
    label: "Colonial West Africa",
    start: 1800,
    end: 1960,
    icon: GiMountains,
    headline: "European colonisation and administrative restructuring"
  },
  {
    label: "Postcolonial West Africa",
    start: 1960,
    end: 2025,
    icon: GiQuillInk,
    headline: "Independence, nation-building, and regional modern states"
  }
];
const SUB_SAHARAN_AFRICA_RANGES = [
  {
    label: "Paleolithic Sub-Saharan Africa",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Early Homo sapiens evolution and widespread hunter-gatherer societies"
  },
  {
    label: "Late Stone Age & Holocene Transition",
    start: -1e4,
    end: -5e3,
    icon: GiFootprint,
    headline: "Climatic change, diversification of foraging cultures, and early regional identities"
  },
  {
    label: "Pastoralism & Early Agriculture Emergence",
    start: -5e3,
    end: -1500,
    icon: GiWheat,
    headline: "Cattle pastoralism, early farming systems, and ecological expansion"
  },
  {
    label: "Early Iron Age & Bantu Expansion",
    start: -1500,
    end: 500,
    icon: GiAxeSword,
    headline: "Spread of ironworking, Bantu migrations, and formation of early settlements"
  },
  {
    label: "Regional Kingdom Formation",
    start: 500,
    end: 1200,
    icon: GiTempleGate,
    headline: "Development of structured kingdoms in Great Lakes, Central, Southern, and Horn regions"
  },
  {
    label: "Classical African Civilisational States",
    start: 1200,
    end: 1500,
    icon: GiCastle,
    headline: "Great Zimbabwe peak, Ethiopian Solomonic consolidation, Swahili coastal city-states"
  },
  {
    label: "Early Modern African States & External Contact",
    start: 1500,
    end: 1800,
    icon: GiCompass,
    headline: "Indian Ocean trade expansion, Portuguese influence, inland state restructuring"
  },
  {
    label: "Colonial Sub-Saharan Africa",
    start: 1800,
    end: 1960,
    icon: GiMountains,
    headline: "Scramble for Africa, colonial administration, and resistance movements"
  },
  {
    label: "Postcolonial Sub-Saharan Africa",
    start: 1960,
    end: 2025,
    icon: GiQuillInk,
    headline: "Independence, nation-building, and contemporary political and economic development"
  }
];
const NORTH_AMERICAS_RANGES = [
  {
    label: "Pleistocene Era",
    start: -3e5,
    end: -5e4,
    icon: GiCaveEntrance,
    headline: "Possible early migrations and unconfirmed human presence debates"
  },
  {
    label: "Late Pleistocene Pre-Paleoindian Cultures",
    start: -5e4,
    end: -2e4,
    icon: GiFootprint,
    headline: "Early migration waves and Ice Age adaptation phases"
  },
  {
    label: "Paleoindian Traditions",
    start: -2e4,
    end: -12e3,
    icon: GiFootprint,
    headline: "First widely established human populations and megafauna hunting"
  },
  {
    label: "Late Paleoindian Transition",
    start: -12e3,
    end: -8e3,
    icon: GiAxeSword,
    headline: "Post-glacial adaptation and regionalisation begins"
  },
  {
    label: "Early Archaic Period",
    start: -8e3,
    end: -5e3,
    icon: GiAxeSword,
    headline: "Broad-spectrum foraging and ecological diversification"
  },
  {
    label: "Middle Archaic Period",
    start: -5e3,
    end: -2e3,
    icon: GiWheat,
    headline: "Technological refinement and regional cultural traditions"
  },
  {
    label: "Late Archaic Period",
    start: -2e3,
    end: -1e3,
    icon: GiStoneAxe,
    headline: "Sedentism increases and early proto-agricultural systems emerge"
  },
  {
    label: "Early Woodland Period",
    start: -1e3,
    end: 200,
    icon: GiWheat,
    headline: "Pottery traditions, early agriculture, and mound-building origins"
  },
  {
    label: "Middle Woodland Interaction Era",
    start: 200,
    end: 600,
    icon: GiTempleGate,
    headline: "Long-distance exchange networks (Hopewell tradition peak)"
  },
  {
    label: "Late Woodland Regionalisation",
    start: 600,
    end: 1e3,
    icon: GiCastle,
    headline: "Regional societies and intensified settlement patterns"
  },
  {
    label: "Emergent Mississippian Horizon",
    start: 1e3,
    end: 1200,
    icon: GiCastle,
    headline: "Formation of complex chiefdoms and early urban centres"
  },
  {
    label: "Classic Mississippian Civilisation",
    start: 1200,
    end: 1450,
    icon: GiLaurelCrown,
    headline: "Urban polities like Cahokia and hierarchical mound societies"
  },
  {
    label: "Post-Mississippian / Protohistoric Transition",
    start: 1450,
    end: 1600,
    icon: GiAxeSword,
    headline: "Collapse and transformation prior to sustained European contact"
  },
  {
    label: "Early Colonial Contact Phase",
    start: 1600,
    end: 1700,
    icon: GiCompass,
    headline: "Initial sustained European-Native contact zones"
  },
  {
    label: "Colonial Competition Era",
    start: 1700,
    end: 1776,
    icon: GiMountains,
    headline: "French, Spanish, and British imperial rivalry"
  },
  {
    label: "Revolutionary & Early Republic",
    start: 1776,
    end: 1820,
    icon: GiDiploma,
    headline: "Independence movements and formation of new states"
  },
  {
    label: "Expansion & Antebellum Era",
    start: 1820,
    end: 1865,
    icon: GiPalmTree,
    headline: "Territorial expansion, industrial roots, and civil conflict"
  },
  {
    label: "Industrial & Reconstruction Era",
    start: 1865,
    end: 1914,
    icon: GiFactory,
    headline: "Industrialisation, migration, and post-civil war restructuring"
  },
  {
    label: "World Wars Era",
    start: 1914,
    end: 1945,
    icon: GiFallingBomb,
    headline: "Global conflicts and rise of industrial superpowers"
  },
  {
    label: "Cold War North America",
    start: 1945,
    end: 1991,
    icon: GiSubmarineMissile,
    headline: "Superpower rivalry and technological expansion"
  },
  {
    label: "Contemporary North America",
    start: 1991,
    end: 2025,
    icon: GiQuillInk,
    headline: "Globalisation, digital era, and geopolitical realignment"
  }
];
const MESOAMERICA_RANGES = [
  {
    label: "Paleolithic Era",
    start: -3e5,
    end: -2e4,
    icon: GiCaveEntrance,
    headline: "No confirmed human presence"
  },
  {
    label: "Paleoindian Period",
    start: -2e4,
    end: -8e3,
    icon: GiFootprint,
    headline: "Early hunter-gatherers and migration"
  },
  {
    label: "Archaic Period",
    start: -8e3,
    end: -2e3,
    icon: GiAxeSword,
    headline: "Transition to agriculture and settled life"
  },
  {
    label: "Preclassic (Formative) Period",
    start: -2e3,
    end: 250,
    icon: GiWheat,
    headline: "Olmec civilization and early cities"
  },
  {
    label: "Early Classic Period",
    start: 250,
    end: 600,
    icon: GiTempleGate,
    headline: "Rise of Teotihuacan and Maya cities"
  },
  {
    label: "Late Classic Period",
    start: 600,
    end: 900,
    icon: GiTempleGate,
    headline: "Peak and collapse of Classic Maya civilization"
  },
  {
    label: "Postclassic Period",
    start: 900,
    end: 1521,
    icon: GiCastle,
    headline: "Toltec and Aztec dominance"
  },
  {
    label: "Spanish Conquest & Early Colonial",
    start: 1521,
    end: 1700,
    icon: GiMountains,
    headline: "Collapse of indigenous empires and colonial rule"
  },
  {
    label: "Colonial Mesoamerica",
    start: 1700,
    end: 1821,
    icon: GiPalmTree,
    headline: "New Spain and colonial society"
  },
  {
    label: "Independent Mexico & Region",
    start: 1821,
    end: 1910,
    icon: GiDiploma,
    headline: "Nation-building and instability"
  },
  {
    label: "Modern Mesoamerica",
    start: 1910,
    end: 2025,
    icon: GiQuillInk,
    headline: "Revolution and modern states"
  }
];
const ANDEAN_AMERICAS_RANGES = [
  {
    label: "Paleolithic Era",
    start: -3e5,
    end: -2e4,
    icon: GiCaveEntrance,
    headline: "No confirmed human presence"
  },
  {
    label: "Paleoindian Period",
    start: -2e4,
    end: -8e3,
    icon: GiFootprint,
    headline: "Early coastal and highland settlement"
  },
  {
    label: "Archaic Period",
    start: -8e3,
    end: -1800,
    icon: GiAxeSword,
    headline: "Fishing economies and early villages"
  },
  {
    label: "Initial Period",
    start: -1800,
    end: -900,
    icon: GiWheat,
    headline: "First monumental architecture and agriculture"
  },
  {
    label: "Early Horizon",
    start: -900,
    end: -200,
    icon: GiTempleGate,
    headline: "Chavín religious and cultural influence"
  },
  {
    label: "Early Intermediate Period",
    start: -200,
    end: 600,
    icon: GiTempleGate,
    headline: "Regional cultures like Moche and Nazca"
  },
  {
    label: "Middle Horizon",
    start: 600,
    end: 1e3,
    icon: GiCastle,
    headline: "Wari and Tiwanaku expansion"
  },
  {
    label: "Late Intermediate Period",
    start: 1e3,
    end: 1470,
    icon: GiCastle,
    headline: "Fragmented regional states"
  },
  {
    label: "Late Horizon (Inca Empire)",
    start: 1470,
    end: 1533,
    icon: GiAxeSword,
    headline: "Rapid imperial expansion of the Inca"
  },
  {
    label: "Colonial Andes",
    start: 1533,
    end: 1800,
    icon: GiMountains,
    headline: "Spanish conquest and viceroyalty"
  },
  {
    label: "Republican Era",
    start: 1800,
    end: 1900,
    icon: GiDiploma,
    headline: "Independence and early republics"
  },
  {
    label: "Modern Andean States",
    start: 1900,
    end: 2025,
    icon: GiQuillInk,
    headline: "Modern nations and development"
  }
];
const OCEANIA_RANGES = [
  {
    label: "Lower Paleolithic Sahul",
    start: -3e5,
    end: -6e4,
    icon: GiCaveEntrance,
    headline: "Early humans in Australia–New Guinea"
  },
  {
    label: "Middle Paleolithic Sahul",
    start: -6e4,
    end: -2e4,
    icon: GiCaveman,
    headline: "Coastal and inland foragers"
  },
  {
    label: "Upper Paleolithic Sahul",
    start: -2e4,
    end: -1500,
    icon: GiFootprint,
    headline: "Refined tools, adaptation, and early cultural complexity"
  },
  {
    label: "Early Settlement & Navigation",
    start: -1500,
    end: 800,
    icon: GiCompass,
    headline: "First Pacific migrations and Lapita expansion"
  },
  {
    label: "Regional Chiefdoms & Exchange",
    start: 800,
    end: 1500,
    icon: GiTempleGate,
    headline: "Polynesian chiefdoms and inter-island networks"
  },
  {
    label: "European Contact & Colonization",
    start: 1500,
    end: 1950,
    icon: GiMountains,
    headline: "Encounters, colonies, and protectorates"
  },
  {
    label: "Modern Pacific States",
    start: 1950,
    end: 2025,
    icon: GiQuillInk,
    headline: "Self-determination and island nations"
  }
];
const SOUTH_ASIA_RANGES = [
  {
    label: "Lower Paleolithic South Asia",
    start: -3e5,
    end: -6e4,
    icon: GiCaveEntrance,
    headline: "Early hunter-gatherers using core-and-flake tools"
  },
  {
    label: "Middle Paleolithic South Asia",
    start: -6e4,
    end: -25e3,
    icon: GiCaveman,
    headline: "Mobile foragers adapting to varied landscapes"
  },
  {
    label: "Upper Paleolithic South Asia",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Refined tools and early rock art"
  },
  {
    label: "South Asian Mesolithic and Neolithic",
    start: -1e4,
    end: -2600,
    icon: GiWheat,
    headline: "Microliths, herding, farming, and early settlements"
  },
  {
    label: "Indus Valley Civilization",
    start: -2600,
    end: -1900,
    icon: GiScrollUnfurled,
    headline: "Urban river-valley civilization"
  },
  {
    label: "Vedic and Mahajanapada Period",
    start: -1900,
    end: -322,
    icon: GiGreekSphinx,
    headline: "Vedic traditions, new religions, and early states"
  },
  {
    label: "Mauryan and Early Imperial South Asia",
    start: -322,
    end: 320,
    icon: GiLaurelCrown,
    headline: "Maurya, Indo-Greek, Kushan, and post-Mauryan powers"
  },
  {
    label: "Classical and Regional Kingdoms",
    start: 320,
    end: 1200,
    icon: GiTempleGate,
    headline: "Gupta, Pallava, Chalukya, and regional powers"
  },
  {
    label: "Delhi Sultanate and Regional States",
    start: 1200,
    end: 1526,
    icon: GiAxeSword,
    headline: "Turko-Afghan sultanates and regional kingdoms"
  },
  {
    label: "Mughal and Early Modern South Asia",
    start: 1526,
    end: 1757,
    icon: GiCastle,
    headline: "Mughals, Deccan states, and expanding trade"
  },
  {
    label: "Colonial South Asia",
    start: 1757,
    end: 1947,
    icon: GiMountains,
    headline: "Company rule, the Raj, and anti-colonial movements"
  },
  {
    label: "Modern South Asia",
    start: 1947,
    end: 2025,
    icon: GiQuillInk,
    headline: "Partition, independence, and regional states"
  }
];
const STEPPE_RANGES = [
  {
    label: "Lower Paleolithic Steppe",
    start: -3e5,
    end: -1e5,
    icon: GiCaveEntrance,
    headline: "Early human hunters on the Eurasian grasslands"
  },
  {
    label: "Middle Paleolithic Steppe",
    start: -1e5,
    end: -25e3,
    icon: GiCaveman,
    headline: "Neanderthals and early sapiens across the steppes"
  },
  {
    label: "Upper Paleolithic Steppe",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Hunter‑gatherers and symbolic culture"
  },
  {
    label: "Early Steppe Pastoralists",
    start: -1e4,
    end: -1e3,
    icon: GiWheat,
    headline: "Shepherds and herders before horse empires"
  },
  {
    label: "Early Nomadic Cultures",
    start: -1e3,
    end: 200,
    icon: GiAxeSword,
    headline: "Pastoralists and early horse peoples"
  },
  {
    label: "Scythian & Steppe Confederations",
    start: 200,
    end: 1200,
    icon: GiCastle,
    headline: "Horse‑archers and steppes empires"
  },
  {
    label: "Mongol Empire & Successors",
    start: 1200,
    end: 1400,
    icon: GiAxeSword,
    headline: "Mongol superstate and fragmentation"
  },
  {
    label: "Post‑Mongol Khanates",
    start: 1400,
    end: 1700,
    icon: GiCastle,
    headline: "Timurid, khanates, and nomadic states"
  },
  {
    label: "Incorporation into Empires",
    start: 1700,
    end: 1900,
    icon: GiMountains,
    headline: "Russian and Qing expansion"
  },
  {
    label: "Modern Central Asia",
    start: 1900,
    end: 2025,
    icon: GiQuillInk,
    headline: "Republics and post‑Soviet states"
  }
];
const EUROPE_RANGES = [
  {
    label: "Lower Paleolithic Europe",
    start: -3e5,
    end: -1e5,
    icon: GiCaveEntrance,
    headline: "First humans in Europe and cold‑climate hunters"
  },
  {
    label: "Middle Paleolithic Europe",
    start: -1e5,
    end: -25e3,
    icon: GiCaveman,
    headline: "Neanderthals and early sapiens survive the ice"
  },
  {
    label: "Upper Paleolithic Europe",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Cave art and symbolic revolution"
  },
  {
    label: "Mesolithic Europe",
    start: -1e4,
    end: -5e3,
    icon: GiWheat,
    headline: "Hunter‑gatherers after the glaciers"
  },
  {
    label: "Early Neolithic Europe",
    start: -5e3,
    end: -3e3,
    icon: GiStoneAxe,
    headline: "Farmers enter Europe and build megaliths"
  },
  {
    label: "Bronze Age Europe",
    start: -3e3,
    end: -800,
    icon: GiAnvil,
    headline: "Kingdoms, warriors, and early states"
  },
  {
    label: "Iron Age Europe",
    start: -800,
    end: 0,
    icon: GiAxeSword,
    headline: "Celts, Germans, and rising elites"
  },
  {
    label: "Classical Antiquity",
    start: 0,
    end: 500,
    icon: GiLaurelCrown,
    headline: "Rome, Athens, and the Mediterranean world"
  },
  {
    label: "Late Antiquity",
    start: 500,
    end: 750,
    icon: GiTempleGate,
    headline: "Transformation of the Roman world"
  },
  {
    label: "Early Middle Ages",
    start: 750,
    end: 1e3,
    icon: GiVisoredHelm,
    headline: "Kings, bishops, and local kingdoms"
  },
  {
    label: "High Middle Ages",
    start: 1e3,
    end: 1300,
    icon: GiCastle,
    headline: "Cathedrals, crusades, and feudal states"
  },
  {
    label: "Late Middle Ages",
    start: 1300,
    end: 1500,
    icon: GiFlame,
    headline: "Plague, war, and late feudal crises"
  },
  {
    label: "Renaissance & Early Modern",
    start: 1500,
    end: 1700,
    icon: GiPalette,
    headline: "Humanism, reformation, and global exploration"
  },
  {
    label: "Revolutionary & Napoleonic Era",
    start: 1700,
    end: 1815,
    icon: GiDiploma,
    headline: "Revolution, nationalism, and Napoleonic wars"
  },
  {
    label: "Industrial & Nationalism",
    start: 1815,
    end: 1914,
    icon: GiFactory,
    headline: "Factories, railways, and new nations"
  },
  {
    label: "World War Era",
    start: 1914,
    end: 1945,
    icon: GiFallingBomb,
    headline: "Trenches, total war, and fascism"
  },
  {
    label: "Postwar Europe",
    start: 1945,
    end: 1990,
    icon: GiSubmarineMissile,
    headline: "Reconstruction and Cold War divisions"
  },
  {
    label: "European Integration",
    start: 1990,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "EU, expansion, and contemporary crises"
  }
];
const SOUTHEAST_ASIA_RANGES = [
  {
    label: "Lower Paleolithic Southeast Asia",
    start: -3e5,
    end: -6e4,
    icon: GiCaveEntrance,
    headline: "Early humans in the rainforests and coasts"
  },
  {
    label: "Middle Paleolithic Southeast Asia",
    start: -6e4,
    end: -25e3,
    icon: GiCaveman,
    headline: "Regional hunter-gatherer traditions"
  },
  {
    label: "Upper Paleolithic Southeast Asia",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Advanced tools and early seafaring"
  },
  {
    label: "Neolithic Southeast Asia",
    start: -1e4,
    end: -2e3,
    icon: GiWheat,
    headline: "Rice agriculture and early village societies"
  },
  {
    label: "Bronze & Early Iron Age Southeast Asia",
    start: -2e3,
    end: -500,
    icon: GiAnvil,
    headline: "Metallurgy, trade networks, and proto-states"
  },
  {
    label: "Early States and Indianized Polities",
    start: -500,
    end: 800,
    icon: GiTempleGate,
    headline: "Funan, Chenla, and early Indic influence"
  },
  {
    label: "Classical Kingdoms & Maritime Empires",
    start: 800,
    end: 1400,
    icon: GiCompass,
    headline: "Srivijaya, Khmer, Champa, and trade networks"
  },
  {
    label: "Late Classical & Islamic Transition",
    start: 1400,
    end: 1600,
    icon: GiCastle,
    headline: "Majapahit, Ayutthaya, and rise of Islamic sultanates"
  },
  {
    label: "Early European Contact",
    start: 1600,
    end: 1800,
    icon: GiPalmTree,
    headline: "Portuguese, Dutch, and regional trade competition"
  },
  {
    label: "Colonial Southeast Asia",
    start: 1800,
    end: 1945,
    icon: GiMountains,
    headline: "European imperial dominance and restructuring"
  },
  {
    label: "Modern Southeast Asia",
    start: 1945,
    end: 2025,
    icon: GiQuillInk,
    headline: "Decolonization and nation-states"
  }
];
const ARCTIC_RANGES = [
  {
    label: "Lower Paleolithic Arctic",
    start: -3e5,
    end: -6e4,
    icon: GiCaveEntrance,
    headline: "Ice-age human presence at the northern margins"
  },
  {
    label: "Middle Paleolithic Arctic",
    start: -6e4,
    end: -25e3,
    icon: GiCaveman,
    headline: "Cold-adapted hunter-gatherers"
  },
  {
    label: "Upper Paleolithic Arctic",
    start: -25e3,
    end: -1e4,
    icon: GiFootprint,
    headline: "Late Ice Age survival and migration"
  },
  {
    label: "Paleo-Arctic Traditions",
    start: -1e4,
    end: -500,
    icon: GiAxeSword,
    headline: "Early Arctic cultures and mobile foragers"
  },
  {
    label: "Dorset Culture",
    start: -500,
    end: 1e3,
    icon: GiCompass,
    headline: "Pre-Inuit maritime Arctic societies"
  },
  {
    label: "Thule Expansion",
    start: 1e3,
    end: 1600,
    icon: GiAxeSword,
    headline: "Inuit expansion and whale-hunting societies"
  },
  {
    label: "Early European Contact",
    start: 1600,
    end: 1900,
    icon: GiMountains,
    headline: "Trade, missions, and colonial encroachment"
  },
  {
    label: "Modern Arctic",
    start: 1900,
    end: 2025,
    icon: GiQuillInk,
    headline: "Indigenous rights and Arctic geopolitics"
  }
];
const JAPAN_RANGES = [
  {
    label: "Prehistoric Japan",
    start: -3e5,
    end: -3e4,
    icon: GiCaveEntrance,
    headline: "Early human presence before confirmed archaeological cultures"
  },
  {
    label: "Japanese Paleolithic",
    start: -3e4,
    end: -14e3,
    icon: GiCaveman,
    headline: "First confirmed human activity and stone tools"
  },
  {
    label: "Jōmon Period",
    start: -14e3,
    end: -300,
    icon: GiFootprint,
    headline: "Sedentary foragers and early pottery culture"
  },
  {
    label: "Yayoi Period",
    start: -300,
    end: 250,
    icon: GiWheat,
    headline: "Rice agriculture and early state formation"
  },
  {
    label: "Kofun Period",
    start: 250,
    end: 538,
    icon: GiStoneAxe,
    headline: "Tomb mounds and Yamato state emergence"
  },
  {
    label: "Asuka Period",
    start: 538,
    end: 710,
    icon: GiCompass,
    headline: "Buddhism and early centralisation"
  },
  {
    label: "Nara Period",
    start: 710,
    end: 794,
    icon: GiTempleGate,
    headline: "First permanent capital and ritsuryō state"
  },
  {
    label: "Heian Period",
    start: 794,
    end: 1185,
    icon: GiTempleGate,
    headline: "Court culture and aristocratic dominance"
  },
  {
    label: "Kamakura Period",
    start: 1185,
    end: 1333,
    icon: GiCastle,
    headline: "First shogunate and samurai rule"
  },
  {
    label: "Muromachi Period",
    start: 1333,
    end: 1573,
    icon: GiCastle,
    headline: "Ashikaga rule and regional conflict"
  },
  {
    label: "Azuchi–Momoyama Period",
    start: 1573,
    end: 1603,
    icon: GiAxeSword,
    headline: "Unification under Nobunaga and Hideyoshi"
  },
  {
    label: "Edo Period",
    start: 1603,
    end: 1868,
    icon: GiWheat,
    headline: "Tokugawa rule and relative isolation"
  },
  {
    label: "Meiji Period",
    start: 1868,
    end: 1912,
    icon: GiFactory,
    headline: "Industrialisation and modernisation"
  },
  {
    label: "Taishō Period",
    start: 1912,
    end: 1926,
    icon: GiDiploma,
    headline: "Democracy and political change"
  },
  {
    label: "Shōwa Period (Pre-1945)",
    start: 1926,
    end: 1945,
    icon: GiVisoredHelm,
    headline: "Militarism and expansion"
  },
  {
    label: "Shōwa Period (Postwar)",
    start: 1945,
    end: 1989,
    icon: GiSubmarineMissile,
    headline: "Reconstruction and economic growth"
  },
  {
    label: "Heisei & Reiwa Japan",
    start: 1989,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "Modern Japan in a globalised world"
  }
];
const UK_RANGES = [
  {
    label: "Paleolithic Britain",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Early humans and Ice Age environments"
  },
  {
    label: "Mesolithic Britain",
    start: -1e4,
    end: -4e3,
    icon: GiWheat,
    headline: "Hunter-gatherers in post-glacial landscapes"
  },
  {
    label: "Neolithic Britain",
    start: -4e3,
    end: -2500,
    icon: GiStoneAxe,
    headline: "Farming and monument building"
  },
  {
    label: "Bronze Age Britain",
    start: -2500,
    end: -800,
    icon: GiAnvil,
    headline: "Metalworking and emerging elites"
  },
  {
    label: "Iron Age Britain",
    start: -800,
    end: 43,
    icon: GiAxeSword,
    headline: "Celtic societies and tribal kingdoms"
  },
  {
    label: "Roman Britain",
    start: 43,
    end: 410,
    icon: GiLaurelCrown,
    headline: "Province of the Roman Empire"
  },
  {
    label: "Sub-Roman Britain",
    start: 410,
    end: 600,
    icon: GiTempleGate,
    headline: "Post-Roman fragmentation and transition"
  },
  {
    label: "Anglo-Saxon England",
    start: 600,
    end: 871,
    icon: GiTempleGate,
    headline: "Kingdoms and Christianisation"
  },
  {
    label: "Viking Age England",
    start: 871,
    end: 1066,
    icon: GiAxeSword,
    headline: "Danelaw and Norse influence"
  },
  {
    label: "Norman & Angevin England",
    start: 1066,
    end: 1215,
    icon: GiCastle,
    headline: "Feudal monarchy and consolidation"
  },
  {
    label: "High Medieval England",
    start: 1215,
    end: 1348,
    icon: GiCastle,
    headline: "Magna Carta and baronial power"
  },
  {
    label: "Late Medieval England",
    start: 1348,
    end: 1485,
    icon: GiFlame,
    headline: "Black Death and Wars of the Roses"
  },
  {
    label: "Tudor England",
    start: 1485,
    end: 1603,
    icon: GiPalette,
    headline: "Reformation and centralisation"
  },
  {
    label: "Stuart Britain",
    start: 1603,
    end: 1714,
    icon: GiAxeSword,
    headline: "Union, civil war, and constitutional change"
  },
  {
    label: "Georgian Britain",
    start: 1714,
    end: 1837,
    icon: GiFactory,
    headline: "Empire expansion and industrialisation"
  },
  {
    label: "Victorian Britain",
    start: 1837,
    end: 1901,
    icon: GiFactory,
    headline: "Industrial peak and global empire"
  },
  {
    label: "Edwardian Britain",
    start: 1901,
    end: 1914,
    icon: GiVisoredHelm,
    headline: "Pre-war society and tensions"
  },
  {
    label: "World War Era",
    start: 1914,
    end: 1945,
    icon: GiFallingBomb,
    headline: "Total war and imperial decline"
  },
  {
    label: "Postwar Britain",
    start: 1945,
    end: 1979,
    icon: GiSubmarineMissile,
    headline: "Welfare state and decolonisation"
  },
  {
    label: "Late Modern Britain",
    start: 1979,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "Neoliberalism, EU, and Brexit-era politics"
  }
];
const IRAN_RANGES = [
  {
    label: "Paleolithic Iranian Plateau",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Early human habitation and hunter-gatherer networks"
  },
  {
    label: "Post-Ice Age Transformation",
    start: -1e4,
    end: -7e3,
    icon: GiFootprint,
    headline: "Environmental stabilisation and early regional adaptation"
  },
  {
    label: "Early Settlement & Proto-Agriculture",
    start: -7e3,
    end: -4e3,
    icon: GiStoneAxe,
    headline: "Village formation and early farming systems (e.g., Zagros regions)"
  },
  {
    label: "Proto-Urban Elamite & Plateau Cultures",
    start: -4e3,
    end: -2e3,
    icon: GiAnvil,
    headline: "Elam, early administrative systems, and regional complexity"
  },
  {
    label: "Bronze Age Iranian Interaction Sphere",
    start: -2e3,
    end: -1200,
    icon: GiTempleGate,
    headline: "Interregional trade, Indo-Iranian movement, and Elamite continuity"
  },
  {
    label: "Late Bronze to Early Iron Transition",
    start: -1200,
    end: -800,
    icon: GiFallingBomb,
    headline: "Regional restructuring and emergence of Iranian-speaking groups"
  },
  {
    label: "Median Formation & Early Iranian States",
    start: -800,
    end: -550,
    icon: GiAxeSword,
    headline: "Median polity formation and consolidation of plateau societies"
  },
  {
    label: "Imperial Iranian Plateau Systems",
    start: -550,
    end: -330,
    icon: GiLaurelCrown,
    headline: "Achaemenid imperial integration across Afro-Eurasia"
  },
  {
    label: "Hellenistic & Regional Iranian Rule",
    start: -330,
    end: 224,
    icon: GiTempleGate,
    headline: "Seleucid influence and Parthian state formation"
  },
  {
    label: "Sasanian System",
    start: 224,
    end: 651,
    icon: GiCastle,
    headline: "Centralised imperial administration and Zoroastrian state culture"
  },
  {
    label: "Early Islamic Iranian Transformation",
    start: 651,
    end: 900,
    icon: GiCompass,
    headline: "Political transition and cultural continuity under new systems"
  },
  {
    label: "Iranian Regional Dynastic Age",
    start: 900,
    end: 1500,
    icon: GiTempleGate,
    headline: "Tahirids, Samanids, Seljuks, and Timurid cultural synthesis"
  },
  {
    label: "Early Modern Iranian States",
    start: 1500,
    end: 1800,
    icon: GiCastle,
    headline: "Safavid, Afsharid, and regional imperial competition"
  },
  {
    label: "Qajar & Imperial Pressure Era",
    start: 1800,
    end: 1925,
    icon: GiMountains,
    headline: "External imperial influence and internal reform pressures"
  },
  {
    label: "Modern Iran",
    start: 1925,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "State modernisation, revolution, and contemporary politics"
  }
];
const MEDITERRANEAN_RANGES = [
  {
    label: "Paleolithic Mediterranean World",
    start: -3e5,
    end: -1e4,
    icon: GiCaveEntrance,
    headline: "Early human dispersal across Africa, Europe, and the Near East"
  },
  {
    label: "Post-Ice Age Mediterranean Transition",
    start: -1e4,
    end: -7e3,
    icon: GiFootprint,
    headline: "Climate stabilisation and coastal-adapted foraging societies"
  },
  {
    label: "Early Agricultural Mediterranean Networks",
    start: -7e3,
    end: -4e3,
    icon: GiStoneAxe,
    headline: "Farming spread and village-based societies across the basin"
  },
  {
    label: "Proto-Urban Mediterranean Systems",
    start: -4e3,
    end: -2e3,
    icon: GiAnvil,
    headline: "Early cities in Egypt, Levant, Anatolia, and Mesopotamian interface zones"
  },
  {
    label: "Bronze Age Interconnected States",
    start: -2e3,
    end: -1200,
    icon: GiTempleGate,
    headline: "Palace economies, maritime trade, and diplomatic systems"
  },
  {
    label: "Late Bronze Age Collapse & Reorganisation",
    start: -1200,
    end: -900,
    icon: GiFallingBomb,
    headline: "Widespread systemic collapse and regional restructuring"
  },
  {
    label: "Iron Age Mediterranean Formation",
    start: -900,
    end: -500,
    icon: GiAxeSword,
    headline: "Phoenician expansion, Greek polities, Neo-Assyrian influence"
  },
  {
    label: "Classical Mediterranean System",
    start: -500,
    end: 300,
    icon: GiLaurelCrown,
    headline: "Persian, Greek, and Roman imperial integration"
  },
  {
    label: "Late Antique Transformation",
    start: 300,
    end: 700,
    icon: GiTempleGate,
    headline: "Religious transformation and imperial fragmentation"
  },
  {
    label: "Early Medieval Mediterranean Fragmentation",
    start: 700,
    end: 1e3,
    icon: GiVisoredHelm,
    headline: "Byzantine, Islamic, and Latin regional systems"
  },
  {
    label: "High Medieval Mediterranean Trade System",
    start: 1e3,
    end: 1300,
    icon: GiCastle,
    headline: "Maritime republics, crusader states, and Islamic polities"
  },
  {
    label: "Late Medieval Mediterranean Crisis",
    start: 1300,
    end: 1500,
    icon: GiFlame,
    headline: "Pandemics, war, and shifting trade dominance"
  },
  {
    label: "Early Global Mediterranean Integration",
    start: 1500,
    end: 1700,
    icon: GiCompass,
    headline: "Atlantic shift and Ottoman-Habsburg competition"
  },
  {
    label: "Imperial Mediterranean World",
    start: 1700,
    end: 1900,
    icon: GiQuillInk,
    headline: "Declining centrality and global imperial pressures"
  },
  {
    label: "Modern Mediterranean Region",
    start: 1900,
    end: 2025,
    icon: GiWireframeGlobe,
    headline: "Nation-states, decolonisation, and modern geopolitics"
  }
];
const RANGE_SETS = {
  global: HISTORICAL_RANGES,
  "east-asia": EAST_ASIA_RANGES,
  "islamic-world": ISLAMIC_WORLD_RANGES,
  mediterranean: MEDITERRANEAN_RANGES,
  iran: IRAN_RANGES,
  "west-africa": WEST_AFRICA_RANGES,
  "sub-saharan-africa": SUB_SAHARAN_AFRICA_RANGES,
  "north-america": NORTH_AMERICAS_RANGES,
  mesoamerica: MESOAMERICA_RANGES,
  "andean-americas": ANDEAN_AMERICAS_RANGES,
  oceania: OCEANIA_RANGES,
  "south-asia": SOUTH_ASIA_RANGES,
  steppe: STEPPE_RANGES,
  europe: EUROPE_RANGES,
  "southeast-asia": SOUTHEAST_ASIA_RANGES,
  arctic: ARCTIC_RANGES,
  japan: JAPAN_RANGES,
  uk: UK_RANGES
};
const VIEW_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "east-asia", label: "East Asia" },
  { value: "islamic-world", label: "Islamic World" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "iran", label: "Iranian Plateau" },
  { value: "west-africa", label: "West Africa" },
  { value: "sub-saharan-africa", label: "Sub-Saharan Africa" },
  { value: "north-america", label: "North America" },
  { value: "mesoamerica", label: "Mesoamerica" },
  { value: "andean-americas", label: "Andean Americas" },
  { value: "oceania", label: "Oceania" },
  { value: "south-asia", label: "South Asia" },
  { value: "steppe", label: "Steppe" },
  { value: "europe", label: "Europe" },
  { value: "southeast-asia", label: "Southeast Asia" },
  { value: "arctic", label: "Arctic" },
  { value: "japan", label: "Japan" },
  { value: "uk", label: "United Kingdom" }
];
const VIEW_VALUES = VIEW_OPTIONS.map((option) => option.value);
function isEraView(value) {
  return VIEW_VALUES.includes(value);
}
function parseView(value) {
  if (!value) return void 0;
  return isEraView(value) ? value : void 0;
}
const EraContext = createContext(void 0);
const EraProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [dataStartYear, setDataStartYearState] = useState(-3e5);
  const [view, setViewState] = useState("global");
  useEffect(() => {
    const urlView = parseView(searchParams.get("v"));
    if (!urlView) return;
    setViewState(urlView);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("v");
    const nextSearch = nextParams.toString();
    const nextUrl = window.location.pathname + (nextSearch ? `?${nextSearch}` : "") + window.location.hash;
    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);
  const ranges = RANGE_SETS[view];
  const eraIndex = useMemo(() => {
    const idx = ranges.findIndex(
      (range) => dataStartYear >= range.start && dataStartYear <= range.end
    );
    return idx === -1 ? 0 : idx;
  }, [ranges, dataStartYear]);
  const current = ranges[eraIndex] ?? ranges[0];
  const setDataStartYear = useCallback((year) => {
    if (typeof year !== "number" || Number.isNaN(year)) return;
    setDataStartYearState((prev) => prev !== year ? year : prev);
  }, []);
  const setView = useCallback((nextView) => {
    setViewState(nextView);
  }, []);
  const setEra = useCallback(
    (rangeIndex) => {
      const range = ranges[rangeIndex];
      if (!range) return;
      setDataStartYearState((prev) => {
        const nextYear = Math.max(range.start, Math.min(prev, range.end));
        return prev !== nextYear ? nextYear : prev;
      });
    },
    [ranges]
  );
  const value = useMemo(
    () => ({
      startYear: current.start,
      endYear: current.end,
      label: current.label,
      eraIndex,
      headline: current.headline,
      Icon: current.icon,
      dataStartYear,
      setDataStartYear,
      view,
      setView,
      setEra
    }),
    [
      current.start,
      current.end,
      current.label,
      current.headline,
      current.icon,
      eraIndex,
      dataStartYear,
      setDataStartYear,
      view,
      setEra
    ]
  );
  return /* @__PURE__ */ jsx(EraContext.Provider, { value, children });
};
const useEra = () => {
  const ctx = useContext(EraContext);
  if (!ctx) throw new Error("useEra must be used inside EraProvider");
  return ctx;
};
const formatYear = (year) => {
  return year < 0 ? "BCE" : "CE";
};
function useCountAnimation(value) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));
  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1,
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [motionValue, value]);
  return rounded;
}
function TextSwap({
  text,
  className
}) {
  const [display, setDisplay] = useState(text);
  const progress = useMotionValue(0);
  useEffect(() => {
    const previous = display;
    let controls;
    controls = animate(progress, 0, {
      duration: Math.max(previous.length * 0.02, 0.08),
      ease: "linear",
      onUpdate: (v) => {
        setDisplay(previous.slice(0, Math.floor(v)));
      },
      onComplete: () => {
        controls = animate(progress, text.length, {
          duration: Math.max(text.length * 0.02, 0.08),
          ease: "linear",
          onUpdate: (v) => {
            setDisplay(text.slice(0, Math.floor(v)));
          }
        });
      }
    });
    return () => controls?.stop();
  }, [text]);
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `
    relative inline-block leading-none min-h-[1em] 
     truncate w-full
    ${className ?? ""}
  `,
      children: display || " "
    }
  );
}
function HeaderContainer({ children }) {
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 shadow-lg shadow-stone-950/30 backdrop-blur-sm overflow-hidden border-b border-stone-800 sm:h-[var(--header-height-sm)] md:h-[var(--header-height-md)] lg:h-[var(--header-height-lg)] w-full px-2 h-[8rem]", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/bg-home.webp",
        alt: "Era background",
        className: "absolute inset-0 w-full h-full object-cover object-top",
        fetchPriority: "high"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-overlay/56" }),
    children
  ] });
}
function TimelineHeader({ filter }) {
  const { startYear, endYear, label, headline, view, setView } = useEra();
  const groupMeta = filter.group > 0 ? themes.options.find((opt) => opt.value === filter.group) : null;
  const filterYearsReal = filter.yearStart !== -3e5 && filter.yearEnd !== 2025;
  const groupHasFallback = !!groupMeta?.fallbackYears;
  let years = null;
  if (filterYearsReal) {
    years = [filter.yearStart, filter.yearEnd];
  } else if (groupHasFallback) {
    years = groupMeta.fallbackYears;
  } else {
    years = [startYear, endYear];
  }
  const sortedYears = [...years].sort(
    (a, b) => filter.sortBy ? a - b : b - a
  );
  const firstYear = sortedYears?.[0] ?? 0;
  const secondYear = sortedYears?.[1] ?? 0;
  const subheadline = headline || groupMeta?.fallbackHeadline;
  return /* @__PURE__ */ jsx(HeaderContainer, { children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full flex flex-col justify-center text-center", children: [
    sortedYears && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-x-2 gap-y-1", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-baseline justify-center min-w-[10rem]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 tabular-nums", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 min-w-[5.8rem] justify-end", children: [
          /* @__PURE__ */ jsx(motion.span, { className: "text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90 [font-variant-numeric:tabular-nums]", children: useCountAnimation(Math.abs(firstYear)) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm md:text-md text-stone-300/70", children: formatYear(firstYear) })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm md:text-lg text-stone-300/70", children: "to" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 min-w-[5rem] justify-start", children: [
          /* @__PURE__ */ jsx(motion.span, { className: "text-sm sm:text-base md:text-lg lg:text-xl leading-none tracking-tight text-stone-200/90 [font-variant-numeric:tabular-nums]", children: useCountAnimation(Math.abs(secondYear)) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs sm:text-sm md:text-md text-stone-300/70", children: formatYear(secondYear) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "select",
        {
          id: "timeline-view",
          value: view,
          onChange: (e) => setView(e.target.value),
          className: "select select-ghost select-sm w-32 shrink-0 text-xs sm:text-sm md:text-base text-stone-300 border border-stone-500/20 hover:bg-stone-900 rounded",
          children: VIEW_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value))
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide uppercase text-stone-100 text-shadow-lg", children: groupMeta?.labelText ?? /* @__PURE__ */ jsx(TextSwap, { text: label, className: "align-middle" }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", initial: false, children: subheadline && /* @__PURE__ */ jsxs(
      motion.h3,
      {
        className: "font-serif text-xs sm:text-md md:text-lg tracking-tight uppercase text-stone-200/90 mt-1 truncate",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" },
        children: [
          "— ",
          subheadline,
          " —"
        ]
      },
      subheadline
    ) })
  ] }) });
}
async function graphqlRequest(query, variables) {
  try {
    const res = await api.post("", { query, variables });
    if (res.data?.errors?.length) {
      throw new Error(res.data.errors[0].message);
    }
    return res.data.data;
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}
const TIMELINE_QUERY = gql`
  query Timeline($cursor: ID, $filter: FilterInput, $viewerId: String) {
    timeline(cursor: $cursor, filter: $filter, viewerId: $viewerId) {
      posts {
        id
        name
        type
        startDescription
        endDescription
        startYear
        startMonth
        startDay
        endYear
        endMonth
        endDay
        startSignificance
        endSignificance
        imageUrl
        imageCredit
        sourceUrl
        cdnId
        country {
          name
          continent
        }
        subjects {
          id
          name
        }
        group {
          name
          icon
        }
        user {
          id
          username
        }
        likes
        liked
      }
      nextCursor
    }
  }
`;
const POPULATION_QUERY = gql`
  query GetPopulation($start: Int!) {
    getPopulation(start: $start)
  }
`;
const SIGNIFICANT_QUERY = gql`
  query GetSignificant($startYear: Int!, $endYear: Int!, $filter: FilterInput) {
    getSignificant(startYear: $startYear, endYear: $endYear, filter: $filter) {
      id
      name
      imageUrl
      cdnId
    }
  }
`;
const CIVILISATION_QUERY = gql`
  query GetCivilisation(
    $startYear: Int!
    $endYear: Int!
    $filter: FilterInput
  ) {
    getCivilisation(startYear: $startYear, endYear: $endYear, filter: $filter) {
      id
      name
      startYear
      endYear
      startSignificance
      country {
        name
        continent
      }
      group {
        id
      }
    }
  }
`;
const GET_POST = gql`
  query GetPostWithFormLists($id: Int!) {
    getPost(id: $id) {
      id
      name
      type
      startDescription
      endDescription
      startYear
      startMonth
      startDay
      endYear
      endMonth
      endDay
      startSignificance
      endSignificance
      imageUrl
      imageCredit
      sourceUrl
      civilisation
      country {
        name
        continent
      }
      subjects {
        id
        name
      }
      group {
        id
        name
        icon
      }
    }
    formLists {
      allCountries {
        name
        continent
      }
      allSubjects {
        id
        name
      }
      allGroups {
        id
        name
      }
    }
  }
`;
const GET_FORM_LISTS = gql`
  query GetFormLists {
    formLists {
      allCountries {
        name
        continent
      }
      allSubjects {
        id
        name
      }
      allGroups {
        id
        name
      }
    }
  }
`;
const USER_POSTS = gql`
  query UserPosts($userId: Int!) {
    userPosts(userId: $userId) {
      id
      name
      type
      startDescription
      endDescription
      startYear
      startMonth
      startDay
      endYear
      endMonth
      endDay
      startSignificance
      endSignificance
      imageUrl
      imageCredit
      sourceUrl
      cdnId
      civilisation
      country {
        name
        continent
      }
      subjects {
        id
        name
      }
      group {
        icon
      }
      user {
        id
        username
        createdAt
        role
      }
      likes
      liked
    }
  }
`;
const USER_LIKES = gql`
  query UserLikes($userId: Int!) {
    userLikes(userId: $userId) {
      post {
        id
        name
        type
        startDescription
        endDescription
        startYear
        startMonth
        startDay
        endYear
        endMonth
        endDay
        startSignificance
        endSignificance
        imageUrl
        imageCredit
        sourceUrl
        cdnId
        civilisation
        country {
          name
          continent
        }
        subjects {
          id
          name
        }
        group {
          icon
        }
        user {
          id
          username
          createdAt
          role
        }
        likes
        liked
      }
    }
  }
`;
const USER_STATS = gql`
  query UserStats($userId: Int!) {
    userStats(userId: $userId) {
      id
      username
      emailVerifiedAt
      createdAt
      stats {
        mostLikedPost {
          id
          name
          likes
          cdnId
          imageUrl
          liked
        }
        favouriteEra
        favouriteGroup {
          name
          icon
        }
      }
    }
  }
`;
const PENDING_CREATED_POSTS_QUERY = gql`
  query PendingCreatedPosts {
    pendingCreatedPosts {
      createdPosts {
        id
        data
        createdAt
        updatedAt
        suggestedBy {
          id
          username
        }
      }
    }
  }
`;
const PENDING_STATS_QUERY = gql`
  query PendingStats {
    pendingStats {
      pending
      approved
      rejected
    }
  }
`;
const SAVED_FILTERS_QUERY = gql`
  query SavedFilters {
    savedFilters {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`;
const PENDING_EDITS_QUERY = gql`
  query PendingEdits {
    pendingEdits {
      edits {
        id
        suggestedBy {
          id
          username
        }
        hasImageChanges
        post {
          id
          name
          type
          startDescription
          endDescription
          startYear
          startMonth
          startDay
          endYear
          endMonth
          endDay
          startSignificance
          endSignificance
          imageUrl
          imageCredit
          sourceUrl
          cdnId
          civilisation
          country {
            name
            continent
          }
          subjects {
            id
            name
          }
          group {
            id
            name
            icon
          }
        }
        changes {
          name {
            label
            kind
            from
            to
          }
          type {
            label
            kind
            from
            to
          }
          startYear {
            label
            kind
            from
            to
          }
          startMonth {
            label
            kind
            from
            to
          }
          startDay {
            label
            kind
            from
            to
          }
          endYear {
            label
            kind
            from
            to
          }
          endMonth {
            label
            kind
            from
            to
          }
          endDay {
            label
            kind
            from
            to
          }
          startDescription {
            label
            kind
            from
            to
          }
          endDescription {
            label
            kind
            from
            to
          }
          startSignificance {
            label
            kind
            from
            to
          }
          endSignificance {
            label
            kind
            from
            to
          }
          civilisation {
            label
            kind
            from
            to
          }
          country {
            label
            kind
            from
            to
          }
          group {
            label
            kind
            from
            to
          }
          subjects {
            label
            kind
            from
            to
          }
          imageUrl {
            label
            kind
            from
            to
          }
          imageCredit {
            label
            kind
            from
            to
          }
          sourceUrl {
            label
            kind
            from
            to
          }
        }
      }
    }
  }
`;
function useCivilisationQuery(variables) {
  return useQuery({
    queryKey: [
      "civilisation",
      variables.startYear,
      variables.endYear,
      JSON.stringify(variables.filter ?? null)
    ],
    queryFn: () => graphqlRequest(
      CIVILISATION_QUERY,
      variables
    ),
    staleTime: 1e3 * 60 * 30,
    placeholderData: (prev) => prev
  });
}
function usePopulationQuery(variables) {
  return useQuery({
    queryKey: ["population", variables],
    queryFn: () => graphqlRequest(
      POPULATION_QUERY,
      variables
    ),
    staleTime: 1e3 * 60 * 30,
    placeholderData: (prev) => prev
  });
}
function useSignificantQuery(variables) {
  return useQuery({
    queryKey: ["significant", variables],
    queryFn: () => graphqlRequest(
      SIGNIFICANT_QUERY,
      variables
    ),
    staleTime: 1e3 * 60 * 30,
    placeholderData: (prev) => prev
  });
}
function formatPopulation(population) {
  const suffixes = ["", " thousand", " million", " billion", " trillion", " quadrillion"];
  if (population < 1e3) return population.toString();
  let suffixNum = 0;
  let value = population;
  while (value >= 1e3 && suffixNum < suffixes.length - 1) {
    value /= 1e3;
    suffixNum++;
  }
  const rounded = value % 1 === 0 ? value.toString() : value.toFixed(1);
  return rounded + suffixes[suffixNum];
}
function cleanName(str) {
  if (!str) return str;
  return str.replace(/^The\s+/i, "").replace(/^Rise of the\s+/i, "").trim();
}
const groupColorMap = /* @__PURE__ */ new Map();
function groupColor(groupId, continent) {
  if (groupId == null) return "#adb7adff";
  if (groupColorMap.has(groupId)) return groupColorMap.get(groupId);
  const continentHueBand = {
    SouthAmerica: [330, 50],
    NorthAmerica: [280, 50],
    Europe: [230, 50],
    Africa: [180, 50],
    MiddleEast: [130, 50],
    Asia: [80, 50],
    Oceania: [30, 50],
    Antarctica: [0, 30],
    Global: [0, 360]
  };
  const safeGroup = Math.abs(groupId);
  const [center, width] = continent ? continentHueBand[continent] ?? [0, 360] : [0, 360];
  const steps = 7;
  const stepSize = width / steps;
  const hue = (center - width / 2 + safeGroup % steps * stepSize + 360) % 360;
  const lightnessSteps = [50, 60, 40];
  const saturationSteps = [65, 75, 70];
  const color = `hsl(${hue}, ${saturationSteps[safeGroup % saturationSteps.length]}%, ${lightnessSteps[safeGroup % lightnessSteps.length]}%)`;
  groupColorMap.set(groupId, color);
  return color;
}
const PostModal$1 = lazy(
  () => import("./TimelineModal-BBCY81Yq.js")
);
let cachedWorld = null;
function WorldMap({
  civilisations,
  onClick,
  isInteractive
}) {
  const { dataStartYear } = useEra();
  const queryClient2 = useQueryClient();
  const [openPost, setOpenPost] = useState(null);
  const [worldDataLoaded, setWorldDataLoaded] = useState(false);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const width = 320;
  const height = 180;
  const projection = useMemo(() => geoNaturalEarth1(), []);
  const path = useMemo(() => geoPath(projection), [projection]);
  const activeCivilisations = useMemo(
    () => civilisations.filter(
      (c) => c.startYear <= dataStartYear && c.endYear >= dataStartYear
    ),
    [civilisations, dataStartYear]
  );
  const countryMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    activeCivilisations.forEach((c) => {
      const key = c.country.name.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          civs: [],
          totalSignificance: 0,
          groupId: c.group?.id ?? null,
          country: {
            name: c.country.name,
            continent: c.country.continent
          }
        });
      }
      const entry2 = map.get(key);
      entry2.civs.push(c);
      entry2.totalSignificance += c.startSignificance;
    });
    return map;
  }, [activeCivilisations]);
  const groupColors = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const civ of activeCivilisations) {
      if (civ.group?.id != null && !map.has(civ.group.id)) {
        map.set(
          civ.group.id,
          groupColor(civ.group.id, civ.country.continent)
        );
      }
    }
    return map;
  }, [activeCivilisations]);
  const radiusScale = useMemo(
    () => scaleSqrt().domain([0, 3]).range([1.5, 6]).clamp(true),
    []
  );
  useEffect(() => {
    let cancelled = false;
    const loadWorld = async () => {
      if (!cachedWorld) {
        const mod = await import("./world-110m-EMfB1vJC.js");
        const topology = mod.default ?? mod;
        const fcUnknown = feature(
          topology,
          topology.objects.countries
        );
        if (fcUnknown.type !== "FeatureCollection") return;
        cachedWorld = fcUnknown;
      }
      if (!cancelled) setWorldDataLoaded(true);
    };
    loadWorld();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!svgRef.current || !cachedWorld || !worldDataLoaded) return;
    const svg = select(svgRef.current);
    projection.fitSize([width, height], cachedWorld);
    if (svg.select(".map-paths").empty()) {
      svg.append("g").classed("map-paths", true).selectAll("path").data(cachedWorld.features).join("path").attr("d", path).attr("fill", "oklch(55.3% 0.013 58.071)").attr("stroke", "#1B1715").attr("stroke-width", 0.3);
    }
  }, [worldDataLoaded]);
  useEffect(() => {
    if (!svgRef.current || !cachedWorld || !worldDataLoaded) return;
    const svg = select(svgRef.current);
    let dotsG = svg.select(".dots");
    if (dotsG.empty()) dotsG = svg.append("g").classed("dots", true);
    const filtered = cachedWorld.features.filter(
      (d) => countryMap.has(d.properties.name.trim().toLowerCase())
    );
    const circles = dotsG.selectAll("circle").data(filtered, (d) => d.properties.name);
    circles.exit().transition().duration(300).attr("r", 0).attr("opacity", 0).remove();
    const enterCircles = circles.enter().append("circle").attr("cx", (d) => projection(geoCentroid(d))?.[0] ?? 0).attr("cy", (d) => projection(geoCentroid(d))?.[1] ?? 0).attr("r", 0).attr("opacity", 0).attr("fill", (d) => {
      const entry2 = countryMap.get(d.properties.name.trim().toLowerCase());
      return entry2?.groupId ? groupColors.get(entry2.groupId) ?? "#adb7adff" : "#adb7adff";
    });
    enterCircles.merge(circles).transition().duration(300).attr("cx", (d) => projection(geoCentroid(d))?.[0] ?? 0).attr("cy", (d) => projection(geoCentroid(d))?.[1] ?? 0).attr("r", (d) => {
      const entry2 = countryMap.get(d.properties.name.trim().toLowerCase());
      return entry2 ? radiusScale(entry2.totalSignificance * entry2.civs.length) : 1.5;
    }).attr("fill", (d) => {
      const entry2 = countryMap.get(d.properties.name.trim().toLowerCase());
      return entry2?.groupId ? groupColors.get(entry2.groupId) ?? "#adb7adff" : "#adb7adff";
    }).attr("opacity", 0.9);
    dotsG.selectAll("circle").on("mouseenter", (_e, d) => {
      const entry2 = countryMap.get(d.properties.name.trim().toLowerCase());
      if (!entry2) return;
      select(tooltipRef.current).style("display", "block").html(
        `<strong>${d.properties.name}</strong><br/>${entry2.civs.map((c) => c.name).join("<br/>")}`
      ).style("opacity", 0).transition().duration(200).style("opacity", 1);
    }).on("mousemove", (event) => {
      if (!tooltipRef.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      tooltipRef.current.style.left = `${event.clientX - rect.left + 10}px`;
      tooltipRef.current.style.top = `${event.clientY - rect.top + 10}px`;
    }).on("mouseleave", () => {
      select(tooltipRef.current).style("display", "none");
    }).on("click", function(event, d) {
      const entry2 = countryMap.get(d.properties.name.trim().toLowerCase());
      if (!isInteractive) {
        onClick?.();
        return;
      }
      event.stopPropagation();
      if (!entry2?.civs.length) return;
      const queries = queryClient2.getQueriesData({
        queryKey: ["timeline"]
      });
      for (const [, data] of queries) {
        if (!data) continue;
        for (const page of data.pages) {
          const post = page.posts.find((p) => p.id === entry2.civs[0].id);
          if (post) {
            setOpenPost(post);
            return;
          }
        }
      }
    }).style("cursor", isInteractive ? "pointer" : "default");
  }, [countryMap, groupColors, worldDataLoaded]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative w-full",
        onClick,
        style: {
          cursor: isInteractive ? "default" : "pointer"
        },
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              ref: svgRef,
              viewBox: `0 0 ${width} ${height}`,
              className: "w-full h-auto"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              ref: tooltipRef,
              className: `${isInteractive ? "text-lg" : "text-sm"} absolute pointer-events-none bg-stone-800 text-stone-200 rounded px-2 py-1 hidden z-10`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: openPost && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(PostModal$1, { open: true, post: openPost, onClose: () => setOpenPost(null) }) }) })
  ] });
}
function StatsContainer({ children, timeline: timeline2 }) {
  return /* @__PURE__ */ jsx(
    "aside",
    {
      className: "fixed sm:sticky bottom-0 left-0 w-full z-30 sm:bottom-auto h-26 shadow-xl\r\n  sm:top-[var(--header-height-sm)]\r\n  md:top-[var(--header-height-md)]\r\n  lg:top-[var(--header-height-lg)]\r\n  sm:h-[calc(100vh-var(--header-height-sm))]\r\n  md:h-[calc(100vh-var(--header-height-md))]\r\n  lg:h-[calc(100vh-var(--header-height-lg))]\r\n",
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `${timeline2 ? "grid-cols-[29%_auto_33%] sm:grid-rows-[28%_32%_40%]" : "grid grid-cols-3 sm:grid-rows-3"} stats sm:stats-vertical sm:grid-cols-1 w-full h-full bg-gradient-to-br from-stats-primary to-stats-secondary border-t sm:border-l border-stone-800 shadow-lg shadow-stone-950/20 py-1 sm:py-0 rounded-none overflow-hidden`,
          children
        }
      )
    }
  );
}
function StatBlock({
  title,
  description,
  figure,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "stat p-3 xs:px-5 sm:px-4 lg:px-6 space-y-1 place-content-start sm:place-content-evenly items-start sm:items-center", children: [
    figure && /* @__PURE__ */ jsx("div", { className: "stat-figure text-gold/95 hidden sm:block", children: figure }),
    /* @__PURE__ */ jsx("div", { className: "stat-title text-stone-400 truncate self-end md:text-base", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-gold/95 font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl truncate", children }),
    description && /* @__PURE__ */ jsx("div", { className: "stat-desc truncate self-start text-stone-400 md:text-base", children: description })
  ] });
}
const MapModal = lazy(() => import("./MapModal-DnKNMmDD.js"));
function TimelineStats({ filter }) {
  const { startYear, endYear, label, Icon } = useEra();
  const [mapOpen, setMapOpen] = useState(false);
  const { data, isLoading } = usePopulationQuery({ start: startYear });
  const {
    data: sigData,
    isLoading: sigLoading,
    isError: sigError
  } = useSignificantQuery({
    startYear,
    endYear,
    filter
  });
  const { data: civData, isLoading: civLoading } = useCivilisationQuery({
    startYear,
    endYear,
    filter
  });
  const significant = sigData?.getSignificant;
  const civilisationsRaw = civData?.getCivilisation ?? [];
  const populationValue = data?.getPopulation ?? null;
  const imageSrc = significant?.cdnId ? `https://cdn.tldrhistory.xyz/${significant.cdnId}` : significant?.imageUrl ?? null;
  const animatedPopulation = useCountAnimation(populationValue ?? 0);
  const formattedPopulation = useTransform(
    animatedPopulation,
    (v) => formatPopulation(Math.round(v))
  );
  const civilisations = useMemo(() => {
    return Array.from(
      new Map(civilisationsRaw.map((c) => [cleanName(c.name), c])).values()
    );
  }, [civilisationsRaw]);
  return /* @__PURE__ */ jsxs(StatsContainer, { timeline: true, children: [
    /* @__PURE__ */ jsx(
      StatBlock,
      {
        title: "Population",
        description: label,
        figure: /* @__PURE__ */ jsx(Icon, { className: "w-8 md:w-10 lg:w-16 h-auto text-gold/95" }),
        children: isLoading ? /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg m-auto" }) : populationValue != null ? /* @__PURE__ */ jsx(motion.div, { className: "truncate", children: formattedPopulation }) : /* @__PURE__ */ jsx(motion.div, { className: "truncate", children: "—" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "h-full border-dashed border-r border-stone-700/60 sm:border-r-0 sm:border-b grid", children: /* @__PURE__ */ jsxs("div", { className: "sm:stat [overflow-y:hidden] h-20 sm:h-auto p-3 xs:px-5 sm:px-4 lg:px-6 space-y-1 place-content-start sm:place-content-evenly", children: [
      /* @__PURE__ */ jsx("div", { className: "stat-figure text-gold/95 hidden lg:block", children: imageSrc ? /* @__PURE__ */ jsx("div", { className: "avatar", children: /* @__PURE__ */ jsx("div", { className: "w-8 md:w-10 lg:w-16 hidden lg:block", children: /* @__PURE__ */ jsx(
        motion.img,
        {
          src: imageSrc,
          alt: significant?.name ?? "Significant figure",
          className: "absolute w-full h-full object-cover rounded-full",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.5 }
        },
        imageSrc
      ) }) }) : /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "w-8 md:w-10 lg:w-16 hidden lg:block stroke-current",
          fill: "none",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4S8 5.79 8 8s1.79 4 4 4zm0 2c-3.866 0-7 1.567-7 3.5V19h14v-1.5c0-1.933-3.134-3.5-7-3.5z"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "stat-title truncate self-end text-stone-400 md:text-base", children: "Most Significant" }),
      /* @__PURE__ */ jsxs("div", { className: "text-gold/95 font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl group", children: [
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "line-clamp-2 text-wrap",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2, ease: "easeOut" },
            onClick: (e) => {
              const tooltip = e.currentTarget.nextElementSibling;
              if (tooltip) {
                tooltip.style.opacity = tooltip.style.opacity === "1" ? "0" : "1";
              }
            },
            children: sigLoading ? /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg justify-center m-auto" }) : sigError ? "—" : significant?.name ? cleanName(significant.name) : "—"
          },
          sigLoading ? "loading" : sigError ? "—" : significant?.id ?? "empty"
        ) }),
        significant?.name && /* @__PURE__ */ jsx("div", { className: "absolute w-max max-w-xs bg-base-200 text-base-content text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none", children: cleanName(significant.name) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "stat-desc truncate self-start text-stone-400 md:text-base", children: "Highly influential event" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center", children: civLoading ? /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg justify-center m-auto text-gold/80" }) : /* @__PURE__ */ jsx("div", { className: "size-fit", children: /* @__PURE__ */ jsx(
      WorldMap,
      {
        civilisations,
        onClick: () => setMapOpen(true),
        isInteractive: false
      }
    ) }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: mapOpen && /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsx(
      MapModal,
      {
        open: mapOpen,
        onClose: () => setMapOpen(false),
        civilisations
      }
    ) }) })
  ] });
}
const Drawer = lazy(() => import("./Drawer-DRVKIm3m.js"));
const UtilityMenu = lazy(() => import("./UtilityMenu-CS853ViG.js"));
function TimelineLayout() {
  const { filter } = useTimelineFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(TimelineHeader, { filter }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] w-full bg-base", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col relative", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsx(Outlet, {}) }),
        /* @__PURE__ */ jsx("div", { className: "flex fixed z-40 right-0 top-1/2 -translate-y-1/10 sm:translate-y-0 sm:right-auto sm:top-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-4", children: /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(UtilityMenu, { onOpenDrawer: () => setDrawerOpen(true) }) }) })
      ] }),
      /* @__PURE__ */ jsx(TimelineStats, { filter })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(AnimatePresence, { children: drawerOpen && /* @__PURE__ */ jsx(
      Drawer,
      {
        isOpen: drawerOpen,
        onClose: () => setDrawerOpen(false)
      },
      "timeline-drawer"
    ) }) })
  ] });
}
const timeline = UNSAFE_withComponentProps(function TimelineRoute() {
  return /* @__PURE__ */ jsx(EraProvider, {
    children: /* @__PURE__ */ jsx(TimelineFilterProvider, {
      children: /* @__PURE__ */ jsx(TimelineLayout, {})
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: timeline
}, Symbol.toStringTag, { value: "Module" }));
const animatedPosts = /* @__PURE__ */ new Set();
const ICON_MAP = {
  GiEgyptianPyramids,
  GiLaurelCrown,
  GiColiseum,
  GiScrollUnfurled,
  GiStoneWall,
  GiVisoredHelm,
  GiPalette,
  GiSamaraMosque,
  GiVikingHelmet,
  GiTotem,
  GiHorseHead,
  GiByzantinTemple,
  GiFactory,
  GiEarthAmerica,
  GiCrossedSabres,
  GiCeremonialMask,
  GiMayanPyramid,
  GiMountaintop,
  GiLotusFlower,
  GiWingedEmblem,
  GiPagoda,
  GiArabicDoor,
  GiMusicalNotes,
  GiPirateFlag,
  GiJapaneseBridge,
  GiSamuraiHelmet,
  GiJapan,
  GiGalleon,
  GiBrazilFlag,
  GiTempleGate,
  GiDjembe,
  GiCaravan,
  GiCanoe,
  GiQuillInk,
  GiHolyGrail,
  GiAnchor,
  GiLightBulb,
  GiSubmarineMissile,
  GiWireframeGlobe,
  GiFist,
  GiFemale,
  GiSpearFeather,
  GiSouthAmerica,
  GiTreasureMap,
  GiMusket,
  GiRevolver,
  GiModernCity,
  GiStoneAxe,
  GiTank
};
function CardDescriptions({ post }) {
  const imageSrc = post.cdnId ? `https://cdn.tldrhistory.xyz/${post.cdnId}` : post.imageUrl;
  const hasImage = Boolean(imageSrc);
  const icon = post.group?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : void 0;
  return /* @__PURE__ */ jsxs("div", { className: "z-20 ", children: [
    hasImage ? /* @__PURE__ */ jsx(
      "img",
      {
        src: imageSrc,
        alt: post.name,
        className: "float-right ml-4 max-w-32 max-h-32 object-cover rounded shadow-md",
        loading: "eager"
      }
    ) : IconComponent ? /* @__PURE__ */ jsx(IconComponent, { className: "h-70 w-70 -right-8 -bottom-8 absolute text-stone-400/6 z-0" }) : null,
    /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-stone-300", children: post.startDescription })
  ] });
}
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;
const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(email: $email, password: $password, username: $username) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;
const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;
const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail {
    resendVerificationEmail {
      success
      message
    }
  }
`;
const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;
const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      token
      needsEmailVerification
      user {
        id
        username
        email
        role
        emailVerifiedAt
      }
    }
  }
`;
const LIKE_POST = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId) {
      id
      likes
      liked
    }
  }
`;
const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;
const SUGGEST_EDIT = `
  mutation SuggestEdit($postId: Int!, $input: PostInput!) {
    suggestEdit(postId: $postId, input: $input) {
      id
      status
      data
      post { id name }
      suggestedBy { id username }
    }
  }
`;
const APPROVE_EDIT_MUTATION = `
  mutation ApproveEdit($id: Int!) {
    approveEdit(id: $id)
  }
`;
const REJECT_EDIT_MUTATION = `
  mutation RejectEdit($id: Int!) {
    rejectEdit(id: $id)
  }
`;
const CREATE_POST_SUGGESTION_MUTATION = gql`
  mutation CreatePostSuggestion($input: PostInput!) {
    createPostSuggestion(input: $input) {
      id
      status
      data
      createdAt
      updatedAt
      suggestedBy {
        id
        username
      }
    }
  }
`;
const APPROVE_CREATED_POST_MUTATION = `
  mutation ApproveCreatedPost($id: Int!) {
    approveCreatedPost(id: $id)
  }
`;
const REJECT_CREATED_POST_MUTATION = `
  mutation RejectCreatedPost($id: Int!) {
    rejectCreatedPost(id: $id)
  }
`;
const SAVE_FILTER_MUTATION = gql`
  mutation SaveFilter($input: SaveFilterInput!) {
    saveFilter(input: $input) {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`;
const EDIT_SAVED_FILTER_MUTATION = gql`
  mutation EditSavedFilter($input: EditSavedFilterInput!) {
    editSavedFilter(input: $input) {
      id
      name
      state {
        search
        sortBy
        type
        subject
        continent
        yearStart
        yearEnd
        group
        view
      }
      createdAt
      updatedAt
    }
  }
`;
const DELETE_SAVED_FILTER_MUTATION = gql`
  mutation DeleteSavedFilter($input: DeleteSavedFilterInput!) {
    deleteSavedFilter(input: $input) {
      id
      name
    }
  }
`;
function CardFooter({ post }) {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  useEffect(() => {
    setLiked(post.liked);
    setLikesCount(post.likes);
  }, [post.liked, post.likes]);
  const likePostMutation = useMutation({
    mutationFn: (variables) => graphqlRequest(
      LIKE_POST,
      variables
    ),
    onSuccess: (data) => {
      setLiked(data.likePost.liked);
      setLikesCount(data.likePost.likes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userLikes"] });
    }
  });
  function handleClick(e) {
    e.stopPropagation();
    if (!isAuth.token) {
      navigate("/login");
      return;
    }
    likePostMutation.mutate({ postId: Number(post.id) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center justify-end gap-1", children: [
    /* @__PURE__ */ jsx(
      motion.button,
      {
        onClick: handleClick,
        disabled: likePostMutation.isPending,
        className: "btn btn-ghost btn-sm text-gold p-1 hover:text-gold-hover hover:bg-stone-800/70",
        "aria-label": liked ? "Unlike article" : "Like article",
        whileTap: { scale: 0.9 },
        children: /* @__PURE__ */ jsx(
          motion.svg,
          {
            xmlns: "http://www.w3.org/2000/svg",
            className: "h-6 w-6",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            fill: liked ? "currentColor" : "none",
            initial: false,
            animate: {
              fill: liked ? "currentColor" : "none",
              scale: liked ? 1.1 : 1
            },
            transition: { type: "spring", stiffness: 500, damping: 20 },
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "2",
                d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "text-base", children: likesCount })
  ] });
}
const SUBJECT_ICONS = {
  art: FaPalette,
  military: LuSwords,
  politics: FaGavel,
  economic: FaCoins,
  culture: FaTheaterMasks,
  religion: FaScroll,
  maritime: GiSailboat,
  environment: FaTree,
  intellectual: MdOutlineScience
};
function CardSubjects({ subjects, modal }) {
  return /* @__PURE__ */ jsx("div", { className: "items-center flex flex-wrap gap-2 items-center", children: subjects.map((s) => {
    const Icon = SUBJECT_ICONS[s.name];
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `badge ${modal ? "bg-gold/90" : "bg-stone-800/60"} border border-stone-800 flex items-center text-sm gap-1 shadow-sm shadow-stone-950/30 text-stone-200 p-3`,
        children: [
          Icon && /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
          " ",
          s.name
        ]
      },
      s.id
    );
  }) });
}
function formatDate(year, month, day) {
  const isBCE = year < 0;
  const absYear = Math.abs(year);
  const y = absYear + (isBCE ? " BCE" : " CE");
  const m = month ?? 0;
  const d = day ?? 0;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (m === 0) return y;
  if (d === 0) return `${months[m - 1]} ${y}`;
  return `${d} ${months[m - 1]} ${y}`;
}
function CardHeader({ post }) {
  const start = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay)
  );
  const end = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay)
  );
  const metadata = `${start}${end && end !== "0 CE" ? ` - ${end}` : ""}, ${post.country.name}`;
  return /* @__PURE__ */ jsxs("div", { className: "z-20", children: [
    /* @__PURE__ */ jsx("h2", { className: "card-title text-stone-200 text-xl font-bold md:text-2xl mb-2", children: post.name }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-stone-400 text-md sm:text-lg", children: /* @__PURE__ */ jsx("span", { children: metadata }) }) })
  ] });
}
function CardContainer({
  children,
  significant
}) {
  return /* @__PURE__ */ jsx(
    "article",
    {
      className: `w-full card h-full bg-gradient-to-br from-card-primary to-card-secondary flex flex-col overflow-hidden border p-5 sm:p-6 space-y-4 sm:space-y-6 ${significant ? "border-gold border-2" : "border-stone-700"}`,
      children
    }
  );
}
function ArticleCard({ post }) {
  return /* @__PURE__ */ jsxs(CardContainer, { ...post.startSignificance === 1 && { significant: true }, children: [
    /* @__PURE__ */ jsx(CardHeader, { post }),
    /* @__PURE__ */ jsx(CardDescriptions, { post }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-auto z-20", children: [
      /* @__PURE__ */ jsx(CardSubjects, { subjects: post.subjects }),
      /* @__PURE__ */ jsx(CardFooter, { post })
    ] })
  ] });
}
const AnimatedCard = forwardRef(
  ({ post, width, onClick }, ref) => {
    const hasAnimated = animatedPosts.has(post.id);
    useEffect(() => {
      if (!hasAnimated) {
        animatedPosts.add(post.id);
      }
    }, [hasAnimated, post.id]);
    const handleClick = useCallback(() => onClick(post), [onClick, post]);
    return /* @__PURE__ */ jsx(
      motion.div,
      {
        ref,
        style: { width },
        onClick: handleClick,
        "data-post-id": post.id,
        "data-start-year": post.startYear,
        initial: hasAnimated ? false : { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.35, ease: "easeOut" },
        className: "rounded-xl shadow-lg shadow-stone-950/35",
        whileHover: {
          scale: 1.03,
          y: -3
        },
        children: /* @__PURE__ */ jsx(ArticleCard, { post })
      }
    );
  }
);
const AnimatedCard$1 = memo(AnimatedCard);
function Skeleton() {
  return /* @__PURE__ */ jsx("div", { className: "card bg-gradient-to-br from-card-primary to-card-secondary shadow-xl shadow-stone-950/40 border border-stone-700 w-full", children: /* @__PURE__ */ jsxs("div", { className: "card-body w-full px-5 gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-7 w-[70%]" }),
    /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-[40%] mb-4" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-full" }),
        /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-[60%]" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 w-32 h-32 rounded shrink-0" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
      /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-[20%]" }),
      /* @__PURE__ */ jsx("div", { className: "skeleton bg-stone-500/70 h-5 w-[20%]" })
    ] })
  ] }) });
}
function timelineQueryKey(args) {
  return ["timeline", "list", args.filter ?? null, args.viewerKey];
}
function timelineInfiniteQueryOptions(args) {
  const { filter, viewerKey } = args;
  return infiniteQueryOptions({
    queryKey: timelineQueryKey({ filter, viewerKey }),
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const data = await graphqlRequest(TIMELINE_QUERY, {
        cursor: pageParam ?? void 0,
        filter
      });
      if (!data?.timeline) {
        throw new Error("No timeline data returned");
      }
      return data.timeline;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? void 0
  });
}
const EMPTY_POSTS = [];
function useTimeline({ filter } = {}) {
  const { isAuth } = useAuth();
  const viewerKey = isAuth.id ?? "anonymous";
  const { initialData } = useLoaderData();
  const query = useInfiniteQuery({
    ...timelineInfiniteQueryOptions({
      filter,
      viewerKey
    }),
    initialData: viewerKey === "anonymous" && initialData ? {
      pages: [initialData],
      pageParams: []
    } : void 0,
    placeholderData: (previousData, previousQuery) => {
      const previousKey = previousQuery?.queryKey;
      const previousFilter = previousKey?.[2] ?? null;
      const previousViewerKey = previousKey?.[3];
      const currentFilter = filter ?? null;
      const isSameFilter = JSON.stringify(previousFilter) === JSON.stringify(currentFilter);
      const isViewerTransition = previousViewerKey === "anonymous" && viewerKey !== "anonymous";
      const isSameViewer = previousViewerKey === viewerKey;
      return isSameFilter && (isSameViewer || isViewerTransition) ? previousData : void 0;
    },
    staleTime: 3e4,
    refetchOnMount: viewerKey === "anonymous" ? false : "always"
  });
  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page.posts) ?? EMPTY_POSTS,
    [query.data]
  );
  return {
    posts,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error
  };
}
function useEraTracker(posts, postRefs) {
  const { setDataStartYear } = useEra();
  const currentYearRef = useRef(null);
  const lastIndexRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const rafIdRef = useRef(null);
  useEffect(() => {
    if (!posts.length) return;
    lastIndexRef.current = 0;
    currentYearRef.current = null;
    const update = () => {
      tickingRef.current = false;
      const scrollY = window.scrollY;
      const scrollingDown = scrollY >= lastScrollYRef.current;
      lastScrollYRef.current = scrollY;
      let index = lastIndexRef.current;
      const start = Math.max(0, Math.min(index, posts.length - 1));
      if (scrollingDown) {
        for (let i = start; i < posts.length; i++) {
          const el = postRefs.get(posts[i].id)?.current;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0) {
            index = i;
            break;
          }
        }
      } else {
        for (let i = start; i >= 0; i--) {
          const el = postRefs.get(posts[i].id)?.current;
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            index = Math.min(i + 1, posts.length - 1);
            break;
          }
          index = i;
        }
      }
      lastIndexRef.current = index;
      const topPost = posts[index];
      if (!topPost) return;
      if (currentYearRef.current !== topPost.startYear) {
        currentYearRef.current = topPost.startYear;
        setDataStartYear(topPost.startYear);
      }
    };
    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafIdRef.current = requestAnimationFrame(update);
      }
    };
    rafIdRef.current = requestAnimationFrame(update);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [posts, postRefs, setDataStartYear]);
}
const PostModal = lazy(() => import("./TimelineModal-BBCY81Yq.js"));
function StaticTimelineGrid({
  posts,
  renderStaticCard,
  hidden
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": hidden,
      className: hidden ? "pointer-events-none invisible absolute inset-0" : "",
      children: /* @__PURE__ */ jsx("div", { className: "columns-1 gap-6 lg:columns-2", children: posts.map((post) => /* @__PURE__ */ jsx("div", { className: "mb-6 break-inside-avoid", children: renderStaticCard(post) }, post.id)) })
    }
  );
}
function Timeline({ filter }) {
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTimeline({ filter });
  const [openPost, setOpenPost] = useState(null);
  const [isEnhanced, setIsEnhanced] = useState(false);
  useEffect(() => {
    setIsEnhanced(true);
  }, []);
  const safePosts = useMemo(
    () => posts.filter((post) => !!post && !!post.id),
    [posts]
  );
  const postRefs = useRef(
    /* @__PURE__ */ new Map()
  );
  const getPostRef = useCallback((id) => {
    let ref = postRefs.current.get(id);
    if (!ref) {
      ref = createRef();
      postRefs.current.set(id, ref);
    }
    return ref;
  }, []);
  useEraTracker(safePosts, postRefs.current);
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const maybeLoadMore = useInfiniteLoader(loadMore, {
    isItemLoaded: (index, items) => index < items.length && !!items[index],
    threshold: 10
  });
  const renderMasonryCard = useCallback(
    ({ data, width }) => /* @__PURE__ */ jsx(
      AnimatedCard$1,
      {
        post: data,
        width,
        onClick: setOpenPost,
        ref: getPostRef(data.id)
      },
      data.id
    ),
    [getPostRef]
  );
  const renderStaticCard = useCallback(
    (post) => /* @__PURE__ */ jsx(
      AnimatedCard$1,
      {
        post,
        onClick: setOpenPost,
        ref: getPostRef(post.id)
      },
      post.id
    ),
    [getPostRef]
  );
  return /* @__PURE__ */ jsxs("div", { className: "relative pb-20", children: [
    !isLoading && safePosts.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-lg text-stone-900", children: "No posts yet" }),
    isLoading && safePosts.length === 0 && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.35, ease: "easeOut" },
        className: "grid grid-cols-1 gap-3 lg:grid-cols-2",
        children: [
          /* @__PURE__ */ jsx(Skeleton, {}),
          /* @__PURE__ */ jsx(Skeleton, {})
        ]
      }
    ),
    safePosts.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        StaticTimelineGrid,
        {
          posts: safePosts,
          renderStaticCard,
          hidden: isEnhanced
        }
      ),
      isEnhanced && /* @__PURE__ */ jsx(
        Masonry,
        {
          items: safePosts,
          itemKey: (post) => post.id,
          columnGutter: 24,
          columnWidth: 350,
          itemHeightEstimate: 420,
          onRender: maybeLoadMore,
          render: renderMasonryCard
        },
        JSON.stringify(filter)
      )
    ] }),
    isFetchingNextPage && isEnhanced && /* @__PURE__ */ jsx("span", { className: "loading loading-spinner mx-auto flex pt-14 text-gold loading-xl" }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: openPost && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(PostModal, { open: true, post: openPost, onClose: () => setOpenPost(null) }) }) })
  ] });
}
function normalizeFilter(filter) {
  const trimmedSearch = filter.search?.trim();
  return {
    ...filter,
    search: trimmedSearch ? trimmedSearch : void 0,
    sortBy: filter.sortBy ?? DEFAULT_TIMELINE_FILTER.sortBy,
    type: filter.type ?? DEFAULT_TIMELINE_FILTER.type,
    subject: filter.subject ?? DEFAULT_TIMELINE_FILTER.subject,
    continent: filter.continent ?? DEFAULT_TIMELINE_FILTER.continent,
    group: filter.group ?? DEFAULT_TIMELINE_FILTER.group,
    yearStart: filter.yearStart ?? DEFAULT_TIMELINE_FILTER.yearStart,
    yearEnd: filter.yearEnd ?? DEFAULT_TIMELINE_FILTER.yearEnd
  };
}
function buildTimelineFilterFromUrl(args) {
  const url = new URL(args.requestUrl);
  const partial = searchParamsToPartialFilter(url.searchParams);
  const group = getGroupIdFromSlug(args.groupSlug ?? null) ?? DEFAULT_TIMELINE_FILTER.group;
  return normalizeFilter({
    ...DEFAULT_TIMELINE_FILTER,
    ...partial,
    group
  });
}
async function fetchTimeline({
  filter,
  cursor,
  viewerId = "anonymous"
}) {
  const data = await graphqlRequest(TIMELINE_QUERY, {
    cursor: void 0,
    filter,
    viewerId
  });
  if (!data?.timeline) {
    throw new Error("No timeline data returned");
  }
  return data.timeline;
}
async function timelineLoader({
  request,
  params
}) {
  const groupId = getGroupIdFromSlug(params?.groupSlug ?? null);
  if (params?.groupSlug && !groupId) {
    throw new Response("Not Found", { status: 404 });
  }
  const filter = buildTimelineFilterFromUrl({
    groupSlug: params?.groupSlug,
    requestUrl: request.url
  });
  const initialData = await fetchTimeline({
    filter,
    cursor: null,
    viewerId: "anonymous"
  });
  return { filter, initialData, viewerId: "anonymous" };
}
function meta$e({}) {
  return buildMeta({
    title: "History Timeline | TLDR History",
    description: "Browse an interactive timeline of human history across eras, civilisations, and major turning points.",
    path: "/timeline",
    type: "website"
  });
}
const timeline_index = UNSAFE_withComponentProps(function TimelineIndex() {
  const {
    filter
  } = useTimelineFilter();
  return /* @__PURE__ */ jsx(Timeline, {
    filter
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: timeline_index,
  loader: timelineLoader,
  meta: meta$e
}, Symbol.toStringTag, { value: "Module" }));
function meta$d({
  params
}) {
  const allThemes = themes.options;
  const theme = allThemes.find((item) => item.slug === params.groupSlug);
  if (!theme) {
    return buildMeta({
      title: "Timeline Not Found | TLDR History",
      description: "The requested timeline could not be found.",
      path: `/timeline/${params.groupSlug ?? ""}`,
      robots: "noindex, nofollow",
      type: "website"
    });
  }
  const title = `${theme.labelText} Timeline | TLDR History`;
  const description = theme.fallbackHeadline || `Explore the ${theme.labelText.toLowerCase()} timeline on TLDR History, including key events, people, and historical context.`;
  return buildMeta({
    title,
    description,
    path: `/timeline/${params.groupSlug}`,
    type: "article"
  });
}
const timeline_$groupSlug = UNSAFE_withComponentProps(function TimelineGroup() {
  const {
    filter
  } = useTimelineFilter();
  return /* @__PURE__ */ jsx(Timeline, {
    filter
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: timeline_$groupSlug,
  loader: timelineLoader,
  meta: meta$d
}, Symbol.toStringTag, { value: "Module" }));
function useLoginMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      LOGIN_MUTATION,
      variables
    )
  });
}
function useRegisterMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      REGISTER_MUTATION,
      variables
    )
  });
}
function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      VERIFY_EMAIL_MUTATION,
      variables
    )
  });
}
function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      FORGOT_PASSWORD_MUTATION,
      variables
    )
  });
}
function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      RESET_PASSWORD_MUTATION,
      variables
    )
  });
}
function useResendVerificationEmailMutation() {
  return useMutation({
    mutationFn: () => graphqlRequest(
      RESEND_VERIFICATION_EMAIL_MUTATION
    )
  });
}
const registerSchema = z.object({
  email: z.email("Invalid email address"),
  username: z.string().min(3, "Username too short").max(30, "Username too long").regex(/^[A-Za-z][A-Za-z0-9-]*$/, "Invalid username"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    "Must include uppercase, lowercase, and number"
  ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});
function meta$c({}) {
  return buildMeta({
    title: "Register | TLDR History",
    description: "Create a TLDR History account to save timelines, personalize your experience, and access member features.",
    path: "/register",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const register = UNSAFE_withComponentProps(function Register() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation();
  const {
    addToast
  } = useToast();
  const {
    login: login2
  } = useAuth();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const handleRegister = (e) => {
    e.preventDefault();
    setErrors({});
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate({
      email: result.data.email,
      username: result.data.username,
      password: result.data.password
    }, {
      onSuccess: (data) => {
        login2(data.register.token, data.register.user, true);
        addToast({
          type: "success",
          message: "Registration successful! Please verify your email."
        });
        navigate("/timeline", {
          replace: true,
          state: {
            email: data.register.user.email
          }
        });
      },
      onError: (error) => {
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (message.includes("email")) {
            setErrors({
              email: "That email is already in use"
            });
            return;
          }
          if (message.includes("username")) {
            setErrors({
              username: "That username is already taken"
            });
            return;
          }
        }
        addToast({
          type: "error",
          message: "Could not create your account. Please try again."
        });
      }
    });
  };
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsx("div", {
      className: "card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl",
      children: /* @__PURE__ */ jsxs("form", {
        className: "card-body text-center",
        onSubmit: handleRegister,
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-serif font-semibold tracking-wide text-stone-200 pb-2",
          children: "Register now!"
        }), /* @__PURE__ */ jsx("p", {
          className: "hidden sm:block pb-6 text-stone-300/90 lg:text-lg",
          children: "Create an account to continue."
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600",
          children: /* @__PURE__ */ jsx("input", {
            name: "username",
            type: "text",
            className: "text-stone-200 caret-stone-200",
            "aria-label": "username",
            placeholder: "Username",
            value: form.username,
            onChange: (e) => setForm({
              ...form,
              username: e.target.value
            }),
            autoComplete: "on"
          })
        }), errors.username && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.username
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600",
          children: /* @__PURE__ */ jsx("input", {
            name: "email",
            type: "email",
            className: "text-stone-200 caret-stone-200",
            "aria-label": "email",
            placeholder: "mail@site.com",
            value: form.email,
            onChange: (e) => setForm({
              ...form,
              email: e.target.value
            }),
            autoComplete: "on"
          })
        }), errors.email && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.email
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600",
          children: /* @__PURE__ */ jsx("input", {
            name: "password",
            type: "password",
            className: "text-stone-200 caret-stone-200",
            "aria-label": "password",
            placeholder: "Password",
            value: form.password,
            onChange: (e) => setForm({
              ...form,
              password: e.target.value
            })
          })
        }), errors.password && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.password
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 w-full bg-stone-900/93 border-stone-600 mb-4",
          children: /* @__PURE__ */ jsx("input", {
            name: "confirmPassword",
            type: "password",
            className: "text-stone-200 caret-stone-200",
            "aria-label": "confirm password",
            placeholder: "Confirm Password",
            value: form.confirmPassword,
            onChange: (e) => setForm({
              ...form,
              confirmPassword: e.target.value
            })
          })
        }), errors.confirmPassword && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.confirmPassword
        }), /* @__PURE__ */ jsxs("label", {
          htmlFor: "accept",
          className: "flex items-start gap-3 text-stone-300 cursor-pointer mb-4",
          children: [/* @__PURE__ */ jsx("input", {
            id: "accept",
            type: "checkbox",
            required: true,
            className: "mt-1 shrink-0 checkbox rounded border-stone-600 inset-shadow-none bg-stone-900 checked:border-gold checked:bg-stone-950 checked:text-gold"
          }), /* @__PURE__ */ jsxs("span", {
            className: "text-sm leading-6 text-start",
            children: ["I have read and agree to the", " ", /* @__PURE__ */ jsx(Link, {
              to: "/terms",
              className: "text-gold underline underline-offset-2",
              onClick: (e) => e.stopPropagation(),
              children: "Terms of Service"
            }), " ", "and the", " ", /* @__PURE__ */ jsx(Link, {
              to: "/privacy",
              className: "text-gold underline underline-offset-2",
              onClick: (e) => e.stopPropagation(),
              children: "Privacy Policy"
            }), "."]
          })]
        }), /* @__PURE__ */ jsx(Button, {
          isLoading: mutation.isPending,
          primary: true,
          label: "Register",
          type: "submit",
          loading: "Registering..."
        })]
      })
    })
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: register,
  meta: meta$c
}, Symbol.toStringTag, { value: "Module" }));
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});
function meta$b({}) {
  return buildMeta({
    title: "Login | TLDR History",
    description: "Log in to your TLDR History account to access saved timelines, writing tools, and account features.",
    path: "/login",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const login = UNSAFE_withComponentProps(function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login: login2
  } = useAuth();
  const {
    addToast
  } = useToast();
  const mutation = useLoginMutation();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
      setErrors(fieldErrors);
      return;
    }
    const from = location.state?.from || "/";
    mutation.mutate(result.data, {
      onSuccess: (data) => {
        const authUser = {
          id: data.login.user.id,
          username: data.login.user.username,
          role: data.login.user.role,
          emailVerifiedAt: data.login.user.emailVerifiedAt ?? null
        };
        login2(data.login.token, authUser, true);
        if (data.login.needsEmailVerification) {
          addToast({
            type: "success",
            message: "Please verify your email address."
          });
          navigate(from, {
            replace: true,
            state: {
              email: data.login.user.email,
              from
            }
          });
          return;
        }
        navigate(from, {
          replace: true
        });
      },
      onError: () => setErrors({
        password: "Invalid email or password"
      })
    });
  };
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsx("div", {
      className: "card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-sm shadow-stone-950/40 shadow-xl text-center",
      children: /* @__PURE__ */ jsxs("form", {
        className: "card-body",
        onSubmit: handleLogin,
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-serif font-semibold tracking-wide text-stone-200 pb-2",
          children: "Welcome Back!"
        }), /* @__PURE__ */ jsx("p", {
          className: "hidden sm:block pb-6 text-stone-300/90 lg:text-lg",
          children: "Login to continue."
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full",
          children: /* @__PURE__ */ jsx("input", {
            name: "email",
            type: "email",
            className: "text-stone-200 caret-stone-200",
            placeholder: "mail@site.com",
            "aria-label": "email",
            value: form.email,
            onChange: (e) => setForm({
              ...form,
              email: e.target.value
            }),
            autoComplete: "on"
          })
        }), errors.email && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.email
        }), /* @__PURE__ */ jsx("label", {
          className: "input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full",
          children: /* @__PURE__ */ jsx("input", {
            name: "password",
            type: "password",
            className: "text-stone-200 caret-stone-200",
            "aria-label": "password",
            placeholder: "Password",
            value: form.password,
            onChange: (e) => setForm({
              ...form,
              password: e.target.value
            })
          })
        }), errors.password && /* @__PURE__ */ jsx("p", {
          className: "text-error text-xs",
          children: errors.password
        }), /* @__PURE__ */ jsx("div", {
          className: "mb-4 text-right",
          children: /* @__PURE__ */ jsx(Link, {
            to: "/forgot-password",
            className: "text-sm text-gold underline underline-offset-2",
            children: "Forgot password?"
          })
        }), /* @__PURE__ */ jsx(Button, {
          isLoading: mutation.isPending,
          primary: true,
          label: "Login",
          type: "submit",
          loading: "Logging In..."
        })]
      })
    })
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login,
  meta: meta$b
}, Symbol.toStringTag, { value: "Module" }));
const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address")
});
function meta$a({}) {
  return buildMeta({
    title: "Forgot Password | TLDR History",
    description: "Enter your email address and we'll send you a link to reset your password.",
    path: "/forgot-password",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const forgotPassword = UNSAFE_withComponentProps(function ForgotPassword() {
  const navigate = useNavigate();
  const {
    addToast
  } = useToast();
  const mutation = useForgotPasswordMutation();
  const [form, setForm] = useState({
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("form");
  const [submittedEmail, setSubmittedEmail] = useState("");
  useEffect(() => {
    if (view !== "success") return;
    const timeout = window.setTimeout(() => {
      navigate("/timeline", {
        state: {
          emailSentTo: submittedEmail,
          justRequestedPasswordReset: true
        }
      });
    }, 3e3);
    return () => window.clearTimeout(timeout);
  }, [view, submittedEmail, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const result = forgotPasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate({
      email: result.data.email
    }, {
      onSuccess: (data) => {
        setSubmittedEmail(result.data.email);
        setView("success");
        addToast({
          type: "success",
          message: data.forgotPassword.message
        });
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        addToast({
          type: "error",
          message
        });
      }
    });
  };
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsx("div", {
      className: "card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden",
      children: /* @__PURE__ */ jsx(AnimatePresence, {
        mode: "wait",
        children: view === "success" ? /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center space-y-2 mb-6",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-3xl",
                children: "✓"
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "card-title text-2xl font-serif text-stone-200 mx-auto mb-2",
              children: "Check your email"
            })]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-stone-300 mb-6",
            children: ["We've sent a password reset link to ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("strong", {
              className: "text-stone-200",
              children: submittedEmail
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-sm text-stone-400 mb-8",
            children: "Didn't receive the email? Check your spam folder."
          }), /* @__PURE__ */ jsx(Button, {
            primary: true,
            label: "Back to login",
            onClick: () => navigate("/login")
          })]
        }, "success") : /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "card-body",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 text-center mx-auto mb-2",
            children: "Forgot password?"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-stone-300 text-center mb-8",
            children: "Enter your email address and we'll send you a link to reset your password."
          }), /* @__PURE__ */ jsxs("form", {
            className: "space-y-4",
            onSubmit: handleSubmit,
            children: [/* @__PURE__ */ jsx("label", {
              className: "input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full",
              children: /* @__PURE__ */ jsx("input", {
                name: "email",
                type: "email",
                className: "text-stone-200 caret-stone-200 flex-1",
                "aria-label": "email",
                placeholder: "mail@site.com",
                value: form.email,
                onChange: (e) => setForm({
                  email: e.target.value
                }),
                autoComplete: "email"
              })
            }), errors.email && /* @__PURE__ */ jsx("p", {
              className: "text-error text-xs",
              children: errors.email
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4",
              children: [/* @__PURE__ */ jsx(Button, {
                isLoading: mutation.isPending,
                primary: true,
                label: "Send reset link",
                type: "submit",
                loading: "Sending..."
              }), /* @__PURE__ */ jsx(Button, {
                label: "Back to login",
                onClick: () => navigate("/login")
              })]
            })]
          })]
        }, "form")
      })
    })
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: forgotPassword,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").regex(
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    "Must include uppercase, lowercase, and number"
  ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});
function meta$9({}) {
  return buildMeta({
    title: "Reset Password | TLDR History",
    description: "Choose a new password for your TLDR History account.",
    path: "/reset-password",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const resetPassword = UNSAFE_withComponentProps(function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    addToast
  } = useToast();
  const mutation = useResetPasswordMutation();
  const token = searchParams.get("token");
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [view, setView] = useState(token ? "form" : "invalid");
  useEffect(() => {
    setView(token ? "form" : "invalid");
  }, [token]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    if (!token) {
      setView("invalid");
      addToast({
        type: "error",
        message: "Invalid reset link. Please request a new one."
      });
      return;
    }
    const result = resetSchema.safeParse(passwords);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate({
      token,
      password: passwords.password
    }, {
      onSuccess: () => {
        setView("success");
        addToast({
          type: "success",
          message: "Password reset successfully."
        });
        setTimeout(() => {
          navigate("/timeline", {
            replace: true,
            state: {
              passwordResetComplete: true
            }
          });
        }, 2e3);
      },
      onError: () => {
        setView("invalid");
        addToast({
          type: "error",
          message: "Reset link is invalid or expired."
        });
      }
    });
  };
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsx("div", {
      className: "card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden",
      children: /* @__PURE__ */ jsx(AnimatePresence, {
        mode: "wait",
        children: view === "invalid" ? /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 mx-auto mb-2",
            children: "Invalid reset link"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-stone-300 mb-6",
            children: "This reset link is missing or invalid. Please request a new one."
          }), /* @__PURE__ */ jsx(Button, {
            primary: true,
            label: "Try again",
            onClick: () => navigate("/forgot-password")
          })]
        }, "invalid") : view === "success" ? /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center space-y-2 mb-6",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-3xl",
                children: "✓"
              })
            }), /* @__PURE__ */ jsx("h1", {
              className: "card-title text-2xl font-serif text-stone-200 mx-auto mb-2",
              children: "Password reset successful"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-stone-300 mb-6",
            children: "Redirecting you to timeline..."
          }), /* @__PURE__ */ jsx(Button, {
            primary: true,
            label: "Go to timeline",
            onClick: () => navigate("/timeline")
          })]
        }, "success") : /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "card-body",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 text-center mx-auto mb-2",
            children: "Reset your password"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-stone-300 text-center mb-8",
            children: "Enter a new password for your TLDR History account."
          }), /* @__PURE__ */ jsxs("form", {
            className: "space-y-4",
            onSubmit: handleSubmit,
            children: [/* @__PURE__ */ jsx("label", {
              className: "input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full",
              children: /* @__PURE__ */ jsx("input", {
                name: "password",
                type: "password",
                className: "text-stone-200 caret-stone-200 flex-1",
                "aria-label": "new password",
                placeholder: "New password",
                value: passwords.password,
                onChange: (e) => setPasswords({
                  ...passwords,
                  password: e.target.value
                }),
                autoComplete: "new-password"
              })
            }), errors.password && /* @__PURE__ */ jsx("p", {
              className: "text-error text-xs",
              children: errors.password
            }), /* @__PURE__ */ jsx("label", {
              className: "input input-bordered flex items-center gap-2 bg-stone-900/93 border-stone-600 w-full",
              children: /* @__PURE__ */ jsx("input", {
                name: "confirmPassword",
                type: "password",
                className: "text-stone-200 caret-stone-200 flex-1",
                "aria-label": "confirm new password",
                placeholder: "Confirm new password",
                value: passwords.confirmPassword,
                onChange: (e) => setPasswords({
                  ...passwords,
                  confirmPassword: e.target.value
                }),
                autoComplete: "new-password"
              })
            }), errors.confirmPassword && /* @__PURE__ */ jsx("p", {
              className: "text-error text-xs",
              children: errors.confirmPassword
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4 pt-4",
              children: [/* @__PURE__ */ jsx(Button, {
                isLoading: mutation.isPending,
                primary: true,
                label: "Reset password",
                type: "submit",
                loading: "Resetting..."
              }), /* @__PURE__ */ jsx(Button, {
                label: "Back to login",
                onClick: () => navigate("/login")
              })]
            })]
          })]
        }, "form")
      })
    })
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: resetPassword,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
function meta$8({}) {
  return buildMeta({
    title: "Verify Email | TLDR History",
    description: "Verify your email address to complete your TLDR History account setup.",
    path: "/verify",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const verify = UNSAFE_withComponentProps(function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    addToast
  } = useToast();
  const {
    isAuth
  } = useAuth();
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationEmailMutation();
  const hasVerifiedRef = useRef(false);
  const redirectTimeoutRef = useRef(null);
  const token = searchParams.get("token");
  const from = location.state?.from || "/timeline";
  const [view, setView] = useState(token ? "verifying" : "prompt");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!token && isAuth.token && isAuth.emailVerifiedAt) {
      setView("success");
      setMessage("Your email is already verified.");
    }
  }, [token, isAuth.token, isAuth.emailVerifiedAt]);
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (!token) {
      setView("prompt");
      setMessage("");
      return;
    }
    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;
    setView("verifying");
    setMessage("");
    verifyMutation.mutate({
      token
    }, {
      onSuccess: (data) => {
        if (data.verifyEmail.success) {
          setView("success");
          setMessage("Your email has been verified successfully.");
          addToast({
            type: "success",
            message: "Email verified successfully."
          });
          redirectTimeoutRef.current = window.setTimeout(() => {
            navigate(from, {
              replace: true
            });
          }, 1500);
          return;
        }
        setView("invalid");
        setMessage(data.verifyEmail.message || "This verification link is invalid or has expired.");
      },
      onError: () => {
        setView("invalid");
        setMessage("This verification link is invalid or has expired.");
      }
    });
  }, [token, verifyMutation, navigate, from, addToast]);
  const handleResend = () => {
    setMessage("");
    resendMutation.mutate(void 0, {
      onSuccess: () => {
        setView("prompt");
        addToast({
          type: "success",
          message: "We have sent you a verification email. Please check your inbox and spam folder."
        });
        setMessage("We have sent you a new verification email. Please check your inbox and spam folder.");
      },
      onError: () => {
        setMessage("We could not send a new verification email right now. Please try again shortly.");
      }
    });
  };
  const motionProps = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    transition: {
      duration: 0.2
    }
  };
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsx("div", {
      className: "card border border-stone-900/70 bg-gradient-to-br from-stone-800 to-stone-900 w-full max-w-md shadow-stone-950/40 shadow-xl overflow-hidden",
      children: /* @__PURE__ */ jsx(AnimatePresence, {
        mode: "wait",
        children: view === "verifying" ? /* @__PURE__ */ jsxs(motion.div, {
          ...motionProps,
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 mb-2",
            children: "Email Verification"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "loading loading-bars loading-lg text-gold mx-auto"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-300",
              children: "Verifying your email address..."
            })]
          })]
        }, "verifying") : view === "success" ? /* @__PURE__ */ jsxs(motion.div, {
          ...motionProps,
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200  mb-2",
            children: "Email Verification"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-3xl",
                children: "✓"
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-200 font-semibold",
              children: "Email verified successfully"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-300",
              children: message || "Redirecting you back..."
            }), /* @__PURE__ */ jsx(Button, {
              primary: true,
              label: "Continue",
              onClick: () => navigate(from, {
                replace: true
              })
            })]
          })]
        }, "success") : view === "invalid" ? /* @__PURE__ */ jsxs(motion.div, {
          ...motionProps,
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 mb-2",
            children: "Email Verification"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-3xl",
                children: "✕"
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-200 font-semibold",
              children: "Verification failed"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-300",
              children: message || "This verification link is invalid or has expired."
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4 pt-2",
              children: [/* @__PURE__ */ jsx(Button, {
                isLoading: resendMutation.isPending,
                primary: true,
                label: "Resend email",
                onClick: handleResend,
                loading: "Sending..."
              }), /* @__PURE__ */ jsx(Button, {
                label: "Go back",
                onClick: () => navigate(from, {
                  replace: true
                })
              })]
            })]
          })]
        }, "invalid") : /* @__PURE__ */ jsxs(motion.div, {
          ...motionProps,
          className: "card-body items-center text-center",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "card-title text-4xl font-serif text-stone-200 mb-2",
            children: "Verify your email"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-20 h-20 bg-gold/30 rounded-full flex items-center justify-center border-4 border-gold mx-auto",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-3xl",
                children: "!"
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-200 font-semibold",
              children: "Your account is not verified yet"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-stone-300",
              children: message || "Please verify your email address to continue with account features like creating and editing content."
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-stone-400",
              children: "We can send you a new verification email now."
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4 pt-2",
              children: [/* @__PURE__ */ jsx(Button, {
                isLoading: resendMutation.isPending,
                primary: true,
                label: "Verify Email",
                onClick: handleResend,
                loading: "Sending..."
              }), /* @__PURE__ */ jsx(Button, {
                label: "Go back",
                onClick: () => navigate(from, {
                  replace: true
                })
              })]
            })]
          })]
        }, "prompt")
      })
    })
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: verify,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
function UserHeader({
  memberSince,
  user,
  isLoading,
  verified
}) {
  const isNotFound = !isLoading && !user;
  return /* @__PURE__ */ jsx(HeaderContainer, { children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full flex flex-col justify-center sm:py-6.5 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase text-stone-100 text-shadow-lg", children: isLoading ? /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-md" }) : isNotFound ? "User Not Found" : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { children: user }),
      verified && /* @__PURE__ */ jsx("sup", { className: "text-xs sm:text-sm md:text-md lg:text-lg text-gold", children: /* @__PURE__ */ jsx(MdVerifiedUser, {}) })
    ] }) }),
    !isNotFound && /* @__PURE__ */ jsx("h2", { className: "text-xs sm:text-md md:text-lg text-stone-200/90 mt-1 uppercase font-serif ", children: isLoading ? "—" : `— Since ${memberSince} —` })
  ] }) });
}
function useUserPostsQuery(variables, options) {
  return useQuery({
    queryKey: ["userPosts", variables.userId],
    queryFn: () => graphqlRequest(USER_POSTS, variables),
    staleTime: 1e3 * 60 * 30,
    placeholderData: (prev) => prev,
    ...options
  });
}
function useUserLikesQuery(variables, options) {
  return useQuery({
    queryKey: ["userLikes", variables.userId],
    queryFn: () => graphqlRequest(USER_LIKES, variables),
    staleTime: 1e3 * 60 * 30,
    placeholderData: (prev) => prev,
    ...options
  });
}
function getUserStatsQueryOptions(variables) {
  return queryOptions({
    queryKey: ["userStats", variables.userId],
    queryFn: () => graphqlRequest(
      USER_STATS,
      variables
    ),
    staleTime: 1e3 * 60 * 30
  });
}
function useUserStatsQuery(variables) {
  return useQuery({
    ...getUserStatsQueryOptions(variables),
    placeholderData: (prev) => prev
  });
}
function TimelineTabs({
  active,
  onClick,
  children,
  role,
  ariaSelected,
  ariaControls,
  id
}) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick,
      role,
      "aria-selected": ariaSelected,
      "aria-controls": ariaControls,
      id,
      className: `pb-2 px-2 text-base sm:text-lg transition ${active ? "border-b-3 border-gold font-bold text-gold" : "font-semibold text-stone-400 hover:text-stone-500"}`,
      children
    }
  );
}
function TabbedTimeline({
  tabs,
  items,
  activeTab,
  onTabChange,
  getItemKey,
  renderCard,
  renderEmpty,
  isLoading,
  isError = false,
  className = "p-4 pb-40 sm:p-6"
}) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0].id);
  const currentTab = activeTab ?? internalActiveTab;
  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    setInternalActiveTab(tab);
  };
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "mb-6 mt-1 flex gap-4 border-b border-stone-600 sm:mt-3",
        role: "tablist",
        "aria-label": "Timeline tabs",
        children: tabs.map((tab) => /* @__PURE__ */ jsxs(
          TimelineTabs,
          {
            active: currentTab === tab.id,
            onClick: () => handleTabChange(tab.id),
            role: "tab",
            ariaSelected: currentTab === tab.id,
            ariaControls: `timeline-panel-${tab.id}`,
            id: `timeline-tab-${tab.id}`,
            children: [
              tab.label,
              " ",
              tab.count !== void 0 && `(${tab.count})`
            ]
          },
          tab.id
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Skeleton, {}),
      /* @__PURE__ */ jsx(Skeleton, {})
    ] }) : isError ? /* @__PURE__ */ jsx("div", { className: "py-10 text-gold font-semibold", children: "Failed to load timeline data." }) : items.length === 0 ? renderEmpty ? renderEmpty(currentTab) : /* @__PURE__ */ jsx("p", { className: "min-h-[40vh] text-stone-800/86 text-shadow-sm", children: "No items yet." }) : /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        id: `timeline-panel-${currentTab}`,
        role: "tabpanel",
        "aria-labelledby": `timeline-tab-${currentTab}`,
        initial: { opacity: 0, y: 2 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -2 },
        transition: { duration: 0.2 },
        children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: items.map((item, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "card shadow-lg shadow-black/40",
            children: renderCard(item)
          },
          getItemKey(item, index)
        )) })
      },
      String(currentTab)
    ) })
  ] });
}
function UserTimeline({ userId }) {
  const [activeTab, setActiveTab] = useState("created");
  const {
    data: createdPostsData,
    isLoading: isCreatedPostsLoading,
    isError: isCreatedPostsError
  } = useUserPostsQuery({ userId });
  const {
    data: likedPostsData,
    isLoading: isLikedPostsLoading,
    isError: isLikedPostsError
  } = useUserLikesQuery({ userId });
  const createdPosts = createdPostsData?.userPosts ?? [];
  const likedPosts = likedPostsData?.userLikes.map((l) => l.post) ?? [];
  const tabs = [
    {
      id: "created",
      label: "Created",
      count: createdPosts.length
    },
    {
      id: "liked",
      label: "Liked",
      count: likedPosts.length
    }
  ];
  const items = activeTab === "created" ? createdPosts : likedPosts;
  const isLoading = activeTab === "created" ? isCreatedPostsLoading : isLikedPostsLoading;
  const isError = activeTab === "created" ? isCreatedPostsError : isLikedPostsError;
  return /* @__PURE__ */ jsx(
    TabbedTimeline,
    {
      tabs,
      activeTab,
      onTabChange: setActiveTab,
      items,
      getItemKey: (post) => post.id,
      renderCard: (post) => /* @__PURE__ */ jsx(ArticleCard, { post }),
      renderEmpty: (tab) => /* @__PURE__ */ jsx("p", { className: "min-h-[40vh] text-stone-800/86 text-shadow-sm", children: tab === "created" ? "No articles created yet." : "No liked articles yet." }),
      isLoading,
      isError
    }
  );
}
function StatCard({
  title,
  value,
  description,
  imageSrc,
  icon: Icon,
  isLoading = false,
  isNotFound = false
}) {
  return /* @__PURE__ */ jsxs("div", { className: "stat lg:gap-2 space-y-1 p-3 xs:px-5 sm:px-4 lg:px-6 items-start sm:items-center", children: [
    (imageSrc || Icon) && /* @__PURE__ */ jsx("div", { className: "stat-figure text-gold/95 hidden sm:block", children: imageSrc ? /* @__PURE__ */ jsx("div", { className: "avatar", children: /* @__PURE__ */ jsx("div", { className: "w-8 md:w-10 lg:w-16", children: /* @__PURE__ */ jsx(
      motion.img,
      {
        src: imageSrc,
        alt: title,
        className: "absolute w-full h-full object-cover rounded-full",
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 }
      },
      imageSrc
    ) }) }) : Icon ? /* @__PURE__ */ jsx(Icon, { className: "w-8 md:w-10 lg:w-16 h-auto" }) : null }),
    /* @__PURE__ */ jsx("div", { className: "stat-title text-stone-400 truncate self-end md:text-base", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-gold/95 truncate font-extrabold text-md sm:text-xl md:text-3xl lg:text-4xl", children: isLoading ? /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg m-auto" }) : isNotFound ? "—" : value ?? "—" }),
    description && /* @__PURE__ */ jsx("div", { className: "stat-desc truncate self-start text-stone-400/60 md:text-base", children: description })
  ] });
}
function UserStats({ stats, isLoading }) {
  const isNotFound = !isLoading && !stats;
  const imageSrc = stats?.mostLikedPost?.cdnId ? `https://cdn.tldrhistory.xyz/${stats?.mostLikedPost?.cdnId}` : stats?.mostLikedPost?.imageUrl;
  const icon = stats?.favouriteGroup?.icon;
  const IconComponent = icon ? ICON_MAP[icon] : void 0;
  const era = HISTORICAL_RANGES.find((r) => r.label === stats?.favouriteEra);
  const EraIcon = era?.icon;
  return /* @__PURE__ */ jsxs(StatsContainer, { children: [
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Top Contribution",
        value: stats?.mostLikedPost?.name ?? "—",
        description: "Most Liked Article",
        isLoading,
        isNotFound,
        imageSrc: imageSrc ?? void 0
      }
    ),
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Favourite Era",
        value: stats?.favouriteEra ?? "—",
        description: "Most Contributions",
        isLoading,
        isNotFound,
        icon: EraIcon
      }
    ),
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Favourite Group",
        value: stats?.favouriteGroup?.name ?? "—",
        description: "Most Liked Articles",
        isLoading,
        isNotFound,
        icon: IconComponent
      }
    )
  ] });
}
async function loader({
  params
}) {
  const userId = Number(params.id);
  if (!Number.isFinite(userId) || userId <= 0) {
    throw new Response("Invalid user id", {
      status: 404
    });
  }
  const data = await queryClient.ensureQueryData(getUserStatsQueryOptions({
    userId
  }));
  return {
    userStats: data?.userStats
  };
}
function meta$7({
  data,
  params
}) {
  const stats = data?.userStats;
  if (!stats?.username) {
    return buildMeta({
      title: "User Profile | TLDR History",
      description: "User profile on TLDR History.",
      path: `/user/${params.id ?? "not-found"}`,
      robots: "noindex, nofollow",
      type: "website"
    });
  }
  return buildMeta({
    title: `${stats.username} | TLDR History`,
    description: `${stats.username}'s profile and timelines on TLDR History.`,
    path: `/user/${params.id}`,
    type: "website"
  });
}
const user_$id = UNSAFE_withComponentProps(function User() {
  const {
    id
  } = useParams();
  const userId = Number(id);
  const {
    data,
    isLoading
  } = useUserStatsQuery({
    userId
  });
  const stats = data?.userStats;
  const formattedDate = stats?.createdAt ? new Date(Number(stats.createdAt)).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(UserHeader, {
      memberSince: formattedDate,
      user: stats?.username,
      isLoading,
      verified: stats?.emailVerifiedAt
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] bg-base",
      children: [/* @__PURE__ */ jsx(UserTimeline, {
        userId
      }), /* @__PURE__ */ jsx(UserStats, {
        stats: stats?.stats,
        isLoading
      })]
    })]
  });
});
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: user_$id,
  loader,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const articles = UNSAFE_withComponentProps(function ArticlesLayout() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: articles
}, Symbol.toStringTag, { value: "Module" }));
function RequireAuth({
  children,
  requireRole,
  requireVerified = false
}) {
  const { isAuth, loading } = useAuth();
  const location = useLocation();
  const from = location.pathname + location.search;
  if (loading) {
    return /* @__PURE__ */ jsx(PageContainer, { children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg mx-auto flex text-gold" }) });
  }
  if (!isAuth.token) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login", replace: true, state: { from } });
  }
  if (requireVerified && !isAuth.emailVerifiedAt) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/verify", replace: true, state: { from } });
  }
  if (requireRole && (!isAuth.role || !requireRole.includes(isAuth.role))) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function usePostQuery(variables) {
  return useQuery({
    queryKey: ["post", variables],
    queryFn: () => graphqlRequest(GET_POST, variables)
  });
}
function usePendingEdits() {
  return useQuery({
    queryKey: ["pendingEdits"],
    queryFn: async () => {
      const response = await graphqlRequest(PENDING_EDITS_QUERY);
      return response.pendingEdits;
    }
  });
}
function usePendingStats() {
  return useQuery({
    queryKey: ["pendingStats"],
    queryFn: async () => {
      const data = await graphqlRequest(PENDING_STATS_QUERY);
      return data.pendingStats;
    }
  });
}
function useFormListsQuery() {
  return useQuery({
    queryKey: ["formLists"],
    queryFn: async () => {
      const response = await graphqlRequest(GET_FORM_LISTS);
      return response.formLists;
    }
  });
}
function usePendingCreatedPostsQuery() {
  return useQuery({
    queryKey: ["pendingCreatedPosts"],
    queryFn: async () => {
      const data = await graphqlRequest(
        PENDING_CREATED_POSTS_QUERY
      );
      return data.pendingCreatedPosts;
    }
  });
}
function useCreatePostSuggestionMutation() {
  return useMutation({
    mutationFn: (variables) => graphqlRequest(
      CREATE_POST_SUGGESTION_MUTATION,
      variables
    )
  });
}
function useApproveCreatedPost() {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (id) => graphqlRequest(APPROVE_CREATED_POST_MUTATION, { id }),
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["pendingCreatedPosts"] });
      queryClient2.invalidateQueries({ queryKey: ["timeline"] });
    }
  });
}
function useRejectCreatedPost() {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (id) => graphqlRequest(REJECT_CREATED_POST_MUTATION, { id }),
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["pendingCreatedPosts"] });
    }
  });
}
function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ALL":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
function useFormReducer(postData) {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    startDescription: "",
    endDescription: "",
    type: "",
    startYear: 0,
    startMonth: 0,
    startDay: 0,
    endYear: 0,
    endMonth: 0,
    endDay: 0,
    imageUrl: "",
    imageCredit: "",
    sourceUrl: "",
    country: { name: "" },
    subjects: [],
    group: { id: 0, name: "" },
    civilisation: false
  });
  useEffect(() => {
    if (postData) {
      dispatch({
        type: "SET_ALL",
        payload: {
          name: postData.name ?? "",
          startDescription: postData.startDescription ?? "",
          endDescription: postData.endDescription ?? "",
          type: postData.type ?? "",
          startYear: postData.startYear ?? 0,
          startMonth: postData.startMonth ?? 0,
          startDay: postData.startDay ?? 0,
          endYear: postData.endYear ?? 0,
          endMonth: postData.endMonth ?? 0,
          endDay: postData.endDay ?? 0,
          imageUrl: postData.imageUrl ?? "",
          imageCredit: postData.imageCredit ?? "",
          sourceUrl: postData.sourceUrl ?? "",
          country: { name: postData.country.name ?? "" },
          subjects: postData.subjects.map((s) => ({ id: s.id, name: s.name })),
          group: {
            id: postData.group?.id ?? 0,
            name: postData.group?.name ?? ""
          },
          civilisation: postData.civilisation ?? false
        }
      });
    }
  }, [postData]);
  return { state, dispatch };
}
const postSchemaClient = void 0;
function FieldHelp({ text }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return /* @__PURE__ */ jsxs("span", { className: "relative inline-flex items-center", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        "aria-label": "More information",
        "aria-describedby": open ? id : void 0,
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
        onKeyDown: (e) => {
          if (e.key === "Escape") setOpen(false);
        },
        className: "ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-stone-400 transition hover:text-gold focus:outline-none",
        children: /* @__PURE__ */ jsx(IoMdInformationCircleOutline, { className: "text-base hover:text-gold" })
      }
    ),
    open && /* @__PURE__ */ jsx(
      "div",
      {
        id,
        role: "tooltip",
        className: "absolute left-full top-1/2 z-30 ml-2 w-64 -translate-y-1/2 rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-xs leading-relaxed text-stone-200 shadow-xl",
        children: text
      }
    )
  ] });
}
function FieldLabel({
  htmlFor,
  label,
  helpText
}) {
  return /* @__PURE__ */ jsxs(
    "label",
    {
      htmlFor,
      className: "label flex items-center text-lg text-stone-200/86 text-shadow-sm",
      children: [
        /* @__PURE__ */ jsx("span", { className: "label-text", children: label }),
        helpText ? /* @__PURE__ */ jsx(FieldHelp, { text: helpText }) : null
      ]
    }
  );
}
function TextInput({
  label,
  value,
  input = false,
  field,
  placeHolder = "",
  dispatch,
  required = false,
  rows = 5,
  helpText
}) {
  const commonProps = {
    name: field,
    id: field,
    value,
    "aria-label": label,
    onChange: (e) => dispatch({
      type: "SET_FIELD",
      field,
      value: e.target.value
    }),
    minLength: required ? 5 : 0,
    required,
    placeholder: placeHolder,
    className: `${input ? "input input-bordered" : "textarea textarea-bordered"} w-full bg-stone-950 border border-stone-600`
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor: field, label, helpText }),
    input ? /* @__PURE__ */ jsx("input", { ...commonProps, type: "text" }) : /* @__PURE__ */ jsx("textarea", { ...commonProps, rows })
  ] });
}
function NumberInput({
  label,
  value,
  field,
  dispatch,
  min,
  max,
  required = true,
  helpText
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor: field, label, helpText }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        id: field,
        name: field,
        "aria-label": label,
        className: "input input-bordered w-full border border-stone-600 bg-stone-950",
        required,
        placeholder: min !== void 0 && max !== void 0 ? `Between ${min} and ${max}` : void 0,
        min,
        max,
        title: min !== void 0 && max !== void 0 ? `Must be between ${min} and ${max}` : void 0,
        value,
        onChange: (e) => dispatch({
          type: "SET_FIELD",
          field,
          value: Number(e.target.value)
        })
      }
    ),
    min !== void 0 && max !== void 0 && /* @__PURE__ */ jsx("p", { className: "validator-hint hidden", children: `Must be between ${min} and ${max}` })
  ] });
}
function UrlInput({
  label,
  value,
  field,
  placeHolder,
  dispatch,
  helpText
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor: field, label, helpText }),
    /* @__PURE__ */ jsxs("label", { className: "input validator w-full border border-stone-600 bg-stone-950 shadow-none", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: "h-[1em] opacity-50",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxs(
            "g",
            {
              strokeLinejoin: "round",
              strokeLinecap: "round",
              strokeWidth: "2.5",
              fill: "none",
              stroke: "currentColor",
              children: [
                /* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "url",
          pattern: "^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\\\\-].*[a-zA-Z0-9])?\\\\.)+[a-zA-Z].*$",
          title: "Must be valid URL",
          className: "bg-stone-950",
          name: field,
          id: field,
          "aria-label": label,
          value,
          placeholder: placeHolder,
          onChange: (e) => dispatch({
            type: "SET_FIELD",
            field,
            value: e.target.value
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "validator-hint hidden", children: "Must be valid URL" })
  ] });
}
function SelectInput({
  id,
  label,
  value,
  options,
  placeholder,
  helpText,
  onChange,
  required = false
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(FieldLabel, { htmlFor: id, label, helpText }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        value,
        onChange: (e) => onChange(e.target.value),
        className: "select select-bordered w-full border border-stone-600 bg-stone-950",
        "aria-label": label,
        required,
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: placeholder }),
          options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, `${id}-${option.value}`))
        ]
      }
    )
  ] });
}
function PostForm({
  mode,
  initialData,
  formLists,
  onSubmit,
  isSubmitting
}) {
  const { addToast } = useToast();
  const { state, dispatch } = useFormReducer(initialData);
  const [submitted, setSubmitted] = useState(false);
  const { allCountries, allSubjects, allGroups } = formLists;
  const showSubjectsError = submitted && state.subjects.length === 0;
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const parsed = postSchemaClient.safeParse(state);
    if (!parsed.success) {
      parsed.error.issues.forEach((err) => {
        addToast({ message: err.message, type: "error" });
      });
      return;
    }
    onSubmit(parsed.data);
  };
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6",
      children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "Title",
            value: state.name,
            field: "name",
            dispatch,
            required: true,
            placeHolder: "e.g. Fall of Constantinople",
            input: true
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "Description",
            value: state.startDescription,
            field: "startDescription",
            dispatch,
            rows: 4,
            required: true,
            placeHolder: "What happened, and why does it matter?"
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "How it ended",
            value: state.endDescription,
            field: "endDescription",
            dispatch,
            rows: 4,
            placeHolder: "How did this event, period, or life conclude?"
          }
        ),
        /* @__PURE__ */ jsx(
          SelectInput,
          {
            id: "type",
            label: "Type",
            value: state.type,
            placeholder: "Select type",
            helpText: "Events are short (<100 years). Periods are long (>100 years).",
            required: true,
            options: [
              { value: "event", label: "Event" },
              { value: "person", label: "Person" },
              { value: "landmark", label: "Landmark" },
              { value: "period", label: "Period" }
            ],
            onChange: (value) => dispatch({
              type: "SET_FIELD",
              field: "type",
              value
            })
          }
        ),
        /* @__PURE__ */ jsx(
          SelectInput,
          {
            id: "country",
            label: "Country",
            value: state.country.name,
            placeholder: "Select country",
            helpText: "Use the modern equivalent country, even for ancient events.",
            required: true,
            options: allCountries.map((c) => ({
              value: c.name,
              label: `${c.name} (${c.continent})`
            })),
            onChange: (value) => dispatch({
              type: "SET_FIELD",
              field: "country",
              value: { name: value }
            })
          }
        ),
        /* @__PURE__ */ jsx(
          SelectInput,
          {
            id: "group",
            label: "Theme",
            helpText: "Choose the theme this post best fits. Some posts fit multiple themes.",
            value: state.group?.id?.toString() ?? "",
            placeholder: "Select theme",
            options: allGroups.map((g) => ({
              value: g.id.toString(),
              label: g.name
            })),
            onChange: (value) => {
              const selectedGroup = allGroups.find((g) => g.id.toString() === value) ?? null;
              dispatch({
                type: "SET_FIELD",
                field: "group",
                value: selectedGroup ? { id: selectedGroup.id, name: selectedGroup.name } : { id: 0, name: "" }
              });
            }
          }
        ),
        /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "subjects", label: "Subjects" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: allSubjects.map((s) => {
          const selected = state.subjects.some((subj) => subj.id === s.id);
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `btn btn-sm border bg-stone-950 hover:bg-stone-950/70 ${selected ? "border-[#daa754] text-[#daa754] shadow-lg shadow-stone-950/40 hover:border-gold hover:text-gold" : "border-stone-600 text-stone-400/80 hover:border-stone-300 hover:text-stone-300"}`,
              onClick: () => dispatch({
                type: "SET_FIELD",
                field: "subjects",
                value: selected ? state.subjects.filter((v) => v.id !== s.id) : [...state.subjects, { id: s.id, name: s.name }]
              }),
              children: s.name
            },
            s.id
          );
        }) }),
        /* @__PURE__ */ jsx("p", { className: `text-xs text-error ${showSubjectsError ? "" : "hidden"}`, children: "Select at least one subject" }),
        /* @__PURE__ */ jsx(
          FieldLabel,
          {
            htmlFor: "civilisation",
            label: "Civilisation",
            helpText: "For empires, dynasties, tribes, or cultures (not single events)."
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "civilisation",
            type: "checkbox",
            checked: state.civilisation,
            onChange: (e) => dispatch({
              type: "SET_FIELD",
              field: "civilisation",
              value: e.target.checked
            }),
            className: "checkbox rounded border-stone-600 inset-shadow-none bg-stone-950 checked:border-gold checked:bg-stone-950 checked:text-gold"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "Start Year",
              helpText: "Use most widely accepted academic date. Use negative for BCE (e.g. -476).",
              value: state.startYear,
              field: "startYear",
              dispatch,
              min: -3e5,
              max: 2025
            }
          ),
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "Start Month",
              value: state.startMonth,
              field: "startMonth",
              dispatch,
              min: 0,
              max: 12
            }
          ),
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "Start Day",
              value: state.startDay,
              field: "startDay",
              dispatch,
              min: 0,
              max: 31
            }
          ),
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "End Year",
              value: state.endYear,
              field: "endYear",
              dispatch,
              min: -3e5,
              max: 2025
            }
          ),
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "End Month",
              value: state.endMonth,
              field: "endMonth",
              dispatch,
              min: 0,
              max: 12
            }
          ),
          /* @__PURE__ */ jsx(
            NumberInput,
            {
              label: "End Day",
              value: state.endDay,
              field: "endDay",
              dispatch,
              min: 0,
              max: 31
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          UrlInput,
          {
            label: "Source URL",
            placeHolder: "e.g. https://en.wikipedia.org/wiki/Example",
            value: state.sourceUrl,
            field: "sourceUrl",
            dispatch
          }
        ),
        /* @__PURE__ */ jsx(
          UrlInput,
          {
            label: "Image URL",
            placeHolder: "https://commons.wikimedia.org/wiki/File:Example.jpg",
            helpText: "Direct image link only (Wikimedia Commons). Check copyright first.",
            value: state.imageUrl,
            field: "imageUrl",
            dispatch
          }
        ),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            label: "Image Credit",
            value: state.imageCredit,
            field: "imageCredit",
            dispatch,
            placeHolder: "e.g. Rijksmuseum / Wikimedia Commons / CC BY-SA 4.0",
            input: true
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            isLoading: isSubmitting,
            primary: true,
            label: mode === "create" ? "Submit Article" : "Submit Suggestion",
            type: "submit",
            loading: "Submitting..."
          }
        )
      ]
    }
  );
}
function CreatePost() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: formListsData } = useFormListsQuery();
  const mutation = useCreatePostSuggestionMutation();
  const handleSubmit = (data) => {
    mutation.mutate(
      { input: data },
      {
        onSuccess: () => {
          navigate("/");
          addToast({
            message: "Your suggestion is pending review",
            type: "success"
          });
        },
        onError: (error) => {
          addToast({
            message: error instanceof Error ? error.message : "Failed to submit suggestion",
            type: "error"
          });
        }
      }
    );
  };
  if (!formListsData) return null;
  return /* @__PURE__ */ jsx(PageContainer, { children: /* @__PURE__ */ jsxs("div", { className: "py-16 sm:py-24 p-4 sm:p-6 z-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center", children: "Create Article" }),
    /* @__PURE__ */ jsx(
      PostForm,
      {
        mode: "create",
        formLists: formListsData,
        onSubmit: handleSubmit,
        isSubmitting: mutation.isPending
      }
    )
  ] }) });
}
function meta$6({}) {
  return buildMeta({
    title: "Create Article | TLDR History",
    description: "Create and publish a new article on TLDR History.",
    path: "/create",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const articles_create = UNSAFE_withComponentProps(function CreateArticleRoute() {
  return /* @__PURE__ */ jsx(RequireAuth, {
    requireVerified: true,
    children: /* @__PURE__ */ jsx(CreatePost, {})
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: articles_create,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
function useSuggestEditMutation() {
  return useMutation({
    mutationFn: ({ postId, input }) => {
      return graphqlRequest(SUGGEST_EDIT, { postId, input });
    }
  });
}
function useApproveEdit() {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (id) => graphqlRequest(APPROVE_EDIT_MUTATION, { id }),
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["pendingEdits"] });
      queryClient2.invalidateQueries({ queryKey: ["timeline"] });
    }
  });
}
function useRejectEdit() {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (id) => graphqlRequest(REJECT_EDIT_MUTATION, { id }),
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["pendingEdits"] });
    }
  });
}
function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data } = usePostQuery({ id: Number(id) });
  const mutation = useSuggestEditMutation();
  const handleSubmit = (data2) => {
    mutation.mutate(
      {
        postId: Number(id),
        input: {
          ...data2,
          startSignificance: data2?.getPost?.startSignificance,
          endSignificance: data2?.getPost?.endSignificance
        }
      },
      {
        onSuccess: () => {
          navigate("/");
          addToast({
            message: "Your suggestion is pending review",
            type: "success"
          });
        },
        onError: (error) => {
          addToast({
            message: error instanceof Error ? error.message : "Failed to submit suggestion",
            type: "error"
          });
        }
      }
    );
  };
  if (!data) return null;
  return /* @__PURE__ */ jsx(PageContainer, { children: /* @__PURE__ */ jsxs("div", { className: "py-16 sm:py-24 p-4 sm:p-6 z-10", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center", children: "Suggest Edit" }),
    /* @__PURE__ */ jsx(
      PostForm,
      {
        mode: "edit",
        initialData: data.getPost,
        formLists: data.formLists,
        onSubmit: handleSubmit,
        isSubmitting: mutation.isPending
      }
    )
  ] }) });
}
function meta$5({}) {
  return buildMeta({
    title: "Edit | TLDR History",
    description: "Edit content on TLDR History.",
    path: "/edit",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const articles_edit_$id = UNSAFE_withComponentProps(function EditRoute() {
  return /* @__PURE__ */ jsx(RequireAuth, {
    requireVerified: true,
    children: /* @__PURE__ */ jsx(Edit, {})
  });
});
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: articles_edit_$id,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function ReviewHeader() {
  return /* @__PURE__ */ jsx(HeaderContainer, { children: /* @__PURE__ */ jsx("div", { className: "relative z-10 h-full flex flex-col justify-center sm:py-6.5 text-center", children: /* @__PURE__ */ jsx("h1", { className: "font-serif text-xl xs:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase text-stone-100 text-shadow-lg", children: "Review Suggestions" }) }) });
}
function ReviewStats({
  isLoading,
  pendingCount,
  stats
}) {
  return /* @__PURE__ */ jsxs(StatsContainer, { children: [
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Pending Review",
        value: pendingCount,
        description: "Left to Verify",
        isLoading
      }
    ),
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Approved Submissions",
        value: stats.approved,
        description: "Total Verified",
        isLoading
      }
    ),
    /* @__PURE__ */ jsx(
      StatCard,
      {
        title: "Rejected Submissions",
        value: stats.rejected,
        description: "Total Dismissed",
        isLoading
      }
    )
  ] });
}
function ReviewFieldDiff({
  label,
  from,
  to,
  render,
  isDiff
}) {
  if (!isDiff) {
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "text-stone-400 text-sm font-semibold", children: [
        label,
        ":"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-stone-200 text-base", children: render(to) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("p", { className: "text-stone-400 text-sm font-semibold", children: [
      label,
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-gold text-sm", children: "(changed)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("p", { className: "text-stone-400 text-sm line-through", children: render(from) }),
      /* @__PURE__ */ jsx("p", { className: "text-stone-200 text-base", children: render(to) })
    ] })
  ] });
}
function ReviewDiff({ fields, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `space-y-2 ${className}`, children: fields.map(({ label, from, to, isDiff, render = (v) => /* @__PURE__ */ jsx("span", { children: v || /* @__PURE__ */ jsx("span", { className: "text-stone-500 italic", children: "empty" }) }) }) => /* @__PURE__ */ jsx(
    ReviewFieldDiff,
    {
      label,
      from,
      to,
      render,
      isDiff
    },
    label
  )) });
}
function ImageChangesSection({
  imageFields,
  hasAnyImageChange
}) {
  if (!hasAnyImageChange) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-stone-900/40 rounded-md p-3 space-y-2 border border-stone-600", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gold font-semibold", children: "Image metadata has been changed" }),
    /* @__PURE__ */ jsx(ReviewDiff, { fields: imageFields })
  ] });
}
function useReviewDiffs(suggestion) {
  const { post, changes } = suggestion;
  const nameTo = String(changes.name?.to ?? post.name);
  const isNameDiff = post.name !== nameTo;
  const typeFrom = String(post.type);
  const typeTo = String(changes.type?.to ?? post.type);
  const isTypeDiff = typeFrom !== typeTo;
  const startFrom = formatDate(
    Number(post.startYear),
    Number(post.startMonth),
    Number(post.startDay)
  );
  const startTo = formatDate(
    Number(changes.startYear?.to ?? post.startYear),
    Number(changes.startMonth?.to ?? post.startMonth),
    Number(changes.startDay?.to ?? post.startDay)
  );
  const endFrom = formatDate(
    Number(post.endYear),
    Number(post.endMonth),
    Number(post.endDay)
  );
  const endTo = formatDate(
    Number(changes.endYear?.to ?? post.endYear),
    Number(changes.endMonth?.to ?? post.endMonth),
    Number(changes.endDay?.to ?? post.endDay)
  );
  const dateFrom = `${startFrom} → ${endFrom}`;
  const dateTo = `${startTo} → ${endTo}`;
  const isDateDiff = dateFrom !== dateTo;
  const startDescFrom = post.startDescription ?? "";
  const startDescTo = String(
    changes.startDescription?.to ?? post.startDescription ?? ""
  );
  const isStartDescDiff = startDescFrom !== startDescTo;
  const endDescFrom = post.endDescription ?? "";
  const endDescTo = String(
    changes.endDescription?.to ?? post.endDescription ?? ""
  );
  const isEndDescDiff = endDescFrom !== endDescTo;
  const groupFrom = post.group?.name ?? "";
  const groupTo = changes.group?.to?.name ?? post.group?.name ?? "";
  const isGroupDiff = groupFrom !== groupTo;
  const countryFrom = post.country?.name ?? "";
  const countryTo = changes.country?.to?.name ?? post.country?.name ?? "";
  const isCountryDiff = countryFrom !== countryTo;
  const civilisationFrom = Boolean(post.civilisation);
  const civilisationTo = Boolean(
    changes.civilisation?.to ?? post.civilisation
  );
  const isCivilisationDiff = civilisationFrom !== civilisationTo;
  const subjectsFrom = post.subjects.map((s) => ({
    name: s.name
  }));
  const subjectsTo = changes.subjects?.to ?? subjectsFrom;
  const isSubjectsDiff = JSON.stringify(subjectsFrom) !== JSON.stringify(subjectsTo);
  const imageUrlFrom = post.imageUrl ?? "";
  const imageUrlTo = String(changes.imageUrl?.to ?? post.imageUrl ?? "");
  const isImageUrlDiff = imageUrlFrom !== imageUrlTo;
  const imageCreditFrom = post.imageCredit ?? "";
  const imageCreditTo = String(
    changes.imageCredit?.to ?? post.imageCredit ?? ""
  );
  const isImageCreditDiff = imageCreditFrom !== imageCreditTo;
  const sourceUrlFrom = post.sourceUrl ?? "";
  const sourceUrlTo = String(
    changes.sourceUrl?.to ?? post.sourceUrl ?? ""
  );
  const isSourceUrlDiff = sourceUrlFrom !== sourceUrlTo;
  const hasAnyImageChange = isImageUrlDiff || isImageCreditDiff || isSourceUrlDiff;
  return {
    mainFields: [
      { label: "Name", from: post.name, to: nameTo, isDiff: isNameDiff },
      { label: "Type", from: typeFrom, to: typeTo, isDiff: isTypeDiff },
      { label: "Date", from: dateFrom, to: dateTo, isDiff: isDateDiff }
    ],
    descriptionFields: [
      {
        label: "Start description",
        from: startDescFrom,
        to: startDescTo,
        isDiff: isStartDescDiff
      },
      {
        label: "End description",
        from: endDescFrom,
        to: endDescTo,
        isDiff: isEndDescDiff
      }
    ],
    metadataFields: [
      {
        label: "Group",
        from: groupFrom,
        to: groupTo,
        isDiff: isGroupDiff
      },
      {
        label: "Country",
        from: countryFrom,
        to: countryTo,
        isDiff: isCountryDiff
      },
      {
        label: "Civilisation",
        from: civilisationFrom,
        to: civilisationTo,
        isDiff: isCivilisationDiff,
        render: (value) => /* @__PURE__ */ jsx("span", { children: value ? "True" : "False" })
      },
      {
        label: "Subjects",
        from: subjectsFrom,
        to: subjectsTo,
        isDiff: isSubjectsDiff,
        render: (items) => items?.length ? /* @__PURE__ */ jsx("span", { className: "flex flex-wrap gap-1.5", children: items.map((item) => /* @__PURE__ */ jsx("span", { children: item.name }, item.name)) }) : /* @__PURE__ */ jsx("span", { className: "text-stone-500 italic", children: "empty" })
      }
    ],
    imageFields: [
      {
        label: "Image URL",
        from: imageUrlFrom,
        to: imageUrlTo,
        isDiff: isImageUrlDiff
      },
      {
        label: "Image credit",
        from: imageCreditFrom,
        to: imageCreditTo,
        isDiff: isImageCreditDiff
      },
      {
        label: "Source URL",
        from: sourceUrlFrom,
        to: sourceUrlTo,
        isDiff: isSourceUrlDiff
      }
    ],
    hasAnyImageChange
  };
}
function ReviewCard({
  suggestion,
  onApprove,
  onReject,
  approving = false,
  rejecting = false
}) {
  const {
    mainFields,
    descriptionFields,
    metadataFields,
    imageFields,
    hasAnyImageChange
  } = useReviewDiffs(suggestion);
  const { post, suggestedBy } = suggestion;
  return /* @__PURE__ */ jsxs(CardContainer, { children: [
    /* @__PURE__ */ jsx("header", { className: "flex justify-between items-start", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-stone-200", children: post.name }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-stone-300 pt-1", children: [
        "Suggested by @",
        suggestedBy.username
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(ReviewDiff, { fields: mainFields }),
    /* @__PURE__ */ jsx(ReviewDiff, { fields: descriptionFields }),
    /* @__PURE__ */ jsx(
      ReviewDiff,
      {
        fields: metadataFields,
        className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
      }
    ),
    /* @__PURE__ */ jsx(
      ImageChangesSection,
      {
        imageFields,
        hasAnyImageChange
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 flex gap-3 justify-center", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          label: "Reject",
          loading: "Rejecting...",
          isLoading: rejecting,
          onClick: onReject
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          label: "Approve",
          loading: "Approving...",
          isLoading: approving,
          primary: true,
          onClick: onApprove
        }
      )
    ] })
  ] });
}
function ReviewEditsPanel({
  tabs,
  activeTab,
  onTabChange,
  edits,
  isLoading,
  isError
}) {
  const approveEdit = useApproveEdit();
  const rejectEdit = useRejectEdit();
  const [actingEditId, setActingEditId] = useState(null);
  const handleApprove = (id) => {
    setActingEditId(id);
    approveEdit.mutate(id, {
      onSettled: () => setActingEditId(null)
    });
  };
  const handleReject = (id) => {
    setActingEditId(id);
    rejectEdit.mutate(id, {
      onSettled: () => setActingEditId(null)
    });
  };
  return /* @__PURE__ */ jsx(
    TabbedTimeline,
    {
      tabs,
      activeTab,
      onTabChange,
      items: edits,
      getItemKey: (item) => item.id,
      renderCard: (item) => /* @__PURE__ */ jsx(
        ReviewCard,
        {
          suggestion: item,
          onApprove: () => handleApprove(item.id),
          onReject: () => handleReject(item.id),
          approving: approveEdit.isPending && actingEditId === item.id,
          rejecting: rejectEdit.isPending && actingEditId === item.id
        }
      ),
      renderEmpty: () => /* @__PURE__ */ jsx("p", { className: "min-h-[40vh] text-stone-800/86 text-shadow-sm", children: "No edit suggestions pending." }),
      isLoading,
      isError
    }
  );
}
function CreatedCard({
  post,
  onApprove,
  onReject,
  approving = false,
  rejecting = false
}) {
  const typeMeta = `${post.type.slice(0, 1).toUpperCase() + post.type.slice(1)}${post.civilisation ? " | Civilisation" : ""}${post.group ? ` | ${post.group.name}` : ""}`;
  return /* @__PURE__ */ jsxs(CardContainer, { children: [
    /* @__PURE__ */ jsx(CardHeader, { post }),
    /* @__PURE__ */ jsxs("div", { className: "z-20", children: [
      post.imageUrl && /* @__PURE__ */ jsxs("div", { className: "float-right ml-4 mb-2 max-w-32", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: post.imageUrl,
            alt: post.name,
            className: "max-w-32 max-h-32 object-cover rounded shadow-md",
            loading: "eager"
          }
        ),
        post.imageCredit && /* @__PURE__ */ jsx("span", { className: "mt-2 block text-xs text-stone-400", children: post.imageCredit })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-stone-300", children: post.startDescription }),
      post.endDescription && /* @__PURE__ */ jsx("p", { className: "mt-3 text-base md:text-lg text-stone-400", children: post.endDescription })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-stone-400 font-medium", children: typeMeta }),
    /* @__PURE__ */ jsx(CardSubjects, { subjects: post.subjects }),
    post.sourceUrl && /* @__PURE__ */ jsx(
      "a",
      {
        className: "text-stone-400 font-medium break-all",
        href: post.sourceUrl,
        target: "_blank",
        rel: "noreferrer",
        children: post.sourceUrl
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-3 justify-center", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          label: "Reject",
          loading: "Rejecting...",
          isLoading: rejecting,
          onClick: onReject
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          label: "Approve",
          loading: "Approving...",
          primary: true,
          isLoading: approving,
          onClick: onApprove
        }
      )
    ] })
  ] });
}
function ReviewCreatedPanel({
  tabs,
  activeTab,
  onTabChange,
  createdPosts,
  isLoading,
  isError
}) {
  const approveCreatedPost = useApproveCreatedPost();
  const rejectCreatedPost = useRejectCreatedPost();
  const [actingCreatedId, setActingCreatedId] = useState(null);
  const handleApprove = (id) => {
    setActingCreatedId(id);
    approveCreatedPost.mutate(id, {
      onSettled: () => setActingCreatedId(null)
    });
  };
  const handleReject = (id) => {
    setActingCreatedId(id);
    rejectCreatedPost.mutate(id, {
      onSettled: () => setActingCreatedId(null)
    });
  };
  return /* @__PURE__ */ jsx(
    TabbedTimeline,
    {
      tabs,
      activeTab,
      onTabChange,
      items: createdPosts,
      getItemKey: (item) => item.id,
      renderCard: (item) => /* @__PURE__ */ jsx(
        CreatedCard,
        {
          post: item.data,
          onApprove: () => handleApprove(item.id),
          onReject: () => handleReject(item.id),
          approving: approveCreatedPost.isPending && actingCreatedId === item.id,
          rejecting: rejectCreatedPost.isPending && actingCreatedId === item.id
        }
      ),
      renderEmpty: () => /* @__PURE__ */ jsx("p", { className: "min-h-[40vh] text-stone-800/86 text-shadow-sm", children: "No created post submissions yet." }),
      isLoading,
      isError
    }
  );
}
function ReviewTimeline() {
  const [activeTab, setActiveTab] = useState("edits");
  const {
    data: editsData,
    isLoading: editsLoading,
    isError: editsError
  } = usePendingEdits();
  const {
    data: createdData,
    isLoading: createdLoading,
    isError: createdError
  } = usePendingCreatedPostsQuery();
  const edits = editsData?.edits ?? [];
  const createdPosts = createdData?.createdPosts ?? [];
  const tabs = [
    { id: "edits", label: "Edits", count: edits.length },
    { id: "created", label: "Created", count: createdPosts.length }
  ];
  const isLoading = activeTab === "edits" ? editsLoading : createdLoading;
  const isError = activeTab === "edits" ? editsError : createdError;
  return activeTab === "edits" ? /* @__PURE__ */ jsx(
    ReviewEditsPanel,
    {
      tabs,
      activeTab,
      onTabChange: setActiveTab,
      edits,
      isLoading,
      isError
    }
  ) : /* @__PURE__ */ jsx(
    ReviewCreatedPanel,
    {
      tabs,
      activeTab,
      onTabChange: setActiveTab,
      createdPosts,
      isLoading,
      isError
    }
  );
}
const defaultStats = { pending: 0, approved: 0, rejected: 0 };
function Review() {
  const { data: stats, isLoading } = usePendingStats();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ReviewHeader, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 grid grid-cols-1 sm:grid-cols-[2fr_1fr] bg-base", children: [
      /* @__PURE__ */ jsx(ReviewTimeline, {}),
      /* @__PURE__ */ jsx(
        ReviewStats,
        {
          isLoading,
          stats: stats ?? defaultStats,
          pendingCount: stats?.pending ?? 0
        }
      )
    ] })
  ] });
}
function meta$4({}) {
  return buildMeta({
    title: "Review Suggestions | TLDR History",
    description: "Moderation interface for reviewing timeline and content suggestions on TLDR History.",
    path: "/review-suggestions",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const reviewSuggestions = UNSAFE_withComponentProps(function ReviewRoute() {
  return /* @__PURE__ */ jsx(RequireAuth, {
    requireRole: ["ADMIN", "MODERATOR"],
    children: /* @__PURE__ */ jsx(Review, {})
  });
});
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: reviewSuggestions,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3({}) {
  return buildMeta({
    title: "Terms of Service | TLDR History",
    description: "Review the TLDR History terms of service, including the rules, responsibilities, and conditions for using the platform.",
    path: "/terms",
    type: "website"
  });
}
const terms = UNSAFE_withComponentProps(function Terms() {
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "py-16 sm:py-24 p-4 sm:p-6 z-10",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center",
        children: "Terms of Service"
      }), /* @__PURE__ */ jsxs("div", {
        className: "mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6",
        children: [/* @__PURE__ */ jsx("div", {
          className: "space-y-5 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
          children: /* @__PURE__ */ jsx("p", {
            className: "text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:text-sm",
            children: "Last updated April 13, 2026"
          })
        }), /* @__PURE__ */ jsxs("section", {
          id: "section",
          className: "space-y-8 pt-8",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "AGREEMENT TO OUR LEGAL TERMS"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We are Robert Morgan ('Company', 'we', 'us', or 'our'), a company registered in the United Kingdom at Hill View, Cardiff, South Glamorgan CF5 3UB."
            }), /* @__PURE__ */ jsxs("p", {
              children: ["We operate the website", " ", /* @__PURE__ */ jsx("a", {
                href: "https://tldrhistory.xyz",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "https://tldrhistory.xyz"
              }), " ", "(the 'Site'), as well as any other related products and services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services')."]
            }), /* @__PURE__ */ jsx("p", {
              children: "This application is an interactive timeline platform that allows users to explore historical events, filter and search content, and create, manage, and share their own posts and timelines."
            }), /* @__PURE__ */ jsxs("p", {
              children: ["You can contact us by phone at +639543954764, email at", " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                target: "_blank",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              }), ", or by mail to Hill View, Cardiff, South Glamorgan CF5 3UB, United Kingdom."]
            }), /* @__PURE__ */ jsx("p", {
              children: "These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ('you'), and Robert Morgan, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY."
            }), /* @__PURE__ */ jsx("p", {
              children: "Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the 'Last updated' date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted."
            }), /* @__PURE__ */ jsx("p", {
              children: "The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services."
            }), /* @__PURE__ */ jsx("p", {
              children: "We recommend that you print a copy of these Legal Terms for your records."
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "space-y-12 pt-12",
          children: /* @__PURE__ */ jsxs("section", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "TABLE OF CONTENTS"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section1",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "1. OUR SERVICES"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section2",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "2. INTELLECTUAL PROPERTY RIGHTS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section3",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "3. USER REPRESENTATIONS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section4",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "4. USER REGISTRATION"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section5",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "5. PROHIBITED ACTIVITIES"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section6",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "6. USER GENERATED CONTRIBUTIONS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section7",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "7. CONTRIBUTION LICENCE"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section8",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "8. THIRD-PARTY WEBSITES AND CONTENT"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section9",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "9. SERVICES MANAGEMENT"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section10",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "10. PRIVACY POLICY"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section11",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "11. COPYRIGHT INFRINGEMENTS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section12",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "12. TERM AND TERMINATION"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section13",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "13. MODIFICATIONS AND INTERRUPTIONS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section14",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "14. GOVERNING LAW"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section15",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "15. DISPUTE RESOLUTION"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section16",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "16. CORRECTIONS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section17",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "17. DISCLAIMER"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section18",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "18. LIMITATIONS OF LIABILITY"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section19",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "19. INDEMNIFICATION"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section20",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "20. USER DATA"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section21",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "21. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section22",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "22. CALIFORNIA USERS AND RESIDENTS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section23",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "23. MISCELLANEOUS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section24",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "24. CONTENT DISCLAIMER"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section25",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "25. PROHIBITION OF DATA EXTRACTION AND SCRAPING"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section26",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "26. INTELLECTUAL PROPERTY RIGHTS"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section27",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "27. SERVICE MODIFICATIONS AND AVAILABILITY"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section28",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "28. ACCOUNT SUSPENSION AND TERMINATION"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section29",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "29. CONTACT US"
                })
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("section", {
          id: "section1",
          className: "space-y-8 pt-12",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "1. OUR SERVICES"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable."
            }), /* @__PURE__ */ jsx("p", {
              children: "The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA)."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section2",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "2. INTELLECTUAL PROPERTY RIGHTS"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "Our intellectual property"
            }), /* @__PURE__ */ jsx("p", {
              children: "We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the 'Content'), as well as the trademarks, service marks, and logos contained therein (the 'Marks')."
            }), /* @__PURE__ */ jsx("p", {
              children: "Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the United States and around the world."
            }), /* @__PURE__ */ jsx("p", {
              children: "The Content and Marks are provided in or through the Services 'AS IS' for your personal, non-commercial use or internal business purpose only."
            }), /* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "Your use of our Services"
            }), /* @__PURE__ */ jsxs("p", {
              children: ["Subject to your compliance with these Legal Terms, including the", " ", /* @__PURE__ */ jsx("a", {
                href: "#section5",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'PROHIBITED ACTIVITIES'"
              }), " ", "section below, we grant you a non-exclusive, non-transferable, revocable licence to:"]
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 pl-5 mt-3 mb-4 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: "access the Services; and"
              }), /* @__PURE__ */ jsx("li", {
                children: "download or print a copy of any portion of the Content to which you have properly gained access,"
              })]
            }), /* @__PURE__ */ jsx("p", {
              children: "solely for your personal, non-commercial use or internal business purpose."
            }), /* @__PURE__ */ jsx("p", {
              children: "Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission."
            }), /* @__PURE__ */ jsxs("p", {
              children: ["If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to:", " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                target: "_blank",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              }), ". If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content."]
            }), /* @__PURE__ */ jsx("p", {
              children: "We reserve all rights not expressly granted to you in and to the Services, Content, and Marks."
            }), /* @__PURE__ */ jsx("p", {
              children: "Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately."
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-lg font-semibold text-stone-200 mb-4 mt-8",
              children: "Your submissions and contributions"
            }), /* @__PURE__ */ jsxs("p", {
              children: ["Please review this section and the", " ", /* @__PURE__ */ jsx("a", {
                href: "#section5",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'PROHIBITED ACTIVITIES'"
              }), " ", "section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services."]
            }), /* @__PURE__ */ jsxs("p", {
              children: [/* @__PURE__ */ jsx("strong", {
                children: "Submissions:"
              }), " By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ('Submissions'), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you."]
            }), /* @__PURE__ */ jsxs("p", {
              children: [/* @__PURE__ */ jsx("strong", {
                children: "Contributions:"
              }), " The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ('Contributions'). Any Submission that is publicly posted shall also be treated as a Contribution."]
            }), /* @__PURE__ */ jsx("p", {
              children: "You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites."
            }), /* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "When you post Contributions, you grant us a licence (including use of your name, trademarks, and logos)"
            }), /* @__PURE__ */ jsx("p", {
              children: "By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicence the licences granted in this section. Our use and distribution may occur in any media formats and through any media channels."
            }), /* @__PURE__ */ jsx("p", {
              children: "This licence includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide."
            }), /* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "You are responsible for what you post or upload"
            }), /* @__PURE__ */ jsx("p", {
              children: "By sending us Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 pl-5 mt-3 mb-4 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsxs("li", {
                children: ["confirm that you have read and agree with our", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section5",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "'PROHIBITED ACTIVITIES'"
                }), " ", "and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;"]
              }), /* @__PURE__ */ jsx("li", {
                children: "to the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;"
              }), /* @__PURE__ */ jsx("li", {
                children: "warrant that any such Submission and/or Contributions are original to you or that you have the necessary rights and licences to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and"
              }), /* @__PURE__ */ jsx("li", {
                children: "warrant and represent that your Submissions and/or Contributions do not constitute confidential information."
              })]
            }), /* @__PURE__ */ jsx("p", {
              children: "You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law."
            }), /* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "We may remove or edit your Content"
            }), /* @__PURE__ */ jsx("p", {
              children: "Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities."
            }), /* @__PURE__ */ jsx("h3", {
              className: "font-semibold text-stone-200 mb-3 text-lg",
              children: "Copyright infringement"
            }), /* @__PURE__ */ jsxs("p", {
              children: ["We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately refer to the", " ", /* @__PURE__ */ jsx("a", {
                href: "#section11",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'COPYRIGHT INFRINGEMENTS'"
              }), " ", "section below."]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section3",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "3. USER REPRESENTATIONS"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorised purpose; and (7) your use of the Services will not violate any applicable law or regulation."
            }), /* @__PURE__ */ jsx("p", {
              children: "If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof)."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section4",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "4. USER REGISTRATION"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section5",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "5. PROHIBITED ACTIVITIES"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavours except those that are specifically endorsed or approved by us."
            }), /* @__PURE__ */ jsx("p", {
              children: "As a user of the Services, you agree not to:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us."
              }), /* @__PURE__ */ jsx("li", {
                children: "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords."
              }), /* @__PURE__ */ jsx("li", {
                children: "Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein."
              }), /* @__PURE__ */ jsx("li", {
                children: "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Use any information obtained from the Services in order to harass, abuse, or harm another person."
              }), /* @__PURE__ */ jsx("li", {
                children: "Make improper use of our support services or submit false reports of abuse or misconduct."
              }), /* @__PURE__ */ jsx("li", {
                children: "Use the Services in a manner inconsistent with any applicable laws or regulations."
              }), /* @__PURE__ */ jsx("li", {
                children: "Engage in unauthorised framing of or linking to the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools."
              }), /* @__PURE__ */ jsx("li", {
                children: "Delete the copyright or other proprietary rights notice from any Content."
              }), /* @__PURE__ */ jsx("li", {
                children: "Attempt to impersonate another user or person or use the username of another user."
              }), /* @__PURE__ */ jsx("li", {
                children: "Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ('gifs'), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as 'spyware' or 'passive collection mechanisms' or 'pcms')."
              }), /* @__PURE__ */ jsx("li", {
                children: "Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you."
              }), /* @__PURE__ */ jsx("li", {
                children: "Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code."
              }), /* @__PURE__ */ jsx("li", {
                children: "Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorised script or other software."
              }), /* @__PURE__ */ jsx("li", {
                children: "Use a buying agent or purchasing agent to make purchases on the Services."
              }), /* @__PURE__ */ jsx("li", {
                children: "Make any unauthorised use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences."
              }), /* @__PURE__ */ jsx("li", {
                children: "Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavour or commercial enterprise."
              }), /* @__PURE__ */ jsx("li", {
                children: "Posting false, misleading, or intentionally inaccurate historical content"
              }), /* @__PURE__ */ jsx("li", {
                children: "Uploading copyrighted material without permission"
              }), /* @__PURE__ */ jsx("li", {
                children: "Scraping or copying your database/timeline content"
              }), /* @__PURE__ */ jsx("li", {
                children: "Attempting to reverse engineer or exploit your system (important since you're a dev platform)"
              }), /* @__PURE__ */ jsx("li", {
                children: "Harassment, hate speech, or abusive content"
              }), /* @__PURE__ */ jsx("li", {
                children: "Spamming (especially if users can submit entries)"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section6",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "6. USER GENERATED CONTRIBUTIONS"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, 'Contributions'). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: "The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party."
              }), /* @__PURE__ */ jsx("li", {
                children: "You are the creator and owner of or have the necessary licences, rights, consents, releases, and permissions to use and to authorise us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms."
              }), /* @__PURE__ */ jsx("li", {
                children: "You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions are not false, inaccurate, or misleading."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions are not unsolicited or unauthorised advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libellous, slanderous, or otherwise objectionable (as determined by us)."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not violate any applicable law, regulation, or rule."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not violate the privacy or publicity rights of any third party."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap."
              }), /* @__PURE__ */ jsx("li", {
                children: "Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation."
              }), /* @__PURE__ */ jsx("li", {
                children: "Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services."
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section7",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "7. CONTRIBUTION LICENCE"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "By posting your Contributions to any part of the Services, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and licence to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorise sublicences of the foregoing. The use and distribution may occur in any media formats and through any media channels."
            }), /* @__PURE__ */ jsx("p", {
              children: "This licence will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions."
            }), /* @__PURE__ */ jsx("p", {
              children: "We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions."
            }), /* @__PURE__ */ jsx("p", {
              children: "We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to re-categorise any Contributions to place them in more appropriate locations on the Services; and (3) to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section8",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "8. THIRD-PARTY WEBSITES AND CONTENT"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "The Services may contain (or you may be sent via the Site) links to other websites ('Third-Party Websites') as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ('Third-Party Content'). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section9",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "9. SERVICES MANAGEMENT"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section10",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "10. PRIVACY POLICY"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsxs("p", {
              children: ["We care about data privacy and security. Please review our Privacy Policy:", " ", /* @__PURE__ */ jsx("a", {
                href: "/privacy",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "https://tldrhistory.xyz/privacy"
              }), ". By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in Germany. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in Germany, then through your continued use of the Services, you are transferring your data to Germany, and you expressly consent to have your data transferred to and processed in Germany."]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section11",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "11. COPYRIGHT INFRINGEMENTS"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a 'Notification'). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification. Please be advised that pursuant to applicable law you may be held liable for damages if you make material misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by the Services infringes your copyright, you should consider first contacting an attorney."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section12",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "12. TERM AND TERMINATION"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION."
            }), /* @__PURE__ */ jsx("p", {
              children: "If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section13",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "13. MODIFICATIONS AND INTERRUPTIONS"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services."
            }), /* @__PURE__ */ jsx("p", {
              children: "We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section14",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "14. GOVERNING LAW"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "These Legal Terms are governed by and interpreted following the laws of the United Kingdom, and the use of the United Nations Convention of Contracts for the International Sales of Goods is expressly excluded. If your habitual residence is in the EU, and you are a consumer, you additionally possess the protection provided to you by obligatory provisions of the law in your country to residence. Robert Morgan and yourself both agree to submit to the non-exclusive jurisdiction of the courts of London, which means that you may make a claim to defend your consumer protection rights in regards to these Legal Terms in the United Kingdom, or in the EU country in which you reside."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section15",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "15. DISPUTE RESOLUTION"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
              children: "Informal Negotiations"
            }), /* @__PURE__ */ jsx("p", {
              children: "To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a 'Dispute' and collectively, the 'Disputes') brought by either you or us (individually, a 'Party' and collectively, the 'Parties'), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party."
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
              children: "Binding Arbitration"
            }), /* @__PURE__ */ jsx("p", {
              children: "Any dispute arising from the relationships between the Parties to these Legal Terms shall be determined by one arbitrator who will be chosen in accordance with the Arbitration and Internal Rules of the European Court of Arbitration being part of the European Centre of Arbitration having its seat in Strasbourg, and which are in force at the time the application for arbitration is filed, and of which adoption of this clause constitutes acceptance. The seat of arbitration shall be London, United Kingdom. The language of the proceedings shall be English. Applicable rules of substantive law shall be the law of the United Kingdom."
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
              children: "Restrictions"
            }), /* @__PURE__ */ jsx("p", {
              children: "The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilise class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons."
            }), /* @__PURE__ */ jsx("h3", {
              className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
              children: "Exceptions to Informal Negotiations and Arbitration"
            }), /* @__PURE__ */ jsx("p", {
              children: "The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorised use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section16",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "16. CORRECTIONS"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section17",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "17. DISCLAIMER"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORISED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGEMENT AND EXERCISE CAUTION WHERE APPROPRIATE."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section18",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "18. LIMITATIONS OF LIABILITY"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section19",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "19. INDEMNIFICATION"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defence and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defence of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section20",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "20. USER DATA"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section21",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "21. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section22",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "22. CALIFORNIA USERS AND RESIDENTS"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625 North Market Blvd., Suite N 112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916) 445-1254."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section23",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "23. MISCELLANEOUS"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defences you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section24",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "24. CONTENT DISCLAIMER"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "The content provided on this platform is for informational and educational purposes only. While we strive for accuracy, we make no representations or warranties of any kind regarding the completeness, reliability, or accuracy of any content. Users acknowledge that any reliance on such information is at their own risk."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section25",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "25. PROHIBITION OF DATA EXTRACTION AND SCRAPING"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "Users agree not to access, collect, copy, or extract data from the platform through automated means (including bots, scripts, or crawlers) or through manual methods intended to replicate substantial portions of the platform’s content or structure without prior written permission."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section26",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "26. INTELLECTUAL PROPERTY RIGHTS"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "All content, features, functionality, design, and structure of the platform are and remain the exclusive property of the platform owner, unless otherwise stated. Users may not reproduce, distribute, modify, or create derivative works without prior written consent."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section27",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "27. SERVICE MODIFICATIONS AND AVAILABILITY"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We reserve the right to modify, suspend, or discontinue any part of the platform at any time, with or without notice. We do not guarantee that the platform will always be available, uninterrupted, or error-free."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section28",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "28. ACCOUNT SUSPENSION AND TERMINATION"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We reserve the right to suspend or terminate user accounts at our sole discretion, including where users violate these Terms or engage in conduct that may harm the platform or other users."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section29",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "29. CONTACT US"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:"
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-stone-800/50 border border-stone-600 rounded-lg p-6",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-stone-200 mb-1",
                children: "Robert Morgan"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "Hill View"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "Cardiff, South Glamorgan CF5 3UB"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "United Kingdom"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300 font-bold",
                children: "Phone: +639543954764"
              }), /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                target: "_blank",
                className: "text-stone-200 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              })]
            })]
          })]
        })]
      })]
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: terms,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({}) {
  return buildMeta({
    title: "Privacy Policy | TLDR History",
    description: "Read the TLDR History privacy policy to understand how personal data is collected, used, and protected.",
    path: "/privacy",
    type: "website"
  });
}
const privacy = UNSAFE_withComponentProps(function Privacy() {
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "py-16 sm:py-24 p-4 sm:p-6 z-10",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center",
        children: "Privacy Policy"
      }), /* @__PURE__ */ jsxs("div", {
        className: "mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-5 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:text-sm",
            children: "Last updated April 11, 2026"
          }), /* @__PURE__ */ jsx("p", {
            children: "This Privacy Notice for Robert Morgan ('we', 'us', or 'our'), describes how and why we might access, collect, store, use, and/or share ('process') your personal information when you use our services ('Services'), including when you:"
          }), /* @__PURE__ */ jsxs("ul", {
            className: "space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc",
            children: [/* @__PURE__ */ jsxs("li", {
              children: ["Visit our website at", " ", /* @__PURE__ */ jsx("a", {
                href: "https://tldrhistory.xyz",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300",
                children: "https://tldrhistory.xyz"
              }), " ", "or any website of ours that links to this Privacy Notice"]
            }), /* @__PURE__ */ jsx("li", {
              children: "Use TLDR History. This application is an interactive timeline platform that allows users to explore historical events, filter and search content, and create, manage, and share their own posts and timelines."
            }), /* @__PURE__ */ jsx("li", {
              children: "Engage with us in other related ways, including any marketing or events"
            })]
          }), /* @__PURE__ */ jsxs("p", {
            children: ["Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at", " ", /* @__PURE__ */ jsx("a", {
              href: "mailto:support@mail.tldrhistory.xyz",
              className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300",
              children: "support@mail.tldrhistory.xyz"
            }), "."]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "space-y-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "pt-1",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-4",
              children: "SUMMARY OF KEY POINTS"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
              children: "This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "What personal information do we process?"
              }), /* @__PURE__ */ jsxs("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: ["When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section1",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Learn more about personal information you disclose to us."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "Do we process any sensitive personal information?"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: "Some of the information may be considered 'special' or 'sensitive' in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "Do we collect any information from third parties?"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: "We do not collect any information from third parties."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "How do we process your information?"
              }), /* @__PURE__ */ jsxs("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: ["We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so.", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section2",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Learn more about how we process your information."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "In what situations and with which parties do we share personal information?"
              }), /* @__PURE__ */ jsxs("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: ["We may share information in specific situations and with specific third parties.", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section4",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Learn more about when and with whom we share your personal information."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "How do we keep your information safe?"
              }), /* @__PURE__ */ jsxs("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: ["We have adequate organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section7",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Learn more about how we keep your information safe."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "What are your rights?"
              }), /* @__PURE__ */ jsxs("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: ["Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section9",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Learn more about your privacy rights."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "How do you exercise your rights?"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: "The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("dt", {
                className: "font-medium text-stone-200 tracking-wide",
                children: "Want to learn more about what we do with any information we collect?"
              }), /* @__PURE__ */ jsx("dd", {
                className: "mt-1 text-sm leading-7 text-stone-400 sm:text-base sm:leading-8",
                children: "Review the Privacy Notice in full."
              })]
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "space-y-12 pt-12",
          children: /* @__PURE__ */ jsxs("section", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "TABLE OF CONTENTS"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section1",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "1. WHAT INFORMATION DO WE COLLECT?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section2",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "2. HOW DO WE PROCESS YOUR INFORMATION?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section3",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section4",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section5",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section6",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "6. HOW LONG DO WE KEEP YOUR INFORMATION?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section7",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "7. HOW DO WE KEEP YOUR INFORMATION SAFE?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section8",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "8. DO WE COLLECT INFORMATION FROM MINORS?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section9",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "9. WHAT ARE YOUR PRIVACY RIGHTS?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section10",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "10. CONTROLS FOR DO-NOT-TRACK FEATURES"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section11",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section12",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section13",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "13. DO WE MAKE UPDATES TO THIS NOTICE?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section14",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "#section15",
                  className: "block p-3 rounded-lg border border-stone-800 hover:bg-stone-700/50 hover:border-stone-600 transition-all duration-200 text-stone-400 hover:text-stone-200 text-sm",
                  children: "15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"
                })
              })]
            })]
          })
        }), /* @__PURE__ */ jsxs("section", {
          id: "section1",
          className: "space-y-8 pt-12",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "1. WHAT INFORMATION DO WE COLLECT?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-lg font-medium text-stone-300 mb-6",
              children: "Personal information you disclose to us"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-4",
              children: "In Short: We collect personal information that you provide to us."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us."
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-stone-200 mb-3",
                children: "Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "space-y-2 pl-5 text-stone-300 marker:text-stone-500 list-disc",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "email addresses"
                }), /* @__PURE__ */ jsx("li", {
                  children: "usernames"
                }), /* @__PURE__ */ jsx("li", {
                  children: "passwords"
                })]
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "font-medium text-stone-200 mb-2",
              children: "Sensitive Information. We do not process sensitive information."
            }), /* @__PURE__ */ jsx("p", {
              children: "All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section2",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "2. HOW DO WE PROCESS YOUR INFORMATION?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-4",
              children: "In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We process your personal information for a variety of reasons, depending on how you interact with our Services, including:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-4 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: "To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order."
              }), /* @__PURE__ */ jsx("li", {
                children: "To deliver and facilitate delivery of services to the user. We may process your information to provide you with the requested service."
              }), /* @__PURE__ */ jsx("li", {
                children: "To save or protect an individual's vital interest. We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm."
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section3",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfil our contractual obligations, to protect your rights, or to fulfil our legitimate business interests."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-8 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-4",
                children: "If you are located in the EU or UK, this section applies to you."
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-4 pl-5",
                children: [/* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-stone-100 block font-medium mb-1",
                    children: "Consent."
                  }), /* @__PURE__ */ jsx("span", {
                    children: "We may process your information if you have given us permission (i.e. consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent."
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-stone-100 block font-medium mb-1",
                    children: "Performance of a Contract."
                  }), /* @__PURE__ */ jsx("span", {
                    children: "We may process your personal information when we believe it is necessary to fulfil our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you."
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-stone-100 block font-medium mb-1",
                    children: "Legal Obligations."
                  }), /* @__PURE__ */ jsx("span", {
                    children: "We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved."
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-stone-100 block font-medium mb-1",
                    children: "Vital Interests."
                  }), /* @__PURE__ */ jsx("span", {
                    children: "We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person."
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-4",
                children: "If you are located in Canada, this section applies to you."
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "We may process your information if you have given us specific permission (i.e. express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e. implied consent). You can withdraw your consent at any time."
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium text-stone-200 mb-3",
                  children: "In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:"
                }), /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-2 pl-5 text-stone-300 marker:text-stone-500 list-disc",
                  children: [/* @__PURE__ */ jsx("li", {
                    children: "If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "For investigations and fraud detection and prevention"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "For business transactions provided certain conditions are met"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "For identifying injured, ill, or deceased persons and communicating with next of kin"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If the collection is solely for journalistic, artistic, or literary purposes"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "If the information is publicly available and is specified by the regulations"
                  })]
                }), /* @__PURE__ */ jsx("p", {
                  className: "mt-4 text-sm",
                  children: "We may disclose de-identified information for approved research or statistics projects, subject to ethics oversight and confidentiality commitments"
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section4",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We may share information in specific situations described in this section and/or with the following third parties."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We may need to share your personal information in the following situations:"
            }), /* @__PURE__ */ jsx("div", {
              className: "space-y-4 pl-5",
              children: /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("strong", {
                  className: "text-stone-100 block font-medium mb-1",
                  children: "Business Transfers."
                }), /* @__PURE__ */ jsx("span", {
                  children: "We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company."
                })]
              })
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section5",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "5. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We may use cookies and other tracking technologies to collect and store your information."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions."
            }), /* @__PURE__ */ jsx("p", {
              children: "We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites."
            }), /* @__PURE__ */ jsxs("p", {
              children: ["To the extent these online tracking technologies are deemed to be a 'sale'/'sharing' (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section ", " ", " ", /* @__PURE__ */ jsx("a", {
                href: "#section11",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?'"
              })]
            }), /* @__PURE__ */ jsxs("p", {
              children: ["Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice: ", " ", /* @__PURE__ */ jsx("a", {
                href: "/cookies",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "https://tldrhistory.xyz/cookies"
              }), "."]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section6",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "6. HOW LONG DO WE KEEP YOUR INFORMATION?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us."
            }), /* @__PURE__ */ jsx("p", {
              children: "When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section7",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "7. HOW DO WE KEEP YOUR INFORMATION SAFE?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We aim to protect your personal information through a system of organisational and technical security measures."
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section8",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "8. DO WE COLLECT INFORMATION FROM MINORS?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction."
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsxs("p", {
              children: ["We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or the equivalent age as specified by law in your jurisdiction or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age or the equivalent age as specified by law in your jurisdiction has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18 or the equivalent age as specified by law in your jurisdiction, please contact us at", " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              }), "."]
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section9",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "9. WHAT ARE YOUR PRIVACY RIGHTS?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("p", {
              children: ["In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. If a decision that produces legal or similarly significant effects is made solely by automated means, we will inform you, explain the main factors, and offer a simple way to request human review. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section", " ", /* @__PURE__ */ jsx("a", {
                href: "#section14",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?'"
              }), " ", "below."]
            }), /* @__PURE__ */ jsx("p", {
              children: "We will consider and act upon any request in accordance with applicable data protection laws."
            }), /* @__PURE__ */ jsx("p", {
              children: "If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority."
            }), /* @__PURE__ */ jsx("p", {
              children: "If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner."
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsxs("p", {
                className: "font-medium text-stone-200 mb-3",
                children: ["Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section ", " ", /* @__PURE__ */ jsxs("a", {
                  href: "#section14",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: ["'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?'", " "]
                }), " below."]
              }), /* @__PURE__ */ jsx("p", {
                children: "However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "Account Information"
              }), /* @__PURE__ */ jsx("p", {
                children: "If you would at any time like to review or change the information in your account or terminate your account, you can:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "space-y-2 pl-5 mt-3 text-stone-300 marker:text-stone-500 list-disc",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Contact us using the contact information provided."
                }), /* @__PURE__ */ jsx("li", {
                  children: "Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements."
                })]
              })]
            }), /* @__PURE__ */ jsx("div", {
              children: /* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services."
              })
            }), /* @__PURE__ */ jsxs("p", {
              children: ["If you have questions or comments about your privacy rights, you may email us at", " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              }), "."]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section10",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "10. CONTROLS FOR DO-NOT-TRACK FEATURES"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ('DNT') feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice."
            }), /* @__PURE__ */ jsx("p", {
              children: "California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognising or honouring DNT signals, we do not respond to them at this time."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section11",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "11. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-10 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
              children: "Categories of Personal Information We Collect"
            }), /* @__PURE__ */ jsxs("p", {
              className: "mb-6",
              children: ["The table below shows the categories of personal information we have collected in the past twelve (12) months. The table includes illustrative examples of each category and does not reflect the personal information we collect from you. For a comprehensive inventory of all personal information we process, please refer to the section", " ", /* @__PURE__ */ jsx("a", {
                href: "#section1",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "'WHAT INFORMATION DO WE COLLECT?'"
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950/40",
              children: /* @__PURE__ */ jsxs("table", {
                className: "min-w-full border-collapse text-left",
                children: [/* @__PURE__ */ jsx("thead", {
                  className: "border-b border-stone-800 bg-stone-900/50",
                  children: /* @__PURE__ */ jsxs("tr", {
                    children: [/* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 sm:px-6",
                      children: "Category"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 sm:px-6",
                      children: "Examples"
                    }), /* @__PURE__ */ jsx("th", {
                      className: "px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400 sm:px-6",
                      children: "Collected"
                    })]
                  })
                }), /* @__PURE__ */ jsxs("tbody", {
                  className: "divide-y divide-stone-800",
                  children: [/* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "A. Identifiers"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-gold bg-gold-hover px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stoene-200",
                        children: "YES"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "B. Personal information as defined in the California Customer Records statute"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Name, contact information, education, employment, employment history, and financial information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "C. Protected classification characteristics under state or federal law"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "D. Commercial information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Transaction information, purchase history, financial details, and payment information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "E. Biometric information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Fingerprints and voiceprints"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "F. Internet or other similar network activity"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Browsing history, search history, online behaviour, interest data, and interactions with our and other websites, applications, systems, and advertisements"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "G. Geolocation data"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Device location"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "H. Audio, electronic, sensory, or similar information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Images and audio, video or call recordings created in connection with our business activities"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "I. Professional or employment-related information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "J. Education Information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Student records and directory information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "K. Inferences drawn from collected personal information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  }), /* @__PURE__ */ jsxs("tr", {
                    className: "align-top",
                    children: [/* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 font-semibold text-stone-200 sm:px-6",
                      children: "L. Sensitive personal information"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 text-stone-300 sm:px-6",
                      children: "None"
                    }), /* @__PURE__ */ jsx("td", {
                      className: "px-4 py-5 sm:px-6",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "inline-flex rounded-full border border-stone-700 bg-stone-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300",
                        children: "NO"
                      })
                    })]
                  })]
                })]
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: "Receiving help through our customer support channels;"
              }), /* @__PURE__ */ jsx("li", {
                children: "Participation in customer surveys or contests; and"
              }), /* @__PURE__ */ jsx("li", {
                children: "Facilitation in the delivery of our Services and to respond to your inquiries."
              })]
            }), /* @__PURE__ */ jsx("p", {
              children: "We will use and retain the collected personal information as needed to provide the Services or for:"
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "Category A"
              }), /* @__PURE__ */ jsx("p", {
                children: "As long as the user has an account with us."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "Sources of Personal Information"
              }), /* @__PURE__ */ jsxs("p", {
                children: ["Learn more about the sources of personal information we collect in", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section1",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "WHAT INFORMATION DO WE COLLECT?"
                }), "."]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "How We Use and Share Personal Information"
              }), /* @__PURE__ */ jsxs("p", {
                children: ["Learn more about how we use your personal information in the section", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section2",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "HOW DO WE PROCESS YOUR INFORMATION?"
                }), "."]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-semibold text-stone-200 mb-3",
                children: "Will your information be shared with anyone else?"
              }), /* @__PURE__ */ jsxs("p", {
                children: ["We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section,", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section4",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?"
                })]
              })]
            }), /* @__PURE__ */ jsxs("p", {
              children: ["We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be ", /* @__PURE__ */ jsx("span", {
                className: "italic",
                children: "'selling'"
              }), " of your personal information."]
            }), /* @__PURE__ */ jsx("p", {
              children: "We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers."
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-lg font-semibold text-stone-200 mb-4 mt-8",
                children: "Your Rights"
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-6",
                children: "You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "space-y-2 pl-5 mb-8 text-stone-300 marker:text-stone-500 list-disc",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Right to know whether or not we are processing your personal data"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to access your personal data"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to correct inaccuracies in your personal data"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to request the deletion of your personal data"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to obtain a copy of the personal data you previously shared with us"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to non-discrimination for exercising your rights"
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["Right to opt out of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California's privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (", /* @__PURE__ */ jsx("span", {
                    className: "italic",
                    children: "'profiling'"
                  }), ")"]
                })]
              }), /* @__PURE__ */ jsx("p", {
                children: "Depending upon the state where you live, you may also have the following rights:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "space-y-2 pl-5 mt-4 mb-8 text-stone-300 marker:text-stone-500 list-disc",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Right to access the categories of personal data being processed (as permitted by applicable law, including the privacy law in Minnesota)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in California, Delaware, and Maryland)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including the privacy law in Minnesota and Oregon)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to obtain a list of third parties to which we have sold personal data (as permitted by applicable law, including the privacy law in Connecticut)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to review, understand, question, and depending on where you live, correct how personal data has been profiled (as permitted by applicable law, including the privacy law in Connecticut and Minnesota)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including the privacy law in California)"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including the privacy law in Florida)"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("h4", {
                  className: "text-base font-semibold text-stone-200 mb-4",
                  children: "How to Exercise Your Rights"
                }), /* @__PURE__ */ jsxs("p", {
                  children: ["To exercise these rights, you can contact us by submitting a data subject access request, by emailing us at", " ", /* @__PURE__ */ jsx("a", {
                    href: "mailto:support@mail.tldrhistory.xyz",
                    className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                    children: "support@mail.tldrhistory.xyz"
                  }), ", or by referring to the contact details at the bottom of this document."]
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h4", {
                className: "text-base font-semibold text-stone-200 mb-4",
                children: "Authorized Agents"
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "Under certain US state data protection laws, you can designate an authorised agent to make a request on your behalf. We may deny a request from an authorised agent that does not submit proof that they have been validly authorised to act on your behalf in accordance with applicable laws."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h4", {
                className: "text-base font-semibold text-stone-200 mb-4",
                children: "Request Verification"
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes."
              }), /* @__PURE__ */ jsx("p", {
                children: "If you submit the request through an authorised agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h4", {
                className: "text-base font-semibold text-stone-200 mb-4",
                children: "Appeals"
              }), /* @__PURE__ */ jsxs("p", {
                children: ["Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at", " ", /* @__PURE__ */ jsx("a", {
                  href: "mailto:support@mail.tldrhistory.xyz",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "support@mail.tldrhistory.xyz"
                }), ". We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general."]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h4", {
                className: "text-base font-semibold text-stone-200 mb-4",
                children: 'California "Shine The Light" Law'
              }), /* @__PURE__ */ jsxs("p", {
                children: ["California Civil Code Section 1798.83, also known as the", " ", /* @__PURE__ */ jsx("span", {
                  className: "italic",
                  children: "'Shine The Light'"
                }), " law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section", " ", /* @__PURE__ */ jsx("a", {
                  href: "#section14",
                  className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section12",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "12. DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: You may have additional rights based on the country you reside in."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-10 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
                children: "Australia and New Zealand"
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act)."
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-6",
                children: "This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information."
              }), /* @__PURE__ */ jsxs("div", {
                className: "mb-6",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium text-stone-200 mb-3",
                  children: "If you do not wish to provide the personal information necessary to fulfil their applicable purpose, it may affect our ability to provide our services, in particular:"
                }), /* @__PURE__ */ jsxs("ul", {
                  className: "space-y-2 pl-5 marker:text-stone-500 list-disc",
                  children: [/* @__PURE__ */ jsx("li", {
                    children: "offer you the products or services that you want"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "respond to or help with your requests"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "manage your account with us"
                  }), /* @__PURE__ */ jsx("li", {
                    children: "confirm your identity and protect your account"
                  })]
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-4",
                children: "At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section 'HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?'"
              }), /* @__PURE__ */ jsx("p", {
                children: "If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the Office of the Australian Information Commissioner and a breach of New Zealand's Privacy Principles to the Office of New Zealand Privacy Commissioner."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl font-serif font-semibold tracking-wide text-stone-200/90 mb-4",
                children: "Republic of South Africa"
              }), /* @__PURE__ */ jsx("p", {
                className: "mb-6",
                children: "At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section 'HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?'"
              }), /* @__PURE__ */ jsxs("div", {
                className: "bg-stone-700/30 border border-stone-600 rounded-lg p-6",
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-medium text-stone-200 mb-2",
                  children: "If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:"
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-3 text-sm",
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "font-semibold text-stone-100",
                    children: "The Information Regulator (South Africa)"
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["General enquiries:", " ", /* @__PURE__ */ jsx("a", {
                      href: "mailto:enquiries@inforegulator.org.za",
                      className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                      children: "enquiries@inforegulator.org.za"
                    })]
                  }), /* @__PURE__ */ jsxs("p", {
                    children: ["Complaints (complete POPIA/PAIA form 5):", " ", /* @__PURE__ */ jsx("a", {
                      href: "mailto:PAIAComplaints@inforegulator.org.za",
                      className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                      children: "PAIAComplaints@inforegulator.org.za"
                    }), " ", "&", " ", /* @__PURE__ */ jsx("a", {
                      href: "mailto:POPIAComplaints@inforegulator.org.za",
                      className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                      children: "POPIAComplaints@inforegulator.org.za"
                    })]
                  })]
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section13",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "13. DO WE MAKE UPDATES TO THIS NOTICE?"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm font-medium italic text-stone-400 uppercase tracking-wide mb-6",
              children: "In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws."
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "We may update this Privacy Notice from time to time. The updated version will be indicated by an updated 'Revised' date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information."
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section14",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsxs("p", {
              children: ["If you have questions or comments about this notice, you may email us at", " ", /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              }), " ", "or contact us by post at:"]
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-stone-700/50 border border-stone-600 rounded-lg p-6",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-stone-200 mb-1",
                children: "Robert Morgan"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "Hill View"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "Cardiff, South Glamorgan CF5 3UB"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300 font-medium",
                children: "United Kingdom"
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section15",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-6",
              children: "15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: "Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request."
            })
          })]
        })]
      })]
    })
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: privacy,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1({}) {
  return buildMeta({
    title: "Cookie Policy | TLDR History",
    description: "Read the TLDR History cookie policy to understand how cookies and similar technologies are used across the site.",
    path: "/cookies",
    type: "website"
  });
}
const cookies = UNSAFE_withComponentProps(function Cookies() {
  return /* @__PURE__ */ jsx(PageContainer, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "py-16 sm:py-24 p-4 sm:p-6 z-10",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-4xl font-serif font-semibold tracking-wide text-stone-200/86 text-shadow-sm mb-8 sm:mb-12 text-center",
        children: "Cookie Policy"
      }), /* @__PURE__ */ jsxs("div", {
        className: "mx-auto flex max-w-2xl flex-col gap-4 rounded-xl border border-stone-900 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-4 shadow-xl shadow-stone-950/40 sm:gap-5 sm:p-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-5 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-xs font-medium uppercase tracking-[0.18em] text-stone-400 sm:text-sm",
            children: "Last updated April 13, 2026"
          }), /* @__PURE__ */ jsxs("p", {
            children: ['This Cookie Policy explains how Robert Morgan ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at ', " ", /* @__PURE__ */ jsx("a", {
              href: "https://tldrhistory.xyz",
              className: "text-stone-100 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
              children: "https://tldrhistory.xyz"
            }), " ", " ", '("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.']
          }), /* @__PURE__ */ jsx("p", {
            children: "In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information."
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section1",
          className: "space-y-8 pt-12",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "What are cookies?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information."
            }), /* @__PURE__ */ jsx("p", {
              children: 'Cookies set by the website owner (in this case, Robert Morgan) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.'
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section2",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "Why do we use cookies?"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: 'We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.'
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section3",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "How can I control cookies?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Preference Center. The Cookie Preference Center allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services."
            }), /* @__PURE__ */ jsx("p", {
              children: "The Cookie Preference Center can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies."
            }), /* @__PURE__ */ jsx("p", {
              children: "The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table below (please note that the specific cookies served may vary depending on the specific Online Properties you visit):"
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section4",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "How can I control cookies on my browser?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Chrome"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Internet Explorer"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Firefox"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://support.apple.com/en-ie/guide/safari/sfri11471/mac",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Safari"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://support.microsoft.com/en-us/microsoft-edge/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Edge"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://help.opera.com/en/latest/web-preferences/",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Opera"
                })
              })]
            }), /* @__PURE__ */ jsx("p", {
              children: "In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-3 pl-5 text-stone-300 marker:text-stone-500 list-disc",
              children: [/* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://optout.aboutads.info/",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Digital Advertising Alliance"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://youradchoices.ca/",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "Digital Advertising Alliance of Canada"
                })
              }), /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx("a", {
                  href: "https://www.youronlinechoices.com/",
                  target: "_blank",
                  className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                  children: "European Interactive Digital Advertising Alliance"
                })
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section5",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "What about other tracking technologies, like web beacons?"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: /* @__PURE__ */ jsx("p", {
              children: 'Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.'
            })
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section6",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "Do you use Flash cookies or Local Shared Objects?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: 'Websites may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.'
            }), /* @__PURE__ */ jsxs("p", {
              children: ["If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the", " ", /* @__PURE__ */ jsx("a", {
                href: "https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html",
                target: "_blank",
                className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "Website Storage Settings Panel"
              }), ". You can also control Flash Cookies by going to the", " ", /* @__PURE__ */ jsx("a", {
                href: "https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html",
                target: "_blank",
                className: "text-stone-300 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "Global Storage Settings Panel"
              }), " ", 'and following the instructions (which may include instructions that explain, for example, how to delete existing Flash Cookies (referred to "information" on the Macromedia site), how to prevent Flash LSOs from being placed on your computer without your being asked, and (for Flash Player 8 and later) how to block Flash Cookies that are not being delivered by the operator of the page you are on at the time).']
            }), /* @__PURE__ */ jsx("p", {
              children: "Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications, including, potentially, Flash applications used in connection with our services or online content."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section7",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "How often will you update this Cookie Policy?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies."
            }), /* @__PURE__ */ jsx("p", {
              children: "The date at the top of this Cookie Policy indicates when it was last updated."
            })]
          })]
        }), /* @__PURE__ */ jsxs("section", {
          id: "section8",
          className: "space-y-8 pt-12 border-t border-stone-800",
          children: [/* @__PURE__ */ jsx("div", {
            children: /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-serif font-semibold tracking-wide text-stone-200/90 text-shadow-sm mb-2",
              children: "Where can I get further information?"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6 text-sm leading-7 text-stone-300 sm:text-base sm:leading-8",
            children: [/* @__PURE__ */ jsx("p", {
              children: "If you have any questions about our use of cookies or other technologies, please contact us at:"
            }), /* @__PURE__ */ jsxs("div", {
              className: "bg-stone-800/50 border border-stone-600 rounded-lg p-6",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-medium text-stone-200 mb-1",
                children: "Robert Morgan"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "23 Hill View"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "Cardiff, South Glamorgan CF5 3UB"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300",
                children: "United Kingdom"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-stone-300 font-bold",
                children: "Phone: +639543954764"
              }), /* @__PURE__ */ jsx("a", {
                href: "mailto:support@mail.tldrhistory.xyz",
                target: "_blank",
                className: "text-stone-200 underline decoration-stone-500 underline-offset-4 transition hover:text-white hover:decoration-stone-300 font-medium",
                children: "support@mail.tldrhistory.xyz"
              })]
            })]
          })]
        })]
      })]
    })
  });
});
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cookies,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return buildMeta({
    title: "Page Not Found | TLDR History",
    description: "The page you’re looking for does not exist or may have been moved.",
    path: "/404",
    robots: "noindex, nofollow",
    type: "website"
  });
}
const notFound = UNSAFE_withComponentProps(function NotFound() {
  return /* @__PURE__ */ jsx(ErrorPage, {});
});
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: notFound,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-D0FeqjWV.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/index-B4b5WdU2.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/root-DbBHDEh7.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/index-B4b5WdU2.js", "/assets/api-Cerb6jfg.js", "/assets/queryClient-BjzNGa1W.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/icons-BqHPv0b5.js", "/assets/proxy-DZXW7wcI.js", "/assets/query-C0SnJp37.js", "/assets/mutation-XDZetmbL.js"], "css": ["/assets/root-CMmoI1sr.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app-layout": { "id": "routes/app-layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": true, "module": "/assets/app-layout-B4LMYpmf.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/Error-BVRaYIVj.js", "/assets/Button-DKCewfr6.js", "/assets/PageContainer-DezZHYQh.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "routes/app-layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/home-CbHCQwO5.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/seo-C7rmy-Hb.js", "/assets/PageContainer-DezZHYQh.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/timeline": { "id": "routes/timeline", "parentId": "routes/app-layout", "path": "timeline", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/timeline-C7aNiPqM.js", "imports": ["/assets/timeline-DPPIAUmW.js", "/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/EraContext-B-nIDenh.js", "/assets/historicalRanges-BjJqNVMV.js", "/assets/index-DYfjXkOF.js", "/assets/queries-C9NwmI2N.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/StatsContainer-Cr4GvC08.js", "/assets/useQuery-B8BaeAup.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/timeline.index": { "id": "routes/timeline.index", "parentId": "routes/timeline", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/timeline.index-DbUEnTNj.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/Timeline-B5dTxbzA.js", "/assets/EraContext-B-nIDenh.js", "/assets/seo-C7rmy-Hb.js", "/assets/TimelineCard-BtC9NJPH.js", "/assets/index-DYfjXkOF.js", "/assets/queries-C9NwmI2N.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/CardFooter-DRVyA_5I.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/queryClient-BjzNGa1W.js", "/assets/formatDate-Dl1fuuw4.js", "/assets/Skeleton-dF88oFNV.js", "/assets/historicalRanges-BjJqNVMV.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/timeline.$groupSlug": { "id": "routes/timeline.$groupSlug", "parentId": "routes/timeline", "path": ":groupSlug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/timeline._groupSlug-Bo72l3H0.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/Timeline-B5dTxbzA.js", "/assets/EraContext-B-nIDenh.js", "/assets/seo-C7rmy-Hb.js", "/assets/TimelineCard-BtC9NJPH.js", "/assets/index-DYfjXkOF.js", "/assets/queries-C9NwmI2N.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/CardFooter-DRVyA_5I.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/queryClient-BjzNGa1W.js", "/assets/formatDate-Dl1fuuw4.js", "/assets/Skeleton-dF88oFNV.js", "/assets/historicalRanges-BjJqNVMV.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register": { "id": "routes/register", "parentId": "routes/app-layout", "path": "register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/register-C2CQ7pRh.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useAuthMutations-B2Snm5gu.js", "/assets/schemas-B-AyO3lh.js", "/assets/PageContainer-DezZHYQh.js", "/assets/Button-DKCewfr6.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/seo-C7rmy-Hb.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/gql-LW7U8fXP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "routes/app-layout", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/login-BOZyZocP.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useAuthMutations-B2Snm5gu.js", "/assets/schemas-B-AyO3lh.js", "/assets/Button-DKCewfr6.js", "/assets/PageContainer-DezZHYQh.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/seo-C7rmy-Hb.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/gql-LW7U8fXP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/forgot-password": { "id": "routes/forgot-password", "parentId": "routes/app-layout", "path": "forgot-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/forgot-password-DW1-227w.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useAuthMutations-B2Snm5gu.js", "/assets/PageContainer-DezZHYQh.js", "/assets/Button-DKCewfr6.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/seo-C7rmy-Hb.js", "/assets/schemas-B-AyO3lh.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/gql-LW7U8fXP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/reset-password": { "id": "routes/reset-password", "parentId": "routes/app-layout", "path": "reset-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/reset-password-M0RRdUQB.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useAuthMutations-B2Snm5gu.js", "/assets/schemas-B-AyO3lh.js", "/assets/PageContainer-DezZHYQh.js", "/assets/Button-DKCewfr6.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/seo-C7rmy-Hb.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/gql-LW7U8fXP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/verify": { "id": "routes/verify", "parentId": "routes/app-layout", "path": "verify", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/verify-j1eBjBed.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useAuthMutations-B2Snm5gu.js", "/assets/Button-DKCewfr6.js", "/assets/PageContainer-DezZHYQh.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/seo-C7rmy-Hb.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/gql-LW7U8fXP.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/user.$id": { "id": "routes/user.$id", "parentId": "routes/app-layout", "path": "user/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/user._id-KmX8BI4D.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/seo-C7rmy-Hb.js", "/assets/StatsContainer-Cr4GvC08.js", "/assets/formatDate-Dl1fuuw4.js", "/assets/useQuery-B8BaeAup.js", "/assets/gql-LW7U8fXP.js", "/assets/queries-C9NwmI2N.js", "/assets/TimelineCard-BtC9NJPH.js", "/assets/StatCard-GF2ARpUe.js", "/assets/historicalRanges-BjJqNVMV.js", "/assets/index-DYfjXkOF.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/query-C0SnJp37.js", "/assets/CardFooter-DRVyA_5I.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/queryClient-BjzNGa1W.js", "/assets/Skeleton-dF88oFNV.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/articles": { "id": "routes/articles", "parentId": "routes/app-layout", "path": "articles", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/articles-CHRbFs12.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/articles.create": { "id": "routes/articles.create", "parentId": "routes/articles", "path": "create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/articles.create-WqqM5j2n.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useSuggestions-dcmsBlOx.js", "/assets/useCreate-DxmmJgd6.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/PostForm-DXWDloMu.js", "/assets/PageContainer-DezZHYQh.js", "/assets/seo-C7rmy-Hb.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/useQuery-B8BaeAup.js", "/assets/queries-C9NwmI2N.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/schemas-B-AyO3lh.js", "/assets/index-p3IKnc0-.js", "/assets/Button-DKCewfr6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/articles.edit.$id": { "id": "routes/articles.edit.$id", "parentId": "routes/articles", "path": "edit/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/articles.edit._id-DAg0136m.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/seo-C7rmy-Hb.js", "/assets/useSuggestions-dcmsBlOx.js", "/assets/useEdit-BvA3xFhI.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/PostForm-DXWDloMu.js", "/assets/PageContainer-DezZHYQh.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/useQuery-B8BaeAup.js", "/assets/queries-C9NwmI2N.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/schemas-B-AyO3lh.js", "/assets/index-p3IKnc0-.js", "/assets/Button-DKCewfr6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/review-suggestions": { "id": "routes/review-suggestions", "parentId": "routes/app-layout", "path": "review-suggestions", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/review-suggestions-inpL1haF.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/useSuggestions-dcmsBlOx.js", "/assets/StatsContainer-Cr4GvC08.js", "/assets/StatCard-GF2ARpUe.js", "/assets/useEdit-BvA3xFhI.js", "/assets/Button-DKCewfr6.js", "/assets/Skeleton-dF88oFNV.js", "/assets/formatDate-Dl1fuuw4.js", "/assets/useCreate-DxmmJgd6.js", "/assets/seo-C7rmy-Hb.js", "/assets/AuthContext-DXWSM6lf.js", "/assets/ToastContext-DhR2gbfb.js", "/assets/api-Cerb6jfg.js", "/assets/proxy-DZXW7wcI.js", "/assets/PageContainer-DezZHYQh.js", "/assets/useQuery-B8BaeAup.js", "/assets/queries-C9NwmI2N.js", "/assets/query-C0SnJp37.js", "/assets/gql-LW7U8fXP.js", "/assets/mutations-QHF5Ee7w.js", "/assets/mutation-XDZetmbL.js", "/assets/index-DYfjXkOF.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/terms": { "id": "routes/terms", "parentId": "routes/app-layout", "path": "terms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/terms-Cuc0oFAm.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/PageContainer-DezZHYQh.js", "/assets/seo-C7rmy-Hb.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/privacy": { "id": "routes/privacy", "parentId": "routes/app-layout", "path": "privacy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/privacy-DxGu0zDQ.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/PageContainer-DezZHYQh.js", "/assets/seo-C7rmy-Hb.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cookies": { "id": "routes/cookies", "parentId": "routes/app-layout", "path": "cookies", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/cookies-BF3D9oF0.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/PageContainer-DezZHYQh.js", "/assets/seo-C7rmy-Hb.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/not-found": { "id": "routes/not-found", "parentId": "routes/app-layout", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasDefaultExport": true, "hasErrorBoundary": false, "module": "/assets/not-found-CbVwIyvb.js", "imports": ["/assets/chunk-OE4NN4TA-D45wUbcD.js", "/assets/Error-BVRaYIVj.js", "/assets/seo-C7rmy-Hb.js", "/assets/Button-DKCewfr6.js", "/assets/PageContainer-DezZHYQh.js", "/assets/proxy-DZXW7wcI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-a6729ce8.js", "version": "a6729ce8", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_passThroughRequests": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "unstable_previewServerPrerendering": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = ["/", "/timeline", "/register", "/login", "/forgot-password", "/reset-password", "/verify", "/articles", "/articles/create", "/review-suggestions", "/terms", "/privacy", "/cookies", "/timeline/ancient-china", "/timeline/ancient-egypt", "/timeline/ancient-greece", "/timeline/ancient-india", "/timeline/ancient-rome", "/timeline/andean-civilizations", "/timeline/baroque", "/timeline/black-history", "/timeline/byzantine-empire", "/timeline/classical-japan", "/timeline/cold-war", "/timeline/colonial-brazil", "/timeline/colonial-north-america", "/timeline/colonial-southeast-asia", "/timeline/colonial-spanish-america", "/timeline/early-islamic-period", "/timeline/early-modern-europe", "/timeline/early-republic", "/timeline/feminism", "/timeline/feudal-japan", "/timeline/gilded-age", "/timeline/globalization", "/timeline/imperial-china", "/timeline/industrial-revolution", "/timeline/islamic-golden-age", "/timeline/medieval-europe", "/timeline/mesoamerica", "/timeline/mesopotamia", "/timeline/modern-china", "/timeline/modern-era", "/timeline/modern-japan", "/timeline/mongol-empire", "/timeline/ottoman-empire", "/timeline/persian-empire", "/timeline/pirates", "/timeline/polynesia-oceania", "/timeline/post-independence-south-america", "/timeline/pre-columbian-brazil", "/timeline/precolonial-north-america", "/timeline/precolonial-southeast-asia", "/timeline/prehistory", "/timeline/reformation-religious-wars", "/timeline/renaissance", "/timeline/silk-road", "/timeline/sub-saharan-kingdoms", "/timeline/enlightenment", "/timeline/viking-age", "/timeline/west-african-empires", "/timeline/wwii"];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/app-layout": {
    id: "routes/app-layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/home": {
    id: "routes/home",
    parentId: "routes/app-layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/timeline": {
    id: "routes/timeline",
    parentId: "routes/app-layout",
    path: "timeline",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/timeline.index": {
    id: "routes/timeline.index",
    parentId: "routes/timeline",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
  },
  "routes/timeline.$groupSlug": {
    id: "routes/timeline.$groupSlug",
    parentId: "routes/timeline",
    path: ":groupSlug",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/register": {
    id: "routes/register",
    parentId: "routes/app-layout",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/login": {
    id: "routes/login",
    parentId: "routes/app-layout",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/forgot-password": {
    id: "routes/forgot-password",
    parentId: "routes/app-layout",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/reset-password": {
    id: "routes/reset-password",
    parentId: "routes/app-layout",
    path: "reset-password",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/verify": {
    id: "routes/verify",
    parentId: "routes/app-layout",
    path: "verify",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/user.$id": {
    id: "routes/user.$id",
    parentId: "routes/app-layout",
    path: "user/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/articles": {
    id: "routes/articles",
    parentId: "routes/app-layout",
    path: "articles",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/articles.create": {
    id: "routes/articles.create",
    parentId: "routes/articles",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/articles.edit.$id": {
    id: "routes/articles.edit.$id",
    parentId: "routes/articles",
    path: "edit/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/review-suggestions": {
    id: "routes/review-suggestions",
    parentId: "routes/app-layout",
    path: "review-suggestions",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/terms": {
    id: "routes/terms",
    parentId: "routes/app-layout",
    path: "terms",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/privacy": {
    id: "routes/privacy",
    parentId: "routes/app-layout",
    path: "privacy",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/cookies": {
    id: "routes/cookies",
    parentId: "routes/app-layout",
    path: "cookies",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/not-found": {
    id: "routes/not-found",
    parentId: "routes/app-layout",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  }
};
const allowedActionOrigins = false;
export {
  prerender as A,
  Button as B,
  CloseIcon as C,
  DEFAULT_TIMELINE_FILTER as D,
  EDIT_SAVED_FILTER_MUTATION as E,
  FilterIcon as F,
  publicPath as G,
  routeDiscovery as H,
  routes as I,
  ssr as J,
  SAVE_FILTER_MUTATION as S,
  WorldMap as W,
  DELETE_SAVED_FILTER_MUTATION as a,
  SAVED_FILTERS_QUERY as b,
  useEra as c,
  getGroupSlugFromId as d,
  collapseData as e,
  filterToSearchParams as f,
  graphqlRequest as g,
  useToast as h,
  SearchIcon as i,
  SortIcon as j,
  useAuth as k,
  api as l,
  DELETE_POST as m,
  formatDate as n,
  CardSubjects as o,
  parseView as p,
  CardFooter as q,
  allowedActionOrigins as r,
  serverManifest as s,
  themes as t,
  useTimelineFilter as u,
  assetsBuildDirectory as v,
  basename as w,
  entry as x,
  future as y,
  isSpaMode as z
};
