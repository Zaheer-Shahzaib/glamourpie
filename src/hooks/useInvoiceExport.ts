// Custom hook for managing invoice exports

import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../Context/useAuth';
import {
    InvoiceExport,
    ExportParams,
} from '../types/invoice.types';
import {
    createInvoiceExport,
    fetchInvoiceExports,
    fetchExportStatus,
    downloadExportedFile,
} from '../Services/invoice-services';

interface UseInvoiceExportReturn {
    exports: InvoiceExport[];
    loading: boolean;
    error: Error | null;
    subscriptionError: string | null;
    createExport: (params: ExportParams) => Promise<string | null>;
    checkExportStatus: (exportId: string) => Promise<InvoiceExport | null>;
    refreshExports: () => Promise<void>;
    pollExportStatus: (exportId: string, onComplete: (exportData: InvoiceExport) => void) => void;
}

export const useInvoiceExport = (): UseInvoiceExportReturn => {
    const { token } = useAuth();
    const [exports, setExports]                     = useState<InvoiceExport[]>([]);
    const [loading, setLoading]                     = useState(false);
    const [error, setError]                         = useState<Error | null>(null);
    const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

    // ─── refreshExports (declared first so createExport can reference it) ────────
    const refreshExports = useCallback(async (): Promise<void> => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await fetchInvoiceExports(token);
            setExports(response.payload.exports || []);
        } catch (err: any) {
            // 403 = no subscription — swallow from list, it's surfaced via createExport
            if (err?.response?.status !== 403) {
                console.error('Error fetching exports:', err);
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    // ─── createExport ─────────────────────────────────────────────────────────────
    const createExport = useCallback(
        async (params: ExportParams): Promise<string | null> => {
            if (!token) {
                setError(new Error('No authentication token'));
                return null;
            }

            try {
                setLoading(true);
                setError(null);
                setSubscriptionError(null);

                const response = await createInvoiceExport(token, params);
                const payload  = (response as any).payload ?? response;

                // ── Sandbox / instant-complete fast-path ───────────────────────────
                // Backend returns { status: 'COMPLETED', downloadUrl: '/api/...' }
                if (payload.status === 'COMPLETED' && payload.downloadUrl) {
                    await downloadExportedFile(token, payload.downloadUrl);
                    notifications.show({
                        title: "Export Generated ✓",
                        message: "Your PDF was generated instantly from sandbox data.",
                        color: "green",
                    });
                    await refreshExports();
                    return null; // Return null so the caller doesn't start polling
                }

                // ── Normal async path ──────────────────────────────────────────────
                await refreshExports();
                return payload.exportId ?? null;

            } catch (err: any) {
                // 403 = no subscription or limit reached
                if (err?.response?.status === 403) {
                    const msg: string =
                        err.response?.data?.error ||
                        'No active subscription. Please subscribe to a plan to export invoices.';
                    setSubscriptionError(msg);
                    return null;
                }
                setError(err instanceof Error ? err : new Error('Failed to create export'));
                console.error('Error creating export:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [token, refreshExports]
    );

    // ─── checkExportStatus ────────────────────────────────────────────────────────
    const checkExportStatus = useCallback(
        async (exportId: string): Promise<InvoiceExport | null> => {
            if (!token) return null;
            try {
                const response = await fetchExportStatus(token, exportId);
                setExports((prev) =>
                    prev.map((exp) => (exp.exportId === exportId ? response.payload : exp))
                );
                return response.payload;
            } catch (err) {
                console.error('Error checking export status:', err);
                return null;
            }
        },
        [token]
    );

    // ─── pollExportStatus ─────────────────────────────────────────────────────────
    const pollExportStatus = useCallback(
        (exportId: string, onComplete: (exportData: InvoiceExport) => void) => {
            const POLL_MS   = 5_000;
            const MAX_TRIES = 60;
            let   attempts  = 0;

            const poll = async () => {
                if (++attempts > MAX_TRIES) {
                    setError(new Error('Export polling timed out'));
                    return;
                }
                const data = await checkExportStatus(exportId);
                if (!data) return;

                if (data.status === 'COMPLETED') {
                    onComplete(data);
                } else if (data.status === 'FAILED') {
                    setError(new Error(data.errorMessage || 'Export failed'));
                } else {
                    setTimeout(poll, POLL_MS);
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
        subscriptionError,
        createExport,
        checkExportStatus,
        refreshExports,
        pollExportStatus,
    };
};
