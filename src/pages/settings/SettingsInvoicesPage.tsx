import { useState } from 'react';
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
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import MainLayout from '../../layout/Main';

export default function SettingsInvoicesPage() {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        autoGenerateInvoices: false,
        invoicePrefix: 'INV',
        includeVAT: true,
        vatRate: 5,
        invoiceTemplate: 'simple' as 'simple' | 'premium',
        autoUploadToAmazon: false,
    });

    const handleSave = async () => {
        try {
            setSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            notifications.show({
                title: 'Success',
                message: 'Invoice settings saved',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to save settings',
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

                        <Switch
                            label="Auto-generate invoices for new orders"
                            checked={settings.autoGenerateInvoices}
                            onChange={(e) => setSettings({ ...settings, autoGenerateInvoices: e.currentTarget.checked })}
                        />

                        <Switch
                            label="Auto-upload invoices to Amazon"
                            checked={settings.autoUploadToAmazon}
                            onChange={(e) => setSettings({ ...settings, autoUploadToAmazon: e.currentTarget.checked })}
                        />

                        <TextInput
                            label="Invoice Prefix"
                            placeholder="e.g., INV"
                            value={settings.invoicePrefix}
                            onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                            size="sm"
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

                        <Group justify="flex-end" mt="md">
                            <Button onClick={handleSave} loading={saving}>Save Settings</Button>
                        </Group>
                    </Stack>
                </Paper>
            </Container>
        </MainLayout>
    );
}
