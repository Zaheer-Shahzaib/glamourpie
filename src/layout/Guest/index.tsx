import { ReactNode } from "react";
import { AppShell } from "@mantine/core";

import HeaderNav from "./HeaderNav/HeaderNav";
import FooterNav from "./FooterNav/FooterNav";

type GuestLayoutProps = {
  children: ReactNode;
};

function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <AppShell
      header={{ height: 60 }} 
    >
      <AppShell.Header>
        <HeaderNav />
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <FooterNav />
    </AppShell>
  );
}

export default GuestLayout;
