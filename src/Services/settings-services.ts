// Settings API Service Layer

import { api } from './api';
import { SellerSettings, UpdateSettingsData, TestConnectionResponse } from '../types/settings.types';

/**
 * Get seller settings
 */
export const fetchSellerSettings = async (token: string): Promise<SellerSettings> => {
    const response = await api.get('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Update seller settings
 */
export const updateSellerSettings = async (
    token: string,
    data: UpdateSettingsData
): Promise<SellerSettings> => {
    const response = await api.put('/api/settings', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Test SP-API connection
 */
export const testSpApiConnection = async (
    token: string,
    credentials: {
        sellerId: string;
        marketplaceId: string;
        accessKeyId: string;
        secretAccessKey: string;
        refreshToken: string;
    }
): Promise<TestConnectionResponse> => {
    const response = await api.post('/api/settings/test-connection', credentials, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Sync orders from Amazon
 */
export const syncAmazonOrders = async (token: string): Promise<{ message: string; ordersSynced: number }> => {
    const response = await api.post(
        '/api/settings/sync-orders',
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

/**
 * Reset settings to default
 */
export const resetSettings = async (token: string): Promise<{ message: string }> => {
    const response = await api.post(
        '/api/settings/reset',
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};
