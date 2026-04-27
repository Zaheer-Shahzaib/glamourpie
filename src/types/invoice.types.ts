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
    id: string; // The amazon invoice ID or our DB id
    amazonOrderId: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    invoiceType: InvoiceType;
    issueDate: string;
    dueDate?: string;
    totalAmount: CurrencyAmount;
    taxAmount: CurrencyAmount;
    buyerName?: string;
    marketplaceId: string;
    
    // Additional details for Modal
    seller?: InvoiceHeader;
    buyer?: InvoiceHeader;
    lineItems?: InvoiceLineItem[];
    subtotal?: number;
    discounts?: number;
    shippingCharges?: number;
    paymentMethod?: string;
    paymentDueDate?: string;
    currency?: string; // For backward compatibility
}

export interface InvoiceListItem {
    id: string;
    amazonOrderId: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    invoiceType: InvoiceType;
    issueDate: string;
    totalAmount: CurrencyAmount;
    taxAmount: CurrencyAmount;
    buyerName?: string;
    marketplaceId: string;
    currency?: string; // For backward compatibility
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
