"use client";

import { Burger, Menu, Tooltip } from "@mantine/core";
import {
  IconBell,
  IconChevronDown,
  IconHelp,
  IconLogout,
  IconSettings,
  IconUserCircle,
  IconPlugConnected,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./HeaderNav.module.scss";
import { useAuth } from "../../Context/useAuth";
import { PATH_APPS, PATH_DASHBOARD, PATH_PAGES } from "../../routes";
import {
  findMarketplace,
  marketplaceShortName,
  useSellerStatus,
} from "../../hooks/useSellerStatus";
import { useSubscriptionStatus } from "../../hooks/useSubscriptionStatus";

type HeaderNavProps = {
  /** Mobile drawer state */
  mobileOpened: boolean;
  onToggleMobile: () => void;
  /** Desktop sidebar state */
  sidebarHidden: boolean;
  onToggleSidebar: () => void;
};

/** Screen title shown on the left of the topbar. */
const resolveTitle = (pathname: string): string => {
  const path = pathname.toLowerCase();
  if (path.startsWith(PATH_APPS.orders)) return "Orders";
  if (path.startsWith(PATH_APPS.invoices.root)) return "Invoices";
  if (path.startsWith(PATH_APPS.profile.root)) return "Profile";
  if (path.startsWith(PATH_APPS.settings.billing)) return "Billing & Subscription";
  if (path.startsWith(PATH_APPS.settings.root) || path === "/settings") {
    return "Settings";
  }
  if (path.startsWith(PATH_APPS.analytics)) return "Analytics";
  return "SellerCenter";
};

/** Workspace screens show the marketplace / date / search tools in the topbar. */
const isWorkspaceRoute = (pathname: string): boolean => {
  const path = pathname.toLowerCase();
  return (
    path.startsWith(PATH_DASHBOARD.root) ||
    path.startsWith(PATH_APPS.orders) ||
    path.startsWith(PATH_APPS.invoices.root)
  );
};

const HeaderNav = ({
  mobileOpened,
  onToggleMobile,
  sidebarHidden,
  onToggleSidebar,
}: HeaderNavProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const { data: seller } = useSellerStatus();
  const { data: subscription } = useSubscriptionStatus();

  const workspace = isWorkspaceRoute(pathname);
  const squareSize = workspace ? "sm" : "lg";

  const marketplace = findMarketplace(seller?.seller?.marketplace);
  const marketplaceLabel = marketplace
    ? `${marketplace.flag}  Amazon ${marketplaceShortName(marketplace)}`
    : seller?.seller?.marketplace
      ? seller.seller.marketplace
      : "No marketplace";

  const fullName =
    [profile?.firstname, profile?.lastname].filter(Boolean).join(" ") ||
    profile?.username ||
    "Account";
  const initial = fullName.charAt(0).toUpperCase();
  const hasPastDue = Boolean(subscription?.hasPastDue);

  const userMenu = (
    <Menu.Dropdown>
      <Menu.Item
        leftSection={<IconUserCircle size={16} />}
        onClick={() => navigate(PATH_APPS.profile.personal)}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        leftSection={<IconSettings size={16} />}
        onClick={() => navigate(PATH_APPS.settings.marketplace)}
      >
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        color="red"
        leftSection={<IconLogout size={16} />}
        onClick={logout}
      >
        Log out
      </Menu.Item>
    </Menu.Dropdown>
  );

  return (
    <div className={classes.bar}>
      <div className={classes.left}>
        <Burger
          visibleFrom="md"
          size="sm"
          opened={!sidebarHidden}
          onClick={onToggleSidebar}
          aria-label="Toggle side navigation"
        />
        <Burger
          hiddenFrom="md"
          size="sm"
          opened={mobileOpened}
          onClick={onToggleMobile}
          aria-label="Toggle navigation"
        />
        <h2 className={classes.title}>{resolveTitle(pathname)}</h2>
      </div>

      {workspace && (
        <div className={classes.filters}>
          <Menu shadow="md" width={240} position="bottom-start">
            <Menu.Target>
              <button type="button" className={classes.chip} style={{ minWidth: 206 }}>
                <span>{marketplaceLabel}</span>
                <IconChevronDown size={14} className={classes.chipChevron} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Connected marketplace</Menu.Label>
              {seller?.isConnected && marketplace ? (
                <Menu.Item disabled>
                  {marketplace.flag} {marketplace.name} · {marketplace.domain}
                </Menu.Item>
              ) : (
                <div className={classes.menuNote}>
                  No marketplace connected yet.
                </div>
              )}
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconPlugConnected size={16} />}
                onClick={() => navigate(PATH_APPS.settings.marketplace)}
              >
                Manage marketplaces
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Tooltip label="Date range filter is coming soon" withArrow>
            <button
              type="button"
              className={classes.chip}
              style={{ minWidth: 160 }}
              aria-disabled="true"
            >
              <span>Last 30 days</span>
              <IconChevronDown size={14} className={classes.chipChevron} />
            </button>
          </Tooltip>
        </div>
      )}

      <div className={classes.spacer} />

      <div className={classes.right}>
        {workspace && (
          <input
            className={classes.search}
            type="search"
            placeholder="Search anything"
            aria-label="Search (coming soon)"
            title="Search is coming soon"
            disabled
          />
        )}

        <Menu shadow="md" width={280} position="bottom-end">
          <Menu.Target>
            <button
              type="button"
              className={`${classes.square} ${classes.squareAlert}`}
              data-size={squareSize}
              aria-label="Notifications"
            >
              <IconBell size={workspace ? 15 : 18} />
              {hasPastDue && <span className={classes.alertDot} />}
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Notifications</Menu.Label>
            {hasPastDue ? (
              <Menu.Item
                component={Link}
                to={PATH_APPS.settings.billing}
                color="red"
              >
                Payment failed — update your billing details
              </Menu.Item>
            ) : (
              <div className={classes.menuNote}>You&apos;re all caught up.</div>
            )}
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="Help & support" withArrow>
          <Link
            to={PATH_PAGES.contact}
            className={`${classes.square} ${classes.squareHelp}`}
            data-size={squareSize}
            aria-label="Help & support"
          >
            <IconHelp size={workspace ? 15 : 18} />
          </Link>
        </Tooltip>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            {workspace ? (
              <button
                type="button"
                className={`${classes.square} ${classes.squareUser}`}
                data-size="sm"
                aria-label="Account menu"
              >
                {initial}
              </button>
            ) : (
              <button
                type="button"
                className={classes.userChip}
                aria-label="Account menu"
              >
                {fullName}
              </button>
            )}
          </Menu.Target>
          {userMenu}
        </Menu>
      </div>
    </div>
  );
};

export default HeaderNav;
