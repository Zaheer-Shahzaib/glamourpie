import { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  Select,
  Switch,
  NumberInput,
  Skeleton,
} from "@mantine/core";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import {
  AppCard,
  PageHeader,
  StatusPill,
  appButton,
} from "../../Components/AppUi";
import {
  fetchSellerSettings,
  updateSellerSettings,
} from "../../Services/settings-services";
import classes from "./Settings.module.scss";

const switchClassNames = {
  root: classes.switchRoot,
  body: classes.switchBody,
  labelWrapper: classes.switchLabelWrap,
};

export default function SettingsInvoicesPage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    autoGenerateInvoices: false,
    invoicePrefix: "INV",
    includeVAT: true,
    vatRate: 5,
    invoiceTemplate: "simple" as "simple" | "premium",
    autoUploadToAmazon: false,
  });

  // Load saved settings from backend on mount
  useEffect(() => {
    if (!token) return;
    fetchSellerSettings(token)
      .then((data: any) => {
        const inv = data?.data?.invoiceSettings || {};
        setSettings((prev) => ({
          ...prev,
          invoicePrefix: inv.invoicePrefix ?? "INV",
          autoGenerateInvoices: inv.autoGenerateInvoices ?? false,
          autoUploadToAmazon: inv.autoUploadToAmazon ?? false,
          includeVAT: inv.includeVAT ?? false,
          vatRate: inv.vatRate ?? 5,
          invoiceTemplate: inv.invoiceTemplate ?? "simple",
        }));
      })
      .catch((err: any) => {
        console.warn("Could not load invoice settings:", err?.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSellerSettings(token!, {
        invoiceSettings: {
          invoicePrefix: settings.invoicePrefix,
          autoGenerateInvoices: settings.autoGenerateInvoices,
          autoUploadToAmazon: settings.autoUploadToAmazon,
          includeVAT: settings.includeVAT,
          vatRate: settings.vatRate,
          invoiceTemplate: settings.invoiceTemplate,
        },
      });
      notifications.show({
        title: "Success",
        message: "Invoice settings saved",
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

  const prefix = settings.invoicePrefix || "INV";
  const sampleNumber = `${prefix}-${new Date().getFullYear()}-0001`;

  return (
    <MainLayout>
      <PageHeader
        title="Invoice settings"
        subtitle="Configure invoice generation, VAT, and Amazon submission preferences."
      />

      <div className={classes.twoCol}>
        <AppCard className={classes.panel}>
          {loading ? (
            <>
              <Skeleton height={24} radius="sm" mb="md" />
              <Skeleton height={48} radius="sm" mb="md" />
              <Skeleton height={48} radius="sm" mb="md" />
              <Skeleton height={42} radius="sm" mb="md" />
              <Skeleton height={42} radius="sm" />
            </>
          ) : (
            <>
              <h2 className={classes.sectionTitle}>Automation</h2>

              <div className={classes.switchRow}>
                <Switch
                  classNames={switchClassNames}
                  labelPosition="left"
                  label="Auto-generate invoices for new orders"
                  description="Create PDF invoices automatically after an order ships (checked every 30 minutes)."
                  checked={settings.autoGenerateInvoices}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoGenerateInvoices: e.currentTarget.checked,
                    })
                  }
                />
              </div>

              <div className={classes.switchRow}>
                <Switch
                  classNames={switchClassNames}
                  labelPosition="left"
                  label="Auto-upload invoices to Amazon"
                  description="Submit generated invoices through the Feeds API."
                  checked={settings.autoUploadToAmazon}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoUploadToAmazon: e.currentTarget.checked,
                    })
                  }
                />
              </div>

              <h2 className={`${classes.sectionTitle} ${classes.sectionGap}`}>
                Invoice identity
              </h2>

              <div className={classes.fieldGrid}>
                <TextInput
                  label="Invoice prefix"
                  placeholder="e.g., GP or INV"
                  value={settings.invoicePrefix}
                  onChange={(e) =>
                    setSettings({ ...settings, invoicePrefix: e.target.value })
                  }
                  maxLength={20}
                />
                <Select
                  label="Invoice template"
                  value={settings.invoiceTemplate}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      invoiceTemplate: value as "simple" | "premium",
                    })
                  }
                  data={[
                    { value: "simple", label: "Simple template" },
                    {
                      value: "premium",
                      label: "Premium template",
                      disabled: true,
                    },
                  ]}
                  allowDeselect={false}
                />

                <div className={classes.fullWidth}>
                  <Switch
                    classNames={switchClassNames}
                    labelPosition="left"
                    label="Include VAT in invoices"
                    checked={settings.includeVAT}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        includeVAT: e.currentTarget.checked,
                      })
                    }
                  />
                </div>

                {settings.includeVAT && (
                  <NumberInput
                    label="VAT rate (%)"
                    placeholder="Enter VAT rate"
                    value={settings.vatRate}
                    onChange={(value) =>
                      setSettings({ ...settings, vatRate: Number(value) })
                    }
                    min={0}
                    max={100}
                    step={0.1}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                )}
                <TextInput
                  label="Currency"
                  value="Per marketplace"
                  description="Invoices use each order's marketplace currency"
                  disabled
                />
              </div>

              <p className={classes.note}>
                Invoice numbers will be formatted as {sampleNumber}.
              </p>
            </>
          )}

          <div className={classes.footer}>
            <Button
              className={appButton("primary")}
              onClick={handleSave}
              loading={saving}
              disabled={loading}
            >
              Save settings
            </Button>
          </div>
        </AppCard>

        {/* ── Live preview ─────────────────────────────────── */}
        <AppCard tone="dark" className={classes.preview}>
          <h2 className={classes.previewTitle}>Live preview</h2>
          <p className={classes.previewSub}>Generated invoice</p>

          <div className={classes.sheet}>
            <span className={classes.sheetBrand}>RUNANALYTIC</span>
            <span className={classes.sheetTitle}>
              {settings.includeVAT ? "TAX INVOICE" : "INVOICE"}
            </span>
            <div className={classes.sheetRow}>
              <span>Invoice number</span>
              <span>{sampleNumber}</span>
            </div>
            <div className={classes.sheetDivider} />
            <div className={classes.sheetRow}>
              <span>Order</span>
              <span className={classes.sheetOrder}>#401-8821</span>
            </div>
            <div className={classes.sheetRow}>
              <span>Total</span>
              <span className={classes.sheetTotal}>249.00</span>
            </div>
            {settings.includeVAT && (
              <div>
                <StatusPill tone="info">
                  {`VAT ${settings.vatRate ?? 0}% INCLUDED`}
                </StatusPill>
              </div>
            )}
          </div>
        </AppCard>
      </div>
    </MainLayout>
  );
}
