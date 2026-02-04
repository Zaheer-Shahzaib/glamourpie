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
    PasswordInput,
    Divider,
    Badge,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import MainLayout from '../../layout/Main';

export default function SettingsSpApiPage() {
    const { token } = useAuth();
    const [testing, setTesting] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [credentials, setCredentials] = useState({
        sellerId: '',
        marketplaceId: '',
        region: 'EU' as 'NA' | 'EU' | 'FE',
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        accessKeyId: '',
        secretAccessKey: '',
    });

    const handleTestConnection = async () => {
        if (!token) return;

        try {
            setTesting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            notifications.show({
                title: 'Success',
                message: 'Connection test successful',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to test connection',
                color: 'red',
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSyncOrders = async () => {
        if (!token) return;

        try {
            setSyncing(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            notifications.show({
                title: 'Success',
                message: 'Orders synced successfully',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to sync orders',
                color: 'red',
            });
        } finally {
            setSyncing(false);
        }
    };

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <div>
                                <Title order={3}>Amazon SP-API Credentials</Title>
                                <Text size="sm" c="dimmed">Configure your Amazon Selling Partner API credentials</Text>
                            </div>
                            <Group>
                                <Button
                                    variant="light"
                                    onClick={handleTestConnection}
                                    loading={testing}
                                    leftSection={<IconRefresh size={16} />}
                                >
                                    Test Connection
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={handleSyncOrders}
                                    loading={syncing}
                                    leftSection={<IconRefresh size={16} />}
                                >
                                    Sync Orders
                                </Button>
                            </Group>
                        </Group>

                        <Divider />

                        <TextInput
                            label="Seller ID"
                            placeholder="Enter your Amazon Seller ID"
                            value={credentials.sellerId}
                            onChange={(e) => setCredentials({ ...credentials, sellerId: e.target.value })}
                            size="sm"
                        />

                        <TextInput
                            label="Marketplace ID"
                            placeholder="e.g., A2VIGQ35RCS4UG (UAE)"
                            value={credentials.marketplaceId}
                            onChange={(e) => setCredentials({ ...credentials, marketplaceId: e.target.value })}
                            size="sm"
                        />

                        <Select
                            label="Region"
                            placeholder="Select region"
                            value={credentials.region}
                            onChange={(value) => setCredentials({ ...credentials, region: value as 'NA' | 'EU' | 'FE' })}
                            data={[
                                { value: 'NA', label: 'North America' },
                                { value: 'EU', label: 'Europe' },
                                { value: 'FE', label: 'Far East' },
                            ]}
                            size="sm"
                        />

                        <TextInput
                            label="Client ID"
                            placeholder="Enter your LWA Client ID"
                            value={credentials.clientId}
                            onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                            size="sm"
                        />

                        <PasswordInput
                            label="Client Secret"
                            placeholder="Enter your LWA Client Secret"
                            value={credentials.clientSecret}
                            onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                            size="sm"
                        />

                        <PasswordInput
                            label="Refresh Token"
                            placeholder="Enter your SP-API Refresh Token"
                            value={credentials.refreshToken}
                            onChange={(e) => setCredentials({ ...credentials, refreshToken: e.target.value })}
                            size="sm"
                        />

                        <PasswordInput
                            label="Access Key ID"
                            placeholder="Enter AWS Access Key ID"
                            value={credentials.accessKeyId}
                            onChange={(e) => setCredentials({ ...credentials, accessKeyId: e.target.value })}
                            size="sm"
                        />

                        <PasswordInput
                            label="Secret Access Key"
                            placeholder="Enter AWS Secret Access Key"
                            value={credentials.secretAccessKey}
                            onChange={(e) => setCredentials({ ...credentials, secretAccessKey: e.target.value })}
                            size="sm"
                        />

                        <Group justify="flex-end" mt="md">
                            <Button>Save Credentials</Button>
                        </Group>
                    </Stack>
                </Paper>
            </Container>
        </MainLayout>
    );
}
