/** Backend uses the same multiplier for Stripe line items; not shown in UI copy. */
const CHECKOUT_MULTIPLIER = 0.2;

export const estimateHistoricalCheckoutTotalAed = (quantity: number): number => {
  const q = Number(quantity);
  if (!Number.isFinite(q) || q < 1) return 0;
  return Math.round(q * CHECKOUT_MULTIPLIER * 100) / 100;
};
