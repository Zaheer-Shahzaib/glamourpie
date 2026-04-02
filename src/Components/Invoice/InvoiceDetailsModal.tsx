import { Modal, Stack, Group, Text, Badge, Table, Divider, Paper, Grid, Button, Loader, Center } from '@mantine/core';
import { IconFileDownload, IconCalendar, IconUser, IconBuilding } from '@tabler/icons-react';
import { Invoice, InvoiceStatus, InvoiceType } from '../../types/invoice.types';
import { useInvoiceDetails } from '../../hooks/useInvoices';
import { useAuth } from '../../Context/useAuth';
import { fetchInvoiceDocument } from '../../Services/invoice-services';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

interface InvoiceDetailsModalProps {
    invoiceId: string | null;
    opened: boolean;
    onClose: () => void;
}

const getStatusColor = (status: InvoiceStatus): string => {
    switch (status) {
        case 'DRAFT': return 'gray';
        case 'SUBMITTED': return 'blue';
        case 'ACCEPTED': return 'green';
        case 'REJECTED': return 'red';
        default: return 'gray';
    }
};

const getTypeColor = (type: InvoiceType): string => {
    switch (type) {
        case 'INVOICE': return 'blue';
        case 'CREDIT_NOTE': return 'orange';
        case 'DEBIT_NOTE': return 'violet';
        default: return 'gray';
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default function InvoiceDetailsModal({ invoiceId, opened, onClose }: InvoiceDetailsModalProps) {
    const { invoice, loading } = useInvoiceDetails(invoiceId);
    const { token } = useAuth();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!token || !invoiceId) return;

        try {
            setDownloading(true);
            const response = await fetchInvoiceDocument(token, invoiceId);
            window.open(response.payload.documentUrl, '_blank');

            notifications.show({
                title: 'Success',
                message: 'Invoice document opened',
                color: 'green',
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to download invoice document',
                color: 'red',
            });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Invoice Details"
            size="xl"
            padding="lg"
        >
            {loading || !invoice ? (
                <Center h={400}>
                    <Stack align="center" gap="md">
                        <Loader size="lg" />
                        <Text c="dimmed">Loading invoice details...</Text>
                    </Stack>
                </Center>
            ) : (
                <Stack gap="lg">
                    {/* Header */}
                    <Paper p="md" withBorder>
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="md" fw={550}>{invoice.invoiceNumber}</Text>
                                <Group gap="xs" mt="xs">
                                    <IconCalendar size={16} />
                                    <Text size="xs" c="dimmed">{formatDate(invoice.invoiceDate)}</Text>
                                </Group>
                            </div>
                            <Stack gap="xs" align="flex-end">
                                <Badge size="md" color={getStatusColor(invoice.status)} variant="filled">
                                    {invoice.status}
                                </Badge>
                                <Badge size="md" color={getTypeColor(invoice.invoiceType)} variant="light">
                                    {invoice.invoiceType.replace('_', ' ')}
                                </Badge>
                            </Stack>
                        </Group>

                        <Group justify="space-between">
                            <Text size="xs" c="dimmed">Order ID: {invoice.amazonOrderId}</Text>
                            <Text size="xs" c="dimmed">Marketplace: {invoice.marketplaceId}</Text>
                        </Group>
                    </Paper>

                    {/* Seller & Buyer Information */}
                    <Grid>
                        <Grid.Col span={6}>
                            <Paper p="md" withBorder>
                                <Group gap="xs" mb="sm">
                                    <IconBuilding size={16} />
                                    <Text size='md' fw={550}>Seller Information</Text>
                                </Group>
                                <Stack gap="xs">
                                    <Text size="sm">{invoice.seller.name}</Text>
                                    <Text size="xs" c="dimmed">Tax ID: {invoice.seller.taxId}</Text>
                                    <Text size="xs" c="dimmed">{invoice.seller.address}</Text>
                                    {invoice.seller.email && (
                                        <Text size="xs" c="dimmed">{invoice.seller.email}</Text>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Paper p="md" withBorder>
                                <Group gap="xs" mb="sm">
                                    <IconUser size={16} />
                                    <Text size='md' fw={550}>Buyer Information</Text>
                                </Group>
                                <Stack gap="xs">
                                    <Text size="sm" >{invoice.buyer.name}</Text>
                                    {invoice.buyer.taxId && (
                                        <Text size="xs" c="dimmed">Tax ID: {invoice.buyer.taxId}</Text>
                                    )}
                                    <Text size="xs" c="dimmed">{invoice.buyer.address}</Text>
                                    {invoice.buyer.email && (
                                        <Text size="xs" c="dimmed">{invoice.buyer.email}</Text>
                                    )}
                                </Stack>
                            </Paper>
                        </Grid.Col>
                    </Grid>

                    {/* Line Items */}
                    <Paper p="md" withBorder>
                        <Text fw={600} mb="md">Line Items</Text>
                        <Table.ScrollContainer minWidth={500}>
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Description</Table.Th>
                                        <Table.Th>HSN Code</Table.Th>
                                        <Table.Th>Qty</Table.Th>
                                        <Table.Th>Unit Price</Table.Th>
                                        <Table.Th>Tax Rate</Table.Th>
                                        <Table.Th>Tax Amount</Table.Th>
                                        <Table.Th>Total</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {invoice.lineItems.map((item) => (
                                        <Table.Tr key={item.itemId}>
                                            <Table.Td ><Text size="sm">{item.description}</Text></Table.Td>
                                            <Table.Td><Text size="sm">{item.hsnCode || '-'}</Text></Table.Td>
                                            <Table.Td><Text size="sm">{item.quantity}</Text></Table.Td>
                                            <Table.Td><Text size="sm">{formatCurrency(item.unitPrice, invoice.currency)}</Text></Table.Td>
                                            <Table.Td><Text size="sm">{(item.taxRate * 100).toFixed(0)}%</Text></Table.Td>
                                            <Table.Td><Text size="sm">{formatCurrency(item.taxAmount, invoice.currency)}</Text></Table.Td>
                                            <Table.Td ><Text size="sm" fw={600}>{formatCurrency(item.lineTotal, invoice.currency)}</Text></Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Paper>

                    {/* Financial Summary */}
                    <Paper p="md" withBorder>
                        <Text fw={600} mb="md">Financial Summary</Text>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text size="sm">Subtotal:</Text>
                                <Text size="sm" fw={600}>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
                            </Group>
                            {invoice.discounts > 0 && (
                                <Group justify="space-between">
                                    <Text size="sm">Discounts:</Text>
                                    <Text size="sm" c="red">-{formatCurrency(invoice.discounts, invoice.currency)}</Text>
                                </Group>
                            )}
                            <Group justify="space-between">
                                <Text size="sm">Tax Amount:</Text>
                                <Text size="sm" fw={600}>{formatCurrency(invoice.taxAmount, invoice.currency)}</Text>
                            </Group>
                            {invoice.shippingCharges > 0 && (
                                <Group justify="space-between">
                                    <Text size="sm">Shipping:</Text>
                                    <Text size="sm" fw={600}>{formatCurrency(invoice.shippingCharges, invoice.currency)}</Text>
                                </Group>
                            )}
                            <Divider />
                            <Group justify="space-between">
                                <Text fw={600} size="md">Total Amount:</Text>
                                <Text fw={600} size="md">{formatCurrency(invoice.totalAmount, invoice.currency)}</Text>
                            </Group>
                        </Stack>
                    </Paper>

                    {/* Payment Information */}
                    {invoice.paymentMethod && (
                        <Paper p="md" withBorder>
                            <Text fw={600} mb="sm">Payment Information</Text>
                            <Group gap="xl">
                                <div>
                                    <Text size="sm" c="dimmed">Payment Method</Text>
                                    <Text size="sm">{invoice.paymentMethod}</Text>
                                </div>
                                {invoice.paymentDueDate && (
                                    <div>
                                        <Text size="sm" c="dimmed">Due Date</Text>
                                        <Text size="sm">{formatDate(invoice.paymentDueDate)}</Text>
                                    </div>
                                )}
                            </Group>
                        </Paper>
                    )}

                    {/* Actions */}
                    <Group justify="flex-end">
                        <Button
                            variant="filled"
                            leftSection={<IconFileDownload size={18} />}
                            onClick={handleDownload}
                            loading={downloading}
                        >
                            Download Document
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}
