import { ActionIcon, Avatar, Skeleton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import classes from "./Navigation.module.scss";
import { LinksGroup, LinksGroupProps } from "./Links/Links";
import { PATH_DASHBOARD, PATH_APPS } from "../../routes";
import { useAuth } from "../../Context/useAuth";
import { getAvatarUrl } from "../../utils/helperFunctions";
import {
  pickBestPlan,
  useSubscriptionStatus,
} from "../../hooks/useSubscriptionStatus";

type NavGroup = { title: string; items: Omit<LinksGroupProps, "onNavigate">[] };

/**
 * Sidebar structure from Figma "01 Product UI".
 * Entries flagged `soon` have no route/backend yet and render as disabled items.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", link: PATH_DASHBOARD.default },
      { label: "Orders", link: PATH_APPS.orders },
      { label: "Products", soon: true },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Invoices",
        link: PATH_APPS.invoices.root,
        matchPrefix: PATH_APPS.invoices.root,
      },
      { label: "Revenue & fees", soon: true },
      { label: "Refunds", soon: true },
    ],
  },
  {
    title: "Insights",
    items: [
      // The Analytics route still renders mock data, so it stays hidden behind "Soon"
      // (it was already hidden from the previous navigation).
      { label: "Analytics", soon: true },
      { label: "Reports", soon: true },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "Profile",
        link: PATH_APPS.profile.personal,
        matchPrefix: PATH_APPS.profile.root,
      },
      {
        label: "Settings",
        matchPrefix: PATH_APPS.settings.root,
        links: [
          { label: "Marketplace", link: PATH_APPS.settings.marketplace },
          { label: "Invoices", link: PATH_APPS.settings.invoices },
          { label: "Business info", link: PATH_APPS.settings.business },
          {
            label: "Billing & Subscription",
            link: PATH_APPS.settings.billing,
          },
        ],
      },
    ],
  },
];

type NavigationProps = {
  /** Closes the mobile drawer */
  onClose: () => void;
};

const Navigation = ({ onClose }: NavigationProps) => {
  const { profile, loading } = useAuth();
  const { data: subscription } = useSubscriptionStatus();

  const plan = pickBestPlan(subscription?.activePlans);
  const fullName =
    [profile?.firstname, profile?.lastname].filter(Boolean).join(" ") ||
    profile?.username ||
    profile?.email ||
    "";
  const initial = (fullName || "U").charAt(0).toUpperCase();

  return (
    <nav className={classes.navbar} aria-label="Primary">
      <div className={classes.header}>
        <Link
          to={PATH_DASHBOARD.default}
          className={classes.brand}
          aria-label="RunAnalytic SellerCenter home"
          onClick={onClose}
        >
          <span className={classes.brandName}>RunAnalytic</span>
          <span className={classes.brandSub}>SellerCenter</span>
        </Link>
        <ActionIcon
          hiddenFrom="md"
          variant="transparent"
          className={classes.closeButton}
          onClick={onClose}
          aria-label="Close navigation"
        >
          <IconX size={18} />
        </ActionIcon>
      </div>

      <div className={classes.links}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className={classes.group}>
            <p className={classes.groupLabel}>{group.title}</p>
            {group.items.map((item) => (
              <LinksGroup key={item.label} {...item} onNavigate={onClose} />
            ))}
          </div>
        ))}
      </div>

      <Link
        to={PATH_APPS.profile.personal}
        className={classes.footer}
        onClick={onClose}
      >
        <Avatar
          size={28}
          radius="md"
          src={getAvatarUrl(profile?.avatar)}
          className={classes.avatar}
        >
          {initial}
        </Avatar>
        <div className={classes.userText}>
          {loading && !profile ? (
            <Skeleton height={12} width={90} />
          ) : (
            <div className={classes.userName}>{fullName || "Your account"}</div>
          )}
          <div className={classes.userPlan}>
            {plan ? `${plan} workspace` : "Seller workspace"}
          </div>
        </div>
      </Link>
    </nav>
  );
};

export default Navigation;
