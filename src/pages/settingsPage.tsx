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
    Tabs,
    PasswordInput,
    NumberInput,
    Divider,
    Badge,
    Alert,
    Loader,
    Collapse,
    Anchor,
    Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import {
    IconKey,
    IconWorld,
    IconFileInvoice,
    IconBell,
    IconBuilding,
    IconRefresh,
    IconCheck,
    IconAlertCircle,
    IconSettings,
    IconCreditCard,
} from '@tabler/icons-react';
import { useAuth } from '../Context/useAuth';
import { notifications } from '@mantine/notifications';
import { getSubscriptionStatus, createPortalSession } from '../Services/stripeService';
import {
    fetchSellerSettings,
    updateSellerSettings,
    testSpApiConnection,
    syncAmazonOrders,
} from '../Services/settings-services';
import { SellerSettings, UpdateSettingsData } from '../types/settings.types';
import MainLayout from '../layout/Main';

export default function SettingsPage() {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [connecting, setConnecting] = useState(false); // New state for OAuth connect
    const [settings, setSettings] = useState<SellerSettings | null>(null);
    const [showAdvanced, { toggle: toggleAdvanced }] = useDisclosure(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // Subscription & Billing state
    const [billingLoading, setBillingLoading] = useState(false);
    const [activePlans, setActivePlans] = useState<string[]>([]);
    const [totalAllowedInvoices, setTotalAllowedInvoices] = useState<number>(0);
    const [hasPastDue, setHasPastDue] = useState(false);
    const [portalAvailable, setPortalAvailable] = useState(false);

    // Form state
    const [spApiCredentials, setSpApiCredentials] = useState({
        sellerId: '',
        marketplaceId: '',
        region: 'NA' as 'NA' | 'EU' | 'FE',
        accessKeyId: '',
        secretAccessKey: '',
        refreshToken: '',
        clientId: '',
        clientSecret: '',
    });

    const [marketplaceSettings, setMarketplaceSettings] = useState({
        primaryMarketplace: '',
        defaultCurrency: '',
        defaultLanguage: '',
    });

    const [invoiceSettings, setInvoiceSettings] = useState({
        autoGenerateInvoices: false,
        invoicePrefix: '',
        includeVAT: false,
        vatRate: 5,
        invoiceTemplate: 'simple' as 'simple' | 'premium',
        autoUploadToAmazon: false,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: false,
        orderNotifications: false,
        invoiceNotifications: false,
        errorNotifications: false,
        dailyReports: false,
        weeklyReports: false,
        notificationEmail: '',
    });

    const [businessInfo, setBusinessInfo] = useState({
        businessName: '',
        taxId: '',
        vatNumber: '',
        businessType: 'company' as 'individual' | 'company' | 'partnership',
    });

    useEffect(() => {
        loadSettings();
        loadBilling();

        const amazonAuth = searchParams.get('amazon_auth');
        if (amazonAuth === 'success') {
            notifications.show({
                title: 'Success',
                message: 'Successfully connected to Amazon Seller Central.',
                color: 'green',
            });
            // remove url params
            searchParams.delete('amazon_auth');
            setSearchParams(searchParams);
        } else if (amazonAuth === 'error') {
            notifications.show({
                title: 'Connection Failed',
                message: 'Failed to connect to Amazon Seller Central: ' + (searchParams.get('error') || 'Unknown error'),
                color: 'red',
            });
            // remove url params
            searchParams.delete('amazon_auth');
            searchParams.delete('error');
            setSearchParams(searchParams);
        }
    }, [token]);

    const loadBilling = async () => {
        if (!token) return;
        try {
            const data = await getSubscriptionStatus();
            setActivePlans(data.activePlans || []);
            setTotalAllowedInvoices(data.totalAllowedInvoices || 0);
            setHasPastDue(data.hasPastDue || false);
            setPortalAvailable(data.portalAvailable || false);
        } catch (error) {
            console.error("Failed to fetch billing status");
        }
    };

    const loadSettings = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const data = await fetchSellerSettings(token);
            setSettings(data);

            // Populate form fields
            setSpApiCredentials({
                sellerId: data.spApiCredentials.sellerId,
                marketplaceId: data.spApiCredentials.marketplaceId,
                region: data.spApiCredentials.region,
                accessKeyId: data.spApiCredentials.accessKeyId || '',
                secretAccessKey: data.spApiCredentials.secretAccessKey || '',
                refreshToken: data.spApiCredentials.refreshToken || '',
                clientId: data.spApiCredentials.clientId || '',
                clientSecret: data.spApiCredentials.clientSecret || '',
            });

            setMarketplaceSettings({
                primaryMarketplace: data.marketplaceSettings.primaryMarketplace,
                defaultCurrency: data.marketplaceSettings.defaultCurrency,
                defaultLanguage: data.marketplaceSettings.defaultLanguage,
            });

            setInvoiceSettings({
                autoGenerateInvoices: data.invoiceSettings.autoGenerateInvoices,
                invoicePrefix: data.invoiceSettings.invoicePrefix,
                includeVAT: data.invoiceSettings.includeVAT,
                vatRate: data.invoiceSettings.vatRate,
                invoiceTemplate: data.invoiceSettings.invoiceTemplate,
                autoUploadToAmazon: data.invoiceSettings.autoUploadToAmazon,
            });

            setNotificationSettings({
                emailNotifications: data.notificationSettings.emailNotifications,
                orderNotifications: data.notificationSettings.orderNotifications,
                invoiceNotifications: data.notificationSettings.invoiceNotifications,
                errorNotifications: data.notificationSettings.errorNotifications,
                dailyReports: data.notificationSettings.dailyReports,
                weeklyReports: data.notificationSettings.weeklyReports,
                notificationEmail: data.notificationSettings.notificationEmail || '',
            });

            setBusinessInfo({
                businessName: data.businessInfo.businessName,
                taxId: data.businessInfo.taxId,
                vatNumber: data.businessInfo.vatNumber || '',
                businessType: data.businessInfo.businessType,
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load settings',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        if (!token) return;

        try {
            setSaving(true);
            const updateData: UpdateSettingsData = {
                spApiCredentials,
                marketplaceSettings,
                invoiceSettings,
                notificationSettings,
                businessInfo,
            };

            await updateSellerSettings(token, updateData);

            notifications.show({
                title: 'Success',
                message: 'Settings saved successfully',
                color: 'green',
            });

            loadSettings();
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

    const handleTestConnection = async () => {
        if (!token) return;

        try {
            setTesting(true);
            const response = await testSpApiConnection(token, {
                sellerId: spApiCredentials.sellerId,
                marketplaceId: spApiCredentials.marketplaceId,
                accessKeyId: spApiCredentials.accessKeyId,
                secretAccessKey: spApiCredentials.secretAccessKey,
                refreshToken: spApiCredentials.refreshToken,
            });

            if (response.success) {
                notifications.show({
                    title: 'Success',
                    message: response.message,
                    color: 'green',
                });
            } else {
                notifications.show({
                    title: 'Connection Failed',
                    message: response.message,
                    color: 'red',
                });
            }
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
            const response = await syncAmazonOrders(token);

            notifications.show({
                title: 'Success',
                message: `${response.ordersSynced} orders synced successfully`,
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

    const handleConnectAmazon = async () => {
        if (!token) return;
        setConnecting(true);
        try {
            // Adjust endpoint depending on your environment, assuming backend is running on process.env.VITE_API_URL or similar
            // Our backend runs on http://localhost:5173 for some reason (see .env PORT=5173 which is unusual for backend, but we'll use API token call)
            const response = await fetch('http://localhost:5173/api/aws/sp-api/auth-url', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to generate Amazon authorization URL',
                color: 'red',
            });
        } finally {
            setConnecting(false);
        }
    };

    const handlePortalAccess = async () => {
        setBillingLoading(true);
        try {
            const result = await createPortalSession();
            window.location.href = result.url;
        } catch (err: any) {
            notifications.show({
                title: "Error",
                message: err?.response?.data?.error || "Failed to open billing portal.",
                color: "red",
            });
        } finally {
            setBillingLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Container size="lg" py="xl">
                    <Stack align="center" gap="md">
                        <Loader size="lg" />
                        <Text>Loading settings...</Text>
                    </Stack>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <div>
                            <Title order={2}>Settings</Title>
                            <Text c="dimmed" size="sm">
                                Manage your AWS seller account and preferences
                            </Text>
                        </div>
                        <Button onClick={handleSaveSettings} loading={saving} leftSection={<IconCheck size={16} />}>
                            Save All Settings
                        </Button>
                    </Group>

                    {/* Connection Status */}
                    {settings && (
                        <Alert
                            icon={settings.spApiCredentials.isActive ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
                            title={settings.spApiCredentials.isActive ? 'Connected' : 'Not Connected'}
                            color={settings.spApiCredentials.isActive ? 'green' : 'orange'}
                        >
                            {settings.spApiCredentials.isActive
                                ? `Last synced: ${settings.spApiCredentials.lastSynced ? new Date(settings.spApiCredentials.lastSynced).toLocaleString() : 'Never'}`
                                : 'Please configure your Amazon SP-API credentials to get started'}
                        </Alert>
                    )}

                    {/* Tabs */}
                    <Tabs defaultValue="credentials">
                        <Tabs.List>
                            <Tabs.Tab value="credentials" leftSection={<IconKey size={16} />}>
                                SP-API Credentials
                            </Tabs.Tab>
                            <Tabs.Tab value="marketplace" leftSection={<IconWorld size={16} />}>
                                Marketplace
                            </Tabs.Tab>
                            <Tabs.Tab value="invoices" leftSection={<IconFileInvoice size={16} />}>
                                Invoices
                            </Tabs.Tab>
                            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
                                Notifications
                            </Tabs.Tab>
                            <Tabs.Tab value="business" leftSection={<IconBuilding size={16} />}>
                                Business Info
                            </Tabs.Tab>
                            <Tabs.Tab value="billing" leftSection={<IconCreditCard size={16} />}>
                                Billing & Subscription
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* SP-API Credentials Tab */}
                        <Tabs.Panel value="credentials" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Title order={3}>Amazon SP-API Credentials</Title>
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

                                    <Box my="lg">
                                        <Stack gap="md">
                                            <Box>
                                                <Text fw={500} size="lg">One-Click Setup</Text>
                                                <Text size="sm" c="dimmed">Securely authorize this application to manage your Amazon Seller account.</Text>
                                            </Box>
                                            <Button 
                                                size="md" 
                                                color="orange"
                                                onClick={handleConnectAmazon}
                                                loading={connecting}
                                                leftSection={<IconWorld size={18} />}
                                                w={{ base: '100%', sm: 'auto' }}
                                                style={{ alignSelf: 'flex-start' }}
                                            >
                                                Connect to Amazon Seller Central
                                            </Button>
                                        </Stack>
                                    </Box>

                                    <Divider />
                                    <Group justify="center" mt="md">
                                        <Anchor component="button" type="button" c="dimmed" size="sm" onClick={toggleAdvanced}>
                                            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Manual Credentials)'}
                                        </Anchor>
                                    </Group>

                                    <Collapse in={showAdvanced}>
                                        <Stack gap="md" mt="md" p="md" bg="var(--mantine-color-gray-0)" style={{ borderRadius: '8px' }}>
                                            <Text fw={500}>Manual API Setup</Text>
                                            <TextInput
                                                label="Seller ID"
                                                placeholder="Enter your Amazon Seller ID"
                                                value={spApiCredentials.sellerId}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, sellerId: e.target.value })
                                                }
                                                required={showAdvanced}
                                            />

                                            <TextInput
                                                label="Marketplace ID"
                                                placeholder="e.g., A2VIGQ35RCS4UG (UAE)"
                                                value={spApiCredentials.marketplaceId}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, marketplaceId: e.target.value })
                                                }
                                                required={showAdvanced}
                                            />

                                            <Select
                                                label="Region"
                                                placeholder="Select region"
                                                value={spApiCredentials.region}
                                                onChange={(value) =>
                                                    setSpApiCredentials({ ...spApiCredentials, region: value as 'NA' | 'EU' | 'FE' })
                                                }
                                                data={[
                                                    { value: 'NA', label: 'North America' },
                                                    { value: 'EU', label: 'Europe' },
                                                    { value: 'FE', label: 'Far East' },
                                                ]}
                                                required={showAdvanced}
                                            />

                                            <TextInput
                                                label="Client ID (LWA)"
                                                placeholder="Enter your LWA Client ID"
                                                value={spApiCredentials.clientId}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, clientId: e.target.value })
                                                }
                                            />

                                            <PasswordInput
                                                label="Client Secret (LWA)"
                                                placeholder="Enter your LWA Client Secret"
                                                value={spApiCredentials.clientSecret}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, clientSecret: e.target.value })
                                                }
                                            />

                                            <PasswordInput
                                                label="Refresh Token"
                                                placeholder="Enter your SP-API Refresh Token"
                                                value={spApiCredentials.refreshToken}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, refreshToken: e.target.value })
                                                }
                                            />

                                            <PasswordInput
                                                label="IAM Access Key ID"
                                                placeholder="Enter AWS IAM Access Key ID"
                                                value={spApiCredentials.accessKeyId}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, accessKeyId: e.target.value })
                                                }
                                            />

                                            <PasswordInput
                                                label="IAM Secret Access Key"
                                                placeholder="Enter AWS IAM Secret Access Key"
                                                value={spApiCredentials.secretAccessKey}
                                                onChange={(e) =>
                                                    setSpApiCredentials({ ...spApiCredentials, secretAccessKey: e.target.value })
                                                }
                                            />
                                        </Stack>
                                    </Collapse>
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Marketplace Tab */}
                        <Tabs.Panel value="marketplace" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Title order={3}>Marketplace Settings</Title>
                                    <Divider />

                                    <Select
                                        label="Primary Marketplace"
                                        placeholder="Select primary marketplace"
                                        value={marketplaceSettings.primaryMarketplace}
                                        onChange={(value) =>
                                            setMarketplaceSettings({ ...marketplaceSettings, primaryMarketplace: value || '' })
                                        }
                                        data={[
                                            { value: 'amazon.ae', label: 'Amazon UAE' },
                                            { value: 'amazon.com.br', label: 'Amazon Brazil' },
                                            { value: 'amazon.in', label: 'Amazon India' },
                                            { value: 'amazon.com', label: 'Amazon US' },
                                            { value: 'amazon.co.uk', label: 'Amazon UK' },
                                        ]}
                                    />

                                    <Select
                                        label="Default Currency"
                                        placeholder="Select default currency"
                                        value={marketplaceSettings.defaultCurrency}
                                        onChange={(value) =>
                                            setMarketplaceSettings({ ...marketplaceSettings, defaultCurrency: value || '' })
                                        }
                                        data={[
                                            { value: 'AED', label: 'AED - UAE Dirham' },
                                            { value: 'BRL', label: 'BRL - Brazilian Real' },
                                            { value: 'INR', label: 'INR - Indian Rupee' },
                                            { value: 'USD', label: 'USD - US Dollar' },
                                            { value: 'GBP', label: 'GBP - British Pound' },
                                        ]}
                                    />

                                    <Select
                                        label="Default Language"
                                        placeholder="Select default language"
                                        value={marketplaceSettings.defaultLanguage}
                                        onChange={(value) =>
                                            setMarketplaceSettings({ ...marketplaceSettings, defaultLanguage: value || '' })
                                        }
                                        data={[
                                            { value: 'en', label: 'English' },
                                            { value: 'ar', label: 'Arabic' },
                                            { value: 'pt', label: 'Portuguese' },
                                            { value: 'hi', label: 'Hindi' },
                                        ]}
                                    />
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Invoice Settings Tab */}
                        <Tabs.Panel value="invoices" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Title order={3}>Invoice Settings</Title>
                                    <Divider />

                                    <Switch
                                        label="Auto-generate invoices for new orders"
                                        checked={invoiceSettings.autoGenerateInvoices}
                                        onChange={(e) =>
                                            setInvoiceSettings({ ...invoiceSettings, autoGenerateInvoices: e.currentTarget.checked })
                                        }
                                    />

                                    <Switch
                                        label="Auto-upload invoices to Amazon"
                                        checked={invoiceSettings.autoUploadToAmazon}
                                        onChange={(e) =>
                                            setInvoiceSettings({ ...invoiceSettings, autoUploadToAmazon: e.currentTarget.checked })
                                        }
                                    />

                                    <TextInput
                                        label="Invoice Prefix"
                                        placeholder="e.g., INV"
                                        value={invoiceSettings.invoicePrefix}
                                        onChange={(e) =>
                                            setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })
                                        }
                                    />

                                    <Select
                                        label="Invoice Template"
                                        value={invoiceSettings.invoiceTemplate}
                                        onChange={(value) =>
                                            setInvoiceSettings({ ...invoiceSettings, invoiceTemplate: value as 'simple' | 'premium' })
                                        }
                                        data={[
                                            { value: 'simple', label: 'Simple Template' },
                                            { value: 'premium', label: 'Premium Template' },
                                        ]}
                                    />

                                    <Switch
                                        label="Include VAT in invoices"
                                        checked={invoiceSettings.includeVAT}
                                        onChange={(e) =>
                                            setInvoiceSettings({ ...invoiceSettings, includeVAT: e.currentTarget.checked })
                                        }
                                    />

                                    {invoiceSettings.includeVAT && (
                                        <NumberInput
                                            label="VAT Rate (%)"
                                            placeholder="Enter VAT rate"
                                            value={invoiceSettings.vatRate}
                                            onChange={(value) =>
                                                setInvoiceSettings({ ...invoiceSettings, vatRate: Number(value) })
                                            }
                                            min={0}
                                            max={100}
                                            step={0.1}
                                        />
                                    )}
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Notifications Tab */}
                        <Tabs.Panel value="notifications" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Title order={3}>Notification Settings</Title>
                                    <Divider />

                                    <TextInput
                                        label="Notification Email"
                                        placeholder="Enter email for notifications"
                                        type="email"
                                        value={notificationSettings.notificationEmail}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, notificationEmail: e.target.value })
                                        }
                                    />

                                    <Divider label="Email Notifications" />

                                    <Switch
                                        label="Enable email notifications"
                                        checked={notificationSettings.emailNotifications}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, emailNotifications: e.currentTarget.checked })
                                        }
                                    />

                                    <Switch
                                        label="Order notifications"
                                        description="Get notified when new orders are received"
                                        checked={notificationSettings.orderNotifications}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, orderNotifications: e.currentTarget.checked })
                                        }
                                    />

                                    <Switch
                                        label="Invoice notifications"
                                        description="Get notified when invoices are generated"
                                        checked={notificationSettings.invoiceNotifications}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, invoiceNotifications: e.currentTarget.checked })
                                        }
                                    />

                                    <Switch
                                        label="Error notifications"
                                        description="Get notified when errors occur"
                                        checked={notificationSettings.errorNotifications}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, errorNotifications: e.currentTarget.checked })
                                        }
                                    />

                                    <Divider label="Reports" />

                                    <Switch
                                        label="Daily reports"
                                        description="Receive daily summary reports"
                                        checked={notificationSettings.dailyReports}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, dailyReports: e.currentTarget.checked })
                                        }
                                    />

                                    <Switch
                                        label="Weekly reports"
                                        description="Receive weekly summary reports"
                                        checked={notificationSettings.weeklyReports}
                                        onChange={(e) =>
                                            setNotificationSettings({ ...notificationSettings, weeklyReports: e.currentTarget.checked })
                                        }
                                    />
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Business Info Tab */}
                        <Tabs.Panel value="business" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Title order={3}>Business Information</Title>
                                    <Divider />

                                    <TextInput
                                        label="Business Name"
                                        placeholder="Enter business name"
                                        value={businessInfo.businessName}
                                        onChange={(e) =>
                                            setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                                        }
                                        required
                                    />

                                    <Select
                                        label="Business Type"
                                        value={businessInfo.businessType}
                                        onChange={(value) =>
                                            setBusinessInfo({ ...businessInfo, businessType: value as 'individual' | 'company' | 'partnership' })
                                        }
                                        data={[
                                            { value: 'individual', label: 'Individual' },
                                            { value: 'company', label: 'Company' },
                                            { value: 'partnership', label: 'Partnership' },
                                        ]}
                                    />

                                    <TextInput
                                        label="Tax ID / TRN"
                                        placeholder="Enter tax identification number"
                                        value={businessInfo.taxId}
                                        onChange={(e) =>
                                            setBusinessInfo({ ...businessInfo, taxId: e.target.value })
                                        }
                                        required
                                    />

                                    <TextInput
                                        label="VAT Number"
                                        placeholder="Enter VAT registration number"
                                        value={businessInfo.vatNumber}
                                        onChange={(e) =>
                                            setBusinessInfo({ ...businessInfo, vatNumber: e.target.value })
                                        }
                                    />
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Billing & Subscription Tab */}
                        <Tabs.Panel value="billing" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Stack gap="md">
                                    <Title order={3}>Subscription & Billing Overview</Title>
                                    <Divider />
                                    
                                    {hasPastDue && (
                                        <Alert icon={<IconAlertCircle size={16} />} title="Payment Action Required" color="red" variant="filled">
                                            Your recent subscription payment failed. Your automated invoicing feature is currently paused. Please update your payment details.
                                        </Alert>
                                    )}

                                    <Group align="flex-start" grow>
                                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                            <Text c="dimmed" size="sm" fw={500} tt="uppercase">Active Plans</Text>
                                            <Group gap="xs" mt="xs">
                                                {activePlans.length > 0 ? (
                                                    activePlans.map(plan => (
                                                        <Badge key={plan} size="xl" color="blue" variant="light">
                                                            {plan.charAt(0).toUpperCase() + plan.slice(1)}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Text fw={500}>No active plans</Text>
                                                )}
                                            </Group>
                                        </Paper>

                                        <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                            <Text c="dimmed" size="sm" fw={500} tt="uppercase">Combined Monthly Invoice Limit</Text>
                                            <Text size="xl" fw={700} mt="xs">
                                                {totalAllowedInvoices > 0 ? totalAllowedInvoices.toLocaleString() : '0'} Invoices
                                            </Text>
                                        </Paper>
                                    </Group>

                                    {portalAvailable ? (
                                        <Stack align="flex-start" mt="md">
                                            <Text size="sm" c="dimmed">
                                                Manage your payment methods, download previous receipts, and cancel your subscriptions securely via Stripe. To upgrade your plan, visit the Pricing page.
                                            </Text>
                                            <Button 
                                                variant="light" 
                                                color="grape" 
                                                leftSection={<IconCreditCard size={18} />}
                                                onClick={handlePortalAccess}
                                                loading={billingLoading}
                                            >
                                                Manage Billing & Update Payment Methods
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Text size="sm" c="dimmed" mt="md">
                                            You are currently on the Free plan. To link a payment method and manage billing, please upgrade your plan on the Pricing page first.
                                        </Text>
                                    )}
                                </Stack>
                            </Paper>
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Container>
        </MainLayout>
    );
}
