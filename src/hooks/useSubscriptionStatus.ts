import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/useAuth";
import { getSubscriptionStatus } from "../Services/stripeService";

const PLAN_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  growth: 3,
  scale: 4,
  enterprise: 5,
};

/** Picks the highest-ranking plan from the list of active plans. */
export const pickBestPlan = (plans: string[] = []): string | null =>
  plans.reduce<string | null>((best, plan) => {
    if (!best) return plan;
    return (PLAN_RANK[plan.toLowerCase()] ?? -1) >
      (PLAN_RANK[best.toLowerCase()] ?? -1)
      ? plan
      : best;
  }, null);

/**
 * Subscription status (plans, usage, past-due flag), cached so the app shell can show
 * the plan name on every page without re-fetching.
 */
export const useSubscriptionStatus = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: getSubscriptionStatus,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};
