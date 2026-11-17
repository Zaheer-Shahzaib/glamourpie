import type { Invoice } from "../types/invoice.types";
import { isVatApplied, type VatDisplayInput } from "./vatDisplay";

export type InvoiceShippingRow = {
  label: string;
  amountExclVat: number;
  vat: number;
  totalInclVat: number;
};

export const invoiceHasShippingSection = (invoice: Invoice): boolean => {
  if (invoice.hasShipping === true) return true;
  return (invoice.shippingCharges ?? 0) > 0;
};

export const getInvoiceShippingRow = (invoice: Invoice): InvoiceShippingRow => ({
  label: invoice.shippingLineLabel || "Shipping",
  amountExclVat: invoice.shippingNetAmount ?? 0,
  vat: invoice.shippingTaxAmount ?? 0,
  totalInclVat: invoice.shippingCharges ?? 0,
});

export const getInvoiceItemSubtotalExclVat = (invoice: Invoice): number => {
  if (invoice.itemSubtotalExclVat != null && invoice.itemSubtotalExclVat > 0) {
    return invoice.itemSubtotalExclVat;
  }
  const shippingNet = invoice.shippingNetAmount ?? 0;
  if (invoiceHasShippingSection(invoice) && shippingNet > 0) {
    return Math.max(0, (invoice.subtotal ?? 0) - shippingNet);
  }
  return invoice.subtotal ?? 0;
};

export const getInvoiceItemVat = (invoice: Invoice): number => {
  const vatInfo: VatDisplayInput = {
    taxAmount: invoice.taxAmount,
    taxRate: invoice.taxRate,
    priceIncludesVat: invoice.priceIncludesVat,
    vatStatus: invoice.vatStatus,
  };
  if (!isVatApplied(vatInfo)) return 0;
  if (invoiceHasShippingSection(invoice) && (invoice.itemTaxAmount ?? 0) > 0) {
    return invoice.itemTaxAmount ?? 0;
  }
  return invoice.taxAmount ?? 0;
};
