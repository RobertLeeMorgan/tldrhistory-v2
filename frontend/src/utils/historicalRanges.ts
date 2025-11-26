import {
  GiStoneAxe,
  GiWheat,
  GiScrollQuill,
  GiAxeSword,
  GiGreekSphinx,
  GiRomanShield,
  GiTempleGate,
  GiCastle,
  GiCompass,
  GiFactory,
  GiFallingBomb,
  GiSubmarineMissile,
  GiCircuitry,
} from "react-icons/gi";

import { FaGlobeAmericas } from "react-icons/fa";
import { MdScience } from "react-icons/md";

import type { IconType } from "react-icons";

export interface HistoricalRange {
  label: string;
  start: number;
  end: number;
  density: "extreme" | "very-high" | "high" | "medium" | "low";
  icon: IconType;
}

export const HISTORICAL_RANGES: HistoricalRange[] = [
  // Prehistory & Early Civilizations
  { label: "Neolithic Revolution", start: -10000, end: -6001, density: "low", icon: GiStoneAxe },
  { label: "Early Farming Societies", start: -6000, end: -4001, density: "medium", icon: GiWheat },
  { label: "Urbanization & Proto-Writing", start: -4000, end: -3001, density: "medium", icon: GiScrollQuill },

  // Bronze Age
  { label: "Early Bronze Age", start: -3000, end: -2201, density: "high", icon: GiAxeSword },
  { label: "Middle Bronze Age", start: -2200, end: -1601, density: "high", icon: GiAxeSword },
  { label: "Late Bronze Age Collapse Era", start: -1600, end: -1101, density: "very-high", icon: GiFallingBomb },

  // Iron Age & Classical
  { label: "Early Iron Age", start: -1100, end: -801, density: "medium", icon: GiAxeSword },
  { label: "Archaic Mediterranean Age", start: -800, end: -501, density: "high", icon: GiGreekSphinx },
  { label: "Classical Golden Age", start: -500, end: -324, density: "very-high", icon: GiTempleGate },
  { label: "Hellenistic Age", start: -323, end: -31, density: "high", icon: GiGreekSphinx },

  // Rome
  { label: "Early Roman Empire", start: -30, end: 199, density: "very-high", icon: GiRomanShield },
  { label: "Crisis & Late Empire", start: 200, end: 499, density: "very-high", icon: GiRomanShield },

  // Medieval
  { label: "Early Middle Ages", start: 500, end: 749, density: "medium", icon: GiCastle },
  { label: "Carolingian & Islamic Golden Age", start: 750, end: 999, density: "high", icon: GiTempleGate },
  { label: "High Middle Ages I", start: 1000, end: 1149, density: "very-high", icon: GiCastle },
  { label: "High Middle Ages II", start: 1150, end: 1299, density: "very-high", icon: GiCastle },
  { label: "Late Middle Ages", start: 1300, end: 1449, density: "high", icon: GiCastle },

  // Renaissance → Early Modern
  { label: "Renaissance & Age of Discovery", start: 1450, end: 1599, density: "very-high", icon: GiCompass },
  { label: "Scientific Revolution", start: 1600, end: 1699, density: "high", icon: MdScience },
  { label: "Enlightenment & Imperial Expansion", start: 1700, end: 1799, density: "very-high", icon: FaGlobeAmericas },

  // Industrial → Modern
  { label: "Industrial Revolution", start: 1800, end: 1879, density: "very-high", icon: GiFactory },
  { label: "Age of Empire & Globalization", start: 1880, end: 1913, density: "very-high", icon: FaGlobeAmericas },
  { label: "World War Era", start: 1914, end: 1945, density: "extreme", icon: GiFallingBomb },
  { label: "Cold War", start: 1946, end: 1990, density: "extreme", icon: GiSubmarineMissile },
  { label: "Information Age", start: 1991, end: 2025, density: "extreme", icon: GiCircuitry }
];
