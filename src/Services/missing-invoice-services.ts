import { api } from "./api";
import {
  BulkGenerateResult,
  BulkUploadResult,
  MissingLookupResponse,
} from "../types/missing-invoice.types";

export const lookupMissingInvoices = async (
  token: string,
  payload: {
    orderIds?: string[];
    orderIdsText?: string;
    startDate?: string;
    endDate?: string;
    nextToken?: string;
  },
): Promise<MissingLookupResponse> => {
  const response = await api.post<MissingLookupResponse>(
    "/api/aws/invoices/missing/lookup",
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const lookupMissingInvoicesFile = async (
  token: string,
  file: File,
): Promise<MissingLookupResponse> => {
  const form = new FormData();
  form.append("file", file);
  const response = await api.post<MissingLookupResponse>(
    "/api/aws/invoices/missing/lookup",
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const bulkGenerateMissingInvoices = async (
  token: string,
  orderIds: string[],
  skipExisting = true,
): Promise<{ success: boolean; results: BulkGenerateResult[]; message?: string }> => {
  const response = await api.post(
    "/api/aws/invoices/missing/generate",
    { orderIds, skipExisting },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const bulkUploadMissingInvoices = async (
  token: string,
  orderIds: string[],
  forceRetry = false,
): Promise<{ success: boolean; results: BulkUploadResult[] }> => {
  const response = await api.post(
    "/api/aws/invoices/missing/upload",
    { orderIds, forceRetry },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const refreshMissingUploadStatus = async (
  token: string,
  orderIds: string[],
): Promise<{ success: boolean; results: Array<{ orderId?: string; uploadStatus?: string; errorMessage?: string }> }> => {
  const response = await api.post(
    "/api/aws/invoices/missing/upload/status",
    { orderIds },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const uploadInvoiceToAmazon = async (
  token: string,
  invoiceId: string,
  forceRetry = false,
): Promise<{
  success: boolean;
  feedId?: string;
  uploadStatus?: string;
  processingStatus?: string;
  message?: string;
}> => {
  const response = await api.post(
    `/api/aws/invoices/${encodeURIComponent(invoiceId)}/upload`,
    { forceRetry },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
