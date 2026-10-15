import { useState, useMemo } from "react";
import {
  Text,
  Group,
  Table,
  Button,
  Select,
  TextInput,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconEye,
  IconCheck,
  IconX,
  IconFileInvoice,
  IconSearch,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useAuth } from "../Context/useAuth";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders, useOrderStats } from "../hooks/useOrders";
import { useInvoices } from "../hooks/useInvoices";
import { fetchOrderDetails } from "../Services/order-services";
import { generateManualInvoice } from "../Services/invoice-services";
import { OrderStatus, OrderQueryParams } from "../types/order.types";
import MainLayout from "../layout/Main";
import OrderDetailsModal from "../Components/Orders/OrderDetailsModal";
import OrderRevenueCard from "../Components/Orders/OrderRevenueCard";
import CountUp from "react-countup";
import {
  AppCard,
  CardHeader,
  PageHeader,
  StatusPill,
  appButton,
  cx,
  orderStatusTone,
} from "../Components/AppUi";
import {
  formatCurrency,
  formatStatusLabel,
  getBuyerName,
  getOrderStatus,
  getOrderTotal,
} from "../utils/orderFields";
import classes from "./OrdersPage.module.scss";

// Statuses that are eligible for invoice generation
const INVOICEABLE_STATUSES = new Set([
  "SHIPPED",
  "Shipped",
  "DELIVERED",
  "Delivered",
  "PARTIALLY_SHIPPED",
  "PartiallyShipped",
]);

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

/** Item count: sum quantityOrdered across orderItems */
const getItemCount = (order: any): number =>
  order.orderItems
    ? order.orderItems.reduce(
        (sum: number, i: any) => sum + (i.quantityOrdered || 1),
        0,
      )
    : (order.numberOfItemsShipped ?? 0) + (order.numberOfItemsUnshipped ?? 0);

const formatTime = (dateString?: string): string =>
  dateString
    ? new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

type OrdersView = "cards" | "table";

/** Mantine 8 date pickers use "YYYY-MM-DD" strings */
type DateRange = [string | null, string | null];
const EMPTY_RANGE: DateRange = [null, null];

const toDateString = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/** Parse "YYYY-MM-DD" (or a Date) as a LOCAL date, avoiding UTC shifts */
const parseLocalDate = (value: string | Date | null): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return new Date(value);
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateString(d);
};

const DATE_PRESETS: { label: string; range: () => DateRange }[] = [
  { label: "Today", range: () => [daysAgo(0), daysAgo(0)] },
  { label: "Last 7 days", range: () => [daysAgo(6), daysAgo(0)] },
  { label: "Last 30 days", range: () => [daysAgo(29), daysAgo(0)] },
  {
    label: "This month",
    range: () => {
      const now = new Date();
      return [toDateString(new Date(now.getFullYear(), now.getMonth(), 1)), daysAgo(0)];
    },
  },
];

const formatRangeLabel = (range: DateRange): string => {
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(withYear ? { year: "numeric" } : {}),
    });
  const from = parseLocalDate(range[0]);
  const to = parseLocalDate(range[1]);
  if (from && to) {
    return from.getTime() === to.getTime()
      ? fmt(from, true)
      : `${fmt(from, false)} – ${fmt(to, true)}`;
  }
  if (from) return `From ${fmt(from, true)}`;
  if (to) return `Until ${fmt(to, true)}`;
  return "Loaded orders";
};

export default function OrdersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // ── SP-API page-by-page pagination (nextToken) ───────────────────────────
  // tokens[0] = undefined (first page); tokens[n] = nextToken used to fetch page n+1
  const [pageTokens, setPageTokens] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const [pageIndex, setPageIndex] = useState(0);

  // ── Filter controls (Inputs) ─────────────
  const [statusInput, setStatusInput] = useState<OrderStatus | null>(null);
  const [orderIdInput, setOrderIdInput] = useState<string>("");
  const [dateRangeInput, setDateRangeInput] = useState<DateRange>(EMPTY_RANGE);

  // ── Applied Filters (Used by useMemo) ────
  const [appliedFilters, setAppliedFilters] = useState({
    status: null as OrderStatus | null,
    orderId: "",
    dateRange: EMPTY_RANGE,
  });

  // Order details modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [view, setView] = useState<OrdersView>("cards");

  // Client only sends nextToken; backend owns createdAfter/createdBefore
  const orderQueryParams = useMemo<OrderQueryParams>(() => {
    const nextToken = pageTokens[pageIndex];
    return nextToken ? { nextToken } : {};
  }, [pageTokens, pageIndex]);

  // ── React Query: one SP-API page + invoices in parallel ──────────────────
  const { data: ordersData, isFetching: loading } = useOrders(orderQueryParams);
  const { data: stats } = useOrderStats();
  const { invoices: existingInvoices } = useInvoices({ limit: 9999 });

  const invoicedOrderIds = useMemo(
    () =>
      new Set(
        existingInvoices.map((inv: any) => inv.amazonOrderId).filter(Boolean),
      ),
    [existingInvoices],
  );

  /**
   * Returns true only when invoice generation is allowed:
   *   1. Order status is Shipped / Delivered / PartiallyShipped
   *   2. No invoice already exists for this order
   */
  const canGenerateInvoice = (
    order: any,
  ): { allowed: boolean; reason: string } => {
    const status =
      order.fulfillment?.fulfillmentStatus || order.orderStatus || "";
    const orderId = order.orderId || order.amazonOrderId || "";

    if (invoicedOrderIds.has(orderId)) {
      return { allowed: false, reason: "Invoice already generated" };
    }
    if (!INVOICEABLE_STATUSES.has(status)) {
      return {
        allowed: false,
        reason: `Cannot invoice ${status || "unknown"} orders`,
      };
    }
    return { allowed: true, reason: "Generate Invoice" };
  };

  // Raw SP-API order objects — unchanged from backend payload
  const rawOrders = useMemo(
    () => ordersData?.payload?.orders ?? [],
    [ordersData],
  );
  const hasMore = Boolean(
    ordersData?.payload?.hasMore ?? ordersData?.payload?.nextToken,
  );

  // ── Client-side filtering on the current SP-API page only ───────────────
  const filteredOrders = useMemo(() => {
    let result = [...rawOrders];

    if (appliedFilters.status) {
      result = result.filter((o) => {
        const status = o.fulfillment?.fulfillmentStatus || o.orderStatus;
        return status === appliedFilters.status;
      });
    }

    // Search matches the order ID, the buyer name or any item SKU
    if (appliedFilters.orderId.trim()) {
      const search = appliedFilters.orderId.trim().toLowerCase();
      result = result.filter((o) => {
        const skus = (o.orderItems || []).map((i: any) =>
          String(i.product?.sellerSku || i.sellerSku || i.sku || "").toLowerCase(),
        );
        return (
          o.orderId?.toLowerCase().includes(search) ||
          getBuyerName(o).toLowerCase().includes(search) ||
          skus.some((sku: string) => sku.includes(search))
        );
      });
    }

    const from = parseLocalDate(appliedFilters.dateRange[0]);
    if (from) {
      from.setHours(0, 0, 0, 0);
      result = result.filter((o) => new Date(o.createdTime) >= from);
    }

    const to = parseLocalDate(appliedFilters.dateRange[1]);
    if (to) {
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

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setAppliedFilters({
      status: statusInput,
      orderId: orderIdInput,
      dateRange: dateRangeInput,
    });
  };

  const handleClearFilters = () => {
    setStatusInput(null);
    setOrderIdInput("");
    setDateRangeInput(EMPTY_RANGE);
    setAppliedFilters({ status: null, orderId: "", dateRange: EMPTY_RANGE });
  };

  /** Date range filters apply immediately (no need to press Apply) */
  const handleDateRangeChange = (range: DateRange) => {
    setDateRangeInput(range);
    // wait until both ends are picked, or the range is cleared
    if ((range[0] && range[1]) || (!range[0] && !range[1])) {
      setAppliedFilters((prev) => ({ ...prev, dateRange: range }));
    }
  };

  // Window covered by the currently loaded SP-API page
  const loadedWindow = useMemo(() => {
    const times = rawOrders
      .map((o: any) => new Date(o.createdTime).getTime())
      .filter((t: number) => Number.isFinite(t));
    if (times.length === 0) return null;
    return formatRangeLabel([
      toDateString(new Date(Math.min(...times))),
      toDateString(new Date(Math.max(...times))),
    ]);
  }, [rawOrders]);

  const dateFilterActive = Boolean(
    appliedFilters.dateRange[0] || appliedFilters.dateRange[1],
  );

  const handleNextPage = () => {
    const nextToken = ordersData?.payload?.nextToken;
    if (!nextToken) return;

    setPageTokens((prev) => {
      const trimmed = prev.slice(0, pageIndex + 1);
      return [...trimmed, nextToken];
    });
    setPageIndex((i) => i + 1);
  };

  const handlePrevPage = () => {
    setPageIndex((i) => Math.max(0, i - 1));
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
      // Invalidate invoices cache so the button disables immediately after success
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      notifications.show({
        title: "Success",
        message: "Invoice generated successfully",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error: any) {
      let message = "Failed to generate invoice";

      if (error.response?.data?.error === "Blob") {
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

  const totalCount = stats?.totalOrders ?? filteredOrders.length;
  const pctOfOrders = (n: number) =>
    stats && stats.totalOrders > 0
      ? `${Math.round((n / stats.totalOrders) * 100)}% of orders`
      : "—";
  const summaryItems: {
    label: string;
    value: number;
    meta: string;
    accent: "brand" | "tertiary" | "danger";
  }[] = stats
    ? [
        {
          label: "Total orders",
          value: stats.totalOrders,
          meta: formatCurrency(stats.totalRevenue, stats.currencyCode),
          accent: "brand",
        },
        {
          label: "Shipped",
          value: stats.shippedOrders,
          meta: pctOfOrders(stats.shippedOrders),
          accent: "tertiary",
        },
        {
          label: "Processing",
          value: stats.pendingOrders,
          meta: pctOfOrders(stats.pendingOrders),
          accent: "tertiary",
        },
        {
          label: "Cancelled",
          value: stats.cancelledOrders,
          meta: pctOfOrders(stats.cancelledOrders),
          accent: "danger",
        },
      ]
    : [];

  return (
    <MainLayout>
      <PageHeader
        title="Orders"
        subtitle="Track Amazon orders, fulfillment, buyers, and invoice actions in one view."
      />

      {/* Filters */}
      <AppCard className={classes.filters}>
        <div className={classes.filterGrid}>
          <TextInput
            label="Search orders"
            placeholder="Search by order ID, buyer, or SKU"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
          />
          <Select
            label="Status"
            placeholder="All statuses"
            value={statusInput}
            onChange={(value) => setStatusInput(value as OrderStatus)}
            data={[
              { value: "PENDING", label: "Pending" },
              { value: "UNSHIPPED", label: "Unshipped" },
              { value: "PARTIALLY_SHIPPED", label: "Partially Shipped" },
              { value: "SHIPPED", label: "Shipped" },
              { value: "DELIVERED", label: "Delivered" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "UNFULFILLABLE", label: "Unfulfillable" },
              { value: "INVOICE_UNCONFIRMED", label: "Invoice Unconfirmed" },
            ]}
            clearable
          />
          <DatePickerInput
            type="range"
            label="Purchase date range"
            placeholder="Select date range"
            value={dateRangeInput}
            onChange={(val) => handleDateRangeChange(val as DateRange)}
            maxDate={new Date()}
            clearable
          />
          <div className={classes.filterActions}>
            <Button className={appButton("light")} onClick={handleClearFilters}>
              Clear
            </Button>
            <Button
              className={appButton("primary")}
              rightSection={<IconArrowRight size={14} />}
              onClick={handleApplyFilters}
            >
              Apply filters
            </Button>
          </div>
        </div>

        <div className={classes.presets}>
          <span className={classes.presetsLabel}>Quick range</span>
          {DATE_PRESETS.map((preset) => {
            const range = preset.range();
            const active =
              dateRangeInput[0] === range[0] && dateRangeInput[1] === range[1];
            return (
              <button
                key={preset.label}
                type="button"
                className={cx(classes.preset, active && classes.presetActive)}
                aria-pressed={active}
                onClick={() => handleDateRangeChange(range)}
              >
                {preset.label}
              </button>
            );
          })}
          {loadedWindow && (
            <span className={classes.presetsHint}>
              Date filters apply to the loaded orders ({loadedWindow}). Use
              Next to load older orders.
            </span>
          )}
        </div>
      </AppCard>

      {/* Order revenue (follows the filters, incl. date range) */}
      <OrderRevenueCard
        orders={filteredOrders}
        periodLabel={
          dateFilterActive
            ? formatRangeLabel(appliedFilters.dateRange)
            : "Loaded orders"
        }
        loading={loading}
      />

      {/* Summary strip */}
      {summaryItems.length > 0 && (
        <div className={classes.summary}>
          {summaryItems.map((item) => (
            <div key={item.label} className={classes.summaryItem}>
              <span className={cx(classes.accent, classes[item.accent])} />
              <div className={classes.summaryText}>
                <span className={classes.summaryLabel}>{item.label}</span>
                <span className={classes.summaryValue}>
                  <CountUp end={item.value} duration={1.5} separator="," />
                </span>
              </div>
              <span className={classes.summaryMeta}>{item.meta}</span>
            </div>
          ))}
        </div>
      )}

      {/* Orders list */}
      <AppCard className={classes.list}>
        <CardHeader
          title={view === "cards" ? "Order cards" : "Orders table"}
          subtitle={`Amazon SP-API response fields · ${filteredOrders.length} of ${totalCount} orders`}
          right={
            <div className={classes.toggle} role="group" aria-label="View">
              <button
                type="button"
                className={cx(
                  classes.toggleBtn,
                  view === "cards" && classes.toggleActive,
                )}
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
              >
                Cards
              </button>
              <button
                type="button"
                className={cx(
                  classes.toggleBtn,
                  view === "table" && classes.toggleActive,
                )}
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
              >
                Table
              </button>
            </div>
          }
        />

        {view === "cards" ? (
          <div className={classes.cards}>
            <div className={cx(classes.cardGrid, classes.colHeader)}>
              <span>Order &amp; buyer</span>
              <span>Created / updated</span>
              <span>Status / total</span>
              <span>Marketplace / fulfillment</span>
              <span className={classes.alignEnd}>Actions</span>
            </div>

            {loading ? (
              <Text ta="center" py="xl" c="dimmed">
                Loading orders...
              </Text>
            ) : filteredOrders.length === 0 ? (
              <Text ta="center" py="xl" c="dimmed">
                {rawOrders.length > 0
                  ? "No orders match your filters"
                  : "No orders found"}
              </Text>
            ) : (
              filteredOrders.map((order) => {
                const status = getOrderStatus(order);
                const items = getItemCount(order);
                const { allowed, reason } = canGenerateInvoice(order);
                const generating = generatingId === order.orderId;
                const shipBy = order.fulfillment?.shipByWindow?.latestDateTime;
                return (
                  <div
                    key={order.orderId}
                    className={cx(classes.cardGrid, classes.orderCard)}
                  >
                    <div className={classes.cell}>
                      <span className={classes.primary}>{order.orderId}</span>
                      <span className={classes.secondary}>
                        {getBuyerName(order)}
                      </span>
                    </div>

                    <div className={classes.cell}>
                      <span className={classes.primaryNormal}>
                        {order.createdTime ? formatDate(order.createdTime) : "—"}
                      </span>
                      {order.lastUpdatedTime && (
                        <span className={classes.secondary}>
                          Updated {formatTime(order.lastUpdatedTime)}
                        </span>
                      )}
                    </div>

                    <div className={classes.cell}>
                      <span className={classes.primary}>
                        {getOrderTotal(order)}
                      </span>
                      <span className={classes.statusLine}>
                        <StatusPill tone={orderStatusTone(status)} solid>
                          {formatStatusLabel(status)}
                        </StatusPill>
                        <span className={classes.secondary}>
                          {items} {items === 1 ? "item" : "items"}
                        </span>
                      </span>
                    </div>

                    <div className={classes.cell}>
                      <span className={classes.primaryNormal}>
                        {order.salesChannel?.marketplaceName ||
                          order.salesChannel?.marketplaceId ||
                          "—"}
                      </span>
                      <span className={classes.secondary}>
                        {order.fulfillment?.fulfilledBy ||
                          order.fulfillmentChannel ||
                          "—"}
                        {order.fulfillment?.fulfillmentServiceLevel
                          ? ` · ${order.fulfillment.fulfillmentServiceLevel}`
                          : ""}
                        {shipBy ? ` · Ship by ${formatDate(shipBy)}` : ""}
                      </span>
                    </div>

                    <div className={classes.actions}>
                      {order.isPrime && (
                        <StatusPill tone="info" solid>
                          Prime
                        </StatusPill>
                      )}
                      <Tooltip label="View details">
                        <button
                          type="button"
                          className={classes.actionBtn}
                          onClick={() => handleViewDetails(order.orderId)}
                        >
                          <span className={classes.actionIcon}>
                            <IconEye size={16} />
                          </span>
                          <span className={classes.actionLabel}>View</span>
                        </button>
                      </Tooltip>
                      <Tooltip label={reason}>
                        {/* span wrapper: Mantine Tooltip needs a non-disabled child */}
                        <span>
                          <button
                            type="button"
                            className={classes.actionBtn}
                            disabled={!allowed || generating}
                            onClick={() =>
                              allowed && handleGenerateInvoice(order.orderId)
                            }
                          >
                            <span className={classes.actionIcon}>
                              <IconFileInvoice size={16} />
                            </span>
                            <span className={classes.actionLabel}>
                              {generating ? "…" : "Invoice"}
                            </span>
                          </button>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <Table.ScrollContainer minWidth={800}>
            <Table highlightOnHover>
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
                      <Text ta="center" py="xl" c="dimmed">
                        Loading orders...
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredOrders.length === 0 ? (
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
                  filteredOrders.map((order) => {
                    const status = getOrderStatus(order);
                    const { allowed, reason } = canGenerateInvoice(order);
                    return (
                      <Table.Tr key={order.orderId}>
                        <Table.Td>
                          <Group gap="xs" wrap="nowrap">
                            <Text fw={600} size="sm">
                              {order.orderId}
                            </Text>
                            {order.isPrime && (
                              <StatusPill tone="info" solid>
                                Prime
                              </StatusPill>
                            )}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {order.createdTime
                              ? formatDate(order.createdTime)
                              : "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{getBuyerName(order)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <StatusPill tone={orderStatusTone(status)} solid>
                            {formatStatusLabel(status)}
                          </StatusPill>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{getItemCount(order)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} size="sm">
                            {getOrderTotal(order)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {order.fulfillment?.fulfilledBy ||
                              order.fulfillmentChannel ||
                              "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {order.salesChannel?.marketplaceName ||
                              order.salesChannel?.marketplaceId ||
                              "—"}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" wrap="nowrap">
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="teal"
                                onClick={() => handleViewDetails(order.orderId)}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label={reason}>
                              {/* span wrapper required — Mantine Tooltip needs a non-disabled child */}
                              <span>
                                <ActionIcon
                                  variant="subtle"
                                  color={allowed ? "teal" : "gray"}
                                  disabled={
                                    !allowed || generatingId === order.orderId
                                  }
                                  loading={generatingId === order.orderId}
                                  onClick={() =>
                                    allowed &&
                                    handleGenerateInvoice(order.orderId)
                                  }
                                >
                                  <IconFileInvoice size={18} />
                                </ActionIcon>
                              </span>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}

        {/* SP-API nextToken pagination */}
        <div className={classes.listFooter}>
          <span className={classes.footerText}>
            Showing {filteredOrders.length} of {totalCount} orders · synced from
            Amazon SP-API
            {(pageIndex > 0 || hasMore) && ` · Page ${pageIndex + 1}`}
            {hasMore ? " · more available" : ""}
          </span>
          {(pageIndex > 0 || hasMore) && (
            <div className={classes.pager}>
              <Button
                className={appButton("light", true)}
                leftSection={<IconChevronLeft size={14} />}
                disabled={pageIndex <= 0 || loading}
                onClick={handlePrevPage}
              >
                Previous
              </Button>
              <Button
                className={appButton("light", true)}
                rightSection={<IconChevronRight size={14} />}
                disabled={!hasMore || loading}
                onClick={handleNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </AppCard>

      <OrderDetailsModal
        opened={detailsModalOpened}
        onClose={() => setDetailsModalOpened(false)}
        loading={detailsLoading}
        order={selectedOrder}
        items={selectedOrderItems}
      />
    </MainLayout>
  );
}
