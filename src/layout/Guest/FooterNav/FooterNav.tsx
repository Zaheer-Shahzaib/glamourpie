import { Link } from "react-router-dom";
import { PATH_APPS, PATH_DASHBOARD, PATH_PAGES } from "../../../routes/index";
import { useScroll } from "../../../Context/scrollContext";
import Wordmark from "../../../Components/Brand/Wordmark";
import type { GuestVariant } from "../HeaderNav/HeaderNav";
import classes from "./FooterNav.module.scss";

type FooterNavProps = {
  variant?: GuestVariant;
};

type FooterLink = {
  label: string;
  /** Internal route */
  to?: string;
  /** In-page section on the home page */
  sectionId?: string;
  /** External / mailto / tel link */
  href?: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const SUPPORT_EMAIL = "support@runanalytic.com";
const SUPPORT_EMAIL_LINK = `https://mail.google.com/mail/?view=cm&to=${SUPPORT_EMAIL}`;
const SUPPORT_PHONE = "+971543858251";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/* ------------------------------------------------------------------ */
/* Default (dark) footer – legal / informational pages                 */
/* ------------------------------------------------------------------ */

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", to: PATH_DASHBOARD.default },
      { label: "Orders", to: PATH_APPS.orders },
      { label: "Invoices", to: PATH_APPS.invoices.root },
      { label: "Analytics", to: PATH_APPS.analytics },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: PATH_PAGES.about },
      { label: "Contact", to: PATH_PAGES.contact },
      { label: "Privacy Policy", to: PATH_PAGES.privacy },
      { label: "Terms & Conditions", to: PATH_PAGES.terms },
      { label: "Amazon Data Protection Policy", to: PATH_PAGES.addp },
    ],
  },
];

const DefaultFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={`${classes.footer} ${classes.default}`}>
      <div className={classes.inner}>
        <div className={classes.defaultGrid}>
          <div className={classes.brandBlock}>
            <Wordmark to={PATH_PAGES.root} tone="onDark" />
            <p className={classes.defaultTagline}>
              Amazon seller operations, made clear.
            </p>
            <p className={classes.defaultDescription}>
              Automate orders, invoices, and reporting with a trusted workspace
              built for marketplace teams.
            </p>
          </div>

          {DEFAULT_COLUMNS.map((column) => (
            <nav
              key={column.title}
              className={classes.column}
              aria-label={column.title}
            >
              <h2 className={classes.columnTitle}>{column.title}</h2>
              <ul className={classes.linkList}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to as string}
                      className={classes.link}
                      onClick={scrollToTop}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={classes.column}>
            <h2 className={classes.columnTitle}>Support</h2>
            <ul className={classes.linkList}>
              <li>
                <a
                  href={SUPPORT_EMAIL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`tel:${SUPPORT_PHONE}`} className={classes.link}>
                  UAE &middot; +971 54 385 8251
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={classes.bottomRow}>
          <p>
            &copy; {year} RunAnalytic Technology. All rights reserved.
          </p>
          <p>
            Amazon seller data is handled securely and only for the services you
            request.
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/* Landing (light) footer – home page                                  */
/* ------------------------------------------------------------------ */

const LANDING_COLUMNS: FooterColumn[] = [
  {
    title: "PRODUCT",
    links: [
      { label: "SP-API Settlement Sync", sectionId: "features" },
      { label: "Automated E-Invoicing", sectionId: "features" },
      { label: "ZATCA Phase 2 XML Stamping", sectionId: "compliance" },
      { label: "FTA Tax Ledger Audit", sectionId: "compliance" },
      { label: "Pricing Calculator", sectionId: "calculator" },
    ],
  },
  {
    title: "COMPLIANCE",
    links: [
      { label: "ZATCA Integration Guide" },
      { label: "UAE FTA Executive Regulations" },
      { label: "GCC Cross-Border VAT Rules" },
      { label: "Amazon FBA Tax Engine" },
      { label: "Cryptographic Stamp Vault" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "API Reference" },
      { label: "Seller Case Studies", sectionId: "case-studies" },
      { label: "Onboarding Walkthrough" },
      { label: "SDK & Webhooks" },
      { label: "Status Dashboard" },
    ],
  },
  {
    title: "LEGAL & SECURITY",
    links: [
      { label: "Privacy Policy", to: PATH_PAGES.privacy },
      { label: "Terms of Service", to: PATH_PAGES.terms },
      { label: "SP-API Security Policy", to: PATH_PAGES.addp },
      { label: "SOC 2 Type II" },
      { label: "GDPR Transparency" },
    ],
  },
];

const LandingFooter = () => {
  const year = new Date().getFullYear();
  const { navigateToSection } = useScroll();

  const renderLink = (link: FooterLink) => {
    if (link.to) {
      return (
        <Link to={link.to} className={classes.link} onClick={scrollToTop}>
          {link.label}
        </Link>
      );
    }
    if (link.sectionId) {
      const sectionId = link.sectionId;
      return (
        <button
          type="button"
          className={`${classes.link} ${classes.linkButton}`}
          onClick={() => navigateToSection(sectionId, PATH_PAGES.root)}
        >
          {link.label}
        </button>
      );
    }
    return <span className={classes.plainItem}>{link.label}</span>;
  };

  return (
    <footer className={`${classes.footer} ${classes.landing}`}>
      <div className={classes.inner}>
        <div className={classes.landingGrid}>
          <div className={classes.brandBlock}>
            <Wordmark
              to={PATH_PAGES.root}
              tone="onLight"
              tagline="MENA SP-API PARTNER"
            />
            <p className={classes.landingDescription}>
              Enterprise fiscal compliance, cryptographic stamping, and SP-API
              VAT reconciliation for multi-brand Amazon sellers across the UAE
              and Saudi Arabia.
            </p>
            <div className={classes.chips}>
              <span className={classes.chip}>UAE (AED) Gateway</span>
              <span className={classes.chip}>KSA (SAR) Gateway</span>
            </div>
          </div>

          {LANDING_COLUMNS.map((column) => (
            <nav
              key={column.title}
              className={classes.column}
              aria-label={column.title}
            >
              <h2 className={classes.columnTitle}>{column.title}</h2>
              <ul className={classes.linkList}>
                {column.links.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={classes.bottomRow}>
          <p className={classes.accreditations}>
            <span>&#10003; ISO 27001 Certified</span>
            <span>&#10003; AWS ME-Central (UAE)</span>
            <span>&#10003; ZATCA Cryptographic Stamped</span>
          </p>
          <p>
            &copy; {year} RunAnalytic Inc. All rights reserved. Designed for GCC
            e-commerce sellers.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterNav = ({ variant = "default" }: FooterNavProps) =>
  variant === "landing" ? <LandingFooter /> : <DefaultFooter />;

export default FooterNav;
