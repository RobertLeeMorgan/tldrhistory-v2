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
  headline: string
}

export const HISTORICAL_RANGES: HistoricalRange[] = [
  // Prehistory & Early Civilizations
  {
    label: "Paleolithic Era",
    start: -300000,
    end: -20001,
    icon: GiCaveEntrance,
    headline: "Origins of Humanity"
  },
  { label: "Late Prehistory", start: -20000, end: -10001, icon: GiCaveman, headline: "The Stone Age Frontier" },
  {
    label: "Neolithic Revolution",
    start: -10000,
    end: -6001,
    icon: GiStoneAxe,
    headline: "The Dawn of Farming"
  },
  { label: "Early Farming Societies", start: -6000, end: -4001, icon: GiWheat, headline: "Seeds of Civilization" },
  {
    label: "Urbanization & Proto-Writing",
    start: -4000,
    end: -3001,
    icon: GiScrollUnfurled,
    headline: "The Rise of Cities",
  },

  // Bronze Age
  { label: "Early Bronze Age", start: -3000, end: -2001, icon: GiAnvil, headline: "Metalwork and Monarchy" },
  {
    label: "Middle Bronze Age",
    start: -2000,
    end: -1501,
    icon: GiEgyptianPyramids,
    headline: "Empires Forge Ahead"
  },
  {
    label: "Late Bronze Age Collapse Era",
    start: -1500,
    end: -1201,
    icon: GiFallingBomb,
    headline: "Civilizations in Turmoil"
  },

  // Iron Age & Classical
  { label: "Iron Age", start: -1200, end: -501, icon: GiAxeSword, headline: "Tools of Power" },
  {
    label: "Archaic Mediterranean Age",
    start: -500,
    end: -301,
    icon: GiGreekSphinx,
    headline: "Greek City-States Rise"
  },
  { label: "Classical Antiquity", start: -300, end: 199, icon: GiLaurelCrown, headline: "Rise of the Roman Empire" },
  { label: "Late Antiquity", start: 200, end: 499, icon: GiTempleGate, headline: "The Twilight of Empires" },

  // Medieval
  { label: "Early Middle Ages", start: 500, end: 749, icon: GiVisoredHelm, headline: "Kings and Conquests" },
  { label: "Islamic Golden Age", start: 750, end: 999, icon: GiTempleGate, headline: "Science and Scholars" },
  { label: "High Middle Ages", start: 1000, end: 1299, icon: GiCastle, headline: "Castles and Crusades" },
  { label: "Late Middle Ages", start: 1300, end: 1499, icon: GiCastle, headline: "Plague and War" },

  // Renaissance → Early Modern
  {
    label: "Renaissance & Age of Discovery",
    start: 1500,
    end: 1599,
    icon: GiPalette,
    headline: "Exploration and Enlightenment"
  },
  { label: "Scientific Revolution", start: 1600, end: 1699, icon: GiCompass, headline: "Reason Reigns" },
  {
    label: "Enlightenment & Imperial Expansion",
    start: 1700,
    end: 1799,
    icon: GiQuillInk,
    headline: "Revolutions and Reason"
  },

  // Industrial → Modern
  { label: "Industrial Revolution", start: 1800, end: 1869, icon: GiFactory, headline: "Machines Transform Lives" },
  {
    label: "Age of Empire & Globalization",
    start: 1870,
    end: 1913,
    icon: GiPalmTree,
    headline: "The World Connects"
  },
  { label: "World War Era", start: 1914, end: 1945, icon: GiFallingBomb, headline: "Global Conflict Engulfs Nations" },
  { label: "Cold War", start: 1946, end: 1990, icon: GiSubmarineMissile, headline: "Ideologies Clash" },
  { label: "Information Age", start: 1991, end: 2025, icon: GiWireframeGlobe, headline: "Digital Revolution" },
];