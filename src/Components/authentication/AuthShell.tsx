import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAppTheme } from "../../hooks/useAppTheme";
import { PATH_PAGES } from "../../routes";
import classes from "./AuthShell.module.scss";

type AuthShellProps = {
  /** Small line above the big headline in the brand panel */
  eyebrow: string;
  /** Big headline in the brand panel (42px) */
  headline: string;
  /** Card title (30px) */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  children: ReactNode;
};

/**
 * Split-screen auth layout (Figma "04 Auth & Modals"): navy brand panel on the left,
 * white card on the right. Shared by sign in, sign up, forgot / reset password and OTP.
 * Also switches Mantine to the Seller Center theme while mounted.
 */
export default function AuthShell({
  eyebrow,
  headline,
  title,
  subtitle,
  children,
}: AuthShellProps) {
  useAppTheme();

  return (
    <div className={classes.root}>
      <aside className={classes.brand}>
        <Link to={PATH_PAGES.root} className={classes.logo} aria-label="RunAnalytic home">
          <span className={classes.logoName}>RunAnalytic</span>
          <span className={classes.logoTag}>LEAD WITH INTELLIGENCE</span>
        </Link>

        <div className={classes.brandBody}>
          <p className={classes.eyebrow}>{eyebrow}</p>
          <h2 className={classes.headline}>{headline}</h2>
          <p className={classes.copy}>
            One calm workspace for every marketplace, order, invoice, and
            decision.
          </p>
        </div>

        <div className={classes.metric} aria-hidden="true">
          <span className={classes.metricLabel}>Sample preview · net revenue</span>
          <span className={classes.metricValue}>AED 128,450</span>
          <span className={classes.metricDelta}>↑ 14.8% vs previous period</span>
        </div>
      </aside>

      <main className={classes.panel}>
        <div className={classes.card}>
          <header className={classes.cardHeader}>
            <h1 className={classes.title}>{title}</h1>
            {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export { classes as authUi };
