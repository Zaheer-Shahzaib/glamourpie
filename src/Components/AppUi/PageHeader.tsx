import { ReactNode } from "react";
import classes from "./AppUi.module.scss";

type PageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  /** Buttons / controls aligned to the right of the title */
  actions?: ReactNode;
};

/**
 * Page title block used at the top of every Seller Center screen
 * (26px bold title + 14px muted subtitle, optional actions on the right).
 */
const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <header className={classes.pageHeader}>
    <div>
      <h1 className={classes.pageTitle}>{title}</h1>
      {subtitle && <p className={classes.pageSubtitle}>{subtitle}</p>}
    </div>
    {actions && <div className={classes.pageActions}>{actions}</div>}
  </header>
);

export default PageHeader;
