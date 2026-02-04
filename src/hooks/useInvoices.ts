// Custom hook for fetching and managing invoice data

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/useAuth';
import {
    Invoice,
    InvoiceListItem,
    InvoiceQueryParams,
    PaginationInfo,
} from '../types/invoice.types';
import { fetchInvoices, fetchInvoiceDetails } from '../Services/invoice-services';

interface UseInvoicesReturn {
    invoices: InvoiceListItem[];
    loading: boolean;
    error: Error | null;
    pagination: PaginationInfo | null;
    refetch: () => void;
    setFilters: (filters: InvoiceQueryParams) => void;
}

/**
 * Custom hook for fetching invoices with filters and pagination
 */
export const useInvoices = (initialFilters?: InvoiceQueryParams): UseInvoicesReturn => {
    const { token } = useAuth();
    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [filters, setFilters] = useState<InvoiceQueryParams>(initialFilters || {});

    const fetchData = useCallback(async () => {
        if (!token) {
            setError(new Error('No authentication token'));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetchInvoices(token, filters);

            setInvoices(response.payload.invoices);
            setPagination(response.payload.pagination);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch invoices'));
            console.error('Error fetching invoices:', err);
        } finally {
            setLoading(false);
        }
    }, [token, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        invoices,
        loading,
        error,
        pagination,
        refetch: fetchData,
        setFilters,
    };
};

interface UseInvoiceDetailsReturn {
    invoice: Invoice | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Custom hook for fetching a single invoice's details
 */
export const useInvoiceDetails = (invoiceId: string | null): UseInvoiceDetailsReturn => {
    const { token } = useAuth();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!token || !invoiceId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetchInvoiceDetails(token, invoiceId);
            setInvoice(response.payload);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch invoice details'));
            console.error('Error fetching invoice details:', err);
        } finally {
            setLoading(false);
        }
    }, [token, invoiceId]);

    useEffect(() => {
        if (invoiceId) {
            fetchData();
        }
    }, [fetchData, invoiceId]);

    return {
        invoice,
        loading,
        error,
        refetch: fetchData,
    };
};
