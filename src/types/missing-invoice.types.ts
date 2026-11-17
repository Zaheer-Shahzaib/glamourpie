export type MissingLookupPagination = {
  nextToken: string | null;
  hasMore: boolean;
  pageSize: number;
};

export type MissingLookupMeta = {
  mode?: "manual" | "excel" | "dateRange";
  maxOrderIds?: number;
  startDate?: string;
  endDate?: string;
  searchPageSize?: number;
  ordersOnPage?: number;
  rawOrdersOnPage?: number;
  pagination?: MissingLookupPagination;
};

export type MissingInvoiceRow = {
  orderId: string;
  fetchSuccess: boolean;
  fetchError: string | null;
  rowStatus?: string;
  purchaseDate?: string | null;
  orderStatus?: string | null;
  fulfillmentChannel?: string | null;
  totalAmount?: number;
  currency?: string | null;
  invoiceStatus: "missing" | "exists" | "unknown";
  invoiceId: string | null;
  invoiceNumber: string | null;
  uploadStatus: string | null;
  lifecycleStatus?: string | null;
  feedId: string | null;
  errorMessage: string | null;
  generationEligible: boolean;
  generationBlockReason: string | null;
  canUpload: boolean;
  canRetryUpload?: boolean;
  uploadBlockReason: string | null;
};

export type MissingLookupSummary = {
  total: number;
  fetchFailed: number;
  invoiceMissing: number;
  invoiceExists: number;
  eligibleToGenerate: number;
  eligibleToUpload: number;
};

export type PastInvoiceBalance = {
  purchasedQuantity: number;
  usedQuantity: number;
  remaining: number;
};

export type MissingLookupSuccess = {
  success: true;
  meta?: MissingLookupMeta;
  pagination?: MissingLookupPagination | null;
  limits?: { manualOrderIds: number; excelOrderIds: number };
  pastInvoiceBalance?: PastInvoiceBalance;
  summary: MissingLookupSummary;
  results: MissingInvoiceRow[];
};

export type MissingLookupFailure = {
  success: false;
  message?: string;
  code?: string;
  meta?: MissingLookupMeta;
  pagination?: MissingLookupPagination | null;
  limits?: { manualOrderIds: number; excelOrderIds: number };
  pastInvoiceBalance?: PastInvoiceBalance;
  summary?: MissingLookupSummary;
  results?: MissingInvoiceRow[];
};

export type MissingLookupResponse =
  | MissingLookupSuccess
  | MissingLookupFailure;

export const isMissingLookupSuccess = (
  res: MissingLookupResponse,
): res is MissingLookupSuccess => res.success === true;

export type BulkGenerateResult = {
  orderId: string;
  success: boolean;
  invoiceNumber?: string | null;
  alreadyExists?: boolean;
  invoiceId?: string;
  error?: string | null;
  errorCode?: string | null;
};

export type BulkUploadResult = {
  orderId: string | null;
  invoiceId: string;
  success: boolean;
  feedId?: string;
  uploadStatus?: string;
  error?: string;
  errorCode?: string;
};
