import { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Select,
  Divider,
} from "@mantine/core";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import { AMAZON_MARKETPLACES, CURRENCIES } from "../../constants/marketplaces";

export default function SettingsMarketplacePage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    primaryMarketplace: "amazon.ae",
    defaultCurrency: "AED",
    defaultLanguage: "en",
  });

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notifications.show({
        title: "Success",
        message: "Marketplace settings saved",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save settings",
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
              <Title order={3}>Marketplace Settings</Title>
              <Text size="sm" c="dimmed">
                Configure your marketplace preferences
              </Text>
            </div>

            <Divider />

            <Select
              label="Primary Marketplace"
              placeholder="Select primary marketplace"
              value={settings.primaryMarketplace}
              onChange={(value) =>
                setSettings({ ...settings, primaryMarketplace: value || "" })
              }
              data={AMAZON_MARKETPLACES.map((marketplace) => ({
                value: marketplace.id,
                label: marketplace.name,
              }))}
              size="sm"
            />

            <Select
              label="Default Currency"
              placeholder="Select default currency"
              value={settings.defaultCurrency}
              onChange={(value) =>
                setSettings({ ...settings, defaultCurrency: value || "" })
              }
              data={CURRENCIES.map((currency) => ({
                value: currency.value,
                label: currency.label,
              }))}
              size="sm"
            />

            <Select
              label="Default Language"
              placeholder="Select default language"
              value={settings.defaultLanguage}
              onChange={(value) =>
                setSettings({ ...settings, defaultLanguage: value || "" })
              }
              data={[
                { value: "en", label: "English" },
                { value: "ar", label: "Arabic" },
              ]}
              size="sm"
            />

            <Group justify="flex-end" mt="md">
              <Button onClick={handleSave} loading={saving}>
                Save Settings
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </MainLayout>
  );
}
