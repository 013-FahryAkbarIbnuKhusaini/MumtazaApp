/**
 * Centralized Rupiah currency formatting and parsing utilities.
 *
 * Use these instead of inline formatting scattered across screens —
 * ensures consistent thousand-separator style ("Rp 12.500.000") app-wide.
 */

/**
 * Formats a numeric amount into Indonesian Rupiah display string.
 * e.g. 12500000 → "Rp 12.500.000"
 */
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parses a Rupiah display string back into a number.
 * Handles formats like "Rp 12.500.000", "Rp. 12.500.000,00", etc.
 * Returns 0 if the string cannot be parsed.
 */
export function parseRupiah(str: string): number {
  if (!str) return 0;
  // Strip "Rp", "Rp.", leading/trailing whitespace
  let cleaned = str.replace(/Rp\.?\s*/i, '').trim();
  // Remove thousand separators (dots) — but preserve comma as decimal sep
  // Indonesian format: 12.500.000,00
  // If there's a comma (decimal separator), split on it and take integer part
  const commaIndex = cleaned.indexOf(',');
  if (commaIndex !== -1) {
    cleaned = cleaned.substring(0, commaIndex);
  }
  // Now remove all dots (thousand separators)
  cleaned = cleaned.replace(/\./g, '');
  const result = parseInt(cleaned, 10);
  return isNaN(result) ? 0 : result;
}
