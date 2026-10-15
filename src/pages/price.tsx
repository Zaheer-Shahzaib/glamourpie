"use client";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PaperProps } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import PricingCard from "../Components/PricingCard/PricingCard";
import { createCheckoutSession, getSubscriptionStatus } from "../Services/stripeService";
import { useAuth } from "../Context/useAuth";
import { PATH_PAGES } from "../routes";
import classes from "../styles/Pricing.module.scss";

// Card chrome (padding, radius, surface) lives in PricingCard.module.scss.
const PAPER_PROPS: PaperProps = {
  style: { height: "100%" },
};

type PricingTier = {
  tier: string;
  planKey: string;
  price: { month: number };
  customPrice?: boolean;
  features: string[];
  preferred: boolean;
  actionText: string;
  actionUrl?: string; // only for enterprise / non-Stripe plans
  description: string;
};

const PRICING: PricingTier[] = [
  {
    tier: "Free",
    planKey: "free",
    price: { month: 0 },
    customPrice: false,
    features: [
      "Generate up to 20 invoices",
      "Automatically fetch Amazon order data",
      "Create professional PDF invoices",
      "Secure connection with Amazon",
      "Basic dashboard access",
      "Email support",
    ],
    preferred: false,
    actionText: "Start Free — No Credit Card Required",
  description:""
  },
  {
    tier: "Starter",
    planKey: "starter",
    price: { month: 99 },
    customPrice: false,
    features: [
      "Up to 500 invoices / month",
      "Automatic order data sync",
      "Instant PDF invoice generation",
      "Auto-upload invoices to Amazon",
      "Standard invoice templates",
      "Email support",
    ],
    preferred: false,
    actionText: "Get Starter Plan",
    description: "",
  },
  {
    tier: "Pro",
    planKey: "pro",
    price: { month: 149 },
    customPrice: false,
    features: [
      "Up to 1,000 invoices / month",
      "Automatic order data sync",
      "Instant PDF invoice generation",
      "Auto-upload invoices to Amazon",
      "Everything in Starter plan",
      "Email support",
    ],
    preferred: false,
    actionText: "Get Pro Plan",
    description: "",
  },
  {
    tier: "Growth",
    planKey: "growth",
    price: { month: 249 },
    customPrice: false,
    features: [
      "Up to 2,000 invoices / month",
      "Real-time order syncing",
      "Automatic upload to Amazon",
      "Advanced invoice templates",
      "Faster processing speed",
      "Priority support",
    ],
    preferred: true,
    actionText: "Get Growth Plan",
    description: "",
  },
  {
    tier: "Scale",
    planKey: "scale",
    price: { month: 539 },
    customPrice: false,
    features: [
      "Up to 5,000 invoices / month",
      "Everything in Growth plan",
      "Advanced analytics & reporting",
      "Faster processing priority",
      "Dedicated support",
    ],
    preferred: false,
    actionText: "Get Scale Plan",
    description: "",
  },
  // Enterprise is temporarily disabled. Re-enable by uncommenting this entry —
  // the "Contact Sales" handling in handlePlanAction is still in place.
  // {
  //   tier: "Enterprise",
  //   planKey: "enterprise",
  //   price: { month: 0 },
  //   customPrice: true,
  //   features: [
  //     "High-volume or unlimited invoicing",
  //     "Custom integrations",
  //     "White-label invoice branding",
  //     "Dedicated account manager",
  //     "SLA & priority support",
  //     "Custom compliance workflows",
  //   ],
  //   preferred: false,
  //   actionText: "Contact Sales",
  //   actionUrl: PATH_PAGES.contact,
  //   description: "",
  // },
];

function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Track which plan button is loading (by planKey)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Current active subscriptions of the logged-in user
  const [activePlans, setActivePlans] = useState<string[]>([]);

  // Fetch subscription status if user is logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    getSubscriptionStatus()
      .then((data) => {
        setActivePlans(data.activePlans || []);
      })
      .catch(() => setActivePlans([]));
  }, [isAuthenticated]);

  const handlePlanAction = useCallback(
    async (plan: PricingTier) => {
      // Enterprise: always navigate to contact-us
      if (plan.planKey === "enterprise") {
        navigate(PATH_PAGES.contact);
        return;
      }

      // Not logged in: go to signup
      if (!isAuthenticated) {
        navigate("/authentication/signup");
        return;
      }

      // Already on this plan
      if (activePlans.includes(plan.planKey)) {
        notifications.show({
          title: "Already subscribed",
          message: `You are already on the ${plan.tier} plan.`,
          color: "blue",
          position: "top-right",
        });
        return;
      }

      setLoadingPlan(plan.planKey);
      try {
        const result = await createCheckoutSession(plan.planKey);

        if (result.free) {
          // Free plan activated on backend — redirect to success page
          navigate(`/payment-success?plan=free`);
        } else {
          // Paid plan — redirect to Stripe hosted checkout
          window.location.href = result.url;
        }
      } catch (err: any) {
        notifications.show({
          title: "Error",
          message:
            err?.response?.data?.error ||
            "Failed to start checkout. Please try again.",
          color: "red",
          position: "top-right",
        });
      } finally {
        setLoadingPlan(null);
      }
    },
    [isAuthenticated, activePlans, navigate]
  );

  const pricingItems = PRICING.map((p) => {
    const isCurrentPlan = isAuthenticated && activePlans.includes(p.planKey);
    return (
      <PricingCard
        key={p.tier}
        monthly={false}
        {...p}
        {...PAPER_PROPS}
        onAction={() => handlePlanAction(p)}
        loading={loadingPlan === p.planKey}
        isCurrentPlan={isCurrentPlan}
        actionText={isCurrentPlan ? "Active ✓" : p.actionText}
      />
    );
  });

  return (
    <>
      <>
        <title>Runanalytic Invoice — Pricing</title>
        <meta
          name="description"
          content="Simple, fair pricing for Amazon sellers. Automate invoice generation and save hours every week."
        />
      </>
      <div className={classes.pricing}>
        <header className={classes.header}>
          <h2 id="pricing-title" className={classes.title}>
            Simple, fair pricing.
          </h2>
          <p className={classes.lead}>
            Choose the plan that fits your Amazon selling volume. Automate your
            invoicing and save hours every week.
          </p>

          {isAuthenticated && activePlans.length > 0 && (
            <div className={classes.active}>
              <p className={classes.activeText}>
                You currently have the following active plans:
              </p>
              <ul className={classes.activeList}>
                {activePlans.map((plan) => (
                  <li key={plan} className={classes.activeBadge}>
                    {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                  </li>
                ))}
              </ul>
            </div>
          )}
        </header>

        <div className={classes.grid}>{pricingItems}</div>
      </div>
    </>
  );
}

export default Pricing;
