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
  Switch,
  NumberInput,
  Divider,
  Skeleton,
  Alert,
  FileButton,
  Image,
} from "@mantine/core";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import MainLayout from "../../layout/Main";
import {
  deleteInvoiceLetterhead,
  fetchSellerSettings,
  updateSellerSettings,
  uploadInvoiceLetterhead,
} from "../../Services/settings-services";
import { getAvatarUrl } from "../../utils/helperFunctions";

export default function SettingsInvoicesPage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLetterhead, setUploadingLetterhead] = useState(false);

  const [settings, setSettings] = useState({
    autoGenerateInvoices: false,
    invoicePrefix: "INV",
    includeVAT: false,
    vatRate: 5,
    invoiceTemplate: "simple" as "simple" | "premium",
    autoUploadToAmazon: false,
    letterheadUrl: null as string | null,
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
          letterheadUrl: inv.letterheadUrl ?? null,
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

  const handleLetterheadUpload = async (file: File | null) => {
    if (!file || !token) return;

    const allowed = /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i;
    if (!allowed.test(file.name)) {
      notifications.show({
        title: "Invalid file",
        message: "Please upload a PNG, JPEG, BMP, GIF, WebP, or TIFF image",
        color: "red",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: "File too large",
        message: "Letterhead images must be 5 MB or smaller",
        color: "red",
      });
      return;
    }

    try {
      setUploadingLetterhead(true);
      const response = await uploadInvoiceLetterhead(token, file);
      setSettings((prev) => ({
        ...prev,
        letterheadUrl: response?.data?.letterheadUrl || null,
      }));
      notifications.show({
        title: "Success",
        message: response.message || "Letterhead uploaded",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message || "Failed to upload letterhead",
        color: "red",
      });
    } finally {
      setUploadingLetterhead(false);
    }
  };

  const handleLetterheadDelete = async () => {
    if (!token) return;
    try {
      setUploadingLetterhead(true);
      await deleteInvoiceLetterhead(token);
      setSettings((prev) => ({ ...prev, letterheadUrl: null }));
      notifications.show({
        title: "Success",
        message: "Letterhead removed",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message || "Failed to remove letterhead",
        color: "red",
      });
    } finally {
      setUploadingLetterhead(false);
    }
  };

  return (
    <MainLayout>
      <Container size="lg" py="xl">
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Title order={3}>Invoice Settings</Title>
              <Text size="sm" c="dimmed">
                Configure invoice generation preferences
              </Text>
            </div>

            <Divider />

            {loading ? (
              <>
                <Skeleton height={24} radius="sm" />
                <Skeleton height={24} radius="sm" />
                <Skeleton height={36} radius="sm" />
                <Skeleton height={36} radius="sm" />
              </>
            ) : (
              <>
                <Switch
                  label="Auto-generate invoices for new orders"
                  description="Automatically create PDFs every 30 minutes for newly shipped orders"
                  checked={settings.autoGenerateInvoices}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoGenerateInvoices: e.currentTarget.checked,
                    })
                  }
                />

                <Switch
                  label="Auto-upload invoices to Amazon"
                  description="Automatically submit generated invoices to Amazon via the Feeds API"
                  checked={settings.autoUploadToAmazon}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoUploadToAmazon: e.currentTarget.checked,
                    })
                  }
                />

                <TextInput
                  label="Invoice Prefix"
                  description={`Invoice numbers will be formatted as: ${settings.invoicePrefix || "INV"}-2026-0001`}
                  placeholder="e.g., GP or INV"
                  value={settings.invoicePrefix}
                  onChange={(e) =>
                    setSettings({ ...settings, invoicePrefix: e.target.value })
                  }
                  size="sm"
                  maxLength={20}
                />

                <Select
                  label="Invoice Template"
                  value={settings.invoiceTemplate}
                  onChange={(value) =>
                    setSettings({
                      ...settings,
                      invoiceTemplate: value as "simple" | "premium",
                    })
                  }
                  data={[
                    { value: "simple", label: "Simple Template" },
                    {
                      value: "premium",
                      label: "Premium Template",
                      disabled: true,
                    },
                  ]}
                  size="sm"
                />

                <Switch
                  label="Include VAT in invoices"
                  description="When enabled, invoices use Amazon's reported tax first. If Amazon does not report VAT on a UAE order, VAT is extracted from the VAT-inclusive price at the standard 5% rate (VAT = Gross × 5 / 105). A TRN must be saved in Business Information. Invoices are not generated if the tax treatment cannot be established."
                  checked={settings.includeVAT}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      includeVAT: e.currentTarget.checked,
                    })
                  }
                />

                {settings.includeVAT && (
                  <NumberInput
                    label="VAT Rate (%)"
                    description="UAE standard VAT is 5%. A different rate cannot be used to derive VAT from VAT-inclusive prices."
                    placeholder="Enter VAT rate"
                    value={settings.vatRate}
                    onChange={(value) =>
                      setSettings({ ...settings, vatRate: Number(value) })
                    }
                    min={0}
                    max={100}
                    step={0.1}
                    size="sm"
                  />
                )}

                {settings.includeVAT && Number(settings.vatRate) !== 5 && (
                  <Alert color="yellow" title="VAT rate is not 5%">
                    UAE VAT-inclusive extraction only applies at the standard
                    5% rate. If Amazon does not report a tax amount, invoice
                    generation will stop instead of inventing a VAT figure.
                  </Alert>
                )}

                <Divider />

                <div>
                  <Text size="sm" fw={500}>
                    Custom letterhead
                  </Text>
                  <Text size="xs" c="dimmed" mb="sm">
                    Optional. Upload a PNG, JPEG, BMP, GIF, WebP, or TIFF image
                    (max 5 MB). It is scaled to fit the top of every generated
                    invoice PDF, including automatic and manual invoices.
                  </Text>
                  {settings.letterheadUrl && (
                    <Image
                      src={getAvatarUrl(settings.letterheadUrl)}
                      alt="Invoice letterhead preview"
                      mah={96}
                      maw="100%"
                      w="auto"
                      fit="contain"
                      mb="sm"
                      radius="sm"
                    />
                  )}
                  <Group gap="sm">
                    <FileButton
                      onChange={handleLetterheadUpload}
                      accept="image/png,image/jpeg,image/jpg,image/bmp,image/gif,image/webp,image/tiff"
                    >
                      {(props) => (
                        <Button
                          {...props}
                          variant="light"
                          leftSection={<IconUpload size={16} />}
                          loading={uploadingLetterhead}
                        >
                          {settings.letterheadUrl
                            ? "Replace letterhead"
                            : "Upload letterhead"}
                        </Button>
                      )}
                    </FileButton>
                    {settings.letterheadUrl && (
                      <Button
                        variant="subtle"
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={handleLetterheadDelete}
                        loading={uploadingLetterhead}
                      >
                        Remove
                      </Button>
                    )}
                  </Group>
                </div>
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
