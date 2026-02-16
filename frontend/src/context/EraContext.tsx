import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { HISTORICAL_RANGES } from "../utils/historicalRanges";
import type { IconType } from "react-icons";

interface EraContextType {
  startYear: number;
  endYear: number;
  label: string;
  eraIndex: number;
  Icon: IconType;
  setEra: (rangeIndex: number) => void;
  dataStartYear: number;
  setDataStartYear: (year: number) => void;
}

const EraContext = createContext<EraContextType | undefined>(undefined);

export const EraProvider = ({ children }: { children: ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = HISTORICAL_RANGES[currentIndex];

  const [dataStartYear, setDataStartYearState] = useState(
    HISTORICAL_RANGES[0].start
  );

  const setEra = (rangeIndex: number) => {
    if (
      rangeIndex < 0 ||
      rangeIndex >= HISTORICAL_RANGES.length
    ) {
      return;
    }

    setCurrentIndex((prevIndex) =>
      prevIndex !== rangeIndex ? rangeIndex : prevIndex
    );
  };

  const setDataStartYear = (year: number) => {
    if (typeof year !== "number" || Number.isNaN(year)) return;

    const clamped = Math.max(
      current.start,
      Math.min(year, current.end)
    );

    setDataStartYearState((prev) =>
      prev !== clamped ? clamped : prev
    );
  };

  useEffect(() => {
    setDataStartYearState((prev) => {
      const clamped = Math.max(
        current.start,
        Math.min(prev, current.end)
      );
      return clamped;
    });
  }, [currentIndex, current.start, current.end]);

  return (
    <EraContext.Provider
      value={{
        startYear: current.start,
        endYear: current.end,
        label: current.label,
        eraIndex: currentIndex,
        Icon: current.icon,
        setEra,
        dataStartYear,
        setDataStartYear,
      }}
    >
      {children}
    </EraContext.Provider>
  );
};

export const useEra = () => {
  const ctx = useContext(EraContext);
  if (!ctx) throw new Error("useEra must be used inside EraProvider");
  return ctx;
};
