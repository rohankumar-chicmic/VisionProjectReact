/**
 * Formats a number with units (k, m, b)
 * @param value The number to format
 * @returns Formatted string
 */
const formatNumberWithUnits = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1000000000) {
    return `${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}b`;
  }
  if (absValue >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}m`;
  }
  if (absValue >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }

  return value.toLocaleString();
};

export default formatNumberWithUnits;
