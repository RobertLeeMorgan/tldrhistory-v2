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
    headline: "Origins of Humanity: The First Steps on an Uncharted Earth"
  },
  { label: "Late Prehistory", start: -20000, end: -10001, icon: GiCaveman, headline: "The Stone Age Frontier: Humans Master Fire and Survival" },
  {
    label: "Neolithic Revolution",
    start: -10000,
    end: -6001,
    icon: GiStoneAxe,
    headline: "The Dawn of Farming: A New Era of Food and Settlement"
  },
  { label: "Early Farming Societies", start: -6000, end: -4001, icon: GiWheat, headline: "Seeds of Civilization: Agriculture Fuels Growth and Trade" },
  {
    label: "Urbanization & Proto-Writing",
    start: -4000,
    end: -3001,
    icon: GiScrollUnfurled,
    headline: "The Rise of Cities: Writing Sparks Civilization’s First Records",
  },

  // Bronze Age
  { label: "Early Bronze Age", start: -3000, end: -2001, icon: GiAnvil, headline: "Metalwork and Monarchy: Kingdoms Take Shape Across Continents" },
  {
    label: "Middle Bronze Age",
    start: -2000,
    end: -1501,
    icon: GiEgyptianPyramids,
    headline: "Empires Forge Ahead: Trade and Monumental Architecture"
  },
  {
    label: "Late Bronze Age Collapse Era",
    start: -1500,
    end: -1201,
    icon: GiFallingBomb,
    headline: "Civilizations in Turmoil: Trade Routes Disrupted and Kingdoms Fall"
  },

  // Iron Age & Classical
  { label: "Iron Age", start: -1200, end: -501, icon: GiAxeSword, headline: "Tools of Power: Iron Transforms Society" },
  {
    label: "Archaic Mediterranean Age",
    start: -500,
    end: -301,
    icon: GiGreekSphinx,
    headline: "City-States Rise: Philosophy, Warriors, and Maritime Trade"
  },
  { label: "Classical Antiquity", start: -300, end: 199, icon: GiLaurelCrown, headline: "Rise of the Roman Empire: A Legacy of Politics and Culture" },
  { label: "Late Antiquity", start: 200, end: 499, icon: GiTempleGate, headline: "The Twilight of Empires: Decline, Migration, and Transformation" },

  // Medieval
  { label: "Early Middle Ages", start: 500, end: 749, icon: GiVisoredHelm, headline: "Kingdoms Rise: Trade, Faith, and Cultural Flourishing" },
  { label: "Islamic Golden Age", start: 750, end: 999, icon: GiTempleGate, headline: "Knowledge Flourishes: Scholars Illuminate Science" },
  { label: "High Middle Ages", start: 1000, end: 1299, icon: GiCastle, headline: "Empires Expand: Cities Thrive and Civilizations Interact" },
  { label: "Late Middle Ages", start: 1300, end: 1499, icon: GiCastle, headline: "Conflict and Innovation: Plagues, Networks, and Exchange" },

  // Renaissance → Early Modern
  {
    label: "Renaissance & Age of Discovery",
    start: 1500,
    end: 1599,
    icon: GiPalette,
    headline: "Exploration and Enlightenment: Art, Science, and New Worlds Collide"
  },
  { label: "Scientific Revolution", start: 1600, end: 1699, icon: GiCompass, headline: "Reason Reigns: Discoveries Challenge the Old World Order" },
  {
    label: "Enlightenment & Imperial Expansion",
    start: 1700,
    end: 1799,
    icon: GiQuillInk,
    headline: "Ideas and Empires: Revolutions Reshape Societies"
  },

  // Industrial → Modern
  { label: "Industrial Revolution", start: 1800, end: 1869, icon: GiFactory, headline: "Machines Transform Lives: Cities, Factories, and Steam Power Rise" },
  {
    label: "Age of Empire & Globalization",
    start: 1870,
    end: 1913,
    icon: GiPalmTree,
    headline: "The World Connects: Colonies and Commerce"
  },
  { label: "World War Era", start: 1914, end: 1945, icon: GiFallingBomb, headline: "Global Conflict Engulfs Nations: Devastation and Resilience Define an Era" },
  { label: "Cold War", start: 1946, end: 1990, icon: GiSubmarineMissile, headline: "Ideologies Clash: Nuclear Tensions and Space Race" },
  { label: "Information Age", start: 1991, end: 2025, icon: GiWireframeGlobe, headline: "Digital Revolution: Technology Redefines Society" },
];
