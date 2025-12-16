import {
  GiStoneAxe,
  GiWheat,
  GiScrollUnfurled,
  GiAxeSword,
  GiGreekSphinx,
  GiTempleGate,
  GiCastle,
  GiCompass,
  GiFactory,
  GiFallingBomb,
  GiSubmarineMissile,
  GiCaveman,
  GiAnvil,
  GiEgyptianPyramids,
  GiLaurelCrown,
  GiVisoredHelm,
  GiQuillInk,
  GiPalette,
  GiPalmTree,
  GiCaveEntrance,
  GiWireframeGlobe,
} from "react-icons/gi";

import type { IconType } from "react-icons";

export interface HistoricalRange {
  label: string;
  start: number;
  end: number;
  icon: IconType;
}

export const HISTORICAL_RANGES: HistoricalRange[] = [
  // Prehistory & Early Civilizations
  {
    label: "Early Prehistory",
    start: -3000000,
    end: -20001,
    icon: GiCaveEntrance,
  },
  { label: "Late Prehistory", start: -20000, end: -10001, icon: GiCaveman },
  {
    label: "Neolithic Revolution",
    start: -10000,
    end: -6001,
    icon: GiStoneAxe,
  },
  { label: "Early Farming Societies", start: -6000, end: -4001, icon: GiWheat },
  {
    label: "Urbanization & Proto-Writing",
    start: -4000,
    end: -3001,
    icon: GiScrollUnfurled,
  },

  // Bronze Age
  { label: "Early Bronze Age", start: -3000, end: -2001, icon: GiAnvil },
  {
    label: "Middle Bronze Age",
    start: -2000,
    end: -1501,
    icon: GiEgyptianPyramids,
  },
  {
    label: "Late Bronze Age Collapse Era",
    start: -1500,
    end: -1201,
    icon: GiFallingBomb,
  },

  // Iron Age & Classical
  { label: "Iron Age", start: -1200, end: -501, icon: GiAxeSword },
  {
    label: "Archaic Mediterranean Age",
    start: -500,
    end: -301,
    icon: GiGreekSphinx,
  },
  { label: "Classical Antiquity", start: -300, end: 199, icon: GiLaurelCrown },
  { label: "Late Antiquity", start: 200, end: 499, icon: GiTempleGate },

  // Medieval
  { label: "Early Middle Ages", start: 500, end: 749, icon: GiVisoredHelm },
  { label: "Islamic Golden Age", start: 750, end: 999, icon: GiTempleGate },
  { label: "High Middle Ages", start: 1000, end: 1299, icon: GiCastle },
  { label: "Late Middle Ages", start: 1300, end: 1499, icon: GiCastle },

  // Renaissance → Early Modern
  {
    label: "Renaissance & Age of Discovery",
    start: 1500,
    end: 1599,
    icon: GiPalette,
  },
  { label: "Scientific Revolution", start: 1600, end: 1699, icon: GiCompass },
  {
    label: "Enlightenment & Imperial Expansion",
    start: 1700,
    end: 1799,
    icon: GiQuillInk,
  },

  // Industrial → Modern
  { label: "Industrial Revolution", start: 1800, end: 1869, icon: GiFactory },
  {
    label: "Age of Empire & Globalization",
    start: 1870,
    end: 1913,
    icon: GiPalmTree,
  },
  { label: "World War Era", start: 1914, end: 1945, icon: GiFallingBomb },
  { label: "Cold War", start: 1946, end: 1990, icon: GiSubmarineMissile },
  { label: "Information Age", start: 1991, end: 2025, icon: GiWireframeGlobe },
];
