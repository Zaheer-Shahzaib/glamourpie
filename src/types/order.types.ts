// Amazon Orders API Types

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Unshipped' | 'PartiallyShipped';
export type FulfillmentChannel = 'FBA' | 'MFN';
export type PaymentMethod = 'COD' | 'CVS' | 'Other';

// Order Address
export interface OrderAddress {
    name: string;
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    stateOrRegion?: string;
    postalCode: string;
    countryCode: string;
    phone?: string;
}

// Order Item
export interface OrderItem {
    orderItemId: string;
    asin: string;
    sku: string;
    title: string;
    quantityOrdered: number;
    quantityShipped?: number;
    itemPrice: {
        currencyCode: string;
        amount: number;
    };
    itemTax?: {
        currencyCode: string;
        amount: number;
    };
    shippingPrice?: {
        currencyCode: string;
        amount: number;
    };
    promotionDiscount?: {
        currencyCode: string;
        amount: number;
    };
    conditionId?: string;
    conditionSubtypeId?: string;
}

// Main Order
export interface Order {
    amazonOrderId: string;
    sellerOrderId?: string;
    purchaseDate: string;
    lastUpdateDate: string;
    orderStatus: OrderStatus;
    fulfillmentChannel: FulfillmentChannel;
    salesChannel?: string;
    orderChannel?: string;
    shipServiceLevel?: string;

    // Buyer Information
    buyerEmail?: string;
    buyerName?: string;
    shippingAddress?: OrderAddress;

    // Financial
    orderTotal?: {
        currencyCode: string;
        amount: number;
    };
    numberOfItemsShipped?: number;
    numberOfItemsUnshipped?: number;

    // Payment
    paymentMethod?: PaymentMethod;
    paymentMethodDetails?: string[];

    // Marketplace
    marketplaceId: string;

    // Shipping
    shipmentServiceLevelCategory?: string;
    earliestShipDate?: string;
    latestShipDate?: string;
    earliestDeliveryDate?: string;
    latestDeliveryDate?: string;

    // Business
    isBusinessOrder?: boolean;
    isPrime?: boolean;
    isPremiumOrder?: boolean;
    isGlobalExpressEnabled?: boolean;

    // Replacement
    replacedOrderId?: string;
    isReplacementOrder?: boolean;
}

// Order List Item (simplified for table view)
export interface OrderListItem {
    amazonOrderId: string;
    purchaseDate: string;
    orderStatus: OrderStatus;
    buyerName?: string;
    orderTotal: number;
    currencyCode: string;
    numberOfItems: number;
    fulfillmentChannel: FulfillmentChannel;
    marketplaceId: string;
    isPrime?: boolean;
}

// Order Query Parameters
export interface OrderQueryParams {
    createdAfter?: string; // ISO 8601
    createdBefore?: string; // ISO 8601
    lastUpdatedAfter?: string;
    lastUpdatedBefore?: string;
    orderStatuses?: OrderStatus[];
    marketplaceIds?: string[];
    fulfillmentChannels?: FulfillmentChannel[];
    paymentMethods?: PaymentMethod[];
    buyerEmail?: string;
    sellerOrderId?: string;
    maxResultsPerPage?: number; // max 100
    nextToken?: string; // for pagination
}

// Order List Response
export interface OrderListResponse {
    payload: {
        orders: OrderListItem[];
        nextToken?: string;
        createdBefore?: string;
    };
}

// Order Details Response
export interface OrderDetailsResponse {
    payload: {
        order: Order;
        orderItems: OrderItem[];
    };
}

// Order Statistics
export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    currencyCode: string;
    averageOrderValue: number;
}
