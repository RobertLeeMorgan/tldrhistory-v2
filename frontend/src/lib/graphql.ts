import { api } from "./api";

export async function graphqlRequest<T, V = Record<string, never>>(
  query: string,
  variables?: V,
  apiOrigin?: string
): Promise<T> {
  try {
    const url = apiOrigin ? `${apiOrigin}/graphql` : "";

    const res = await api.post(url, { query, variables });

    if (res.data?.errors?.length) {
      throw Object.assign(new Error(res.data.errors[0].message), { code: res.data.errors[0].extensions?.code });
    }

    return res.data.data as T;
  } catch (err: any) {
    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. The operation may have completed. Refresh before retrying.");
    }

    throw err;
  }
}