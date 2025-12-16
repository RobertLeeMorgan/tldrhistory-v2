export function formatPopulation(population: number) {
  const suffixes = ["", " thousand", " million", " billion", " trillion", " quadrillion"];

  if (population < 1000) return population.toString();

  let suffixNum = 0;
  let value = population;

  // Reduce value by thousands until < 1000
  while (value >= 1000 && suffixNum < suffixes.length - 1) {
    value /= 1000;
    suffixNum++;
  }

  // Round to 1 decimal if needed
  const rounded =
    value % 1 === 0 ? value.toString() : value.toFixed(1);

  return rounded + suffixes[suffixNum];
}
