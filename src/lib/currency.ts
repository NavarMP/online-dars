export const DEFAULT_CURRENCY = 'INR';

export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}
