// Settings Types for AWS Seller Account

export interface SellerSettings {
    // Amazon SP-API Credentials
    spApiCredentials: {
        sellerId: string;
        marketplaceId: string;
        region: 'NA' | 'EU' | 'FE'; // North America, Europe, Far East
        accessKeyId?: string;
        secretAccessKey?: string;
        roleArn?: string;
        refreshToken?: string;
        clientId?: string;
        clientSecret?: string;
        isActive: boolean;
        lastSynced?: string;
    };

    // Marketplace Settings
    marketplaceSettings: {
        primaryMarketplace: string;
        additionalMarketplaces: string[];
        defaultCurrency: string;
        defaultLanguage: string;
    };

    // Invoice Settings
    invoiceSettings: {
        autoGenerateInvoices: boolean;
        invoicePrefix: string;
        invoiceNumberFormat: 'sequential' | 'date-based' | 'custom';
        includeVAT: boolean;
        vatRate: number;
        invoiceTemplate: 'simple' | 'premium';
        autoUploadToAmazon: boolean;
    };

    // Notification Settings
    notificationSettings: {
        emailNotifications: boolean;
        orderNotifications: boolean;
        invoiceNotifications: boolean;
        errorNotifications: boolean;
        dailyReports: boolean;
        weeklyReports: boolean;
        notificationEmail?: string;
    };

    // Business Information
    businessInfo: {
        businessName: string;
        legalName?: string;
        taxId: string;
        vatNumber?: string;
        businessType: 'individual' | 'company' | 'partnership';
        registrationNumber?: string;
    };

    // Sync Settings
    syncSettings: {
        autoSyncOrders: boolean;
        syncFrequency: 'realtime' | 'hourly' | 'daily';
        syncStartDate?: string;
        lastSyncDate?: string;
    };
}

export interface UpdateSettingsData {
    spApiCredentials?: Partial<SellerSettings['spApiCredentials']>;
    marketplaceSettings?: Partial<SellerSettings['marketplaceSettings']>;
    invoiceSettings?: Partial<SellerSettings['invoiceSettings']>;
    notificationSettings?: Partial<SellerSettings['notificationSettings']>;
    businessInfo?: Partial<SellerSettings['businessInfo']>;
    syncSettings?: Partial<SellerSettings['syncSettings']>;
}

export interface TestConnectionResponse {
    success: boolean;
    message: string;
    marketplaces?: string[];
    sellerInfo?: {
        sellerId: string;
        name: string;
    };
}
