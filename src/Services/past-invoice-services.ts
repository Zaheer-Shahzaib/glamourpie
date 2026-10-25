import { api } from "./api";
import {
  BulkGenerateResult,
  BulkUploadResult,
  MissingLookupResponse,
} from "../types/missing-invoice.types";

const pastBase = "/api/aws/invoices/past";

export const getPastInvoiceBalance = async (
  token: string,
): Promise<{
  success: boolean;
  hasHistoricalAccess?: boolean;
  pastInvoiceBalance: {
    purchasedQuantity: number;
    usedQuantity: number;
    remaining: number;
  };
}> => {
  const response = await api.get(`${pastBase}/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/** Date-range historical order search (Past Invoice add-on). */
export const lookupHistoricalOrders = async (
  token: string,
  payload: {
    startDate?: string;
    endDate?: string;
    nextToken?: string;
  },
): Promise<MissingLookupResponse> => {
  const response = await api.post<MissingLookupResponse>(
    `${pastBase}/lookup`,
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const bulkGenerateHistoricalInvoices = async (
  token: string,
  orderIds: string[],
  skipExisting = true,
): Promise<{ success: boolean; results: BulkGenerateResult[]; message?: string }> => {
  const response = await api.post(
    `${pastBase}/generate`,
    { orderIds, skipExisting },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const bulkUploadHistoricalInvoices = async (
  token: string,
  orderIds: string[],
  forceRetry = false,
): Promise<{ success: boolean; results: BulkUploadResult[] }> => {
  const response = await api.post(
    `${pastBase}/upload`,
    { orderIds, forceRetry },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const refreshHistoricalUploadStatus = async (
  token: string,
  orderIds: string[],
): Promise<{ success: boolean; results: Array<{ orderId?: string; uploadStatus?: string; errorMessage?: string }> }> => {
  const response = await api.post(
    `${pastBase}/upload/status`,
    { orderIds },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const uploadHistoricalInvoiceToAmazon = async (
  token: string,
  invoiceId: string,
  forceRetry = false,
): Promise<{
  success: boolean;
  invoiceId?: string;
  feedId?: string;
  uploadStatus?: string;
  processingStatus?: string | null;
  lifecycleStatus?: string | null;
  message?: string;
  code?: string;
}> => {
  const response = await api.post(
    `/api/aws/invoices/${encodeURIComponent(invoiceId)}/upload`,
    { forceRetry },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
