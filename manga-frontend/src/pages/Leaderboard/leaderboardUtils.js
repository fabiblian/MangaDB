export function formatAverageRating(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(1);
}
