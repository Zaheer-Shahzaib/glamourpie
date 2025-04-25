import { ReactNode } from "react";
import { AppShell } from "@mantine/core";

import HeaderNav from "./HeaderNav/HeaderNav";
import FooterNav from "./FooterNav/FooterNav";
import { ScrollContext } from "../../Context/scrollContext";

type GuestLayoutProps = {
  children: ReactNode;
};

function GuestLayout({ children }: GuestLayoutProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <ScrollContext.Provider value={{ scrollToSection }}>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <HeaderNav />
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
        <FooterNav />
      </AppShell>
    </ScrollContext.Provider>
  );
}

export default GuestLayout;
