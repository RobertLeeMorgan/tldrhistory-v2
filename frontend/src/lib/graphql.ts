import { api } from "./api";

export async function graphqlRequest<T, V = {}>(
  query: string,
  variables?: V
): Promise<T> {
  const res = await api.post("", { query, variables });
  if (res.data.errors) {
    throw new Error(res.data.errors[0].message);
  }
  return res.data.data as T;
}
