export function isLeapYear(year: number): boolean {
  if (year < 1582) {
    return year % 4 === 0;
  } else {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}

export function getMaxDays(year: number, month: number): number {
  if (isNaN(year) || isNaN(month)) {
    throw new Error("Invalid year or month");
  }

  if (month === 0) return 0;

  if (month < 1 || month > 12) {
    throw new Error("Invalid month");
  }

  const leap = isLeapYear(year);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return daysInMonth[month - 1];
}
