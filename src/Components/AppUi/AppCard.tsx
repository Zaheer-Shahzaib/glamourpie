import { CSSProperties, ReactNode } from "react";
import classes from "./AppUi.module.scss";
import { cx } from "./cx";

type AppCardProps = {
  children: ReactNode;
  /** Navy card used for "live preview" / hero metric panels */
  tone?: "light" | "dark";
  /** Remove the inner padding (for tables that span the full card width) */
  flush?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** White (or navy) rounded surface used by every Seller Center panel. */
export const AppCard = ({
  children,
  tone = "light",
  flush,
  className,
  style,
}: AppCardProps) => (
  <section
    className={cx(
      classes.card,
      tone === "dark" && classes.cardDark,
      flush && classes.cardFlush,
      className,
    )}
    style={style}
  >
    {children}
  </section>
);

type CardHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  right?: ReactNode;
};

/** Card title (17px semibold) + muted subtitle, optional right-aligned slot. */
export const CardHeader = ({ title, subtitle, right }: CardHeaderProps) => (
  <div className={classes.cardHeader}>
    <div>
      <h2 className={classes.cardTitle}>{title}</h2>
      {subtitle && <p className={classes.cardSubtitle}>{subtitle}</p>}
    </div>
    {right}
  </div>
);

export default AppCard;
