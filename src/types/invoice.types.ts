// Amazon SP-API Invoice Types - v2024-06-19

export type InvoiceStatus = 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
export type InvoiceType = 'INVOICE' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
export type Currency = 'AED' | 'BRL' | 'INR' | 'USD' | 'EUR';
export type MarketplaceId = 'amazon.ae' | 'amazon.com.br' | 'amazon.in' | 'amazon.com' | 'amazon.co.uk';
export type FulfillmentChannel = 'FBA' | 'MFN';
export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
export type ExportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ExportFormat = 'JSON' | 'CSV' | 'PDF';

// Address Information
export interface Address {
    name?: string;
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
}

// Seller Information
export interface SellerInfo {
    name: string;
    taxId: string;
    address: string;
    email?: string;
    phone?: string;
}

// Buyer Information
export interface BuyerInfo {
    name: string;
    taxId?: string;
    address: string;
    email?: string;
}

// Invoice Line Item
export interface InvoiceLineItem {
    itemId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    hsnCode?: string; // Harmonized System Nomenclature code
    taxRate: number; // e.g., 0.05 for 5%
    taxAmount: number;
    discount?: number;
}

// Main Invoice Interface
export interface Invoice {
    invoiceId: string;
    amazonOrderId: string;
    sellerId: string;
    invoiceNumber: string;
    invoiceDate: string; // ISO 8601 format
    invoiceType: InvoiceType;
    status: InvoiceStatus;

    seller: SellerInfo;
    buyer: BuyerInfo;

    lineItems: InvoiceLineItem[];

    // Financial Summary
    subtotal: number;
    discounts: number;
    taxAmount: number;
    shippingCharges: number;
    totalAmount: number;
    currency: Currency;

    // Payment Information
    paymentMethod?: string;
    paymentDueDate?: string;

    // Compliance & Documents
    marketplaceId: MarketplaceId;
    invoiceURI?: string;
    documentHash?: string;

    // Timestamps
    createdAt: string;
    updatedAt: string;
    submittedAt?: string;
}

// Simplified Invoice for List View
export interface InvoiceListItem {
    invoiceId: string;
    invoiceNumber: string;
    invoiceDate: string;
    status: InvoiceStatus;
    invoiceType: InvoiceType;
    totalAmount: number;
    currency: Currency;
    amazonOrderId: string;
    buyerName: string;
    marketplaceId: MarketplaceId;
}

// Invoice Query Parameters
export interface InvoiceQueryParams {
    status?: InvoiceStatus;
    type?: InvoiceType;
    dateFrom?: string; // ISO 8601
    dateTo?: string; // ISO 8601
    marketplaceId?: MarketplaceId;
    limit?: number; // default: 100, max: 200
    offset?: number; // default: 0
}

// Pagination Info
export interface PaginationInfo {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
}

// Invoice List Response
export interface InvoiceListResponse {
    payload: {
        invoices: InvoiceListItem[];
        pagination: PaginationInfo;
    };
}

// Invoice Details Response
export interface InvoiceDetailsResponse {
    payload: Invoice;
}

// Invoice Attributes Response
export interface InvoiceAttributesResponse {
    payload: {
        invoiceStatus: InvoiceStatus[];
        invoiceType: InvoiceType[];
        marketplace: MarketplaceId[];
        currencies: Currency[];
    };
}

// Invoice Document Response
export interface InvoiceDocumentResponse {
    payload: {
        invoiceId: string;
        documentUrl: string;
        contentType: string;
        expiresAt: string;
    };
}

// Order Information
export interface Order {
    amazonOrderId: string;
    sellerId: string;
    buyerName: string;
    buyerEmail?: string;
    shippingAddress: Address;
    orderDate: string;
    orderStatus: OrderStatus;
    fulfillmentChannel: FulfillmentChannel;
    shippingService?: string;
    estimatedDelivery?: string;
    totalAmount: number;
    currency: Currency;
}

// Order Item
export interface OrderItem {
    orderItemId: string;
    amazonOrderId: string;
    sku: string;
    asin: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    currency: Currency;
    condition: string;
    itemSubtotal: number;
}

// Export Parameters
export interface ExportParams {
    dateFrom?: string;
    dateTo?: string;
    invoiceStatus?: InvoiceStatus[];
    invoiceTypes?: InvoiceType[];
    format: ExportFormat;
}

// Invoice Export
export interface InvoiceExport {
    exportId: string;
    sellerId: string;
    exportType: 'BULK_EXPORT' | 'FILTERED_EXPORT';
    status: ExportStatus;
    filters: {
        dateFrom?: string;
        dateTo?: string;
        invoiceStatus?: InvoiceStatus[];
        invoiceTypes?: InvoiceType[];
    };
    totalRecords: number;
    exportedRecords: number;
    exportFormat: ExportFormat;
    exportedFileUrl?: string;
    createdAt: string;
    completedAt?: string;
    errorMessage?: string;
}

// Export Create Response
export interface ExportCreateResponse {
    payload: {
        exportId: string;
        status: ExportStatus;
        createdAt: string;
    };
}

// Export List Response
export interface ExportListResponse {
    payload: {
        exports: InvoiceExport[];
    };
}

// Export Status Response
export interface ExportStatusResponse {
    payload: InvoiceExport;
}

// Invoice Statistics
export interface InvoiceStats {
    totalInvoices: number;
    draftInvoices: number;
    submittedInvoices: number;
    acceptedInvoices: number;
    rejectedInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    currency: Currency;
    periodStart: string;
    periodEnd: string;
}

// Revenue Chart Data Point
export interface RevenueDataPoint {
    date: string;
    revenue: number;
    invoiceCount: number;
}

// Error Response
export interface ApiErrorResponse {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}
