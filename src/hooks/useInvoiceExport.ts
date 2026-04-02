// Custom hook for managing invoice exports

import { useState, useCallback } from 'react';
import { useAuth } from '../Context/useAuth';
import {
    InvoiceExport,
    ExportParams,
    ExportStatus,
} from '../types/invoice.types';
import {
    createInvoiceExport,
    fetchInvoiceExports,
    fetchExportStatus,
} from '../Services/invoice-services';

interface UseInvoiceExportReturn {
    exports: InvoiceExport[];
    loading: boolean;
    error: Error | null;
    createExport: (params: ExportParams) => Promise<string | null>;
    checkExportStatus: (exportId: string) => Promise<InvoiceExport | null>;
    refreshExports: () => Promise<void>;
    pollExportStatus: (exportId: string, onComplete: (exportData: InvoiceExport) => void) => void;
}

/**
 * Custom hook for managing invoice exports
 */
export const useInvoiceExport = (): UseInvoiceExportReturn => {
    const { token } = useAuth();
    const [exports, setExports] = useState<InvoiceExport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Create a new invoice export
     */
    const createExport = useCallback(
        async (params: ExportParams): Promise<string | null> => {
            if (!token) {
                setError(new Error('No authentication token'));
                return null;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await createInvoiceExport(token, params);

                // Refresh exports list
                await refreshExports();

                return response.payload.exportId;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to create export'));
                console.error('Error creating export:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    /**
     * Check status of a specific export
     */
    const checkExportStatus = useCallback(
        async (exportId: string): Promise<InvoiceExport | null> => {
            if (!token) {
                setError(new Error('No authentication token'));
                return null;
            }

            try {
                const response = await fetchExportStatus(token, exportId);

                // Update the export in the list
                setExports((prevExports) =>
                    prevExports.map((exp) =>
                        exp.exportId === exportId ? response.payload : exp
                    )
                );

                return response.payload;
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to check export status'));
                console.error('Error checking export status:', err);
                return null;
            }
        },
        [token]
    );

    /**
     * Refresh the list of exports
     */
    const refreshExports = useCallback(async (): Promise<void> => {
        if (!token) {
            setError(new Error('No authentication token'));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetchInvoiceExports(token);
            setExports(response.payload.exports);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch exports'));
            console.error('Error fetching exports:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    /**
     * Poll export status until completion
     * @param exportId - The export ID to poll
     * @param onComplete - Callback when export is complete
     */
    const pollExportStatus = useCallback(
        (exportId: string, onComplete: (exportData: InvoiceExport) => void) => {
            const pollInterval = 5000; // 5 seconds
            let attempts = 0;
            const maxAttempts = 60; // 5 minutes max

            const poll = async () => {
                attempts++;

                if (attempts > maxAttempts) {
                    setError(new Error('Export polling timeout'));
                    return;
                }

                const exportData = await checkExportStatus(exportId);

                if (!exportData) {
                    return;
                }

                if (exportData.status === 'COMPLETED') {
                    onComplete(exportData);
                } else if (exportData.status === 'FAILED') {
                    setError(new Error(exportData.errorMessage || 'Export failed'));
                } else {
                    // Continue polling
                    setTimeout(poll, pollInterval);
                }
            };

            poll();
        },
        [checkExportStatus]
    );

    return {
        exports,
        loading,
        error,
        createExport,
        checkExportStatus,
        refreshExports,
        pollExportStatus,
    };
};
