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
    PasswordInput,
    Divider,
    Modal,
    Code,
    ScrollArea,
    Alert
} from '@mantine/core';
import { IconRefresh, IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import { api } from '../../Services/api';
import MainLayout from '../../layout/Main';
import { useDisclosure } from '@mantine/hooks';

export default function SettingsSpApiPage() {
    const { token } = useAuth();
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);
    const [opened, { open, close }] = useDisclosure(false);

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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSellerInfo();
    }, [token]);

    const loadSellerInfo = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.get('/api/aws/sellers/me');
            if (response.data.payload?.seller) {
                const s = response.data.payload.seller;
                // Detect region from stored marketplace domain
                const mp = s.marketplace || '';
                const detectedRegion = (['amazon.co.jp', 'amazon.com.au', 'amazon.sg'].some(d => mp.includes(d)))
                    ? 'FE'
                    : (['amazon.com', 'amazon.ca', 'amazon.com.mx', 'amazon.com.br'].some(d => mp === d))
                        ? 'NA'
                        : 'EU'; // amazon.ae, amazon.co.uk, amazon.de, etc.

                setCredentials({
                    sellerId: s.sellerId || '',
                    marketplaceId: s.marketplaceId || '',
                    region: detectedRegion,
                    clientId: '',
                    clientSecret: '',
                    refreshToken: s.refreshToken || '',
                    accessKeyId: s.accessKeyId || '',
                    secretAccessKey: s.secretAccessKey || '',
                });
            }
        } catch (error) {
            console.error('Failed to load seller info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        if (!token) return;
        try {
            setTesting(true);
            setTestResult(null);
            const response = await api.get('/api/aws/sp-api/test-sandbox');
            if (response.data.success) {
                setTestResult(response.data.payload);
                open();
                notifications.show({
                    title: 'Test Successful',
                    message: 'Successfully reached Amazon SP-API Sandbox!',
                    color: 'green',
                    icon: <IconCheck size={16} />
                });
            }
        } catch (error: any) {
            console.error('Test Connection Error:', error);
            notifications.show({
                title: 'Test Failed',
                message: error.response?.data?.message || 'Failed to connect to Amazon SP-API Sandbox.',
                color: 'red',
                icon: <IconX size={16} />
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSaveCredentials = async () => {
        if (!token) return;

        // Simple validation
        if (credentials.refreshToken && !credentials.refreshToken.startsWith('Atzr|')) {
            notifications.show({
                title: 'Invalid Token Format',
                message: 'Your Refresh Token should start with "Atzr|". Please ensure you are not using your dashboard login token.',
                color: 'yellow',
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.put('/api/aws/sellers/credentials', credentials);
            if (response.data.success) {
                notifications.show({
                    title: 'Success',
                    message: 'Amazon SP-API credentials saved successfully!',
                    color: 'green',
                    icon: <IconCheck size={16} />
                });
            }
        } catch (error: any) {
            console.error('Save Credentials Error:', error);
            notifications.show({
                title: 'Save Failed',
                message: error.response?.data?.message || 'Failed to save credentials.',
                color: 'red',
                icon: <IconX size={16} />
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAuthorize = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.get('/api/aws/sp-api/auth-url', {
                params: { region: credentials.region }
            });
            if (response.data.success && response.data.url) {
                // Save current region preference before redirecting
                localStorage.setItem('amazon_onboarding_region', credentials.region);
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Failed to generate auth URL:', error);
            notifications.show({
                title: 'Authorization Error',
                message: 'Failed to start Amazon authorization flow.',
                color: 'red'
            });
        } finally {
            setLoading(false);
        }
    };

    // Check for callback status in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authStatus = params.get('amazon_auth');
        
        if (authStatus === 'success') {
            notifications.show({
                title: 'Connection Success',
                message: 'Successfully authorized! We are now discovering your marketplaces...',
                color: 'green',
                loading: true,
                autoClose: 3000
            });
            // Reload info after discovery is likely done
            setTimeout(loadSellerInfo, 2000);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (authStatus === 'error') {
            notifications.show({
                title: 'Connection Failed',
                message: 'Failed to connect your Amazon account. Please try again.',
                color: 'red'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <div>
                                <Title order={3}>Amazon Store Connection</Title>
                                <Text size="sm" c="dimmed">Connect your Amazon Selling Partner API (Sandbox or Production)</Text>
                            </div>
                            <Group>
                                <Button
                                    variant="light"
                                    onClick={handleTestConnection}
                                    loading={testing}
                                    leftSection={<IconRefresh size={16} />}
                                >
                                    Test Sandbox
                                </Button>
                            </Group>
                        </Group>

                        <Paper withBorder p="md" radius="md" bg="gray.0">
                            <Stack gap="sm">
                                <Text fw={500} size="sm">Quick Connect (Recommended)</Text>
                                <Group align="flex-end">
                                    <Select
                                        label="Marketplace Region"
                                        placeholder="Pick region"
                                        value={credentials.region}
                                        onChange={(value) => setCredentials({ ...credentials, region: value as 'NA' | 'EU' | 'FE' })}
                                        data={[
                                            { value: 'NA', label: 'North America (US, CA, MX, BR)' },
                                            { value: 'EU', label: 'Europe & Middle East (UK, DE, FR, AE, IN, etc.)' },
                                            { value: 'FE', label: 'Far East (JP, AU, SG)' },
                                        ]}
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        variant="filled"
                                        color="orange"
                                        onClick={handleAuthorize}
                                        loading={loading}
                                        leftSection={<IconCheck size={16} />}
                                    >
                                        Authorize with Amazon
                                    </Button>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    Clicking authorize will redirect you to Amazon Seller Central to grant permissions.
                                </Text>
                            </Stack>
                        </Paper>

                        <Divider label="Manual Credentials (Alternative)" labelPosition="center" />

                        <Alert
                            icon={<IconInfoCircle size={16} />}
                            title="Using Amazon UAE (sellercentral.amazon.ae)?"
                            color="blue"
                            variant="light"
                            radius="md"
                        >
                            Select <strong>Europe / Middle East</strong> as your region. UAE is part of Amazon's EU endpoint.
                            Your Marketplace ID is <strong>A2VIGQ35RCS4UG</strong>.
                        </Alert>

                        <TextInput
                            label="Seller ID"
                            description="Found in Seller Central → Account Info → Merchant Token"
                            placeholder="e.g., A1B2C3D4E5F6G7"
                            value={credentials.sellerId}
                            onChange={(e) => setCredentials({ ...credentials, sellerId: e.target.value })}
                            size="sm"
                        />

                        <TextInput
                            label="Marketplace ID"
                            description="UAE = A2VIGQ35RCS4UG · US = ATVPDKIKX0DER · UK = A1F83G8C2ARO7P"
                            placeholder="e.g., A2VIGQ35RCS4UG (UAE / amazon.ae)"
                            value={credentials.marketplaceId}
                            onChange={(e) => setCredentials({ ...credentials, marketplaceId: e.target.value })}
                            size="sm"
                        />

                        <Select
                            label="Region"
                            description="UAE, Saudi Arabia, Egypt, and all EU countries → select Europe / Middle East"
                            placeholder="Select region"
                            value={credentials.region}
                            onChange={(value) => setCredentials({ ...credentials, region: value as 'NA' | 'EU' | 'FE' })}
                            data={[
                                { value: 'NA', label: 'North America (US, CA, MX, BR)' },
                                { value: 'EU', label: 'Europe / Middle East (UAE, UK, DE, FR, SA, IN…)' },
                                { value: 'FE', label: 'Far East (JP, AU, SG)' },
                            ]}
                            size="sm"
                        />

                        <PasswordInput
                            label="Refresh Token"
                            description="From your SP-API Developer App → must start with Atzr|"
                            placeholder="Atzr|..."
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
                            <Button onClick={handleSaveCredentials} loading={loading}>
                                Save Manual Credentials
                            </Button>
                        </Group>
                    </Stack>
                </Paper>
            </Container>

            <Modal opened={opened} onClose={close} title="Amazon SP-API Sandbox Response" size="xl">
                <Text size="sm" mb="md">
                    The following real-time data was returned from the Amazon Selling Partner API Sandbox environment:
                </Text>
                <ScrollArea h={400}>
                    <Code block>
                        {JSON.stringify(testResult, null, 2)}
                    </Code>
                </ScrollArea>
                <Group justify="flex-end" mt="md">
                    <Button onClick={close}>Close Result</Button>
                </Group>
            </Modal>
        </MainLayout>
    );
}
