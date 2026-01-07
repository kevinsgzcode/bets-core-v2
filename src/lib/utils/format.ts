/**
 * Formats a number as a currency string based on the provided currency code.
 * Uses Intl.NumberFormat for robust internationalization.
 */
export function formatCurrency(
  amount: number,
  currency?: string | null
): string {
  const safeCurrency = currency ?? "MXN";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Ultra-safe fallback (should almost never happen)
    console.error("Currency formatting error:", error);
    return `$${amount.toFixed(2)}`;
  }
}
