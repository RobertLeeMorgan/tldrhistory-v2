export const formatYear = (year: number) => {
  return year < 0 ? "BCE" : "CE";
};

export function formatYearNumberOnly(year: number) {
  return Math.abs(year).toString();
}