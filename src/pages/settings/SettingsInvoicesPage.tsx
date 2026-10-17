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
  fetchInvoiceLetterheadPreview,
  fetchSellerSettings,
  updateSellerSettings,
  uploadInvoiceLetterhead,
} from "../../Services/settings-services";

export default function SettingsInvoicesPage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLetterhead, setUploadingLetterhead] = useState(false);
  const [letterheadPreview, setLetterheadPreview] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    autoGenerateInvoices: false,
    invoicePrefix: "INV",
    invoiceStartNumber: 1,
    invoiceNumberPadding: 6,
    nextInvoiceNumber: "INV-000001",
    includeVAT: false,
    vatRate: 5,
    invoiceTemplate: "simple" as "simple" | "premium",
    autoUploadToAmazon: false,
    letterheadUrl: null as string | null,
  });

  const previewPrefix = (settings.invoicePrefix || "INV").trim().toUpperCase() || "INV";
  const previewSerial = String(settings.invoiceStartNumber || 1).padStart(
    settings.invoiceNumberPadding || 6,
    "0",
  );
  const previewInvoiceNumber = /[/-]$/.test(previewPrefix)
    ? `${previewPrefix}${previewSerial}`
    : `${previewPrefix}-${previewSerial}`;

  // Load saved settings from backend on mount
  useEffect(() => {
    if (!token) return;
    fetchSellerSettings(token)
      .then((data: any) => {
        const inv = data?.data?.invoiceSettings || {};
        setSettings((prev) => ({
          ...prev,
          invoicePrefix: inv.invoicePrefix ?? "INV",
          invoiceStartNumber: inv.invoiceStartNumber ?? inv.invoiceNextNumber ?? 1,
          invoiceNumberPadding: inv.invoiceNumberPadding ?? 6,
          nextInvoiceNumber: inv.nextInvoiceNumber ?? "INV-000001",
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

  useEffect(() => {
    if (!token || !settings.letterheadUrl) {
      setLetterheadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    let cancelled = false;
    let objectUrl = "";
    fetchInvoiceLetterheadPreview(token)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setLetterheadPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      })
      .catch(() => {
        if (!cancelled) setLetterheadPreview(null);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, settings.letterheadUrl]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const saved: any = await updateSellerSettings(token!, {
        invoiceSettings: {
          invoicePrefix: settings.invoicePrefix,
          invoiceStartNumber: settings.invoiceStartNumber,
          invoiceNumberPadding: settings.invoiceNumberPadding,
          autoGenerateInvoices: settings.autoGenerateInvoices,
          autoUploadToAmazon: settings.autoUploadToAmazon,
          includeVAT: settings.includeVAT,
          vatRate: settings.vatRate,
          invoiceTemplate: settings.invoiceTemplate,
        },
      });
      const inv = saved?.data?.invoiceSettings;
      if (inv) {
        setSettings((prev) => ({
          ...prev,
          invoicePrefix: inv.invoicePrefix ?? prev.invoicePrefix,
          invoiceStartNumber:
            inv.invoiceStartNumber ?? inv.invoiceNextNumber ?? prev.invoiceStartNumber,
          invoiceNumberPadding: inv.invoiceNumberPadding ?? prev.invoiceNumberPadding,
          nextInvoiceNumber: inv.nextInvoiceNumber ?? prev.nextInvoiceNumber,
        }));
      }
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
      const localPreview = URL.createObjectURL(file);
      setLetterheadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return localPreview;
      });
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
      setLetterheadPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
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
                  description={`Next invoice number: ${previewInvoiceNumber}`}
                  placeholder="e.g., GP, INV, or INV/"
                  value={settings.invoicePrefix}
                  onChange={(e) =>
                    setSettings({ ...settings, invoicePrefix: e.target.value })
                  }
                  size="sm"
                  maxLength={20}
                />

                <Group grow align="flex-start">
                  <NumberInput
                    label="Starting serial"
                    description="First number in this seller's series. Existing invoices are not renumbered."
                    value={settings.invoiceStartNumber}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        invoiceStartNumber: Number(value) || 1,
                      })
                    }
                    min={1}
                    max={999999999}
                    step={1}
                    size="sm"
                  />
                  <NumberInput
                    label="Zero padding"
                    description="Width of the serial, e.g. 6 → 000001"
                    value={settings.invoiceNumberPadding}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        invoiceNumberPadding: Number(value) || 6,
                      })
                    }
                    min={1}
                    max={10}
                    step={1}
                    size="sm"
                  />
                </Group>

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
                  <Text size="xs" c="dimmed" mb="xs">
                    Optional. The image is placed as a banner across the top
                    of the invoice and fitted to <b>512 × 80 pt</b> (about{" "}
                    <b>18 cm × 2.8 cm</b>). Invoice number and date stay on
                    the right underneath. A wide letterhead fills the top; a
                    logo sits on the left.
                  </Text>
                  <Text size="xs" c="dimmed" mb="sm">
                    Recommended upload size: <b>1600 × 250 px</b> for a full
                    letterhead (logo + name + contact), or <b>400 × 400 px</b>{" "}
                    for a logo only. PNG or JPEG, max 5 MB.
                  </Text>
                  {settings.letterheadUrl && letterheadPreview && (
                    <Image
                      src={letterheadPreview}
                      alt="Invoice letterhead preview"
                      w={512}
                      h={80}
                      maw="100%"
                      fit="contain"
                      mb="sm"
                      radius="sm"
                      style={{
                        display: "block",
                        objectPosition: "left center",
                        background: "var(--mantine-color-gray-0)",
                        border: "1px solid var(--mantine-color-gray-3)",
                      }}
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
