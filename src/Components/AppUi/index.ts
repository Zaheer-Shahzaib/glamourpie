import classes from "./AppUi.module.scss";
import { cx } from "./cx";

export { default as PageHeader } from "./PageHeader";
export { AppCard, CardHeader } from "./AppCard";
export {
  StatusPill,
  invoiceStatusTone,
  orderStatusTone,
} from "./StatusPill";
export type { PillTone } from "./StatusPill";
export { default as ComingSoon } from "./ComingSoon";
export { AppModal } from "./AppModal";
export { cx };
export { classes as ui };

export type AppButtonVariant =
  | "primary"
  | "dark"
  | "light"
  | "soft"
  | "dangerText";

const variantClass: Record<AppButtonVariant, string> = {
  primary: classes.btnPrimary,
  dark: classes.btnDark,
  light: classes.btnLight,
  soft: classes.btnSoft,
  dangerText: classes.btnDangerText,
};

/**
 * className for a Mantine <Button> that should match the Figma button styles.
 * Usage: <Button className={appButton("dark")}>Export report</Button>
 */
export const appButton = (variant: AppButtonVariant, small?: boolean) =>
  cx(classes.btn, variantClass[variant], small && classes.btnSm);
