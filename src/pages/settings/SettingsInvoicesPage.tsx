import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import MainLayout from '../../layout/Main';
import { fetchSellerSettings, updateSellerSettings } from '../../Services/settings-services';

export default function SettingsInvoicesPage() {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState({
        autoGenerateInvoices: false,
        invoicePrefix: 'INV',
        includeVAT: true,
        vatRate: 5,
        invoiceTemplate: 'simple' as 'simple' | 'premium',
        autoUploadToAmazon: false,
    });

    // Load saved settings from backend on mount
    useEffect(() => {
        if (!token) return;
        fetchSellerSettings(token)
            .then((data: any) => {
                const inv = data?.data?.invoiceSettings || {};
                setSettings(prev => ({
                    ...prev,
                    invoicePrefix:        inv.invoicePrefix        ?? 'INV',
                    autoGenerateInvoices: inv.autoGenerateInvoices ?? false,
                    autoUploadToAmazon:   inv.autoUploadToAmazon   ?? false,
                }));
            })
            .catch((err: any) => {
                console.warn('Could not load invoice settings:', err?.message);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateSellerSettings(token!, {
                invoiceSettings: {
                    invoicePrefix:        settings.invoicePrefix,
                    autoGenerateInvoices: settings.autoGenerateInvoices,
                    autoUploadToAmazon:   settings.autoUploadToAmazon,
                },
            });
            notifications.show({
                title: 'Success',
                message: 'Invoice settings saved',
                color: 'green',
            });
        } catch (error: any) {
            notifications.show({
                title: 'Error',
                message: error?.response?.data?.message || 'Failed to save settings',
                color: 'red',
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
                            <Title order={3}>Invoice Settings</Title>
                            <Text size="sm" c="dimmed">Configure invoice generation preferences</Text>
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
                                    onChange={(e) => setSettings({ ...settings, autoGenerateInvoices: e.currentTarget.checked })}
                                />

                                <Switch
                                    label="Auto-upload invoices to Amazon"
                                    description="Automatically submit generated invoices to Amazon via the Feeds API"
                                    checked={settings.autoUploadToAmazon}
                                    onChange={(e) => setSettings({ ...settings, autoUploadToAmazon: e.currentTarget.checked })}
                                />

                                <TextInput
                                    label="Invoice Prefix"
                                    description={`Invoice numbers will be formatted as: ${settings.invoicePrefix || 'INV'}-2026-0001`}
                                    placeholder="e.g., GP or INV"
                                    value={settings.invoicePrefix}
                                    onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                                    size="sm"
                                    maxLength={20}
                                />

                                <Select
                                    label="Invoice Template"
                                    value={settings.invoiceTemplate}
                                    onChange={(value) => setSettings({ ...settings, invoiceTemplate: value as 'simple' | 'premium' })}
                                    data={[
                                        { value: 'simple', label: 'Simple Template' },
                                        { value: 'premium', label: 'Premium Template' },
                                    ]}
                                    size="sm"
                                />

                                <Switch
                                    label="Include VAT in invoices"
                                    checked={settings.includeVAT}
                                    onChange={(e) => setSettings({ ...settings, includeVAT: e.currentTarget.checked })}
                                />

                                {settings.includeVAT && (
                                    <NumberInput
                                        label="VAT Rate (%)"
                                        placeholder="Enter VAT rate"
                                        value={settings.vatRate}
                                        onChange={(value) => setSettings({ ...settings, vatRate: Number(value) })}
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        size="sm"
                                    />
                                )}
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

