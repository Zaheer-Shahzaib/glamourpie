import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Select, Skeleton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import { AMAZON_MARKETPLACES, CURRENCIES } from "../../constants/marketplaces";
import {
  fetchSellerSettings,
  updateSellerSettings,
} from "../../Services/settings-services";
import { findMarketplace, useSellerStatus } from "../../hooks/useSellerStatus";
import {
  AppCard,
  CardHeader,
  PageHeader,
  StatusPill,
  appButton,
} from "../../Components/AppUi";
import { PATH_APPS } from "../../routes";
import settingsClasses from "./Settings.module.scss";
import classes from "./Marketplace.module.scss";

const CONNECT_PATH = "/connect-amazon";

/** Seller account statuses that mean the connection needs to be re-authorised. */
const BROKEN_STATUSES = new Set([
  "revoked",
  "expired",
  "error",
  "failed",
  "inactive",
  "disconnected",
]);

export default function SettingsMarketplacePage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const { data: sellerStatus, isLoading: statusLoading } = useSellerStatus();

  const [settings, setSettings] = useState({
    primaryMarketplace: "amazon.ae",
    defaultCurrency: "AED",
    defaultLanguage: "en",
  });

  useEffect(() => {
    if (!token) return;
    fetchSellerSettings(token)
      .then((data: any) => {
        const mp = data?.data?.marketplaceSettings || {};
        setSettings((prev) => ({
          ...prev,
          primaryMarketplace: mp.primaryMarketplace ?? "amazon.ae",
          defaultCurrency: mp.defaultCurrency ?? "AED",
          defaultLanguage: mp.defaultLanguage ?? "en",
        }));
      })
      .catch((err: any) => {
        console.warn("Could not load marketplace settings:", err?.message);
      });
  }, [token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSellerSettings(token!, {
        marketplaceSettings: {
          primaryMarketplace: settings.primaryMarketplace,
          defaultCurrency: settings.defaultCurrency,
          defaultLanguage: settings.defaultLanguage,
        },
      });
      notifications.show({
        title: "Success",
        message: "Marketplace settings saved",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to save settings",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const isConnected = Boolean(sellerStatus?.isConnected);
  const seller = sellerStatus?.seller;
  const connectedMarketplace = findMarketplace(seller?.marketplace);
  const needsAttention =
    isConnected && BROKEN_STATUSES.has(String(seller?.status || "").toLowerCase());

  return (
    <MainLayout>
      <PageHeader
        title="Marketplace connections"
        subtitle="Manage connected Amazon marketplaces and synchronization health."
        actions={
          <Button
            className={appButton("primary")}
            component={Link}
            to={CONNECT_PATH}
            rightSection={<IconPlus size={14} />}
          >
            Connect marketplace
          </Button>
        }
      />

      {/* ── Connections ──────────────────────────────────────── */}
      <div className={classes.list}>
        {statusLoading ? (
          <>
            <Skeleton height={80} radius="md" />
            <Skeleton height={80} radius="md" />
          </>
        ) : (
          AMAZON_MARKETPLACES.map((marketplace) => {
            const connected =
              isConnected && connectedMarketplace?.id === marketplace.id;
            const attention = connected && needsAttention;
            return (
              <AppCard key={marketplace.id} className={classes.row}>
                <span className={classes.flag} aria-hidden="true">
                  {marketplace.flag}
                </span>
                <div className={classes.rowText}>
                  <span className={classes.rowName}>
                    Amazon {marketplace.name}
                  </span>
                  <span className={classes.rowMeta}>{marketplace.domain}</span>
                </div>
                <div className={classes.rowStatus}>
                  {connected ? (
                    <>
                      <StatusPill tone={attention ? "info" : "success"}>
                        {attention ? "Needs attention" : "Connected"}
                      </StatusPill>
                      <span className={classes.rowMeta}>
                        {attention
                          ? "Reconnect required"
                          : seller?.sellerId
                            ? `Seller ID ${seller.sellerId}`
                            : "Connected"}
                      </span>
                    </>
                  ) : (
                    <>
                      <StatusPill tone="neutral">Not connected</StatusPill>
                      <span className={classes.rowMeta}>
                        {marketplace.currency} · {marketplace.region}
                      </span>
                    </>
                  )}
                </div>
                {connected && !attention ? (
                  <Button
                    className={appButton("light")}
                    component={Link}
                    to={PATH_APPS.settings.spApi}
                  >
                    Manage
                  </Button>
                ) : (
                  <Button
                    className={appButton(attention ? "primary" : "light")}
                    component={Link}
                    to={CONNECT_PATH}
                  >
                    {attention ? "Reconnect" : "Connect"}
                  </Button>
                )}
              </AppCard>
            );
          })
        )}
      </div>

      {/* ── Preferences (existing settings form) ─────────────── */}
      <AppCard className={classes.prefs}>
        <CardHeader
          title="Marketplace preferences"
          subtitle="Defaults used when new orders and invoices are created"
        />
        <div className={settingsClasses.fieldGrid}>
          <Select
            label="Primary marketplace"
            placeholder="Select primary marketplace"
            value={settings.primaryMarketplace}
            onChange={(value) =>
              setSettings({ ...settings, primaryMarketplace: value || "" })
            }
            data={AMAZON_MARKETPLACES.map((marketplace) => ({
              value: marketplace.domain,
              label: marketplace.name,
            }))}
          />
          <Select
            label="Default currency"
            placeholder="Select default currency"
            value={settings.defaultCurrency}
            onChange={(value) =>
              setSettings({ ...settings, defaultCurrency: value || "" })
            }
            data={CURRENCIES.map((currency) => ({
              value: currency.value,
              label: currency.label,
            }))}
          />
          <Select
            label="Default language"
            placeholder="Select default language"
            value={settings.defaultLanguage}
            onChange={(value) =>
              setSettings({ ...settings, defaultLanguage: value || "" })
            }
            data={[
              { value: "en", label: "English" },
              { value: "ar", label: "Arabic" },
            ]}
          />
        </div>
        <div className={settingsClasses.footer}>
          <Button
            className={appButton("primary")}
            onClick={handleSave}
            loading={saving}
          >
            Save settings
          </Button>
        </div>
      </AppCard>

      {/* ── SP-API sync panel ────────────────────────────────── */}
      <AppCard tone="dark" className={classes.sync}>
        <div>
          <h2 className={classes.syncTitle}>SP-API synchronization</h2>
          <p className={classes.syncText}>
            All marketplace data remains separated by marketplace context.
          </p>
        </div>
        <div className={classes.syncActions}>
          <StatusPill
            tone={isConnected && !needsAttention ? "success" : "warning"}
            className={classes.upper}
          >
            {isConnected
              ? needsAttention
                ? "Needs attention"
                : "SP-API connected"
              : "Not connected"}
          </StatusPill>
          <Link to={PATH_APPS.settings.spApi} className={classes.syncLink}>
            Manage SP-API →
          </Link>
        </div>
      </AppCard>
    </MainLayout>
  );
}
