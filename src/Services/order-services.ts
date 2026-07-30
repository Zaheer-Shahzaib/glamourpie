// Order API Service Layer
// Mock implementation for frontend development

import { api } from './api';
import {
    OrderQueryParams,
    OrderListResponse,
    OrderDetailsResponse,
    OrderStats,
} from '../types/order.types';

// Environment flag to use mock data
const USE_MOCK_DATA = false; // Set to false since backend is ready

// Mock Orders Data (matches raw SP-API 2026-01-01 field names)
const mockOrders: any[] = [
    {
        orderId: '405-8967478-6005135',
        createdTime: '2025-01-20T10:30:00.000Z',
        orderStatus: 'SHIPPED',
        orderTotal: { currencyCode: 'AED', amount: 40.95 },
        numberOfItemsShipped: 1,
        numberOfItemsUnshipped: 0,
        fulfillmentChannel: 'FBA',
        salesChannel: { marketplaceId: 'A2VIGQ35RCS4UG', marketplaceName: 'Amazon.ae', channelName: 'AMAZON' },
        isPrime: true,
        buyer: { name: 'EYMAN' },
    },
    {
        orderId: '408-5078436-9053930',
        createdTime: '2025-01-21T14:15:00.000Z',
        orderStatus: 'SHIPPED',
        orderTotal: { currencyCode: 'AED', amount: 95.55 },
        numberOfItemsShipped: 2,
        numberOfItemsUnshipped: 0,
        fulfillmentChannel: 'FBA',
        salesChannel: { marketplaceId: 'A2VIGQ35RCS4UG', marketplaceName: 'Amazon.ae', channelName: 'AMAZON' },
        isPrime: false,
        buyer: { name: 'Audrey' },
    },
    {
        orderId: '409-1234567-8901234',
        createdTime: '2025-01-22T09:00:00.000Z',
        orderStatus: 'PENDING',
        orderTotal: { currencyCode: 'BRL', amount: 1750.00 },
        numberOfItemsShipped: 0,
        numberOfItemsUnshipped: 1,
        fulfillmentChannel: 'MFN',
        salesChannel: { marketplaceId: 'A21TJRUUN4KGV', marketplaceName: 'Amazon.com.br', channelName: 'AMAZON' },
        isPrime: false,
        buyer: { name: 'Carlos Silva' },
    },
    {
        orderId: '410-9876543-2109876',
        createdTime: '2025-01-23T16:45:00.000Z',
        orderStatus: 'CANCELLED',
        orderTotal: { currencyCode: 'AED', amount: 136.00 },
        numberOfItemsShipped: 0,
        numberOfItemsUnshipped: 1,
        fulfillmentChannel: 'FBA',
        salesChannel: { marketplaceId: 'A2VIGQ35RCS4UG', marketplaceName: 'Amazon.ae', channelName: 'AMAZON' },
        isPrime: true,
        buyer: { name: 'Mohammed Ahmed' },
    },
    {
        orderId: '411-5555666-7778888',
        createdTime: '2025-01-24T11:20:00.000Z',
        orderStatus: 'SHIPPED',
        orderTotal: { currencyCode: 'INR', amount: 2500.00 },
        numberOfItemsShipped: 3,
        numberOfItemsUnshipped: 0,
        fulfillmentChannel: 'FBA',
        salesChannel: { marketplaceId: 'A21TJRUUN4KGV', marketplaceName: 'Amazon.in', channelName: 'AMAZON' },
        isPrime: true,
        buyer: { name: 'Priya Sharma' },
    },
];

const mockOrderStats: OrderStats = {
    totalOrders: 5,
    pendingOrders: 1,
    shippedOrders: 2,
    deliveredOrders: 1,
    cancelledOrders: 1,
    totalRevenue: 4522.50,
    currencyCode: 'AED',
    averageOrderValue: 904.50,
};

/**
 * Fetch one page of orders from SP-API via the backend.
 *
 * Page 1: omit nextToken (backend builds createdAfter/createdBefore).
 * Page 2+: pass nextToken + the same createdAfter/createdBefore from page 1.
 */
export const fetchOrders = async (
    token: string,
    params: OrderQueryParams = {},
): Promise<OrderListResponse> => {
    // Only forward SP-API pagination / window params the backend expects.
    const queryParams: OrderQueryParams = {};
    if (params.nextToken) queryParams.nextToken = params.nextToken

    const response = await api.get('/api/aws/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams,
    });
    return response.data;
};

/**
 * Get order details including items
 */
export const fetchOrderDetails = async (
    token: string,
    orderId: string
): Promise<OrderDetailsResponse> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const orderListItem = mockOrders.find((o) => o.amazonOrderId === orderId);

        if (!orderListItem) {
            throw new Error(`Order ${orderId} not found`);
        }

        // Create full order details
        const order: any = {
            amazonOrderId: orderListItem.amazonOrderId,
            purchaseDate: orderListItem.purchaseDate,
            lastUpdateDate: orderListItem.purchaseDate,
            orderStatus: orderListItem.orderStatus,
            fulfillmentChannel: orderListItem.fulfillmentChannel,
            buyerName: orderListItem.buyerName,
            orderTotal: {
                currencyCode: orderListItem.currencyCode,
                amount: orderListItem.orderTotal,
            },
            numberOfItemsShipped: orderListItem.orderStatus === 'SHIPPED' ? orderListItem.numberOfItems : 0,
            numberOfItemsUnshipped: orderListItem.orderStatus === 'PENDING' || orderListItem.orderStatus === 'UNSHIPPED' ? orderListItem.numberOfItems : 0,
            marketplaceId: orderListItem.marketplaceId,
            isPrime: orderListItem.isPrime,
            // shippingAddress is not available in mock list items;
            // real data comes from the backend SP-API call
        };

        const orderItems: any[] = [
            {
                orderItemId: 'ITEM-001',
                asin: 'B08XYZ1234',
                sku: 'TENT-4P-WP-001',
                title: 'Camping Tent - 4 Person Waterproof',
                quantityOrdered: orderListItem.numberOfItems,
                quantityShipped: orderListItem.orderStatus === 'SHIPPED' ? orderListItem.numberOfItems : 0,
                itemPrice: {
                    currencyCode: orderListItem.currencyCode,
                    amount: orderListItem.orderTotal,
                },
            },
        ];

        return {
            payload: {
                order,
                orderItems,
            },
        };
    }

    const response = await api.get(`/api/aws/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

/**
 * Get order statistics
 */
export const fetchOrderStats = async (
    token: string
): Promise<OrderStats> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockOrderStats;
    }

    const response = await api.get('/api/aws/orders/stats', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.payload;
};

/**
 * Get order items for a specific order
 */
export const fetchOrderItems = async (
    token: string,
    orderId: string
): Promise<any[]> => {
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        return [
            {
                orderItemId: 'ITEM-001',
                asin: 'B08XYZ1234',
                sku: 'TENT-4P-WP-001',
                title: 'Camping Tent - 4 Person Waterproof',
                quantityOrdered: 1,
                quantityShipped: 1,
                itemPrice: {
                    currencyCode: 'AED',
                    amount: 39.00,
                },
                itemTax: {
                    currencyCode: 'AED',
                    amount: 1.95,
                },
            },
        ];
    }

    const response = await api.get(`/orders/${orderId}/items`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.payload;
};
