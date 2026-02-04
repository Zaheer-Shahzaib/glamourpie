// Invoice API Service Layer
// Mock implementation for frontend development

import { api } from './api';
import {
    InvoiceQueryParams,
    InvoiceListResponse,
    InvoiceDetailsResponse,
    InvoiceAttributesResponse,
    InvoiceDocumentResponse,
    ExportParams,
    ExportCreateResponse,
    ExportListResponse,
    ExportStatusResponse,
    InvoiceStats,
    RevenueDataPoint,
} from '../types/invoice.types';
import {
    mockInvoices,
    mockInvoiceListItems,
    mockInvoiceStats,
    mockInvoiceExports,
    mockRevenueData,
} from '../constant/invoice-mock-data';

// Environment flag to use mock data
const USE_MOCK_DATA = true; // Set to false when backend is ready

/**
 * Get available invoice filter attributes
 */
export const fetchInvoiceAttributes = async (
    token: string
): Promise<InvoiceAttributesResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        return {
            payload: {
                invoiceStatus: ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED'],
                invoiceType: ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE'],
                marketplace: ['amazon.ae', 'amazon.com.br', 'amazon.in'],
                currencies: ['AED', 'BRL', 'INR', 'USD'],
            },
        };
    }

    const response = await api.get('/invoices/attributes', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Fetch invoices with optional filters and pagination
 */
export const fetchInvoices = async (
    token: string,
    params?: InvoiceQueryParams
): Promise<InvoiceListResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Apply filters to mock data
        let filteredInvoices = [...mockInvoiceListItems];

        if (params?.status) {
            filteredInvoices = filteredInvoices.filter(
                (inv) => inv.status === params.status
            );
        }

        if (params?.type) {
            filteredInvoices = filteredInvoices.filter(
                (inv) => inv.invoiceType === params.type
            );
        }

        if (params?.marketplaceId) {
            filteredInvoices = filteredInvoices.filter(
                (inv) => inv.marketplaceId === params.marketplaceId
            );
        }

        if (params?.dateFrom) {
            filteredInvoices = filteredInvoices.filter(
                (inv) => new Date(inv.invoiceDate) >= new Date(params.dateFrom!)
            );
        }

        if (params?.dateTo) {
            filteredInvoices = filteredInvoices.filter(
                (inv) => new Date(inv.invoiceDate) <= new Date(params.dateTo!)
            );
        }

        // Apply pagination
        const limit = params?.limit || 100;
        const offset = params?.offset || 0;
        const paginatedInvoices = filteredInvoices.slice(offset, offset + limit);

        return {
            payload: {
                invoices: paginatedInvoices,
                pagination: {
                    offset,
                    limit,
                    total: filteredInvoices.length,
                    hasMore: offset + limit < filteredInvoices.length,
                },
            },
        };
    }

    const response = await api.get('/invoices', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
    return response.data;
};

/**
 * Get detailed information for a specific invoice
 */
export const fetchInvoiceDetails = async (
    token: string,
    invoiceId: string
): Promise<InvoiceDetailsResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        const invoice = mockInvoices.find((inv) => inv.invoiceId === invoiceId);

        if (!invoice) {
            throw new Error(`Invoice ${invoiceId} not found`);
        }

        return {
            payload: invoice,
        };
    }

    const response = await api.get(`/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Get invoice document URL
 */
export const fetchInvoiceDocument = async (
    token: string,
    invoiceId: string
): Promise<InvoiceDocumentResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const invoice = mockInvoices.find((inv) => inv.invoiceId === invoiceId);

        if (!invoice || !invoice.invoiceURI) {
            throw new Error(`Invoice document for ${invoiceId} not found`);
        }

        // Generate expiry time (1 hour from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        return {
            payload: {
                invoiceId,
                documentUrl: invoice.invoiceURI,
                contentType: 'application/pdf',
                expiresAt: expiresAt.toISOString(),
            },
        };
    }

    const response = await api.get(`/invoices/${invoiceId}/document`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Create a new invoice export
 */
export const createInvoiceExport = async (
    token: string,
    exportParams: ExportParams
): Promise<ExportCreateResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const exportId = `EXP-${Date.now()}`;
        const createdAt = new Date().toISOString();

        return {
            payload: {
                exportId,
                status: 'IN_PROGRESS',
                createdAt,
            },
        };
    }

    const response = await api.post('/invoices/exports', exportParams, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * List all invoice exports for the seller
 */
export const fetchInvoiceExports = async (
    token: string
): Promise<ExportListResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        return {
            payload: {
                exports: mockInvoiceExports,
            },
        };
    }

    const response = await api.get('/invoices/exports', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Get status of a specific export
 */
export const fetchExportStatus = async (
    token: string,
    exportId: string
): Promise<ExportStatusResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const exportData = mockInvoiceExports.find((exp) => exp.exportId === exportId);

        if (!exportData) {
            throw new Error(`Export ${exportId} not found`);
        }

        return {
            payload: exportData,
        };
    }

    const response = await api.get(`/invoices/exports/${exportId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Get all invoices for a specific order
 */
export const fetchOrderInvoices = async (
    token: string,
    amazonOrderId: string
): Promise<InvoiceListResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        const orderInvoices = mockInvoiceListItems.filter(
            (inv) => inv.amazonOrderId === amazonOrderId
        );

        return {
            payload: {
                invoices: orderInvoices,
                pagination: {
                    offset: 0,
                    limit: orderInvoices.length,
                    total: orderInvoices.length,
                    hasMore: false,
                },
            },
        };
    }

    const response = await api.get(`/orders/${amazonOrderId}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Get invoice statistics for dashboard
 */
export const fetchInvoiceStats = async (
    token: string,
    periodStart?: string,
    periodEnd?: string
): Promise<InvoiceStats> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return mockInvoiceStats;
    }

    const response = await api.get('/invoices/stats', {
        headers: { Authorization: `Bearer ${token}` },
        params: { periodStart, periodEnd },
    });
    return response.data.payload;
};

/**
 * Get revenue chart data
 */
export const fetchRevenueData = async (
    token: string,
    dateFrom?: string,
    dateTo?: string
): Promise<RevenueDataPoint[]> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        let data = [...mockRevenueData];

        if (dateFrom) {
            data = data.filter((point) => new Date(point.date) >= new Date(dateFrom));
        }

        if (dateTo) {
            data = data.filter((point) => new Date(point.date) <= new Date(dateTo));
        }

        return data;
    }

    const response = await api.get('/invoices/revenue-data', {
        headers: { Authorization: `Bearer ${token}` },
        params: { dateFrom, dateTo },
    });
    return response.data.payload;
};
