import { createContext, useState, useContext } from "react";
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
  const [dataStartYear, setDataStartYear] = useState(0);

  const current = HISTORICAL_RANGES[currentIndex];

  const setEra = (rangeIndex: number) => {
    setCurrentIndex((prevIndex) =>
      prevIndex !== rangeIndex ? rangeIndex : prevIndex
    );
  };

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
