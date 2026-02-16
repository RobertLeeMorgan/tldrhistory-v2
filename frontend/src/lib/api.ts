import axios from "axios";

export const api = axios.create({
  baseURL: "/graphql",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

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
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  }
);
