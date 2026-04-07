import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Button,
    Divider,
    Alert,
    Badge,
    Table,
    Modal,
    ActionIcon,
    Tooltip,
    Loader,
    Center,
    Box
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconAlertCircle,
    IconDownload,
    IconExternalLink,
    IconEye,
    IconX,
    IconHistory
} from '@tabler/icons-react';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import { getSubscriptionStatus, getCustomerInvoicesDetails, cancelSubscription } from '../../Services/stripeService';
import MainLayout from '../../layout/Main';

export default function SettingsBillingPage() {
    const { token } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [canceling, setCanceling] = useState(false);
    
    // Real Data Arrays
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    
    // Aggregation state
    const [activePlans, setActivePlans] = useState<string[]>([]);
    const [totalAllowedInvoices, setTotalAllowedInvoices] = useState<number>(0);
    const [hasPastDue, setHasPastDue] = useState(false);

    // Modal
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

    // Invoice View Modal State
    const [invoiceModalOpened, { open: openInvoice, close: closeInvoice }] = useDisclosure(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const handleViewInvoice = (inv: any) => {
        setSelectedInvoice(inv);
        openInvoice();
    };

    useEffect(() => {
        loadBillingData();
    }, [token]);

    const loadBillingData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            // Promise.all to fetch concurrently
            const [subData, invData] = await Promise.all([
                getSubscriptionStatus(),
                getCustomerInvoicesDetails()
            ]);

            setSubscriptions(subData.subscriptions || []);
            setActivePlans(subData.activePlans || []);
            setTotalAllowedInvoices(subData.totalAllowedInvoices || 0);
            setHasPastDue(subData.hasPastDue || false);
            setInvoices(invData.data || []);
            
        } catch (error) {
            console.error("Failed to fetch billing status", error);
            notifications.show({ title: 'Error', message: 'Could not load all billing history.', color: 'red' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (subId: number) => {
        setSelectedSubId(subId);
        open();
    };

    const confirmCancel = async () => {
        if (!selectedSubId) return;
        setCanceling(true);
        try {
            await cancelSubscription(selectedSubId);
            notifications.show({
                title: "Success",
                message: "Subscription canceled successfully. You will maintain access until the end of the current billing cycle.",
                color: "green",
            });
            close();
            loadBillingData();
        } catch (err: any) {
            notifications.show({
                title: "Cancellation Error",
                message: err?.response?.data?.error || "Failed to cancel subscription natively.",
                color: "red",
            });
        } finally {
            setCanceling(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    const formatUnix = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString(undefined, {
             year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getStatusColor = (status: string, cancelAtPeriodEnd: boolean) => {
        if (cancelAtPeriodEnd) return 'orange'; // Pending cancellation
        switch(status) {
            case 'active': return 'green';
            case 'past_due': return 'red';
            case 'canceled': return 'gray';
            case 'trialing': return 'cyan';
            default: return 'gray';
        }
    };
console.log("subscriptions",subscriptions)
    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Stack gap="xl">
                        <Box>
                            <Title order={3}>Subscription & Billing Overview</Title>
                            <Text size="sm" c="dimmed">Manage your current active plans, view historical records, and securely access your invoices directly.</Text>
                        </Box>
                        
                        <Divider />
                        
                        {hasPastDue && (
                            <Alert icon={<IconAlertCircle size={16} />} title="Payment Action Required" color="red" variant="filled">
                                Your recent subscription payment failed. Your automated invoicing feature is currently paused.
                            </Alert>
                        )}

                        <Group align="flex-start" grow>
                            <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                <Text c="dimmed" size="sm" fw={500} tt="uppercase">Active Plan & Status</Text>
                                <Group gap="md" mt="xs">
                                    {subscriptions.filter(s => ['active', 'trialing', 'past_due'].includes(s.status)).length > 0 ? (
                                        subscriptions
                                            .filter(s => ['active', 'trialing', 'past_due'].includes(s.status))
                                            .map((sub: any) => (
                                                <Stack gap={4} key={`active-${sub.id}`}>
                                                    <Badge size="lg" color="blue" variant="light">
                                                        {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                                                    </Badge>
                                                </Stack>
                                        ))
                                    ) : (
                                        <Text fw={500}>No active plans</Text>
                                    )}
                                </Group>
                            </Paper>

                            <Paper withBorder p="md" radius="md" bg="var(--mantine-color-gray-0)">
                                <Text c="dimmed" size="sm" fw={500} tt="uppercase">Combined Monthly Extracted Invoices</Text>
                                <Text size="xl" fw={700} mt="xs" c="brand">
                                    {totalAllowedInvoices > 0 ? totalAllowedInvoices.toLocaleString() : '0'} Available
                                </Text>
                            </Paper>
                        </Group>

                        {/* Subscriptions History Table */}
                        <Box>
                            <Group justify="space-between" mb="sm">
                                <Title order={4}>Subscription History</Title>
                                <Text size="sm" fw={500} c="dimmed">Current Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                            </Group>
                            {loading ? (
                                <Center py="xl"><Loader /></Center>
                            ) : subscriptions.length > 0 ? (
                                <Table striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Plan Tier</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Activation Date</Table.Th>
                                            <Table.Th>Current Period End</Table.Th>
                                            <Table.Th>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {subscriptions.map((sub: any) => (
                                            <Table.Tr key={sub.id}>
                                                <Table.Td fw={500} tt="capitalize">{sub.plan}</Table.Td>
                                                <Table.Td>
                                                    <Badge color={getStatusColor(sub.status, sub.cancel_at_period_end)} variant={sub.status === 'canceled' ? 'outline' : 'light'}>
                                                        {sub.cancel_at_period_end ? 'Cancels at Period End' : sub.status}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>{formatDate(sub.createdAt)}</Table.Td>
                                                <Table.Td>{formatDate(sub.currentPeriodEnd)}</Table.Td>
                                                <Table.Td>
                                                    {sub.status === 'active' && !sub.cancel_at_period_end && (
                                                       <Button size="xs" color="red" variant="subtle" onClick={() => handleCancelClick(sub.id)}>
                                                           Cancel Plan
                                                       </Button>
                                                    )}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Text size="sm" c="dimmed">No subscriptions found on your account.</Text>
                            )}
                        </Box>

                        {/* Invoices Table */}
                        <Box>
                            <Title order={4} mb="sm">Invoices & Receipts</Title>
                            {loading ? (
                                <Center py="xl"><Loader /></Center>
                            ) : invoices.length > 0 ? (
                                <Table striped highlightOnHover withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Date</Table.Th>
                                            <Table.Th>Amount</Table.Th>
                                            <Table.Th>Status</Table.Th>
                                            <Table.Th>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {invoices.map((inv: any) => (
                                            <Table.Tr key={inv.id}>
                                                <Table.Td>{formatUnix(inv.created)}</Table.Td>
                                                <Table.Td>{(inv.amount_paid / 100).toFixed(2)} {inv.currency.toUpperCase()}</Table.Td>
                                                <Table.Td>
                                                    <Badge color={inv.paid ? 'green' : (inv.status === 'open' ? 'orange' : 'gray')}>
                                                        {inv.status}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap="xs">
                                                        {inv.hosted_invoice_url && (
                                                            <Tooltip label="View Invoice Details">
                                                                <ActionIcon variant="light" color="blue" onClick={() => handleViewInvoice(inv)}>
                                                                    <IconEye size={16} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                        {inv.invoice_pdf && (
                                                            <Tooltip label="Download PDF">
                                                                <ActionIcon variant="light" color="teal" component="a" href={inv.invoice_pdf} download>
                                                                    <IconDownload size={16} />
                                                                </ActionIcon>
                                                            </Tooltip>
                                                        )}
                                                    </Group>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Group gap="sm" mt="md">
                                    <IconHistory size={20} color="gray" />
                                    <Text size="sm" c="dimmed">No historical invoices have been generated yet.</Text>
                                </Group>
                            )}
                        </Box>

                    </Stack>
                </Paper>
            </Container>

            <Modal opened={opened} onClose={close} title="Confirm Subscription Cancellation" centered>
                <Text size="sm">
                    Are you sure you want to cancel this subscription? 
                </Text>
                <Alert mt="md" mb="md" color="blue" title="Important Notification" variant="light" icon={<IconAlertCircle size={16}/>}>
                    You can continue utilizing your extracted invoice limits and all features associated with this plan until the <b>end of your current paid billing cycle</b>. You will not be billed again.
                </Alert>
                <Group justify="flex-end" mt="xl">
                    <Button variant="default" onClick={close} disabled={canceling}>Keep Plan</Button>
                    <Button color="red" onClick={confirmCancel} loading={canceling}>Yes, Cancel Plan</Button>
                </Group>
            </Modal>

            <Modal opened={invoiceModalOpened} onClose={closeInvoice} title="Invoice Summary" size="lg" centered>
                {selectedInvoice && (
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text fw={700} size="lg">Invoice #{selectedInvoice.number || selectedInvoice.id.slice(0,8)}</Text>
                            <Badge color={selectedInvoice.paid ? 'green' : 'orange'}>{selectedInvoice.status.toUpperCase()}</Badge>
                        </Group>
                        <Divider />
                        
                        <Group justify="space-between">
                            <Text c="dimmed" size="sm">Date Billed:</Text>
                            <Text fw={500}>{formatUnix(selectedInvoice.created)}</Text>
                        </Group>
                        
                        <Box mt="md">
                            <Text fw={600} mb="sm" tt="uppercase" size="xs" c="dimmed">Line Items</Text>
                            <Table verticalSpacing="sm">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Description</Table.Th>
                                        <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedInvoice.lines?.data?.map((line: any) => (
                                        <Table.Tr key={line.id}>
                                            <Table.Td>{line.description}</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>
                                                {(line.amount / 100).toFixed(2)} {selectedInvoice.currency.toUpperCase()}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Box>

                        <Divider mt="md" />
                        <Group justify="space-between" mt="xs">
                            <Text fw={700} size="lg">Total Paid:</Text>
                            <Text fw={700} size="lg" c="blue">
                                {(selectedInvoice.amount_paid / 100).toFixed(2)} {selectedInvoice.currency.toUpperCase()}
                            </Text>
                        </Group>
                        
                        <Group justify="flex-end" mt="xl">
                            <Button variant="default" onClick={closeInvoice}>Close</Button>
                            {selectedInvoice.invoice_pdf && (
                                <Button component="a" href={selectedInvoice.invoice_pdf} download leftSection={<IconDownload size={16} />}>
                                    Download External PDF
                                </Button>
                            )}
                        </Group>
                    </Stack>
                )}
            </Modal>
        </MainLayout>
    );
}
