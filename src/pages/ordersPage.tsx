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
  // OrderQueryParams,
  OrderStatus,
  Order,
  OrderItem,
  OrderListItem,
} from "../types/order.types";
import MainLayout from "../layout/Main";
import CountUp from "react-countup";

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "PENDING":
    case "UNSHIPPED":
    case "PENDING_AVAILABILITY":
      return "orange";
    case "SHIPPED":
    case "PARTIALLY_SHIPPED":
      return "blue";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
    case "UNFULFILLABLE":
      return "red";
    case "INVOICE_UNCONFIRMED":
      return "yellow";
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

  // Client-side pagination
  const PAGE_SIZE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filter controls (Inputs) ─────────────
  const [statusInput, setStatusInput] = useState<OrderStatus | null>(null);
  const [orderIdInput, setOrderIdInput] = useState<string>("");
  const [dateRangeInput, setDateRangeInput] = useState<
    [Date | null, Date | null]
  >([null, null]);

  // ── Applied Filters (Used by useMemo) ────
  const [appliedFilters, setAppliedFilters] = useState({
    status: null as OrderStatus | null,
    orderId: "",
    dateRange: [null, null] as [Date | null, Date | null],
  });

  // Order details modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // ── React Query: fetch all orders in one call ────────────────────────────
  const { data: ordersData, isFetching: loading } = useOrders({});
  const { data: stats } = useOrderStats();

  const rawOrders = ordersData?.payload?.orders ?? [];

  // ── Client-side filtering (no API call, instant on currently loaded page) ──
  const filteredOrders = useMemo(() => {
    let result = [...rawOrders];

    if (appliedFilters.status) {
      result = result.filter((o) => {
        const status = o.fulfillment?.fulfillmentStatus || o.orderStatus;
        return status === appliedFilters.status;
      });
    }

    if (appliedFilters.orderId.trim()) {
      const search = appliedFilters.orderId.trim().toLowerCase();
      result = result.filter((o) => o.orderId?.toLowerCase().includes(search));
    }

    if (appliedFilters.dateRange[0]) {
      const from = new Date(appliedFilters.dateRange[0]);
      from.setHours(0, 0, 0, 0);
      result = result.filter((o) => new Date(o.createdTime) >= from);
    }

    if (appliedFilters.dateRange[1]) {
      const to = new Date(appliedFilters.dateRange[1]);
      to.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.createdTime) <= to);
    }

    // Always sort descending (newest first)
    result.sort(
      (a, b) =>
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
    );

    return result;
  }, [rawOrders, appliedFilters]);

  // Slice filtered results to the current page
  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage, PAGE_SIZE]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusInput,
      orderId: orderIdInput,
      dateRange: dateRangeInput,
    });
    setCurrentPage(1); // reset to first page on new filter
  };

  const handleClearFilters = () => {
    setStatusInput(null);
    setOrderIdInput("");
    setDateRangeInput([null, null]);
    setAppliedFilters({ status: null, orderId: "", dateRange: [null, null] });
    setCurrentPage(1);
  };

  const handleViewDetails = async (orderId: string) => {
    if (!token) return;

    try {
      setDetailsLoading(true);
      setDetailsModalOpened(true);
      const response = await fetchOrderDetails(token, orderId);
      // SP-API 2026-01-01: payload.order contains the order; orderItems is nested inside it
      const orderObj = response.payload?.order ?? response.payload;
      // orderItems may be inside the order object itself
      const items = orderObj?.orderItems || response.payload?.orderItems || [];
      setSelectedOrder(orderObj);
      setSelectedOrderItems(items);
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
                      { value: "PENDING", label: "Pending" },
                      { value: "UNSHIPPED", label: "Unshipped" },
                      {
                        value: "PARTIALLY_SHIPPED",
                        label: "Partially Shipped",
                      },
                      { value: "SHIPPED", label: "Shipped" },
                      { value: "DELIVERED", label: "Delivered" },
                      { value: "CANCELLED", label: "Cancelled" },
                      { value: "UNFULFILLABLE", label: "Unfulfillable" },
                      {
                        value: "INVOICE_UNCONFIRMED",
                        label: "Invoice Unconfirmed",
                      },
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
                    onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, md: 6 }}>
                  <DatePickerInput
                    type="range"
                    label="Purchase Date Range"
                    placeholder="Select date range"
                    value={dateRangeInput}
                    onChange={(val) =>
                      setDateRangeInput(val as [Date | null, Date | null])
                    }
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
                  ) : pagedOrders.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={9}>
                        <Text ta="center" py="xl" c="dimmed">
                          {rawOrders.length > 0
                            ? "No orders match your filters"
                            : "No orders found"}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    pagedOrders.map((order) => (
                      <Table.Tr key={order.orderId}>
                        <Table.Td>
                          <Group>
                            <Text fw={600} size="sm">
                              {order.orderId}
                            </Text>
                            {order.isPrime && (
                              <Badge size="xs" color="blue" mt={4}>
                                Prime
                              </Badge>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{formatDate(order.createdTime)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {order.buyer?.buyerName || order.buyer?.name || "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {/* SP-API list: status is at fulfillment.fulfillmentStatus */}
                          {(() => {
                            const status =
                              order.fulfillment?.fulfillmentStatus ||
                              order.orderStatus;
                            return (
                              <Badge
                                color={getStatusColor(status as any)}
                                variant="filled"
                              >
                                {status || "—"}
                              </Badge>
                            );
                          })()}
                        </Table.Td>
                        <Table.Td>
                          {/* Item count: sum quantityOrdered across orderItems */}
                          <Text size="sm">
                            {order.orderItems
                              ? order.orderItems.reduce(
                                  (sum: number, i: any) =>
                                    sum + (i.quantityOrdered || 1),
                                  0,
                                )
                              : (order.numberOfItemsShipped ?? 0) +
                                (order.numberOfItemsUnshipped ?? 0)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {/* SP-API list: total is at proceeds.grandTotal */}
                          <Text fw={600} size="sm">
                            {(() => {
                              const t =
                                order.proceeds?.grandTotal || order.orderTotal;
                              return t
                                ? formatCurrency(
                                    parseFloat(t.amount),
                                    t.currencyCode,
                                  )
                                : "—";
                            })()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {/* SP-API list: fulfilledBy is at fulfillment.fulfilledBy */}
                          <Badge variant="outline">
                            {order.fulfillment?.fulfilledBy ||
                              order.fulfillmentChannel ||
                              "—"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light">
                            {order.salesChannel?.marketplaceName ||
                              order.salesChannel?.marketplaceId ||
                              "—"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => handleViewDetails(order.orderId)}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Generate Invoice">
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                loading={generatingId === order.orderId}
                                onClick={() =>
                                  handleGenerateInvoice(order.orderId)
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
          {(() => {
            const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
            return totalPages > 1 ? (
              <Group justify="space-between" mt="md">
                <Text size="sm" c="dimmed">
                  Page {currentPage} of {totalPages} &nbsp;·&nbsp;{" "}
                  {filteredOrders.length} orders
                </Text>
                <Group>
                  <Button
                    variant="default"
                    disabled={currentPage <= 1 || loading}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="default"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </Group>
              </Group>
            ) : null;
          })()}
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
                    {selectedOrder.orderId}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Purchased: {formatDate(selectedOrder.createdTime)}
                  </Text>
                  {selectedOrder.lastUpdatedTime && (
                    <Text size="sm" c="dimmed">
                      Last Updated: {formatDate(selectedOrder.lastUpdatedTime)}
                    </Text>
                  )}
                  {(selectedOrder.buyer?.buyerName ||
                    selectedOrder.buyer?.name) && (
                    <Text size="sm" c="dimmed">
                      Buyer:{" "}
                      {selectedOrder.buyer?.buyerName ||
                        selectedOrder.buyer?.name}
                    </Text>
                  )}
                </div>
                {/* SP-API detail: status lives at fulfillment.fulfillmentStatus */}
                {(() => {
                  const status =
                    selectedOrder.orderStatus ||
                    selectedOrder.fulfillment?.fulfillmentStatus;
                  return status ? (
                    <Badge
                      size="lg"
                      color={getStatusColor(status as any)}
                      variant="filled"
                    >
                      {status}
                    </Badge>
                  ) : null;
                })()}
              </Group>

              <Grid mt="xs" gutter="sm">
                {/* Sales Channel */}
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Marketplace
                  </Text>
                  <Badge variant="light" color="blue" mt={4}>
                    {selectedOrder.salesChannel?.marketplaceName || "—"}
                  </Badge>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Channel
                  </Text>
                  <Badge variant="dot" color="green" mt={4}>
                    {selectedOrder.salesChannel?.channelName || "—"}
                  </Badge>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Marketplace ID
                  </Text>
                  <Text size="sm" ff="monospace" mt={4}>
                    {selectedOrder.salesChannel?.marketplaceId || "—"}
                  </Text>
                </Grid.Col>

                {/* Fulfillment */}
                <Grid.Col span={6}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                    Fulfilled By
                  </Text>
                  <Badge variant="outline" mt={4}>
                    {selectedOrder.fulfillment?.fulfilledBy ||
                      selectedOrder.fulfillmentChannel ||
                      "—"}
                  </Badge>
                </Grid.Col>
                {selectedOrder.fulfillment?.fulfillmentServiceLevel && (
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Service Level
                    </Text>
                    <Badge variant="outline" color="orange" mt={4}>
                      {selectedOrder.fulfillment.fulfillmentServiceLevel}
                    </Badge>
                  </Grid.Col>
                )}
                {selectedOrder.fulfillment?.shipByWindow?.latestDateTime && (
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                      Ship By
                    </Text>
                    <Text size="sm" mt={4}>
                      {formatDate(
                        selectedOrder.fulfillment.shipByWindow.latestDateTime,
                      )}
                    </Text>
                  </Grid.Col>
                )}
              </Grid>
            </Paper>

            {/* Recipient / Shipping Address */}
            {selectedOrder.recipient && (
              <Paper p="md" withBorder>
                <Text fw={600} mb="sm">
                  Shipping Address
                </Text>
                {/* SP-API 2026-01-01: address is under deliveryAddress */}
                {(() => {
                  const addr =
                    selectedOrder.recipient.deliveryAddress ||
                    selectedOrder.recipient.address;
                  return (
                    <Stack gap="xs">
                      {addr?.name && (
                        <Text size="sm" fw={500}>
                          {addr.name}
                        </Text>
                      )}
                      {addr?.addressLine1 && (
                        <Text size="sm">{addr.addressLine1}</Text>
                      )}
                      {(addr?.city || addr?.postalCode) && (
                        <Text size="sm">
                          {[addr?.city, addr?.postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                      )}
                      {addr?.districtOrCounty && (
                        <Text size="sm" c="dimmed">
                          {addr.districtOrCounty}
                        </Text>
                      )}
                      {addr?.countryCode && (
                        <Text size="sm">{addr.countryCode}</Text>
                      )}
                    </Stack>
                  );
                })()}
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
                  {selectedOrderItems.map((item) => {
                    // SP-API 2026-01-01: product info is nested under item.product
                    const product = item.product || item;
                    const price =
                      product.price?.unitPrice ||
                      item.proceeds?.proceedsTotal ||
                      item.itemPrice;
                    const title =
                      product.title ||
                      item.title ||
                      item.productTitle ||
                      product.asin;
                    const asin = product.asin || item.asin;
                    const sku = product.sellerSku || item.sellerSku || item.sku;

                    return (
                      <Table.Tr key={item.orderItemId}>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            ASIN: {asin}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{sku || "—"}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{item.quantityOrdered}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600}>
                            {price
                              ? formatCurrency(
                                  parseFloat(price.amount),
                                  price.currencyCode,
                                )
                              : "—"}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Paper>

            {/* Price Breakdown — SP-API 2026-01-01 proceeds.breakdowns */}
            {(() => {
              // Collect all breakdowns: prefer item-level, fall back to order-level
              const allBreakdowns: any[] = [];
              selectedOrderItems.forEach((item) => {
                if (item.proceeds?.breakdowns?.length) {
                  item.proceeds.breakdowns.forEach((b: any) => {
                    allBreakdowns.push({ ...b, _itemId: item.orderItemId });
                  });
                }
              });
              // If no item-level breakdowns, try order-level
              const breakdowns =
                allBreakdowns.length > 0
                  ? allBreakdowns
                  : selectedOrder.proceeds?.breakdowns || [];

              const grandTotal =
                selectedOrder.proceeds?.grandTotal || selectedOrder.orderTotal;

              if (!breakdowns.length && !grandTotal) return null;

              const isDeduction = (type: string) =>
                ["DISCOUNT", "PROMOTION", "COUPON"].includes(
                  type?.toUpperCase(),
                );

              const typeLabel: Record<string, string> = {
                ITEM: "Items Subtotal",
                SHIPPING: "Shipping",
                GIFT_WRAP: "Gift Wrap",
                DISCOUNT: "Discount",
                PROMOTION: "Promotion",
                COUPON: "Coupon",
                TAX: "Tax",
                FEE: "Fee",
              };

              return (
                <Paper p="md" withBorder>
                  <Text fw={600} mb="sm">
                    Price Breakdown
                  </Text>
                  <Stack gap={6}>
                    {breakdowns.map((b: any, i: number) => {
                      const deduction = isDeduction(b.type);
                      const label = typeLabel[b.type?.toUpperCase()] || b.type;
                      const amt = parseFloat(b.subtotal?.amount || "0");
                      const currency = b.subtotal?.currencyCode || "";

                      return (
                        <div key={i}>
                          <Group justify="space-between">
                            <Group gap={6}>
                              <Text size="sm" c={deduction ? "red" : "inherit"}>
                                {label}
                              </Text>
                              {deduction && (
                                <Badge size="xs" color="red" variant="light">
                                  deduction
                                </Badge>
                              )}
                            </Group>
                            <Text
                              size="sm"
                              fw={500}
                              c={deduction ? "red" : "inherit"}
                            >
                              {deduction ? "−" : ""}
                              {formatCurrency(amt, currency)}
                            </Text>
                          </Group>
                          {/* Detailed sub-breakdowns (e.g. DISCOUNT → SHIPPING) */}
                          {b.detailedBreakdowns?.map((d: any, j: number) => (
                            <Group
                              key={j}
                              justify="space-between"
                              pl="md"
                              mt={2}
                            >
                              <Text size="xs" c="dimmed">
                                └ {d.subtype}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {formatCurrency(
                                  parseFloat(d.value?.amount || "0"),
                                  d.value?.currencyCode || currency,
                                )}
                              </Text>
                            </Group>
                          ))}
                        </div>
                      );
                    })}

                    {/* Divider + grand total */}
                    {grandTotal && (
                      <>
                        <div
                          style={{
                            borderTop:
                              "1px solid var(--mantine-color-default-border)",
                            margin: "4px 0",
                          }}
                        />
                        <Group justify="space-between">
                          <Text fw={700} size="sm">
                            Order Total
                          </Text>
                          <Text fw={700} size="sm">
                            {formatCurrency(
                              parseFloat(grandTotal.amount),
                              grandTotal.currencyCode,
                            )}
                          </Text>
                        </Group>
                      </>
                    )}
                  </Stack>
                </Paper>
              );
            })()}
          </Stack>
        )}
      </Modal>
    </MainLayout>
  );
}
