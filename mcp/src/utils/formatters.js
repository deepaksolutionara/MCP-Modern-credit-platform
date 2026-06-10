/**
 * formatters.js — shared number / currency formatting utilities.
 *
 * Centralising these avoids drift between pages that each define their own
 * fmtM / fmt helpers with slightly different behaviour.
 */

/**
 * Formats a currency value as a compact string.
 * Handles negative values correctly (e.g. -1500000 → "$-1.5M").
 *
 * Examples:
 *   1500000  → "$1.5M"
 *   42000    → "$42K"
 *   500      → "$500"
 *   -65000   → "$-65K"
 */
export function formatCurrencyShort(n) {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `$${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `$${sign}${Math.round(abs / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

/**
 * Formats a numeric delta as a directional label for simulation KPI cells.
 *
 * Examples:
 *   0       → "= $0K"
 *   65000   → "↑ $65K"
 *   -45000  → "↓ $45K"
 */
export function deltaLabel(d) {
  if (d === 0) return '= $0K';
  if (d > 0)   return `↑ ${formatCurrencyShort(d)}`;
  return       `↓ ${formatCurrencyShort(Math.abs(d))}`;
}
