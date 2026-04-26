import Cookies from 'js-cookie';
import { api } from './api';

/**
 * Reads the JWT token from the cookie (same as useAuth)
 */
const getAuthHeader = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Creates a Stripe Checkout Session for the given plan.
 * For free plan: backend activates immediately and returns a local redirect URL.
 * For paid plans: returns a Stripe-hosted checkout URL.
 *
 * @param plan - 'free' | 'starter' | 'growth' | 'scale'
 * @returns { url: string, free?: boolean, sessionId?: string }
 */
export const createCheckoutSession = async (
  plan: string
): Promise<{ url: string; free?: boolean; sessionId?: string }> => {
  const response = await api.post(
    '/api/stripe/create-checkout-session',
    { plan },
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Fetches the current user's subscription plans and active status limits.
 * @returns { activePlans: string[], totalAllowedInvoices: number, hasPastDue: boolean, portalAvailable: boolean }
 */
export const getSubscriptionStatus = async (): Promise<{
  activePlans: string[];
  totalAllowedInvoices: number;
  invoicesGeneratedThisMonth: number;
  hasPastDue: boolean;
  portalAvailable: boolean;
  subscriptions: any[];
}> => {
  const response = await api.get('/api/stripe/subscription-status', {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Creates a Stripe Portal Session for the user to manage their billing.
 * @returns { url: string }
 */
export const createPortalSession = async (): Promise<{ url: string }> => {
  const response = await api.post(
    '/api/stripe/create-portal-session',
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getCustomerInvoicesDetails = async () => {
  const response = await api.get('/api/stripe/customer-invoices-details', {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Cancels a subscription safely natively
 */
export const cancelSubscription = async (subscriptionId: number): Promise<{ message: string, stripeSub: any }> => {
  const response = await api.post(
    '/api/stripe/cancel-subscription',
    { subscriptionId },
    { headers: getAuthHeader() }
  );
  return response.data;
};