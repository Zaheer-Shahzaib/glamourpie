/**
 * Amazon Marketplace Definitions for the EU Region
 * Priority: UAE, UK, Germany, etc.
 */

export interface Marketplace {
  id: string;
  name: string;
  domain: string;
  region: 'NA' | 'EU' | 'FE';
  currency: string;
  flag: string; // Emoji or icon name
}

export const AMAZON_MARKETPLACES: Marketplace[] = [
  {
    id: 'A2VIGQ35RCS4UG',
    name: 'United Arab Emirates',
    domain: 'amazon.ae',
    region: 'EU',
    currency: 'AED',
    flag: '🇦🇪',
  },
  {
    id: 'A1F83G8C2ARO7P',
    name: 'United Kingdom',
    domain: 'amazon.co.uk',
    region: 'EU',
    currency: 'GBP',
    flag: '🇬🇧',
  },
  {
    id: 'A2IV9MEV8S3B2E',
    name: 'Saudi Arabia',
    domain: 'amazon.sa',
    region: 'EU',
    currency: 'SAR',
    flag: '🇸🇦',
  },
];

export const CURRENCIES = [
  { value: 'AED', label: 'AED (UAE Dirham)' },
  { value: 'SAR', label: 'SAR (Saudi Riyal)' },
];
