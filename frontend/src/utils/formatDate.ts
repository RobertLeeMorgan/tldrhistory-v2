export function formatDate(year: number, month?: number, day?: number) {
  const isBCE = year < 0;
  const absYear = Math.abs(year);
  const y = absYear + (isBCE ? " BCE" : " CE");
  const m = month ?? 0;
  const d = day ?? 0;

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (m === 0 && d === 0) return y;
  if (d === 0) return `${months[m - 1]} ${y}`;

  return `${d} ${months[m - 1]} ${y}`;
}
