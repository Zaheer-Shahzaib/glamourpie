// Amazon Invoices API Types

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'PENDING' | 'CANCELLED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'DRAFT';
export type InvoiceType = 'INVOICE' | 'CREDIT_NOTE' | 'DEBIT_NOTE';

export interface CurrencyAmount {
    amount: number;
    currencyCode: string;
}

export interface InvoiceHeader {
    name: string;
    taxId?: string;
    address: string;
    email?: string;
    phone?: string; // Added to match mock data
}

export interface InvoiceLineItem {
    itemId: string;
    description: string;
    hsnCode?: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
}

export interface Invoice {
    id: string;                  // DB row id
    invoiceId: string;           // Invoice string ID (e.g. GP-2026-0027)
    sellerId?: number;
    amazonOrderId: string;
    invoiceNumber: string;
    invoiceDate: string;         // Raw date from DB
    issueDate: string;           // Alias of invoiceDate (used by modal)
    status: InvoiceStatus;
    invoiceType: InvoiceType;
    dueDate?: string;

    // Financial — plain numbers; use `currency` for the currency code
    subtotal: number;
    taxAmount: number;
    taxRate: number;
    discounts: number;
    shippingCharges: number;
    totalAmount: number;
    currency: string;

    // Decrypted relational info
    seller?: InvoiceHeader;
    buyer?: InvoiceHeader;
    buyerName?: string;
    lineItems?: InvoiceLineItem[];

    marketplaceId?: string;
    paymentMethod?: string;
    paymentDueDate?: string;
    invoiceURI?: string;
    createdAt?: string;
    updatedAt?: string;
    submittedAt?: string;
}

export interface InvoiceListItem {
    invoiceId: string;
    invoiceNumber: string;
    invoiceDate: string;
    status: InvoiceStatus;
    invoiceType: InvoiceType;
    // Financial — plain numbers from the list serializer
    totalAmount: number;
    taxAmount: number;
    subtotal: number;
    currency: string;
    amazonOrderId: string;
    buyerName?: string;          // Decrypted buyer name for the Customer column
    createdAt?: string;
    // Keep legacy optional fields so existing code doesn't break
    id?: string;
    issueDate?: string;
    marketplaceId?: string;
}

// Invoice List Response
export interface InvoiceListResponse {
    payload: {
        invoices: InvoiceListItem[];
        pagination?: PaginationInfo;
    };
}

// Invoice Details Response
export interface InvoiceDetailsResponse {
    payload: {
        invoice: Invoice;
    };
}

export interface PaginationInfo {
    total: number;
    limit: number;
    offset: number;
}

export interface InvoiceQueryParams {
    status?: InvoiceStatus[];
    type?: InvoiceType[];
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
    marketplaceId?: string;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
    invoiceCount: number;
}

// Marketplace
export type MarketplaceId = string;

// Export Types
export type ExportFormat = 'CSV' | 'JSON' | 'PDF';
export type ExportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface ExportParams {
    dateFrom?: string;
    dateTo?: string;
    invoiceStatus?: InvoiceStatus[];
    invoiceTypes?: InvoiceType[];
    marketplaceIds?: string[];
    format?: ExportFormat;
}

export interface InvoiceExport {
    exportId: string;
    sellerId: string;
    exportType: string;
    status: ExportStatus;
    filters: any;
    totalRecords: number;
    exportedRecords: number;
    exportFormat: ExportFormat;
    exportedFileUrl?: string;
    errorMessage?: string;
    createdAt: string;
    completedAt?: string;
}

// Stats
export interface InvoiceStats {
    totalInvoices: number;
    draftInvoices: number;
    submittedInvoices: number;
    acceptedInvoices: number;
    rejectedInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    currency: string;
    periodStart: string;
    periodEnd: string;
    totalOrders?: number; // Added to match some usage
}

// Order Types (Imported into Invoice module in some places)
export interface Order {
    amazonOrderId: string;
    sellerId: string;
    buyerName: string;
    buyerEmail: string;
    shippingAddress: any;
    orderDate: string;
    orderStatus: string;
    fulfillmentChannel: string;
    shippingService: string;
    estimatedDelivery?: string;
    totalAmount: number;
    currency: string;
}

export interface OrderItem {
    orderItemId: string;
    amazonOrderId: string;
    sku: string;
    asin: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    condition: string;
    itemSubtotal: number;
}
