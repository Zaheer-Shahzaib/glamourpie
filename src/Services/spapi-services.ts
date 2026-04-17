import { api } from './api';

export interface SellerStatusResponse {
  success: boolean;
  isConnected: boolean;
  seller?: {
    sellerId: string;
    marketplace: string;
    currency: string;
    status: string;
  } | null;
}

export interface GeneratedInvoice {
  filename: string;
  invoiceNo: string;
  createdAt: string;
  sizeBytes: number;
  downloadUrl: string;
}

/**
 * Check if the user has a connected Amazon Seller account.
 * Called after login to decide routing: dashboard vs connect-seller.
 */
export const fetchSellerStatus = async (token: string): Promise<SellerStatusResponse> => {
  const response = await api.get('/api/aws/seller-status', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Generate Amazon OAuth consent URL with marketplace and currency preferences.
 * Redirects user to Amazon Seller Central to authorize the app.
 */
export const getAmazonAuthUrl = async (
  token: string,
  params: { marketplace: string; currency: string; region: string }
): Promise<{ success: boolean; url: string }> => {
  const response = await api.get('/api/aws/sp-api/auth-url', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

/**
 * Test SP-API sandbox connection.
 * Validates LWA token exchange + calls Orders sandbox endpoint with TEST_CASE_200.
 */
export const testSandboxConnection = async (
  token: string
): Promise<{ success: boolean; message: string; payload?: any }> => {
  const response = await api.get('/api/aws/sp-api/test-sandbox', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Generate a PDF invoice for a specific Amazon order.
 *
 * In SANDBOX mode (SANDBOX_MODE=true on backend):
 *   - Uses TEST_CASE_200 mock data regardless of orderId
 *
 * In PRODUCTION mode:
 *   - Fetches the actual order from Amazon SP-API
 *
 * @returns A blob URL to the generated PDF, or triggers a download
 */
export const generateInvoice = async (
  token: string,
  orderId: string
): Promise<Blob> => {
  const response = await api.post(
    `/api/aws/invoices/generate/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/pdf',
      },
      responseType: 'blob',
    }
  );
  return response.data;
};

/**
 * Fetch a sandbox invoice preview — full pipeline demonstration.
 * Fetches TEST_CASE_200 sandbox order, generates a real PDF, returns it.
 * Useful for showing the Amazon review team that the integration works.
 */
export const fetchSandboxInvoicePreview = async (token: string): Promise<Blob> => {
  const response = await api.get('/api/aws/invoices/sandbox-preview', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    },
    responseType: 'blob',
  });
  return response.data;
};

/**
 * List all locally generated invoice PDFs (metadata only).
 */
export const listGeneratedInvoices = async (
  token: string
): Promise<{ success: boolean; invoices: GeneratedInvoice[] }> => {
  const response = await api.get('/api/aws/invoices/generated', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

/**
 * Helper: Trigger a browser file download from a Blob response.
 * Usage: downloadBlob(blob, 'INV-ABC123.pdf')
 */
export const downloadBlobAsPDF = (blob: Blob, filename: string): void => {
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
