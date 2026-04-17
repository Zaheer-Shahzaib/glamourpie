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
    return response.data;
};

/**
 * Fetch invoice document URL
 */
export const fetchInvoiceDocument = async (
    token: string,
    invoiceId: string
): Promise<{ payload: { documentUrl: string } }> => {
    const response = await api.get(`/api/aws/invoices/${invoiceId}/document`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
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
