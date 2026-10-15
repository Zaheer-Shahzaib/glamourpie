import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import { fetchSellerStatus } from "../Services/spapi-services";
import { AMAZON_MARKETPLACES, Marketplace } from "../constants/marketplaces";

/**
 * Connected Amazon seller account (marketplace, currency, status), cached.
 */
export const useSellerStatus = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["seller-status"],
    queryFn: () => fetchSellerStatus(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

const SHORT_NAMES: Record<string, string> = {
  "amazon.ae": "UAE",
  "amazon.co.uk": "UK",
  "amazon.sa": "KSA",
};

/** Short display name used in selectors, e.g. "UAE" for Amazon.ae. */
export const marketplaceShortName = (marketplace: Marketplace): string =>
  SHORT_NAMES[marketplace.domain] ?? marketplace.name;

/** Resolves the marketplace string stored on the seller (domain or id) to its definition. */
export const findMarketplace = (value?: string | null): Marketplace | undefined =>
  value
    ? AMAZON_MARKETPLACES.find((m) => m.domain === value || m.id === value)
    : undefined;
