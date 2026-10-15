'use client';

import { ReactNode } from 'react';

import { AppShell } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import HeaderNav from '../../Components/HeaderNav';
import Navigation from '../../Components/Navigation/Navigation';
import FooterNav from '../../Components/FooterNav';
import classes from './MainLayout.module.scss';
import { useAppTheme } from '../../hooks/useAppTheme';

export type SidebarState = 'hidden' | 'mini' | 'full';

type Props = {
  children: ReactNode;
};

/**
 * Seller Center shell (sidebar + topbar). Pages wrap their content in this component.
 * While mounted it tags <body> with `ra-app`, which switches Mantine (including its
 * portals) to the Seller Center theme defined in `styles/app-theme.scss`.
 */
export default function MainLayout({ children }: Props) {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure();
  // The previous design had a "mini" rail; the new sidebar only shows/hides, so a
  // persisted "mini" value is treated as "full".
  const [sidebarState, setSidebarState] = useLocalStorage<SidebarState>({
    key: 'mantine-nav-state',
    defaultValue: 'full',
  });
  const sidebarHidden = sidebarState === 'hidden';

  useAppTheme();

  const toggleSidebar = () =>
    setSidebarState(sidebarHidden ? 'full' : 'hidden');

  return (
    <AppShell
      layout="alt"
      header={{ height: 68 }}
      navbar={{
        width: 232,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: sidebarHidden },
      }}
    >
      <AppShell.Header className={classes.header}>
        <HeaderNav
          mobileOpened={mobileOpened}
          onToggleMobile={toggleMobile}
          sidebarHidden={sidebarHidden}
          onToggleSidebar={toggleSidebar}
        />
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <Navigation onClose={closeMobile} />
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>
        <div className={classes.content}>{children}</div>
        <div className={classes.footer}>
          <FooterNav />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
