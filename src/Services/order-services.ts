// Order API Service Layer
// Mock implementation for frontend development

import { api } from './api';
import {
    OrderQueryParams,
    OrderListResponse,
    OrderDetailsResponse,
    OrderStats,
    Order,
    OrderListItem,
    OrderItem,
} from '../types/order.types';

// Environment flag to use mock data
const USE_MOCK_DATA = true; // Set to false when backend is ready

// Mock Orders Data
const mockOrders: OrderListItem[] = [
    {
        amazonOrderId: '405-8967478-6005135',
        purchaseDate: '2025-01-20T10:30:00.000Z',
        orderStatus: 'Shipped',
        buyerName: 'EYMAN',
        orderTotal: 40.95,
        currencyCode: 'AED',
        numberOfItems: 1,
        fulfillmentChannel: 'FBA',
        marketplaceId: 'amazon.ae',
        isPrime: true,
    },
    {
        amazonOrderId: '408-5078436-9053930',
        purchaseDate: '2025-01-21T14:15:00.000Z',
        orderStatus: 'Delivered',
        buyerName: 'Audrey',
        orderTotal: 95.55,
        currencyCode: 'AED',
        numberOfItems: 2,
        fulfillmentChannel: 'FBA',
        marketplaceId: 'amazon.ae',
        isPrime: false,
    },
    {
        amazonOrderId: '409-1234567-8901234',
        purchaseDate: '2025-01-22T09:00:00.000Z',
        orderStatus: 'Pending',
        buyerName: 'Carlos Silva',
        orderTotal: 1750.00,
        currencyCode: 'BRL',
        numberOfItems: 1,
        fulfillmentChannel: 'MFN',
        marketplaceId: 'amazon.com.br',
        isPrime: false,
    },
    {
        amazonOrderId: '410-9876543-2109876',
        purchaseDate: '2025-01-23T16:45:00.000Z',
        orderStatus: 'Cancelled',
        buyerName: 'Mohammed Ahmed',
        orderTotal: 136.00,
        currencyCode: 'AED',
        numberOfItems: 1,
        fulfillmentChannel: 'FBA',
        marketplaceId: 'amazon.ae',
        isPrime: true,
    },
    {
        amazonOrderId: '411-5555666-7778888',
        purchaseDate: '2025-01-24T11:20:00.000Z',
        orderStatus: 'Shipped',
        buyerName: 'Priya Sharma',
        orderTotal: 2500.00,
        currencyCode: 'INR',
        numberOfItems: 3,
        fulfillmentChannel: 'FBA',
        marketplaceId: 'amazon.in',
        isPrime: true,
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
 * Fetch orders with filters and pagination
 */
export const fetchOrders = async (
    token: string,
    params?: OrderQueryParams
): Promise<OrderListResponse> => {
    if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredOrders = [...mockOrders];

        // Apply filters
        if (params?.orderStatuses && params.orderStatuses.length > 0) {
            filteredOrders = filteredOrders.filter((order) =>
                params.orderStatuses!.includes(order.orderStatus)
            );
        }

        if (params?.fulfillmentChannels && params.fulfillmentChannels.length > 0) {
            filteredOrders = filteredOrders.filter((order) =>
                params.fulfillmentChannels!.includes(order.fulfillmentChannel)
            );
        }

        if (params?.marketplaceIds && params.marketplaceIds.length > 0) {
            filteredOrders = filteredOrders.filter((order) =>
                params.marketplaceIds!.includes(order.marketplaceId)
            );
        }

        if (params?.createdAfter) {
            filteredOrders = filteredOrders.filter(
                (order) => new Date(order.purchaseDate) >= new Date(params.createdAfter!)
            );
        }

        if (params?.createdBefore) {
            filteredOrders = filteredOrders.filter(
                (order) => new Date(order.purchaseDate) <= new Date(params.createdBefore!)
            );
        }

        return {
            payload: {
                orders: filteredOrders,
                nextToken: undefined,
            },
        };
    }

    const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
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
        const order: Order = {
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
            numberOfItemsShipped: orderListItem.orderStatus === 'Shipped' ? orderListItem.numberOfItems : 0,
            numberOfItemsUnshipped: orderListItem.orderStatus === 'Pending' ? orderListItem.numberOfItems : 0,
            marketplaceId: orderListItem.marketplaceId,
            isPrime: orderListItem.isPrime,
            shippingAddress: {
                name: orderListItem.buyerName || 'Customer',
                city: 'Dubai',
                postalCode: '12345',
                countryCode: 'AE',
            },
        };

        const orderItems: OrderItem[] = [
            {
                orderItemId: 'ITEM-001',
                asin: 'B08XYZ1234',
                sku: 'TENT-4P-WP-001',
                title: 'Camping Tent - 4 Person Waterproof',
                quantityOrdered: orderListItem.numberOfItems,
                quantityShipped: orderListItem.orderStatus === 'Shipped' ? orderListItem.numberOfItems : 0,
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

    const response = await api.get(`/orders/${orderId}`, {
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

    const response = await api.get('/orders/stats', {
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
): Promise<OrderItem[]> => {
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
