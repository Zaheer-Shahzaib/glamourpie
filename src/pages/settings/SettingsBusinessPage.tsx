import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Divider,
  Skeleton,
} from "@mantine/core";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import { fetchSellerSettings, updateSellerSettings } from "../../Services/settings-services";

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
          taxId:        info.taxId        || "",
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
          taxId:        settings.taxId,
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
      <Container size="lg" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Title order={3}>Business Information</Title>
              <Text size="sm" c="dimmed">
                Configure your business details — these appear on generated invoices.
              </Text>
            </div>

            <Divider />

            {loading ? (
              <>
                <Skeleton height={36} radius="sm" />
                <Skeleton height={36} radius="sm" />
                <Skeleton height={36} radius="sm" />
              </>
            ) : (
              <>
                <TextInput
                  label="Business Name"
                  placeholder="Enter business name"
                  value={settings.businessName}
                  onChange={(e) =>
                    setSettings({ ...settings, businessName: e.target.value })
                  }
                  required
                  size="sm"
                />

                <Select
                  label="Business Type"
                  value={settings.businessType}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      businessType: value as "individual" | "company" | "partnership",
                    })
                  }
                  data={[
                    { value: "individual", label: "Individual" },
                    { value: "company", label: "Company" },
                    { value: "partnership", label: "Partnership" },
                  ]}
                  size="sm"
                />

                <TextInput
                  label="TRN / Tax ID"
                  placeholder="Enter tax registration number"
                  value={settings.taxId}
                  onChange={(e) =>
                    setSettings({ ...settings, taxId: e.target.value })
                  }
                  size="sm"
                />
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button onClick={handleSave} loading={saving} disabled={loading}>
                Save Settings
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </MainLayout>
  );
}
