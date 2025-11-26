export function formatPopulation(population: number ) {
  const suffixes = ["", " thousand", " million", " billion", " trillion", " quatrillion"];
  let suffixNum = Math.floor(("" + population).length / 3);
  let shortValue: number | string = parseFloat(
    (suffixNum !== 0 ? population / Math.pow(1000, suffixNum) : population).toPrecision(
      2
    )
  );

  if (shortValue < 1 && shortValue >= 0.1) {
    shortValue *= 1000;
    suffixNum--;
  }

  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
}