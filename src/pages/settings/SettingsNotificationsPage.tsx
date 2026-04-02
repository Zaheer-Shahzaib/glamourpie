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
    Switch,
    Divider,
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import MainLayout from '../../layout/Main';

export default function SettingsNotificationsPage() {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        emailNotifications: false,
        orderNotifications: false,
        invoiceNotifications: false,
        errorNotifications: false,
        dailyReports: false,
        weeklyReports: false,
        notificationEmail: '',
    });

    const handleSave = async () => {
        try {
            setSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            notifications.show({
                title: 'Success',
                message: 'Notification settings saved',
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
                            <Title order={3}>Notification Settings</Title>
                            <Text size="sm" c="dimmed">Configure your notification preferences</Text>
                        </div>

                        <Divider />

                        <TextInput
                            label="Notification Email"
                            placeholder="Enter email for notifications"
                            type="email"
                            value={settings.notificationEmail}
                            onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                            size="sm"
                        />

                        <Divider label="Email Notifications" labelPosition="left" />

                        <Switch
                            label="Enable email notifications"
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings({ ...settings, emailNotifications: e.currentTarget.checked })}
                        />

                        <Switch
                            label="Order notifications"
                            description="Get notified when new orders are received"
                            checked={settings.orderNotifications}
                            onChange={(e) => setSettings({ ...settings, orderNotifications: e.currentTarget.checked })}
                        />

                        <Switch
                            label="Invoice notifications"
                            description="Get notified when invoices are generated"
                            checked={settings.invoiceNotifications}
                            onChange={(e) => setSettings({ ...settings, invoiceNotifications: e.currentTarget.checked })}
                        />

                        <Switch
                            label="Error notifications"
                            description="Get notified when errors occur"
                            checked={settings.errorNotifications}
                            onChange={(e) => setSettings({ ...settings, errorNotifications: e.currentTarget.checked })}
                        />

                        <Divider label="Reports" labelPosition="left" />

                        <Switch
                            label="Daily reports"
                            description="Receive daily summary reports"
                            checked={settings.dailyReports}
                            onChange={(e) => setSettings({ ...settings, dailyReports: e.currentTarget.checked })}
                        />

                        <Switch
                            label="Weekly reports"
                            description="Receive weekly summary reports"
                            checked={settings.weeklyReports}
                            onChange={(e) => setSettings({ ...settings, weeklyReports: e.currentTarget.checked })}
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
