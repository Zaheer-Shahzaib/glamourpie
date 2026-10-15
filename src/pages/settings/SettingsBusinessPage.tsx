import { useState, useEffect } from "react";
import { Button, TextInput, Select, Skeleton } from "@mantine/core";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import { AppCard, PageHeader, appButton } from "../../Components/AppUi";
import {
  fetchSellerSettings,
  updateSellerSettings,
} from "../../Services/settings-services";
import classes from "./Settings.module.scss";

export default function SettingsBusinessPage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    businessName: "",
    taxId: "",
    businessType: "company" as "individual" | "company" | "partnership",
  });

  // Load saved settings from backend on mount
  useEffect(() => {
    if (!token) return;
    fetchSellerSettings(token)
      .then((data: any) => {
        const info = data?.data?.businessInfo || {};
        setSettings({
          businessName: info.businessName || "",
          taxId: info.taxId || "",
          businessType: info.businessType || "company",
        });
      })
      .catch((err: any) => {
        console.warn("Could not load business settings:", err?.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSellerSettings(token!, {
        businessInfo: {
          businessName: settings.businessName,
          businessType: settings.businessType,
          taxId: settings.taxId,
        },
      });
      notifications.show({
        title: "Success",
        message: "Business information saved",
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

  return (
    <MainLayout>
      <PageHeader
        title="Settings"
        subtitle="Track and manage marketplace activity."
      />
      <AppCard className={classes.panel}>
        <h2 className={classes.pageCardTitle}>Business information</h2>
        <p className={classes.pageCardSubtitle}>
          These details appear on generated invoices.
        </p>
        <hr className={classes.pageCardRule} />

        {loading ? (
          <div className={classes.fieldGrid}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={42} radius="sm" />
            ))}
          </div>
        ) : (
          <div className={classes.fieldGrid}>
            <TextInput
              label="Business name"
              placeholder="Enter business name"
              value={settings.businessName}
              onChange={(e) =>
                setSettings({ ...settings, businessName: e.target.value })
              }
              required
            />

            <Select
              label="Business type"
              value={settings.businessType}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  businessType: value as
                    | "individual"
                    | "company"
                    | "partnership",
                })
              }
              data={[
                { value: "individual", label: "Individual" },
                { value: "company", label: "Company" },
                { value: "partnership", label: "Partnership" },
              ]}
              allowDeselect={false}
            />

            <TextInput
              label="TRN / Tax ID"
              placeholder="Enter tax registration number"
              value={settings.taxId}
              onChange={(e) =>
                setSettings({ ...settings, taxId: e.target.value })
              }
            />

            {/* Address details are not stored by the backend yet. */}
            <TextInput
              label="Street address"
              placeholder="Coming soon"
              disabled
            />
            <TextInput label="City" placeholder="Coming soon" disabled />
            <Select
              label="Country"
              placeholder="Coming soon"
              data={[]}
              disabled
            />
          </div>
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
    </MainLayout>
  );
}
