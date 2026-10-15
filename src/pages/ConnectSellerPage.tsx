import React, { useState, useEffect } from "react";
import { Select, Checkbox, LoadingOverlay, Alert } from "@mantine/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { AMAZON_MARKETPLACES } from "../constants/marketplaces";
import { getAmazonAuthUrl } from "../Services/spapi-services";
import { IconAlertCircle } from "@tabler/icons-react";
import Wordmark from "../Components/Brand/Wordmark";
import { PATH_PAGES } from "../routes";
import classes from "./ConnectSellerPage.module.scss";

const ConnectSellerPage: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for selections
  const [selectedMarketplaceDomain, setSelectedMarketplaceDomain] = useState<
    string | null
  >("amazon.ae");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
    "AED",
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Parse error from URL if redirected back from Amazon with failure
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("amazon_auth") === "error") {
      setError(
        "Amazon authorization failed. Please try again or check your account permissions.",
      );
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/authentication/signin");
  };
  // Handle marketplace change (auto-update currency)
  const handleMarketplaceChange = (domain: string | null) => {
    setSelectedMarketplaceDomain(domain);
    const marketplace = AMAZON_MARKETPLACES.find((m) => m.domain === domain);
    if (marketplace) {
      setSelectedCurrency(marketplace.currency);
    }
  };

  const handleConnect = async () => {
    if (!selectedMarketplaceDomain || !selectedCurrency || !termsAccepted)
      return;

    setLoading(true);
    setError(null);

    const marketplace = AMAZON_MARKETPLACES.find(
      (m) => m.domain === selectedMarketplaceDomain,
    )!;
    console.log("marketplace", marketplace);
    console.log("selectedMarketplaceDomain", selectedMarketplaceDomain);
    console.log("selectedCurrency", selectedCurrency);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await getAmazonAuthUrl(token, {
        marketplace: marketplace.domain,
        currency: selectedCurrency,
        region: marketplace.region,
      });

      if (response.success && response.url) {
        // Redirect to Amazon
        window.location.href = response.url;
      } else {
        setError("Failed to generate Amazon authorization link.");
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while connecting to Amazon.",
      );
    } finally {
      setLoading(false);
    }
  };

  const marketplaceData = React.useMemo(() => {
    return (AMAZON_MARKETPLACES || []).map((m) => ({
      value: m.domain,
      label: `${m.flag} ${m.name} (${m.domain})`,
      // group: m.region === 'EU' ? 'Europe & Middle East' : 'North America'
    }));
  }, []);

  const currencyData = React.useMemo(() => {
    const currencies = (AMAZON_MARKETPLACES || []).map((m) => m.currency);
    return Array.from(new Set(currencies)).map((c) => ({
      value: c,
      label: c,
    }));
  }, []);

  const selectClassNames = {
    label: classes.label,
    input: classes.input,
    section: classes.section,
  };

  return (
    <main className={classes.page}>
      <div className={classes.strip} aria-hidden="true" />

      <header className={classes.header}>
        <Wordmark tone="onLight" />
        <h1 className={classes.title}>Connect your Amazon seller account</h1>
        <p className={classes.lead}>
          Choose your first marketplace to start using SellerCenter.
        </p>
      </header>

      <section className={classes.card} aria-labelledby="connect-card-title">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <h2 id="connect-card-title" className={classes.cardTitle}>
          Marketplace connection
        </h2>

        <div className={classes.form}>
          {error && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Connection Error"
              color="red"
              role="alert"
            >
              {error}
            </Alert>
          )}

          <Select
            label="Primary marketplace"
            placeholder="Pick a marketplace"
            data={marketplaceData || []}
            value={selectedMarketplaceDomain}
            onChange={handleMarketplaceChange}
            searchable
            size="md"
            allowDeselect={false}
            classNames={selectClassNames}
          />

          <Select
            label="Primary currency"
            placeholder="Pick a currency"
            data={currencyData || []}
            value={selectedCurrency}
            onChange={handleMarketplaceChange}
            size="md"
            allowDeselect={false}
            classNames={selectClassNames}
          />

          <div className={classes.checks}>
            <Checkbox
              size="18px"
              radius="4px"
              color="var(--ra-color-brand)"
              classNames={{ input: classes.checkInput, label: classes.checkLabel }}
              label={
                <>
                  I have read and accepted the RunAnalytic{" "}
                  <Link
                    to={PATH_PAGES.terms}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.inlineLink}
                  >
                    Terms &amp; Conditions
                  </Link>
                </>
              }
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.currentTarget.checked)}
            />
            <Checkbox
              size="18px"
              radius="4px"
              color="var(--ra-color-brand)"
              classNames={{ input: classes.checkInput, label: classes.checkLabel }}
              label="Send me important product updates"
              checked={newsletterSubscribed}
              onChange={(event) =>
                setNewsletterSubscribed(event.currentTarget.checked)
              }
            />
          </div>

          <button
            type="button"
            className={classes.submit}
            onClick={handleConnect}
            disabled={!termsAccepted || !selectedMarketplaceDomain}
          >
            Connect to Seller Central
            <span aria-hidden="true">&#8599;</span>
          </button>
        </div>

        <p className={classes.note}>
          Your marketplace data stays protected and you can add more
          marketplaces later from Settings.
        </p>
      </section>

      <p className={classes.switch}>
        <span>Looking for another account?</span>
        <button
          type="button"
          className={classes.switchAction}
          onClick={handleLogout}
        >
          Log out
        </button>
      </p>

      <p className={classes.footer}>
        RunAnalytic securely connects to Amazon through authorized marketplace
        permissions.
      </p>
    </main>
  );
};

export default ConnectSellerPage;
