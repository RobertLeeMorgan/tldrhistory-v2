import type { IconType } from "react-icons";

import {
  HISTORICAL_RANGES,
  EAST_ASIA_RANGES,
  ISLAMIC_WORLD_RANGES,
  NORTH_AMERICAS_RANGES,
  ANDEAN_AMERICAS_RANGES,
  MESOAMERICA_RANGES,
  WEST_AFRICA_RANGES,
  SUB_SAHARAN_AFRICA_RANGES,
  MEDITERRANEAN_RANGES,
  IRAN_RANGES,
  OCEANIA_RANGES,
  SOUTHEAST_ASIA_RANGES,
  SOUTH_ASIA_RANGES,
  UK_RANGES,
  JAPAN_RANGES,
  ARCTIC_RANGES,
  EUROPE_RANGES,
  STEPPE_RANGES,
} from "./historicalRanges";

export type HistoricalRange = {
  label: string;
  start: number;
  end: number;
  icon: IconType;
  headline: string;
};

export type EraView =
  | "global"
  | "east-asia"
  | "islamic-world"
  | "mediterranean"
  | "iran"
  | "west-africa"
  | "sub-saharan-africa"
  | "north-america"
  | "mesoamerica"
  | "andean-americas"
  | "oceania"
  | "south-asia"
  | "steppe"
  | "europe"
  | "southeast-asia"
  | "arctic"
  | "japan"
  | "uk";

export const RANGE_SETS: Record<EraView, HistoricalRange[]> = {
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
  uk: UK_RANGES,
};

export const VIEW_OPTIONS = [
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
  { value: "uk", label: "United Kingdom" },
] as const satisfies readonly { value: EraView; label: string }[];

const VIEW_VALUES = VIEW_OPTIONS.map((option) => option.value);

export function isEraView(value: string): value is EraView {
  return (VIEW_VALUES as readonly string[]).includes(value);
}

export function parseView(value: string | null): EraView | undefined {
  if (!value) return undefined;
  return isEraView(value) ? value : undefined;
}