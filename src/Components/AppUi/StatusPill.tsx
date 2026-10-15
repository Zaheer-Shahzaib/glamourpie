import { ReactNode } from "react";
import classes from "./AppUi.module.scss";
import { cx } from "./cx";

export type PillTone = "success" | "info" | "warning" | "danger" | "neutral";

type StatusPillProps = {
  tone?: PillTone;
  /** Solid fill + uppercase text (used for order status badges) */
  solid?: boolean;
  className?: string;
  children: ReactNode;
};

const toneClass: Record<PillTone, string> = {
  success: classes.pillSuccess,
  info: classes.pillInfo,
  warning: classes.pillWarning,
  danger: classes.pillDanger,
  neutral: classes.pillNeutral,
};

/** Rounded status badge (Accepted / Pending / Shipped …). */
export const StatusPill = ({
  tone = "neutral",
  solid,
  className,
  children,
}: StatusPillProps) => (
  <span
    className={cx(
      classes.pill,
      toneClass[tone],
      solid && classes.pillSolid,
      className,
    )}
  >
    {children}
  </span>
);

/** Maps an invoice status (API enum or free text) to a pill tone. */
export const invoiceStatusTone = (status?: string): PillTone => {
  switch ((status || "").toUpperCase()) {
    case "ACCEPTED":
    case "PAID":
    case "SUBMITTED":
      return "success";
    case "REJECTED":
    case "CANCELLED":
    case "UNPAID":
      return "danger";
    case "PENDING":
    case "DRAFT":
      return "warning";
    default:
      return "neutral";
  }
};

/** Maps an Amazon order / fulfillment status to a pill tone. */
export const orderStatusTone = (status?: string): PillTone => {
  switch ((status || "").toUpperCase().replace(/\s+/g, "_")) {
    case "SHIPPED":
    case "DELIVERED":
    case "PARTIALLY_SHIPPED":
      return "success";
    case "PROCESSING":
    case "UNSHIPPED":
    case "PENDING":
    case "PENDING_AVAILABILITY":
      return "info";
    case "CANCELLED":
    case "UNFULFILLABLE":
      return "danger";
    case "INVOICE_UNCONFIRMED":
      return "warning";
    default:
      return "neutral";
  }
};

export default StatusPill;
