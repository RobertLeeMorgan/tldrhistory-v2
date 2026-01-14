import axios from "axios";

export const api = axios.create({
  baseURL: "/graphql",
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Handle expired/invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (
      response?.status === 401 ||
      response?.data?.errors?.some(
        (e: any) => e.extensions?.code === "UNAUTHENTICATED"
      )
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("expiresAt");

      window.location.href = "/login";

      alert("Session expired. Please log in again.");
    }

    return Promise.reject(error);
  }
);
