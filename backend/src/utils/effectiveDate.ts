export function computeEffectiveDate(input: {
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  startSignificance: number;
  endSignificance: number;
}) {
  const {
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    startSignificance,
    endSignificance,
  } = input;

  const useEnd =
    endSignificance > startSignificance && endSignificance > 0;

  const year = useEnd ? endYear : startYear;
  const month = useEnd ? endMonth : startMonth;
  const day = useEnd ? endDay : startDay;

  return year * 10000 + month * 100 + day;
}