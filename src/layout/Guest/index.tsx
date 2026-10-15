import { ReactNode } from "react";
import { AppShell } from "@mantine/core";

import HeaderNav, { GuestVariant } from "./HeaderNav/HeaderNav";
import FooterNav from "./FooterNav/FooterNav";
import classes from "./GuestLayout.module.scss";

type GuestLayoutProps = {
  children: ReactNode;
  /**
   * "default" – navy header + dark footer (legal / informational pages).
   * "landing" – light header with announcement bar + light footer (home page).
   */
  variant?: GuestVariant;
};

const HEADER_HEIGHT: Record<GuestVariant, number> = {
  default: 76,
  landing: 116, // 36px announcement bar + 80px navigation bar
};

function GuestLayout({ children, variant = "default" }: GuestLayoutProps) {
  return (
    <AppShell header={{ height: HEADER_HEIGHT[variant] }}>
      <AppShell.Header className={classes.header} withBorder={false}>
        <HeaderNav variant={variant} />
      </AppShell.Header>
      <AppShell.Main
        className={`${classes.main} ${variant === "landing" ? classes.landing : ""}`}
      >
        {children}
      </AppShell.Main>
      <FooterNav variant={variant} />
    </AppShell>
  );
}

export default GuestLayout;
