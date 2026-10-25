export const VAT_ERROR_CODE = "VAT_TREATMENT_UNKNOWN";

export type VatStatus =
  | "NOT_APPLIED"
  | "AMAZON_TAX"
  | "CALCULATED_INCLUSIVE"
  | "UNKNOWN"
  | string
  | null
  | undefined;

export interface VatDisplayInput {
  taxAmount?: number | null;
  taxRate?: number | null;
  priceIncludesVat?: boolean | null;
  vatStatus?: VatStatus;
}

export const formatTaxRate = (rate?: number | null): string => {
  const n = Number(rate);
  if (!Number.isFinite(n) || n <= 0) return "";
  return n % 1 === 0 ? `${n.toFixed(0)}%` : `${n.toFixed(1)}%`;
};

export const isVatApplied = (input: VatDisplayInput): boolean =>
  input.vatStatus === "AMAZON_TAX" ||
  input.vatStatus === "CALCULATED_INCLUSIVE" ||
  (Number(input.taxAmount) || 0) > 0;

export const isVatInclusive = (input: VatDisplayInput): boolean =>
  input.priceIncludesVat === true ||
  input.vatStatus === "CALCULATED_INCLUSIVE";

export const getVatLineLabel = (input: VatDisplayInput): string => {
  const rateStr = formatTaxRate(input.taxRate);
  if (isVatApplied(input)) {
    return rateStr ? `VAT (${rateStr})` : "VAT";
  }
  return rateStr ? `Tax (${rateStr})` : "Tax Amount";
};

export const getSubtotalLabel = (input: VatDisplayInput): string =>
  isVatApplied(input) ? "Subtotal (excl. VAT)" : "Subtotal";

export const getNetUnitPrice = (
  unitPrice?: number | null,
  taxAmount?: number | null,
  quantity?: number | null,
  input?: VatDisplayInput,
): number => {
  const unit = Number(unitPrice) || 0;
  const qty = Number(quantity) || 1;
  const tax = Number(taxAmount) || 0;
  if (input && isVatInclusive(input) && qty > 0) {
    return Math.round((unit - tax / qty) * 100) / 100;
  }
  return unit;
};

export const getAmountBeforeVatLabel = (): string => "Amount Before VAT";

export const getGrandTotalLabel = (input: VatDisplayInput): string =>
  isVatApplied(input) ? "Grand Total" : "Total Amount";

export const getInvoiceGenerationError = (
  error: unknown,
): { title: string; message: string } => {
  const data =
    (error as { response?: { data?: Record<string, unknown> } })?.response
      ?.data || {};
  const detail =
    (typeof data.error === "string" && data.error) ||
    (typeof data.message === "string" && data.message) ||
    "Failed to generate invoice";

  if (data.errorCode === VAT_ERROR_CODE) {
    return {
      title: "VAT could not be determined",
      message: detail,
    };
  }

  return {
    title: "Generation Failed",
    message: detail,
  };
};
