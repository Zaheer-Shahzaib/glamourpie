// Invoice API Service Layer

import { api } from './api';
import {
    InvoiceListResponse,
    InvoiceDetailsResponse,
    InvoiceStats,
    RevenueDataPoint,
    InvoiceExport,
    ExportParams,
} from '../types/invoice.types';

/**
 * Fetch invoices with pagination
 */
export const fetchInvoices = async (
    token: string,
    params?: any
): Promise<InvoiceListResponse> => {
    const response = await api.get('/api/aws/invoices', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

/**
 * Get invoice details
 */
export const fetchInvoiceDetails = async (
    token: string,
    invoiceId: string
): Promise<InvoiceDetailsResponse> => {
    const response = await api.get(`/api/aws/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("invoice details",response)
    return response.data;
};

/**
 * Fetch invoice document URL
 */
export const fetchInvoiceDocument = async (
    token: string,
    invoiceId: string
): Promise<{ payload: { documentUrl: string; generateUrl?: string; isSandbox?: boolean } }> => {
    const response = await api.get(`/api/aws/invoices/${invoiceId}/document`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Download invoice as PDF.
 * - Sandbox: POSTs to the generate endpoint (streams PDF from SP-API sandbox order)
 * - Production: opens the pre-signed S3 URL
 */
export const downloadInvoiceDocument = async (
    token: string,
    invoiceId: string
): Promise<void> => {
    const docResponse = await fetchInvoiceDocument(token, invoiceId);
    console.log(docResponse)
    const { documentUrl, generateUrl, isSandbox } = docResponse.payload;


        // GET from document endpoint — response is a PDF blob stream
        const pdfRes = await api.get(documentUrl, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob',
        });
        const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download  = `${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000);
    
};

/**
 * Download a previously generated export file natively with authentication.
 * Uses blob response type to ensure binary data is saved correctly.
 */
export const downloadExportedFile = async (
    token: string,
    urlPath: string
): Promise<void> => {
    const res = await api.get(urlPath, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
    });
    
    // Extract filename from URL (e.g., "EXP-SANDBOX-1234.pdf")
    const filename = urlPath.split('/').pop() || 'export.pdf';

    // The backend uses correct content-type because of our previous fix
    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    const url  = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { 
        URL.revokeObjectURL(url); 
        a.remove(); 
    }, 2000);
};

/**
 * Manually generate an invoice for a specific Amazon order
 * Calls the backend to fetch SP-API data, generate PDF, save to DB, and return the PDF blob
 */
export const generateManualInvoice = async (
    token: string,
    orderId: string
): Promise<void> => {
    const res = await api.post(`/api/aws/invoices/generate/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    // Server now returns JSON, no longer streams the PDF.
    return res.data;
};

/**
 * Fetch invoice statistics
 */
export const fetchInvoiceStats = async (
    token: string,
    params?: any
): Promise<{ payload: InvoiceStats }> => {
    const response = await api.get('/api/aws/invoices/stats', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

/**
 * Fetch revenue trend data
 */
export const fetchRevenueData = async (
    token: string,
    params?: any
): Promise<{ payload: RevenueDataPoint[] }> => {
    const response = await api.get('/api/aws/invoices/revenue', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

/**
 * Create a new invoice export
 */
export const createInvoiceExport = async (
    token: string,
    params: ExportParams
): Promise<{ payload: InvoiceExport }> => {
    const response = await api.post('/api/aws/invoices/exports', params, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Fetch list of invoice exports
 */
export const fetchInvoiceExports = async (
    token: string,
    params?: any
): Promise<{ payload: { exports: InvoiceExport[], pagination: any } }> => {
    const response = await api.get('/api/aws/invoices/exports', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

/**
 * Fetch status of a specific export
 */
export const fetchExportStatus = async (
    token: string,
    exportId: string
): Promise<{ payload: InvoiceExport }> => {
    const response = await api.get(`/api/aws/invoices/exports/${exportId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
