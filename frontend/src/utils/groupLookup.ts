import { themes } from "./drawerValues";

const groupSlugToIdMap: Map<string, number> = new Map(
  themes.options.map((group) => [group.slug, group.value])
);

const groupIdToSlugMap: Map<number, string> = new Map(
  themes.options.map((group) => [group.value, group.slug])
);

const groupIdToLabelMap: Map<number, string> = new Map(
  themes.options.map((group) => [group.value, group.labelText])
);

export function getGroupIdFromSlug(slug: string | null): number | undefined {
  return slug ? groupSlugToIdMap.get(slug) : undefined;
}

export function getGroupSlugFromId(id: number | undefined): string | undefined {
  return typeof id === "number" && id !== 0 ? groupIdToSlugMap.get(id) : undefined;
}

export function getGroupLabelFromId(id: number | undefined): string | undefined {
  return typeof id === "number" && id !== 0 ? groupIdToLabelMap.get(id) : undefined;
}