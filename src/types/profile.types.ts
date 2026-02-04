// User Profile Types

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    avatar?: string;
    company?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    taxId?: string; // VAT/TRN number
    marketplace?: string; // Primary marketplace
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    username?: string;
    firstname?: string;
    lastname?: string;
    phone?: string;
    company?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    taxId?: string;
    marketplace?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ApiCredentials {
    sellerId: string;
    marketplaceId: string;
    accessKey?: string;
    secretKey?: string;
    refreshToken?: string;
    isActive: boolean;
    lastSynced?: string;
}

export interface UpdateAvatarResponse {
    avatar: string;
    message: string;
}

export interface ProfileStats {
    totalInvoices: number;
    totalOrders: number;
    accountAge: string; // e.g., "3 months"
    lastLogin: string;
}
