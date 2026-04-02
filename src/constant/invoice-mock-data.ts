// Mock Data for Amazon Invoice Management System
// This file provides realistic test data for frontend development

import {
    Invoice,
    InvoiceListItem,
    InvoiceStats,
    InvoiceExport,
    Order,
    OrderItem,
    RevenueDataPoint,
} from '../types/invoice.types';

// Mock Invoices - Full Details
export const mockInvoices: Invoice[] = [
    {
        invoiceId: 'INV-2025-001-AE',
        amazonOrderId: '405-8967478-6005135',
        sellerId: 'SELLER-001',
        invoiceNumber: 'JUNI-2025-000001',
        invoiceDate: '2025-12-17T00:00:00.000Z',
        invoiceType: 'INVOICE',
        status: 'SUBMITTED',

        seller: {
            name: 'RunAnalytic Technology LLC',
            taxId: 'TRN-100123456700003',
            address: 'Dubai Silicon Oasis, Dubai, UAE',
            email: 'seller@runanalytic.com',
            phone: '+971-50-123-4567',
        },

        buyer: {
            name: 'EYMAN',
            taxId: 'TRN-987654321000001',
            address: 'Al Barsha, Dubai, UAE',
            email: 'eyman@example.com',
        },

        lineItems: [
            {
                itemId: 'ITEM-001',
                description: 'Camping Tent - 4 Person Waterproof',
                quantity: 1,
                unitPrice: 39.00,
                lineTotal: 39.00,
                hsnCode: '9406.00.10',
                taxRate: 0.05,
                taxAmount: 1.95,
            },
        ],

        subtotal: 39.00,
        discounts: 0,
        taxAmount: 1.95,
        shippingCharges: 0,
        totalAmount: 40.95,
        currency: 'AED',

        paymentMethod: 'Credit Card',
        paymentDueDate: '2025-12-24T00:00:00.000Z',

        marketplaceId: 'amazon.ae',
        invoiceURI: 's3://runanalytic-invoices/INV-2025-001-AE.pdf',
        documentHash: 'sha256:a1b2c3d4e5f6...',

        createdAt: '2025-12-17T08:30:00.000Z',
        updatedAt: '2025-12-17T08:30:00.000Z',
        submittedAt: '2025-12-17T09:00:00.000Z',
    },
    {
        invoiceId: 'INV-2025-002-AE',
        amazonOrderId: '408-5078436-9053930',
        sellerId: 'SELLER-001',
        invoiceNumber: 'JUNI-2025-000002',
        invoiceDate: '2025-12-18T00:00:00.000Z',
        invoiceType: 'INVOICE',
        status: 'ACCEPTED',

        seller: {
            name: 'RunAnalytic Technology LLC',
            taxId: 'TRN-100123456700003',
            address: 'Dubai Silicon Oasis, Dubai, UAE',
            email: 'seller@runanalytic.com',
            phone: '+971-50-123-4567',
        },

        buyer: {
            name: 'Audrey',
            taxId: 'TRN-456789123000002',
            address: 'Jumeirah Beach Residence, Dubai, UAE',
            email: 'audrey@example.com',
        },

        lineItems: [
            {
                itemId: 'ITEM-002',
                description: 'Wireless Bluetooth Headphones',
                quantity: 2,
                unitPrice: 45.50,
                lineTotal: 91.00,
                hsnCode: '8517.62.30',
                taxRate: 0.05,
                taxAmount: 4.55,
            },
        ],

        subtotal: 91.00,
        discounts: 0,
        taxAmount: 4.55,
        shippingCharges: 0,
        totalAmount: 95.55,
        currency: 'AED',

        paymentMethod: 'Debit Card',
        paymentDueDate: '2025-12-25T00:00:00.000Z',

        marketplaceId: 'amazon.ae',
        invoiceURI: 's3://runanalytic-invoices/INV-2025-002-AE.pdf',
        documentHash: 'sha256:b2c3d4e5f6a7...',

        createdAt: '2025-12-18T10:15:00.000Z',
        updatedAt: '2025-12-18T11:20:00.000Z',
        submittedAt: '2025-12-18T10:30:00.000Z',
    },
    {
        invoiceId: 'INV-2025-003-BR',
        amazonOrderId: '409-1234567-8901234',
        sellerId: 'SELLER-001',
        invoiceNumber: 'JUNI-2025-000003',
        invoiceDate: '2025-12-19T00:00:00.000Z',
        invoiceType: 'INVOICE',
        status: 'DRAFT',

        seller: {
            name: 'RunAnalytic Brasil LTDA',
            taxId: 'CNPJ-12.345.678/0001-90',
            address: 'São Paulo, SP, Brasil',
            email: 'seller@runanalytic.com.br',
            phone: '+55-11-98765-4321',
        },

        buyer: {
            name: 'Carlos Silva',
            taxId: 'CPF-123.456.789-00',
            address: 'Rio de Janeiro, RJ, Brasil',
            email: 'carlos@example.com.br',
        },

        lineItems: [
            {
                itemId: 'ITEM-003',
                description: 'Smartphone Samsung Galaxy A54',
                quantity: 1,
                unitPrice: 1500.00,
                lineTotal: 1500.00,
                hsnCode: '8517.13.00',
                taxRate: 0.18,
                taxAmount: 270.00,
            },
        ],

        subtotal: 1500.00,
        discounts: 50.00,
        taxAmount: 270.00,
        shippingCharges: 30.00,
        totalAmount: 1750.00,
        currency: 'BRL',

        paymentMethod: 'PIX',
        paymentDueDate: '2025-12-26T00:00:00.000Z',

        marketplaceId: 'amazon.com.br',
        invoiceURI: 's3://runanalytic-invoices/INV-2025-003-BR.pdf',
        documentHash: 'sha256:c3d4e5f6a7b8...',

        createdAt: '2025-12-19T14:00:00.000Z',
        updatedAt: '2025-12-19T14:00:00.000Z',
    },
    {
        invoiceId: 'INV-2025-004-AE',
        amazonOrderId: '410-9876543-2109876',
        sellerId: 'SELLER-001',
        invoiceNumber: 'JUNI-2025-000004',
        invoiceDate: '2025-12-20T00:00:00.000Z',
        invoiceType: 'INVOICE',
        status: 'REJECTED',

        seller: {
            name: 'RunAnalytic Technology LLC',
            taxId: 'TRN-100123456700003',
            address: 'Dubai Silicon Oasis, Dubai, UAE',
            email: 'seller@runanalytic.com',
            phone: '+971-50-123-4567',
        },

        buyer: {
            name: 'Mohammed Ahmed',
            address: 'Abu Dhabi, UAE',
            email: 'mohammed@example.com',
        },

        lineItems: [
            {
                itemId: 'ITEM-004',
                description: 'Leather Laptop Bag',
                quantity: 1,
                unitPrice: 120.00,
                lineTotal: 120.00,
                hsnCode: '4202.21.00',
                taxRate: 0.05,
                taxAmount: 6.00,
            },
        ],

        subtotal: 120.00,
        discounts: 0,
        taxAmount: 6.00,
        shippingCharges: 10.00,
        totalAmount: 136.00,
        currency: 'AED',

        paymentMethod: 'Cash on Delivery',
        paymentDueDate: '2025-12-27T00:00:00.000Z',

        marketplaceId: 'amazon.ae',
        invoiceURI: 's3://runanalytic-invoices/INV-2025-004-AE.pdf',
        documentHash: 'sha256:d4e5f6a7b8c9...',

        createdAt: '2025-12-20T09:00:00.000Z',
        updatedAt: '2025-12-20T15:30:00.000Z',
        submittedAt: '2025-12-20T09:15:00.000Z',
    },
    {
        invoiceId: 'INV-2025-005-IN',
        amazonOrderId: '411-5555666-7778888',
        sellerId: 'SELLER-001',
        invoiceNumber: 'JUNI-2025-000005',
        invoiceDate: '2025-12-21T00:00:00.000Z',
        invoiceType: 'CREDIT_NOTE',
        status: 'ACCEPTED',

        seller: {
            name: 'RunAnalytic India Pvt Ltd',
            taxId: 'GSTIN-29ABCDE1234F1Z5',
            address: 'Bangalore, Karnataka, India',
            email: 'seller@runanalytic.in',
            phone: '+91-80-12345678',
        },

        buyer: {
            name: 'Priya Sharma',
            taxId: 'GSTIN-27XYZAB5678G2W6',
            address: 'Mumbai, Maharashtra, India',
            email: 'priya@example.in',
        },

        lineItems: [
            {
                itemId: 'ITEM-005',
                description: 'Return: Cotton T-Shirt (Size M)',
                quantity: -1,
                unitPrice: 25.00,
                lineTotal: -25.00,
                hsnCode: '6109.10.00',
                taxRate: 0.12,
                taxAmount: -3.00,
            },
        ],

        subtotal: -25.00,
        discounts: 0,
        taxAmount: -3.00,
        shippingCharges: 0,
        totalAmount: -28.00,
        currency: 'INR',

        paymentMethod: 'Refund to Original Payment',

        marketplaceId: 'amazon.in',
        invoiceURI: 's3://runanalytic-invoices/INV-2025-005-IN.pdf',
        documentHash: 'sha256:e5f6a7b8c9d0...',

        createdAt: '2025-12-21T11:00:00.000Z',
        updatedAt: '2025-12-21T12:00:00.000Z',
        submittedAt: '2025-12-21T11:15:00.000Z',
    },
];

// Mock Invoice List Items (Simplified)
export const mockInvoiceListItems: InvoiceListItem[] = mockInvoices.map((inv) => ({
    invoiceId: inv.invoiceId,
    invoiceNumber: inv.invoiceNumber,
    invoiceDate: inv.invoiceDate,
    status: inv.status,
    invoiceType: inv.invoiceType,
    totalAmount: inv.totalAmount,
    currency: inv.currency,
    amazonOrderId: inv.amazonOrderId,
    buyerName: inv.buyer.name,
    marketplaceId: inv.marketplaceId,
}));

// Mock Invoice Statistics
export const mockInvoiceStats: InvoiceStats = {
    totalInvoices: 5,
    draftInvoices: 1,
    submittedInvoices: 1,
    acceptedInvoices: 2,
    rejectedInvoices: 1,
    totalRevenue: 1994.50,
    averageInvoiceValue: 398.90,
    currency: 'AED',
    periodStart: '2025-12-01T00:00:00.000Z',
    periodEnd: '2025-12-31T23:59:59.999Z',
};

// Mock Revenue Chart Data (Last 30 days)
export const mockRevenueData: RevenueDataPoint[] = [
    { date: '2025-12-01', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-02', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-03', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-04', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-05', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-10', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-15', revenue: 0, invoiceCount: 0 },
    { date: '2025-12-17', revenue: 40.95, invoiceCount: 1 },
    { date: '2025-12-18', revenue: 95.55, invoiceCount: 1 },
    { date: '2025-12-19', revenue: 1750.00, invoiceCount: 1 },
    { date: '2025-12-20', revenue: 136.00, invoiceCount: 1 },
    { date: '2025-12-21', revenue: -28.00, invoiceCount: 1 },
];

// Mock Invoice Exports
export const mockInvoiceExports: InvoiceExport[] = [
    {
        exportId: 'EXP-1234567890',
        sellerId: 'SELLER-001',
        exportType: 'FILTERED_EXPORT',
        status: 'COMPLETED',
        filters: {
            dateFrom: '2025-12-01',
            dateTo: '2025-12-31',
            invoiceStatus: ['SUBMITTED', 'ACCEPTED'],
            invoiceTypes: ['INVOICE'],
        },
        totalRecords: 3,
        exportedRecords: 3,
        exportFormat: 'JSON',
        exportedFileUrl: 's3://runanalytic-exports/EXP-1234567890.json',
        createdAt: '2025-12-22T10:00:00.000Z',
        completedAt: '2025-12-22T10:02:30.000Z',
    },
    {
        exportId: 'EXP-0987654321',
        sellerId: 'SELLER-001',
        exportType: 'BULK_EXPORT',
        status: 'IN_PROGRESS',
        filters: {
            dateFrom: '2025-01-01',
            dateTo: '2025-12-31',
        },
        totalRecords: 150,
        exportedRecords: 75,
        exportFormat: 'CSV',
        createdAt: '2025-12-23T14:30:00.000Z',
    },
];

// Mock Orders
export const mockOrders: Order[] = [
    {
        amazonOrderId: '405-8967478-6005135',
        sellerId: 'SELLER-001',
        buyerName: 'EYMAN',
        buyerEmail: 'eyman@example.com',
        shippingAddress: {
            name: 'EYMAN',
            street: 'Al Barsha Street 123',
            city: 'Dubai',
            state: 'Dubai',
            postalCode: '12345',
            country: 'AE',
        },
        orderDate: '2025-12-16T15:30:00.000Z',
        orderStatus: 'Shipped',
        fulfillmentChannel: 'FBA',
        shippingService: 'Standard',
        estimatedDelivery: '2025-12-19T23:59:59.999Z',
        totalAmount: 40.95,
        currency: 'AED',
    },
    {
        amazonOrderId: '408-5078436-9053930',
        sellerId: 'SELLER-001',
        buyerName: 'Audrey',
        buyerEmail: 'audrey@example.com',
        shippingAddress: {
            name: 'Audrey',
            street: 'JBR Walk, Building 5',
            city: 'Dubai',
            state: 'Dubai',
            postalCode: '54321',
            country: 'AE',
        },
        orderDate: '2025-12-17T10:00:00.000Z',
        orderStatus: 'Delivered',
        fulfillmentChannel: 'FBA',
        shippingService: 'Expedited',
        estimatedDelivery: '2025-12-20T23:59:59.999Z',
        totalAmount: 95.55,
        currency: 'AED',
    },
];

// Mock Order Items
export const mockOrderItems: OrderItem[] = [
    {
        orderItemId: 'OI-001',
        amazonOrderId: '405-8967478-6005135',
        sku: 'TENT-4P-WP-001',
        asin: 'B08XYZ1234',
        productName: 'Camping Tent - 4 Person Waterproof',
        quantity: 1,
        unitPrice: 39.00,
        currency: 'AED',
        condition: 'New',
        itemSubtotal: 39.00,
    },
    {
        orderItemId: 'OI-002',
        amazonOrderId: '408-5078436-9053930',
        sku: 'HEADPHONE-BT-002',
        asin: 'B09ABC5678',
        productName: 'Wireless Bluetooth Headphones',
        quantity: 2,
        unitPrice: 45.50,
        currency: 'AED',
        condition: 'New',
        itemSubtotal: 91.00,
    },
];
