// Mock data based on Amazon Seller Partner API Sales and Traffic Report
// Reference: https://developer-docs.amazon.com/sp-api/docs/sales-api-v1-reference

/**
 * AWS SP-API Sales Metrics Response Structure
 * Based on getSalesAndTrafficReport endpoint
 */

export interface AWSSalesMetric {
    date: string;
    sales: string;
    orders: number;
    units: number;
    refunds: number;
    advCost: string;
    estPayout: string;
    grossProfit: string;
    netProfit: string;
    title: string;
    period?: string;
    value?: string;
    diff: number;
}

/**
 * Mock Sales Metrics Data
 * Simulates response from Amazon SP-API Sales and Traffic Report
 * 
 * Key metrics include:
 * - orderedProductSales: Total sales amount
 * - unitsOrdered: Number of units sold
 * - totalOrderItems: Number of orders
 * - Returns and refunds data
 * - Advertising cost (from SP-API Advertising)
 */

export const awsSalesMetricsMockData: AWSSalesMetric[] = [
    {
        title: 'Today',
        period: 'today',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        // orderedProductSales from SP-API
        sales: '4,821.44',
        value: 'AED 4,821.44',
        // totalOrderItems from SP-API
        orders: 62,
        // unitsOrdered from SP-API
        units: 68,
        // Returns/refunds count
        refunds: 4,
        // Advertising cost from SP-API Advertising
        advCost: 'AED 215.27',
        // Estimated payout after fees
        estPayout: 'AED 3,512.32',
        // Gross profit calculation
        grossProfit: 'AED 1,279.12',
        // Net profit after ad costs
        netProfit: 'AED 1,122.03',
        // Comparison to previous period
        diff: 12.5,
    },
    {
        title: 'Yesterday',
        period: 'yesterday',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        sales: '4,323.99',
        value: 'AED 4,323.99',
        orders: 58,
        units: 61,
        refunds: 3,
        advCost: 'AED 189.82',
        estPayout: 'AED 3,189.22',
        grossProfit: 'AED 1,134.77',
        netProfit: 'AED 994.65',
        diff: -5.2,
    },
    {
        title: 'Last 7 Days',
        period: '7 days',
        date: `${new Date(Date.now() - 604800000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })} - ${new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })}`,
        sales: '28,154.21',
        value: 'AED 28,154.21',
        orders: 389,
        units: 421,
        refunds: 23,
        advCost: 'AED 1,312.34',
        estPayout: 'AED 20,407.89',
        grossProfit: 'AED 7,214.19',
        netProfit: 'AED 6,387.02',
        diff: 8.3,
    },
    {
        title: 'Last 30 Days',
        period: '30 days',
        date: `${new Date(Date.now() - 2592000000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })} - ${new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })}`,
        sales: '115,599.76',
        value: 'AED 115,599.76',
        orders: 1544,
        units: 1687,
        refunds: 87,
        advCost: 'AED 5,210.50',
        estPayout: 'AED 84,378.54',
        grossProfit: 'AED 29,209.41',
        netProfit: 'AED 25,196.15',
        diff: 15.7,
    },
];

/**
 * Helper function to format currency values
 * Matches AWS SP-API Money type format
 */
export function formatAWSCurrency(amount: number, currencyCode: string = 'AED'): string {
    return `${currencyCode} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/**
 * AWS SP-API Sales Data Type Definitions
 * For reference when implementing real API integration
 */
export interface AWSMoney {
    CurrencyCode: string;
    Amount: number;
}

export interface AWSSalesAndTrafficByDate {
    date: string;
    salesByDate: {
        orderedProductSales: AWSMoney;
        orderedProductSalesB2B: AWSMoney;
        unitsOrdered: number;
        unitsOrderedB2B: number;
        totalOrderItems: number;
        totalOrderItemsB2B: number;
        averageSalesPerOrderItem: AWSMoney;
        averageSalesPerOrderItemB2B: AWSMoney;
        averageUnitsPerOrderItem: number;
        averageUnitsPerOrderItemB2B: number;
        averageSellingPrice: AWSMoney;
        averageSellingPriceB2B: AWSMoney;
        unitsRefunded: number;
        refundRate: number;
        claimsGranted: number;
        claimsAmount: AWSMoney;
        shippedProductSales: AWSMoney;
        unitsShipped: number;
        ordersShipped: number;
    };
    trafficByDate: {
        browserPageViews: number;
        browserPageViewsB2B: number;
        mobileAppPageViews: number;
        mobileAppPageViewsB2B: number;
        pageViews: number;
        pageViewsB2B: number;
        browserSessions: number;
        browserSessionsB2B: number;
        mobileAppSessions: number;
        mobileAppSessionsB2B: number;
        sessions: number;
        sessionsB2B: number;
        buyBoxPercentage: number;
        buyBoxPercentageB2B: number;
        orderItemSessionPercentage: number;
        orderItemSessionPercentageB2B: number;
        unitSessionPercentage: number;
        unitSessionPercentageB2B: number;
        averageOfferCount: number;
        averageParentItems: number;
        feedbackReceived: number;
        negativeFeedbackReceived: number;
        receivedNegativeFeedbackRate: number;
    };
}
