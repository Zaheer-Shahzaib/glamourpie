import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Badge,
    Table,
    Button,
    Select,
    Grid,
    ActionIcon,
    Tooltip,
    Modal,
    Divider,
    SimpleGrid,
    ThemeIcon,
} from '@mantine/core';
import {
    IconEye,
    IconPackage,
    IconTruck,
    IconCheck,
    IconX,
    IconClock,
    IconCurrencyDollar,
    IconShoppingCart,
    IconFilter,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import { useAuth } from '../Context/useAuth';
import { notifications } from '@mantine/notifications';
import {
    fetchOrders,
    fetchOrderDetails,
    fetchOrderStats,
} from '../Services/order-services';
import {
    OrderListItem,
    OrderQueryParams,
    OrderStatus,
    FulfillmentChannel,
    Order,
    OrderItem,
    OrderStats,
} from '../types/order.types';
import MainLayout from '../layout/Main';
import CountUp from 'react-countup';

const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
        case 'Pending':
        case 'Unshipped':
            return 'orange';
        case 'Shipped':
        case 'PartiallyShipped':
            return 'blue';
        case 'Delivered':
            return 'green';
        case 'Cancelled':
            return 'red';
        default:
            return 'gray';
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export default function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
    const [detailsModalOpened, setDetailsModalOpened] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
    const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentChannel | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    // Load orders
    useEffect(() => {
        loadOrders();
        loadStats();
    }, [token]);

    const loadOrders = async (filters?: OrderQueryParams) => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await fetchOrders(token, filters);
            setOrders(response.payload.orders);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load orders',
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        if (!token) return;

        try {
            const data = await fetchOrderStats(token);
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleApplyFilters = () => {
        const filters: OrderQueryParams = {};

        if (statusFilter) {
            filters.orderStatuses = [statusFilter];
        }

        if (fulfillmentFilter) {
            filters.fulfillmentChannels = [fulfillmentFilter];
        }

        if (dateRange[0]) {
            filters.createdAfter = dateRange[0].toISOString();
        }

        if (dateRange[1]) {
            filters.createdBefore = dateRange[1].toISOString();
        }

        loadOrders(filters);
    };

    const handleClearFilters = () => {
        setStatusFilter(null);
        setFulfillmentFilter(null);
        setDateRange([null, null]);
        loadOrders();
    };

    const handleViewDetails = async (orderId: string) => {
        if (!token) return;

        try {
            setDetailsLoading(true);
            setDetailsModalOpened(true);
            const response = await fetchOrderDetails(token, orderId);
            setSelectedOrder(response.payload.order);
            setSelectedOrderItems(response.payload.orderItems);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to load order details',
                color: 'red',
            });
            setDetailsModalOpened(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <MainLayout>
            <Container fluid py="xl">
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <div>
                            <Title order={2}>Orders</Title>
                            <Text c="dimmed" size="sm">
                                View and manage your Amazon orders
                            </Text>
                        </div>
                    </Group>

                    {/* Statistics */}
                    {stats && (
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
                            <Paper p="md" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                            Total Orders
                                        </Text>
                                        <Text fw={700} size="xl" mt="xs">
                                            <CountUp end={stats.totalOrders} duration={1.5} />
                                        </Text>
                                    </div>
                                    <ThemeIcon color="blue" size={44} radius="md" variant="light">
                                        <IconShoppingCart size={24} stroke={1.5} />
                                    </ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper p="md" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                            Pending
                                        </Text>
                                        <Text fw={700} size="xl" mt="xs">
                                            <CountUp end={stats.pendingOrders} duration={1.5} />
                                        </Text>
                                    </div>
                                    <ThemeIcon color="orange" size={44} radius="md" variant="light">
                                        <IconClock size={24} stroke={1.5} />
                                    </ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper p="md" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                            Shipped
                                        </Text>
                                        <Text fw={700} size="xl" mt="xs">
                                            <CountUp end={stats.shippedOrders} duration={1.5} />
                                        </Text>
                                    </div>
                                    <ThemeIcon color="blue" size={44} radius="md" variant="light">
                                        <IconTruck size={24} stroke={1.5} />
                                    </ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper p="md" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                            Delivered
                                        </Text>
                                        <Text fw={700} size="xl" mt="xs">
                                            <CountUp end={stats.deliveredOrders} duration={1.5} />
                                        </Text>
                                    </div>
                                    <ThemeIcon color="green" size={44} radius="md" variant="light">
                                        <IconCheck size={24} stroke={1.5} />
                                    </ThemeIcon>
                                </Group>
                            </Paper>

                            <Paper p="md" radius="md" withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                            Total Revenue
                                        </Text>
                                        <Text fw={700} size="lg" mt="xs">
                                            {stats.currencyCode}{' '}
                                            <CountUp end={stats.totalRevenue} duration={1.5} decimals={2} separator="," />
                                        </Text>
                                    </div>
                                    <ThemeIcon color="teal" size={44} radius="md" variant="light">
                                        <IconCurrencyDollar size={24} stroke={1.5} />
                                    </ThemeIcon>
                                </Group>
                            </Paper>
                        </SimpleGrid>
                    )}

                    {/* Filters */}
                    <Paper p="md" radius="md" withBorder>
                        <Stack gap="md">
                            <Text fw={600}>Filters</Text>
                            <Grid>
                                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                    <Select
                                        label="Order Status"
                                        placeholder="All statuses"
                                        value={statusFilter}
                                        onChange={(value) => setStatusFilter(value as OrderStatus)}
                                        data={[
                                            { value: 'Pending', label: 'Pending' },
                                            { value: 'Shipped', label: 'Shipped' },
                                            { value: 'Delivered', label: 'Delivered' },
                                            { value: 'Cancelled', label: 'Cancelled' },
                                        ]}
                                        clearable
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                                    <Select
                                        label="Fulfillment"
                                        placeholder="All channels"
                                        value={fulfillmentFilter}
                                        onChange={(value) => setFulfillmentFilter(value as FulfillmentChannel)}
                                        data={[
                                            { value: 'FBA', label: 'FBA (Fulfilled by Amazon)' },
                                            { value: 'MFN', label: 'MFN (Merchant Fulfilled)' },
                                        ]}
                                        clearable
                                    />
                                </Grid.Col>

                                <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                                    <DatePickerInput
                                        type="range"
                                        label="Purchase Date Range"
                                        placeholder="Select date range"
                                        value={dateRange}
                                        onChange={() => setDateRange}
                                        clearable
                                    />
                                </Grid.Col>
                            </Grid>

                            <Group justify="flex-end">
                                <Button variant="subtle" onClick={handleClearFilters}>
                                    Clear Filters
                                </Button>
                                <Button leftSection={<IconFilter size={16} />} onClick={handleApplyFilters}>
                                    Apply Filters
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>

                    {/* Orders Table */}
                    <Paper radius="md" withBorder>
                        <Table.ScrollContainer minWidth={800}>
                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Order ID</Table.Th>
                                        <Table.Th>Purchase Date</Table.Th>
                                        <Table.Th>Customer</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Items</Table.Th>
                                        <Table.Th>Total</Table.Th>
                                        <Table.Th>Fulfillment</Table.Th>
                                        <Table.Th>Marketplace</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {loading ? (
                                        <Table.Tr>
                                            <Table.Td colSpan={9}>
                                                <Text ta="center" py="xl">
                                                    Loading orders...
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ) : orders.length === 0 ? (
                                        <Table.Tr>
                                            <Table.Td colSpan={9}>
                                                <Text ta="center" py="xl" c="dimmed">
                                                    No orders found
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ) : (
                                        orders.map((order) => (
                                            <Table.Tr key={order.amazonOrderId}>
                                                <Table.Td>
                                                    <Group>
                                                        <Text fw={600} size="sm">
                                                            {order.amazonOrderId}
                                                        </Text>
                                                        {order.isPrime && (
                                                            <Badge size="xs" color="blue" mt={4}>
                                                                Prime
                                                            </Badge>
                                                        )}
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">{formatDate(order.purchaseDate)}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">{order.buyerName || 'N/A'}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge color={getStatusColor(order.orderStatus)} variant="filled">
                                                        {order.orderStatus}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm">{order.numberOfItems}</Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text fw={600} size="sm">
                                                        {formatCurrency(order.orderTotal, order.currencyCode)}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge variant="outline">{order.fulfillmentChannel}</Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge variant="light">{order.marketplaceId}</Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Tooltip label="View Details">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="blue"
                                                            onClick={() => handleViewDetails(order.amazonOrderId)}
                                                        >
                                                            <IconEye size={18} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Paper>
                </Stack>
            </Container>

            {/* Order Details Modal */}
            <Modal
                opened={detailsModalOpened}
                onClose={() => setDetailsModalOpened(false)}
                title="Order Details"
                size="xl"
                padding="lg"
            >
                {detailsLoading || !selectedOrder ? (
                    <Text>Loading order details...</Text>
                ) : (
                    <Stack gap="lg">
                        {/* Order Header */}
                        <Paper p="md" withBorder>
                            <Group justify="space-between" mb="md">
                                <div>
                                    <Text fw={700} size="lg">
                                        {selectedOrder.amazonOrderId}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Purchased: {formatDate(selectedOrder.purchaseDate)}
                                    </Text>
                                </div>
                                <Badge size="lg" color={getStatusColor(selectedOrder.orderStatus)} variant="filled">
                                    {selectedOrder.orderStatus}
                                </Badge>
                            </Group>

                            <Grid>
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Fulfillment Channel
                                    </Text>
                                    <Badge variant="outline">{selectedOrder.fulfillmentChannel}</Badge>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="sm" c="dimmed">
                                        Marketplace
                                    </Text>
                                    <Badge variant="light">{selectedOrder.marketplaceId}</Badge>
                                </Grid.Col>
                            </Grid>
                        </Paper>

                        {/* Customer Information */}
                        {selectedOrder.shippingAddress && (
                            <Paper p="md" withBorder>
                                <Text fw={600} mb="sm">
                                    Shipping Address
                                </Text>
                                <Stack gap="xs">
                                    <Text size="sm">{selectedOrder.shippingAddress.name}</Text>
                                    {selectedOrder.shippingAddress.addressLine1 && (
                                        <Text size="sm">{selectedOrder.shippingAddress.addressLine1}</Text>
                                    )}
                                    <Text size="sm">
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                                    </Text>
                                    <Text size="sm">{selectedOrder.shippingAddress.countryCode}</Text>
                                </Stack>
                            </Paper>
                        )}

                        {/* Order Items */}
                        <Paper p="md" withBorder>
                            <Text fw={600} mb="md">
                                Order Items
                            </Text>
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Product</Table.Th>
                                        <Table.Th>SKU</Table.Th>
                                        <Table.Th>Quantity</Table.Th>
                                        <Table.Th>Price</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {selectedOrderItems.map((item) => (
                                        <Table.Tr key={item.orderItemId}>
                                            <Table.Td>
                                                <Text size="sm" fw={500}>
                                                    {item.title}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    ASIN: {item.asin}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{item.sku}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">{item.quantityOrdered}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" fw={600}>
                                                    {formatCurrency(item.itemPrice.amount, item.itemPrice.currencyCode)}
                                                </Text>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Paper>

                        {/* Order Total */}
                        {selectedOrder.orderTotal && (
                            <Paper p="md" withBorder>
                                <Group justify="space-between">
                                    <Text fw={700} size="lg">
                                        Order Total:
                                    </Text>
                                    <Text fw={700} size="lg">
                                        {formatCurrency(
                                            selectedOrder.orderTotal.amount,
                                            selectedOrder.orderTotal.currencyCode
                                        )}
                                    </Text>
                                </Group>
                            </Paper>
                        )}
                    </Stack>
                )}
            </Modal>
        </MainLayout>
    );
}
