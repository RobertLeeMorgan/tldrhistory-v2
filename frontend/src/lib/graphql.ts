import { api } from "./api";

export async function graphqlRequest<T, V = Record<string, never>>(
  query: string,
  variables?: V
): Promise<T> {
  try {
    const res = await api.post("", { query, variables });

    if (res.data?.errors?.length) {
      throw new Error(res.data.errors[0].message);
    }

    return res.data.data as T;
  } catch (err: any) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }

    throw err;
  }
}