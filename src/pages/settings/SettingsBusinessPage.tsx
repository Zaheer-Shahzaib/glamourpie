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
    Divider,
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import MainLayout from '../../layout/Main';

export default function SettingsBusinessPage() {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        businessName: '',
        taxId: '',
        vatNumber: '',
        businessType: 'company' as 'individual' | 'company' | 'partnership',
    });

    const handleSave = async () => {
        try {
            setSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            notifications.show({
                title: 'Success',
                message: 'Business information saved',
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
                            <Title order={3}>Business Information</Title>
                            <Text size="sm" c="dimmed">Configure your business details</Text>
                        </div>

                        <Divider />

                        <TextInput
                            label="Business Name"
                            placeholder="Enter business name"
                            value={settings.businessName}
                            onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                            required
                            size="sm"
                        />

                        <Select
                            label="Business Type"
                            value={settings.businessType}
                            onChange={(value) => setSettings({ ...settings, businessType: value as 'individual' | 'company' | 'partnership' })}
                            data={[
                                { value: 'individual', label: 'Individual' },
                                { value: 'company', label: 'Company' },
                                { value: 'partnership', label: 'Partnership' },
                            ]}
                            size="sm"
                        />

                        <TextInput
                            label="Tax ID / TRN"
                            placeholder="Enter tax identification number"
                            value={settings.taxId}
                            onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                            required
                            size="sm"
                        />

                        <TextInput
                            label="VAT Number"
                            placeholder="Enter VAT registration number"
                            value={settings.vatNumber}
                            onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                            size="sm"
                        />

                        <Group justify="flex-end" mt="md">
                            <Button onClick={handleSave} loading={saving}>Save Settings</Button>
                        </Group>
                    </Stack>
                </Paper>
            </Container>
        </MainLayout>
    );
}
