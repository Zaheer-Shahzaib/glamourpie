// Field accessors for the SP-API order list shape, shared by the Overview and Orders screens.

export const formatCurrency = (amount: number, currency: string): string =>
  `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** SP-API list: status is at fulfillment.fulfillmentStatus */
export const getOrderStatus = (order: any): string =>
  order.fulfillment?.fulfillmentStatus || order.orderStatus || "";

/** SP-API list: total is at proceeds.grandTotal */
export const getOrderTotal = (order: any): string => {
  const t = order.proceeds?.grandTotal || order.orderTotal;
  return t ? formatCurrency(Number(t.amount), t.currencyCode) : "—";
};

/** Numeric order total + currency, or null when the order has no total. */
export const getOrderAmount = (
  order: any,
): { amount: number; currency: string } | null => {
  const t = order.proceeds?.grandTotal || order.orderTotal;
  if (!t) return null;
  const amount = Number(t.amount);
  return Number.isFinite(amount)
    ? { amount, currency: t.currencyCode || "" }
    : null;
};

export const getBuyerName = (order: any): string =>
  order.buyer?.buyerName || order.buyer?.name || "—";

export const formatStatusLabel = (status: string): string =>
  status ? status.replace(/_/g, " ") : "—";
