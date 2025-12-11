/**
 * Formats a number as a currency string based on the provided currency code.
 * Uses Intl.NumberFormat for robust internationalization.
 * * @param amount - The numerical value to format (e.g., 1500.5)
 * @param currency - The 3-letter currency code (e.g., "MXN", "USD", "EUR")
 * @returns Formatted string (e.g., "$1,500.50 MXN")
 */
export function formatCurrency(
  amount: number,
  currency: string = "MXN"
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback in case of invalid currency code
    console.error("Currency formatting error:", error);
    return `$${amount.toFixed(2)}`;
  }
}
