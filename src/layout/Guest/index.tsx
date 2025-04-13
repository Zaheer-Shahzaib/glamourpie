import { ReactNode } from "react";
import {
  AppShell,
  Box,
  Burger,
  ColorSchemeScript,
  Group,
  MantineProvider,
  Skeleton,
  useMantineTheme,
} from "@mantine/core";

import { useDisclosure, useHeadroom } from "@mantine/hooks";
import HeaderNav from "./HeaderNav/HeaderNav";
import FooterNav from "./FooterNav/FooterNav";

type GuestLayoutProps = {
  children: ReactNode;
};

function GuestLayout({ children }: GuestLayoutProps) {
  const theme = useMantineTheme();
  const pinned = useHeadroom({ fixedAt: 120 });
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <HeaderNav
          mobileOpened={mobileOpened}
          toggleMobile={toggleMobile}
          desktopOpened={desktopOpened}
          toggleDesktop={toggleDesktop}
        />
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              h={28}
              mt='sm'
              animate={false}
            />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <FooterNav />
    </AppShell>
  );
}

export default GuestLayout;
