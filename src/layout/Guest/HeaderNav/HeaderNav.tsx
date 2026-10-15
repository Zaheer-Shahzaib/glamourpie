import { useEffect, useState } from "react";
import { Burger, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classes from "./HeaderNav.module.scss";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";
import { useScroll } from "../../../Context/scrollContext";
import { useAuth } from "../../../Context/useAuth";
import Wordmark from "../../../Components/Brand/Wordmark";

export type GuestVariant = "default" | "landing";

type HeaderNavProps = {
  /**
   * "default"  – navy header used by legal / informational pages.
   * "landing"  – light header with announcement bar used by the home page.
   */
  variant?: GuestVariant;
};

type NavItem = {
  link: string;
  label: string;
  sectionId?: string;
  onClick?: () => void;
};

const LANDING_SECTIONS = [
  { id: "features", label: "Product Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "compliance", label: "Compliance (UAE & KSA VAT)" },
  { id: "case-studies", label: "Case Studies" },
  { id: "pricing", label: "Pricing" },
];

/** Highlights the nav item whose section is currently in view on the landing page. */
const useActiveSection = (ids: string[], enabled: boolean) => {
  const [activeId, setActiveId] = useState<string>(ids[0]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids.join("|")]);

  return activeId;
};

const HeaderNav = ({ variant = "default" }: HeaderNavProps) => {
  const isLanding = variant === "landing";
  const { navigateToSection } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const activeSectionId = useActiveSection(
    LANDING_SECTIONS.map((section) => section.id),
    isLanding,
  );

  const defaultItems: NavItem[] = [
    { link: PATH_PAGES.root, label: "Home" },
    { link: PATH_PAGES.about, label: "About Us" },
    { link: PATH_PAGES.services, label: "Services" },
    {
      link: PATH_PAGES.root,
      label: "Pricing",
      onClick: () => navigateToSection("pricing", "/"),
    },
    { link: PATH_PAGES.privacy, label: "Privacy" },
    { link: PATH_PAGES.terms, label: "Terms" },
    { link: PATH_PAGES.contact, label: "Contact" },
  ];

  const landingItems: NavItem[] = LANDING_SECTIONS.map((section) => ({
    link: PATH_PAGES.root,
    label: section.label,
    sectionId: section.id,
    onClick: () => navigateToSection(section.id, PATH_PAGES.root),
  }));

  const items = isLanding ? landingItems : defaultItems;

  const isActive = (item: NavItem) =>
    item.sectionId
      ? item.sectionId === activeSectionId
      : !item.onClick && location.pathname === item.link;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderLinks = (onNavigate?: () => void) =>
    items.map((item, index) => (
      <a
        key={`${item.label}-${index}`}
        href={item.link || "#"}
        className={classes.link}
        data-active={isActive(item) || undefined}
        aria-current={isActive(item) && !item.sectionId ? "page" : undefined}
        onClick={(e) => {
          e.preventDefault();
          onNavigate?.();
          if (item.onClick) {
            item.onClick();
          } else {
            window.location.href = item.link;
          }
        }}
      >
        {item.label}
      </a>
    ));

  const renderActions = () => (
    <>
      {!isAuthenticated && (
        <Link
          to={PATH_AUTH.signin}
          className={classes.signIn}
          onClick={closeDrawer}
        >
          {isLanding ? "Sign In" : "Sign in \u2192"}
        </Link>
      )}
      {isAuthenticated && (
        <button
          type="button"
          className={classes.signIn}
          onClick={() => {
            closeDrawer();
            handleLogout();
          }}
        >
          Logout
        </button>
      )}
      {isLanding && (
        <Link
          to={PATH_AUTH.signup}
          className={classes.cta}
          onClick={closeDrawer}
        >
          Start Free Trial
        </Link>
      )}
    </>
  );

  return (
    <div className={`${classes.header} ${classes[variant]}`}>
      {isLanding && (
        <div className={classes.announcement}>
          <div className={classes.announcementInner}>
            <span className={classes.announcementBadge}>NEW</span>
            <span className={classes.announcementText}>
              Certified Amazon SP-API Partner for UAE (FTA) &amp; Saudi Arabia
              (ZATCA Phase 2) &mdash; Explore New E-Invoicing Updates
            </span>
            <button
              type="button"
              className={classes.announcementArrow}
              aria-label="Explore compliance details"
              onClick={() => navigateToSection("compliance", PATH_PAGES.root)}
            >
              &rarr;
            </button>
          </div>
        </div>
      )}

      <div className={classes.bar}>
        <div className={classes.inner}>
          <Wordmark
            to={PATH_PAGES.root}
            tone={isLanding ? "onLight" : "onDark"}
            tagline={isLanding ? "MENA SP-API PARTNER" : "LEAD WITH INTELLIGENCE"}
          />

          <nav className={classes.nav} aria-label="Primary">
            {renderLinks()}
          </nav>

          <div className={classes.actions}>{renderActions()}</div>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            color={isLanding ? "var(--ra-color-surface-inverse)" : "white"}
            size="sm"
            className={classes.burger}
            aria-label={drawerOpened ? "Close navigation" : "Open navigation"}
          />
        </div>
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        zIndex={1000}
        title={
          <Wordmark
            to={PATH_PAGES.root}
            tone={isLanding ? "onLight" : "onDark"}
            tagline={isLanding ? "MENA SP-API PARTNER" : "LEAD WITH INTELLIGENCE"}
          />
        }
        classNames={{
          content: `${classes.drawerContent} ${classes[variant]}`,
          header: classes.drawerHeader,
          close: classes.drawerClose,
        }}
      >
        <nav className={classes.drawerNav} aria-label="Mobile">
          {renderLinks(closeDrawer)}
          <div className={classes.drawerActions}>{renderActions()}</div>
        </nav>
      </Drawer>
    </div>
  );
};

export default HeaderNav;
