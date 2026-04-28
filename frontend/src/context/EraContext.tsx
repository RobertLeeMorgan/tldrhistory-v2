import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import type { IconType } from "react-icons";
import { RANGE_SETS, type EraView, parseView } from "../utils/rangeViews";
import { useSearchParams } from "react-router";

interface EraContextType {
  startYear: number;
  endYear: number;
  label: string;
  eraIndex: number;
  Icon: IconType;
  headline: string;
  dataStartYear: number;
  setDataStartYear: (year: number) => void;
  view: EraView;
  setView: (view: EraView) => void;
  setEra: (rangeIndex: number) => void;
}

const EraContext = createContext<EraContextType | undefined>(undefined);

export const EraProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const [dataStartYear, setDataStartYearState] = useState(-300000);
  const [view, setViewState] = useState<EraView>("global");

  useEffect(() => {
    const urlView = parseView(searchParams.get("v"));
    if (!urlView) return;

    setViewState(urlView);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("v");

    const nextSearch = nextParams.toString();
    const nextUrl =
      window.location.pathname +
      (nextSearch ? `?${nextSearch}` : "") +
      window.location.hash;

    window.history.replaceState(window.history.state, "", nextUrl);
  }, []);

  const ranges = RANGE_SETS[view];

  const eraIndex = useMemo(() => {
    const idx = ranges.findIndex(
      (range) => dataStartYear >= range.start && dataStartYear <= range.end,
    );
    return idx === -1 ? 0 : idx;
  }, [ranges, dataStartYear]);

  const current = ranges[eraIndex] ?? ranges[0];

  const setDataStartYear = useCallback((year: number) => {
    if (typeof year !== "number" || Number.isNaN(year)) return;
    setDataStartYearState((prev) => (prev !== year ? year : prev));
  }, []);

  const setView = useCallback((nextView: EraView) => {
    setViewState(nextView);
  }, []);

  const setEra = useCallback(
    (rangeIndex: number) => {
      const range = ranges[rangeIndex];
      if (!range) return;

      setDataStartYearState((prev) => {
        const nextYear = Math.max(range.start, Math.min(prev, range.end));
        return prev !== nextYear ? nextYear : prev;
      });
    },
    [ranges],
  );

  const value = useMemo(
    () => ({
      startYear: current.start,
      endYear: current.end,
      label: current.label,
      eraIndex,
      headline: current.headline,
      Icon: current.icon,
      dataStartYear,
      setDataStartYear,
      view,
      setView,
      setEra,
    }),
    [
      current.start,
      current.end,
      current.label,
      current.headline,
      current.icon,
      eraIndex,
      dataStartYear,
      setDataStartYear,
      view,
      setEra,
    ],
  );

  return <EraContext.Provider value={value}>{children}</EraContext.Provider>;
};

export const useEra = () => {
  const ctx = useContext(EraContext);
  if (!ctx) throw new Error("useEra must be used inside EraProvider");
  return ctx;
};
