// Amazon Orders API Types
// Field names match the raw SP-API 2026-01-01 response (no backend remapping).

export type OrderStatus =
    | 'PENDING'
    | 'UNSHIPPED'
    | 'PARTIALLY_SHIPPED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'UNFULFILLABLE'
    | 'INVOICE_UNCONFIRMED'
    | 'PENDING_AVAILABILITY';

export type FulfillmentChannel = 'FBA' | 'MFN';

// ─── Shared sub-objects ───────────────────────────────────────────────────────

export interface MoneyAmount {
    currencyCode: string;
    amount: number;
}

export interface SalesChannel {
    marketplaceId: string;
    marketplaceName: string;  // e.g. "Amazon.ae", "Non-Amazon"
    channelName: string;      // e.g. "AMAZON", "NON_AMAZON"
}

export interface RecipientAddress {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateOrRegion?: string;
    postalCode?: string;
    countryCode?: string;
    phone?: string;
}

export interface Recipient {
    name?: string;
    address?: RecipientAddress;
}

export interface Buyer {
    name?: string;
    email?: string;
}

// ─── Order list item (raw SP-API shape) ───────────────────────────────────────

export interface OrderListItem {
    orderId: string;            // e.g. "407-9680877-6709159"
    createdTime: string;        // ISO 8601
    lastUpdatedTime?: string;
    orderStatus: OrderStatus;
    fulfillmentChannel?: FulfillmentChannel;
    salesChannel?: SalesChannel;
    orderTotal?: MoneyAmount;
    numberOfItemsShipped?: number;
    numberOfItemsUnshipped?: number;
    isPrime?: boolean;
    buyer?: Buyer;
}

// ─── Order detail (raw SP-API shape from getOrder with includedData) ──────────

export interface Order {
    orderId: string;
    createdTime: string;
    lastUpdatedTime?: string;
    orderStatus: OrderStatus;
    fulfillmentChannel?: FulfillmentChannel;
    salesChannel?: SalesChannel;
    orderTotal?: MoneyAmount;
    numberOfItemsShipped?: number;
    numberOfItemsUnshipped?: number;
    isPrime?: boolean;
    isBusinessOrder?: boolean;
    buyer?: Buyer;
    recipient?: Recipient;
    // includedData fields
    orderItems?: OrderItem[];
}

// ─── Order item ───────────────────────────────────────────────────────────────

export interface OrderItem {
    orderItemId: string;
    asin: string;
    sellerSku?: string;
    title?: string;
    productTitle?: string;
    quantityOrdered: number;
    quantityShipped?: number;
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
