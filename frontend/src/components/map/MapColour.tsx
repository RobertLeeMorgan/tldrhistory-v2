export type Continent =
  | "Asia"
  | "Europe"
  | "Africa"
  | "NorthAmerica"
  | "SouthAmerica"
  | "Oceania"
  | "Antarctica"
  | "MiddleEast"
  | "Global";

const groupColorMap = new Map<number, string>();

export default function groupColor(
  groupId: number | null,
  continent: Continent | null
) {
  if (groupId == null) return "#adb7adff";

  if (groupColorMap.has(groupId)) return groupColorMap.get(groupId)!;

  const continentHueBand: Record<Continent, [number, number]> = {
    SouthAmerica: [330, 50],
    NorthAmerica: [280, 50],
    Europe: [230, 50],
    Africa: [180, 50],
    MiddleEast: [130, 50],
    Asia: [80, 50],
    Oceania: [30, 50],
    Antarctica: [0, 30],
    Global: [0, 360],
  };

  const safeGroup = Math.abs(groupId);
  const [center, width] = continent
    ? continentHueBand[continent] ?? [0, 360]
    : [0, 360];

  const steps = 7;
  const stepSize = width / steps;
  const hue = (center - width / 2 + (safeGroup % steps) * stepSize + 360) % 360;

  const lightnessSteps = [50, 60, 40];
  const saturationSteps = [65, 75, 70];

  const color = `hsl(${hue}, ${
    saturationSteps[safeGroup % saturationSteps.length]
  }%, ${lightnessSteps[safeGroup % lightnessSteps.length]}%)`;

  groupColorMap.set(groupId, color);
  return color;
}
