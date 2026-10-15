import type { CSSProperties } from "react";
import { Button, PaperProps } from "@mantine/core";
import CountUp from "react-countup";
import classes from "./PricingCard.module.scss";

type PricingCardProps = {
  tier: string;
  description: string;
  price: {
    month: number;
    year?: number;
  };
  features: string[];
  preferred: boolean;
  actionText: string;
  monthly: boolean;
  customPrice?: boolean;
  onAction?: () => void;
  loading?: boolean;
  isCurrentPlan?: boolean;
} & PaperProps;

const PricingCard = (props: PricingCardProps) => {
  const {
    price,
    actionText,
    preferred,
    features,
    tier,
    monthly,
    description,
    customPrice,
    onAction,
    loading,
    isCurrentPlan,
    className,
    style,
  } = props;

  const footnote = tier === "Free" ? "No card required" : "Cancel anytime";
  const showArrow = !loading && !isCurrentPlan;

  return (
    <article
      className={[classes.card, className].filter(Boolean).join(" ")}
      style={style as CSSProperties | undefined}
      data-featured={preferred || undefined}
      aria-label={`${tier} plan`}
    >
      {preferred && <span className={classes.strip} aria-hidden="true" />}

      <div className={classes.price}>
        {customPrice ? (
          <span>Custom Pricing</span>
        ) : (
          <>
            <span className={classes.currency}>AED</span>{" "}
            <CountUp end={monthly && price.year ? price.year : price.month} />
            <span className={classes.unit}>/mo</span>
          </>
        )}
      </div>

      <h3 className={classes.tier}>{tier}</h3>
      {description && <p className={classes.description}>{description}</p>}

      <ul className={classes.features}>
        {features.map((feature, index) => (
          <li key={`${feature}-${index}`} className={classes.feature}>
            <span className={classes.check} aria-hidden="true">
              &#10003;
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className={classes.actions}>
        <Button
          fullWidth
          classNames={{ root: classes.button, label: classes.buttonLabel }}
          data-featured={preferred || undefined}
          data-current={isCurrentPlan || undefined}
          rightSection={showArrow ? <span aria-hidden="true">&rarr;</span> : undefined}
          onClick={onAction}
          loading={loading}
          disabled={isCurrentPlan}
        >
          {actionText}
        </Button>
        <p className={classes.footnote}>{footnote}</p>
      </div>
    </article>
  );
};

export default PricingCard;
