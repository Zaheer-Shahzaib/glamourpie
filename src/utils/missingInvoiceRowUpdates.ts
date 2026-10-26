import {
  BulkGenerateResult,
  BulkUploadResult,
  MissingInvoiceRow,
} from "../types/missing-invoice.types";

export const patchRowAfterGenerate = (
  row: MissingInvoiceRow,
  item: BulkGenerateResult,
): MissingInvoiceRow => {
  if (!item.success) return row;
  const invoiceId = item.invoiceId || item.invoiceNumber || row.invoiceId;
  const invoiceNumber = item.invoiceNumber || invoiceId;
  return {
    ...row,
    invoiceStatus: "exists",
    invoiceId,
    invoiceNumber,
    generationEligible: false,
    generationBlockReason: "Invoice already exists",
    canUpload: true,
    uploadBlockReason: null,
  };
};

export const patchRowsAfterGenerate = (
  rows: MissingInvoiceRow[],
  results: BulkGenerateResult[],
): MissingInvoiceRow[] => {
  const byOrder = new Map(results.map((r) => [r.orderId, r]));
  return rows.map((row) => {
    const item = byOrder.get(row.orderId);
    return item ? patchRowAfterGenerate(row, item) : row;
  });
};

type UploadResponse = {
  feedId?: string;
  uploadStatus?: string | null;
  lifecycleStatus?: string | null;
  processingStatus?: string | null;
};

export const patchRowAfterUpload = (
  row: MissingInvoiceRow,
  res: UploadResponse,
): MissingInvoiceRow => {
  const uploadStatus = res.uploadStatus || "UPLOADING";
  const uploaded =
    uploadStatus === "UPLOADED" || res.lifecycleStatus === "SUBMITTED";
  return {
    ...row,
    feedId: res.feedId ?? row.feedId,
    uploadStatus,
    lifecycleStatus: res.lifecycleStatus ?? row.lifecycleStatus,
    canUpload: uploaded ? false : row.canUpload,
    canRetryUpload: uploadStatus === "FAILED",
    uploadBlockReason: uploaded ? null : row.uploadBlockReason,
  };
};

export const patchRowAfterBulkUploadResult = (
  row: MissingInvoiceRow,
  item: BulkUploadResult,
): MissingInvoiceRow => {
  if (!item.success) {
    return {
      ...row,
      uploadStatus: "FAILED",
      canRetryUpload: true,
      errorMessage: item.error || row.errorMessage,
    };
  }
  return patchRowAfterUpload(row, {
    feedId: item.feedId,
    uploadStatus: item.uploadStatus,
  });
};

export type UploadStatusRefreshHit = {
  orderId?: string;
  uploadStatus?: string;
  lifecycleStatus?: string | null;
  errorMessage?: string | null;
  feedId?: string;
};

export const mergeUploadStatusIntoRows = (
  rows: MissingInvoiceRow[],
  hits: UploadStatusRefreshHit[],
): MissingInvoiceRow[] => {
  if (!hits.length) return rows;
  return rows.map((row) => {
    const hit = hits.find((h) => h.orderId === row.orderId);
    if (!hit) return row;
    const uploaded =
      hit.uploadStatus === "UPLOADED" || hit.lifecycleStatus === "SUBMITTED";
    return {
      ...row,
      uploadStatus: hit.uploadStatus ?? row.uploadStatus,
      lifecycleStatus: hit.lifecycleStatus ?? row.lifecycleStatus,
      errorMessage: hit.errorMessage ?? row.errorMessage,
      feedId: hit.feedId ?? row.feedId,
      canUpload: uploaded ? false : row.canUpload,
      canRetryUpload: hit.uploadStatus === "FAILED",
    };
  });
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Background poll — updates UI via callback without re-running order search. */
export const pollUploadStatusInBackground = async (
  orderIds: string[],
  refresh: (orderIds: string[]) => Promise<UploadStatusRefreshHit[]>,
  onUpdate: (hits: UploadStatusRefreshHit[]) => void,
  options?: { maxRounds?: number; intervalMs?: number },
) => {
  const maxRounds = options?.maxRounds ?? 10;
  const intervalMs = options?.intervalMs ?? 2500;
  if (orderIds.length === 0) return;

  for (let round = 0; round < maxRounds; round++) {
    await sleep(round === 0 ? 800 : intervalMs);
    const hits = await refresh(orderIds);
    onUpdate(hits);
    const settled = orderIds.every((oid) => {
      const hit = hits.find((h) => h.orderId === oid);
      return (
        hit &&
        (hit.uploadStatus === "UPLOADED" ||
          hit.uploadStatus === "FAILED" ||
          hit.lifecycleStatus === "SUBMITTED")
      );
    });
    if (settled) break;
  }
};
