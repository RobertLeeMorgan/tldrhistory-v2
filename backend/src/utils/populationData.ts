export function interpolatePopulation(
  current: { yearStart: number; yearEnd: number; population: number },
  next?: { yearStart: number; yearEnd: number; population: number },
  year?: number
): number {

  if (!next || !year) return current.population;

  const windowLength = current.yearEnd - current.yearStart;
  const progress = (year - current.yearStart) / windowLength;

  const delta = next.population - current.population;
  return Math.round(current.population + delta * progress);
}
