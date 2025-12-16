export function interpolatePopulation(
  current: { yearStart: number; yearEnd: number; population: bigint },
  next?: { yearStart: number; yearEnd: number; population: bigint },
  year?: number
): bigint {
  if (!next || year === undefined) return current.population;

  const windowLength = BigInt(current.yearEnd - current.yearStart);
  const progress = BigInt(year - current.yearStart);

  const delta = next.population - current.population;

  return current.population + (delta * progress) / windowLength;
}