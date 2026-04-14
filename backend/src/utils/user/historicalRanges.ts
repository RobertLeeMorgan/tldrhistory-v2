export interface HistoricalRange {
  label: string;
  start: number;
  end: number;
}

export const HISTORICAL_RANGES: HistoricalRange[] = [
  { label: "Paleolithic Era", start: -300000, end: -20001 },
  { label: "Late Prehistory", start: -20000, end: -10001 },
  { label: "Neolithic Revolution", start: -10000, end: -6001 },
  { label: "Early Farming Societies", start: -6000, end: -4001 },
  {
    label: "Urbanization & Proto-Writing",
    start: -4000,
    end: -3001,
  },
  { label: "Early Bronze Age", start: -3000, end: -2001 },
  {
    label: "Middle Bronze Age",
    start: -2000,
    end: -1501,
  },
  {
    label: "Late Bronze Age Collapse Era",
    start: -1500,
    end: -1201,
  },
  { label: "Iron Age", start: -1200, end: -501 },
  {
    label: "Archaic Mediterranean Age",
    start: -500,
    end: -301,
  },
  {
    label: "Classical Antiquity",
    start: -300,
    end: 199,
  },
  { label: "Late Antiquity", start: 200, end: 499 },
  { label: "Early Middle Ages", start: 500, end: 749 },
  { label: "Islamic Golden Age", start: 750, end: 999 },
  { label: "High Middle Ages", start: 1000, end: 1299 },
  { label: "Late Middle Ages", start: 1300, end: 1499 },
  {
    label: "Renaissance & Age of Discovery",
    start: 1500,
    end: 1599,
  },
  {
    label: "Scientific Revolution",
    start: 1600,
    end: 1699,
  },
  {
    label: "Enlightenment & Imperial Expansion",
    start: 1700,
    end: 1799,
  },
  {
    label: "Industrial Revolution",
    start: 1800,
    end: 1869,
  },
  {
    label: "Age of Empire & Globalization",
    start: 1870,
    end: 1913,
  },
  {
    label: "World War Era",
    start: 1914,
    end: 1945,
  },
  {
    label: "Cold War",
    start: 1946,
    end: 1990,
  },
  {
    label: "Information Age",
    start: 1991,
    end: 2025,
  },
];
