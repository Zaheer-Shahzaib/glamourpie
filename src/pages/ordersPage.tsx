import { useState, useMemo } from "react";
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
  TextInput,
  Grid,
  ActionIcon,
  Tooltip,
  Modal,
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import {
  IconEye,
  IconCheck,
  IconX,
  IconClock,
  IconCurrencyDollar,
  IconShoppingCart,
  IconFilter,
  IconFileInvoice,
  IconTruck,
  IconSearch,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useAuth } from "../Context/useAuth";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders, useOrderStats } from "../hooks/useOrders";
import { fetchOrderDetails } from "../Services/order-services";
import { generateManualInvoice } from "../Services/invoice-services";
import {
  OrderQueryParams,
  OrderStatus,
  Order,
  OrderItem,
} from "../types/order.types";
import MainLayout from "../layout/Main";
import CountUp from "react-countup";

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
    case "Unshipped":
      return "orange";
    case "Shipped":
    case "PartiallyShipped":
      return "blue";
    case "Delivered":
      return "green";
    case "Cancelled":
      return "red";
    default:
      return "gray";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number, currency: string): string => {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function OrdersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Filters & pagination state
  const [tokenHistory, setTokenHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentNextToken, setCurrentNextToken] = useState<string | undefined>(undefined);

  // ── Filter controls (Inputs) ─────────────
  const [statusInput, setStatusInput] = useState<OrderStatus | null>(null);
  const [orderIdInput, setOrderIdInput] = useState<string>('');
  const [dateRangeInput, setDateRangeInput] = useState<[Date | null, Date | null]>([null, null]);

  // ── Applied Filters (Used by useMemo) ────
  const [appliedFilters, setAppliedFilters] = useState({
    status: null as OrderStatus | null,
    orderId: '',
    dateRange: [null, null] as [Date | null, Date | null]
  });

  // Order details modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // ── React Query: fetch single page, only pass nextToken if present ────────
  const { data: ordersData, isFetching: loading } = useOrders(
    currentNextToken ? { nextToken: currentNextToken } : {}
  );
  const { data: stats } = useOrderStats();

  const rawOrders = ordersData?.payload?.orders ?? [];
  const resolvedNextToken = ordersData?.payload?.nextToken ?? null;

  // ── Client-side filtering (no API call, instant on currently loaded page) ──
  const filteredOrders = useMemo(() => {
    let result = [...rawOrders];

    if (appliedFilters.status) {
      result = result.filter((o) => o.orderStatus === appliedFilters.status);
    }

    if (appliedFilters.orderId.trim()) {
      const search = appliedFilters.orderId.trim().toLowerCase();
      result = result.filter((o) =>
        o.amazonOrderId?.toLowerCase().includes(search)
      );
    }

    if (appliedFilters.dateRange[0]) {
      const from = new Date(appliedFilters.dateRange[0]);
      from.setHours(0, 0, 0, 0);
      result = result.filter((o) => new Date(o.purchaseDate) >= from);
    }

    if (appliedFilters.dateRange[1]) {
      const to = new Date(appliedFilters.dateRange[1]);
      to.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.purchaseDate) <= to);
    }

    // Always sort descending (newest first)
    result.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

    return result;
  }, [rawOrders, appliedFilters]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusInput,
      orderId: orderIdInput,
      dateRange: dateRangeInput
    });
  };

  const handleClearFilters = () => {
    setStatusInput(null);
    setOrderIdInput('');
    setDateRangeInput([null, null]);
    setAppliedFilters({ status: null, orderId: '', dateRange: [null, null] });
  };

  const handleNextPage = () => {
    if (!resolvedNextToken) return;
    setTokenHistory((h) => [...h, currentNextToken || '']);
    setCurrentPage((p) => p + 1);
    setCurrentNextToken(resolvedNextToken);
  };

  const handlePrevPage = () => {
    if (tokenHistory.length === 0) return;
    const newHistory = [...tokenHistory];
    const prevToken = newHistory.pop();
    setTokenHistory(newHistory);
    setCurrentPage((p) => p - 1);
    setCurrentNextToken(prevToken === '' ? undefined : prevToken);
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
        title: "Error",
        message: "Failed to load order details",
        color: "red",
      });
      setDetailsModalOpened(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    if (!token) return;

    try {
      setGeneratingId(orderId);
      await generateManualInvoice(token, orderId);
      notifications.show({
        title: "Success",
        message: "Invoice generated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      let message = "Failed to generate invoice";

      if (error.response?.data?.error === "Blob") {
        // Since it's a blob, we have to read it carefully to parse the JSON error
        try {
          const text = await error.response.data.text();
          const parse = JSON.parse(text);
          if (parse.error) message = parse.error;
        } catch (e) {}
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      notifications.show({
        title: "Generation Failed",
        message,
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setGeneratingId(null);
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
                  <ThemeIcon
                    color="orange"
                    size={44}
                    radius="md"
                    variant="light"
                  >
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
                  <ThemeIcon
                    color="green"
                    size={44}
                    radius="md"
                    variant="light"
                  >
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
                      {stats.currencyCode}{" "}
                      <CountUp
                        end={stats.totalRevenue}
                        duration={1.5}
                        decimals={2}
                        separator=","
                      />
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
                    value={statusInput}
                    onChange={(value) => setStatusInput(value as OrderStatus)}
                    data={[
                      { value: "Pending", label: "Pending" },
                      { value: "Unshipped", label: "Unshipped" },
                      { value: "Shipped", label: "Shipped" },
                      { value: "Delivered", label: "Delivered" },
                      { value: "Cancelled", label: "Cancelled" },
                    ]}
                    clearable
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <TextInput
                    label="Order ID"
                    placeholder="Search by Amazon Order ID"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                  <DatePickerInput
                    type="range"
                    label="Purchase Date Range"
                    placeholder="Select date range"
                    value={dateRangeInput}
                    onChange={(val) => setDateRangeInput(val as [Date | null, Date | null])}
                    clearable
                  />
                </Grid.Col>
              </Grid>

              <Group justify="flex-end">
                <Button variant="subtle" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
                <Button
                  leftSection={<IconFilter size={16} />}
                  onClick={handleApplyFilters}
                >
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
                  ) : filteredOrders.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={9}>
                        <Text ta="center" py="xl" c="dimmed">
                          {rawOrders.length > 0 ? 'No orders match your filters' : 'No orders found'}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filteredOrders.map((order) => (
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
                          <Text size="sm">
                            {formatDate(order.purchaseDate)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{order.buyerName || "N/A"}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={getStatusColor(order.orderStatus)}
                            variant="filled"
                          >
                            {order.orderStatus}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{order.numberOfItems}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} size="sm">
                            {formatCurrency(
                              order.orderTotal,
                              order.currencyCode,
                            )}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline">
                            {order.fulfillmentChannel}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light">{order.marketplaceId}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() =>
                                  handleViewDetails(order.amazonOrderId)
                                }
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Generate Invoice">
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                loading={generatingId === order.amazonOrderId}
                                onClick={() =>
                                  handleGenerateInvoice(order.amazonOrderId)
                                }
                              >
                                <IconFileInvoice size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>

          {/* Pagination Controls */}
          <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
              Page {currentPage}
            </Text>
            <Group>
              <Button
                variant="default"
                disabled={tokenHistory.length === 0 || loading}
                onClick={handlePrevPage}
              >
                Previous
              </Button>
              <Button
                variant="default"
                disabled={!resolvedNextToken || loading}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </Group>
          </Group>
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
                <Badge
                  size="lg"
                  color={getStatusColor(selectedOrder.orderStatus)}
                  variant="filled"
                >
                  {selectedOrder.orderStatus}
                </Badge>
              </Group>

              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">
                    Fulfillment Channel
                  </Text>
                  <Badge variant="outline">
                    {selectedOrder.fulfillmentChannel}
                  </Badge>
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
                    <Text size="sm">
                      {selectedOrder.shippingAddress.addressLine1}
                    </Text>
                  )}
                  <Text size="sm">
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.postalCode}
                  </Text>
                  <Text size="sm">
                    {selectedOrder.shippingAddress.countryCode}
                  </Text>
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
                          {formatCurrency(
                            item.itemPrice.amount,
                            item.itemPrice.currencyCode,
                          )}
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
                      selectedOrder.orderTotal.currencyCode,
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
