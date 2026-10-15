"use client";

import { Alert, Button, Text, Tooltip } from "@mantine/core";
import { IconFileExport, IconAlertCircle } from "@tabler/icons-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layout/Main";
import { useAuth } from "../Context/useAuth";
import InvoiceList from "../Components/Invoice/InvoiceList";
import InvoiceFilters from "../Components/Invoice/InvoiceFilters";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceExportModal from "../Components/Invoice/InvoiceExportModal";
import {
  AppCard,
  CardHeader,
  ComingSoon,
  PageHeader,
  StatusPill,
  appButton,
  cx,
  orderStatusTone,
  ui,
} from "../Components/AppUi";
import { useInvoices } from "../hooks/useInvoices";
import { useOrders, useOrderStats } from "../hooks/useOrders";
import {
  pickBestPlan,
  useSubscriptionStatus,
} from "../hooks/useSubscriptionStatus";
import { InvoiceQueryParams, RevenueDataPoint } from "../types/invoice.types";
import { fetchRevenueData } from "../Services/invoice-services";
import { getCustomerInvoicesDetails } from "../Services/stripeService";
import {
  formatStatusLabel,
  getBuyerName,
  getOrderStatus,
  getOrderTotal,
} from "../utils/orderFields";
import { PATH_APPS } from "../routes";
import { notifications } from "@mantine/notifications";
import classes from "./DashboardPage.module.scss";

const compactNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const formatShortDate = (value: string): string => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

function DashBoard() {
  const { token, profile } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InvoiceQueryParams>({
    limit: 10,
    offset: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [exportModalOpened, setExportModalOpened] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  const {
    invoices,
    loading,
    pagination,
    setFilters: updateFilters,
  } = useInvoices(filters);

  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus();
  const hasPastDue = Boolean(subscription?.hasPastDue);
  const activePlan = useMemo(
    () => pickBestPlan(subscription?.activePlans || []),
    [subscription],
  );

  const { data: orderStats } = useOrderStats();
  const { data: ordersData } = useOrders();
  const recentOrders = (ordersData?.payload?.orders ?? [])
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime(),
    )
    .slice(0, 3);

  useEffect(() => {
    if (!token) return;
    getCustomerInvoicesDetails().catch((err) =>
      console.error("Failed to fetch customer invoices:", err),
    );
  }, [token]);

  // Fetch revenue chart data
  useEffect(() => {
    const loadRevenueData = async () => {
      if (!token) return;

      try {
        setRevenueLoading(true);
        const data = await fetchRevenueData(token);
        setRevenueData(data.payload);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setRevenueLoading(false);
      }
    };

    loadRevenueData();
  }, [token]);

  const handleFilterChange = (newFilters: InvoiceQueryParams) => {
    const updatedFilters = { ...newFilters, limit: 10, offset: 0 };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const clearedFilters = { limit: 10, offset: 0 };
    setFilters(clearedFilters);
    updateFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * 10;
    const updatedFilters = { ...filters, offset };
    setFilters(updatedFilters);
    updateFilters(updatedFilters);
    setCurrentPage(page);
  };

  const handleInvoiceClick = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setDetailsModalOpened(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpened(false);
    setSelectedInvoiceId(null);
  };

  const handleOpenExport = () => {
    const isFreeOrNone = !activePlan || activePlan.toLowerCase() === "free";
    if (isFreeOrNone && !subLoading) {
      notifications.show({
        title: "Subscription Required",
        message:
          "You need an active plan to export invoices. Choose a plan to get started.",
        color: "orange",
        icon: <IconFileExport size={16} />,
        autoClose: 6000,
      });
    }
    setExportModalOpened(true);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / 10) : 1;

  // ── Derived metrics (real order stats where available) ───────────────────
  const currency = orderStats?.currencyCode ?? "USD";
  const totalOrders = orderStats?.totalOrders ?? 0;
  const totalRevenue = orderStats?.totalRevenue ?? 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const shippedPct =
    totalOrders > 0
      ? Math.round(((orderStats?.shippedOrders ?? 0) / totalOrders) * 100)
      : 0;

  const chartPoints = useMemo(() => revenueData.slice(-12), [revenueData]);
  const chartMax = useMemo(
    () => Math.max(...chartPoints.map((p) => p.revenue), 1),
    [chartPoints],
  );
  const sparkPoints = useMemo(() => revenueData.slice(-10), [revenueData]);
  const sparkMax = useMemo(
    () => Math.max(...sparkPoints.map((p) => p.revenue), 1),
    [sparkPoints],
  );

  const firstName = profile?.firstname || profile?.username || "";

  return (
    <>
      <>
        <title>Dashboard | Runanalytic Invoice</title>
        <meta
          name="description"
          content="Manage your Amazon invoices with automated generation, tracking, and compliance tools."
        />
      </>
      <MainLayout>
        <PageHeader
          title={firstName ? `${greeting()}, ${firstName}` : greeting()}
          subtitle="Here is the pulse of your Amazon business."
          actions={
            <>
              <Tooltip label="Period comparison is coming soon">
                <span>
                  <Button className={appButton("light")} disabled>
                    Compare period
                  </Button>
                </span>
              </Tooltip>
              <Button
                className={appButton("dark")}
                leftSection={<IconFileExport size={16} />}
                onClick={handleOpenExport}
              >
                Export report
              </Button>
            </>
          }
        />

        {hasPastDue && (
          <Alert
            mb="lg"
            icon={<IconAlertCircle size={16} />}
            title="Payment Action Required"
            color="red"
            variant="filled"
          >
            Your recent subscription payment failed. The ability to export and
            generate invoices may be restricted.{" "}
            <Text
              span
              bg="transparent"
              td="underline"
              style={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate(PATH_APPS.settings.billing)}
            >
              Update your payment details
            </Text>
          </Alert>
        )}

        {/* ── Metric row ─────────────────────────────────────── */}
        <div className={classes.metricGrid}>
          <AppCard tone="dark" className={classes.revenueCard}>
            <div>
              <span className={cx(ui.eyebrow, classes.revenueEyebrow)}>
                Net revenue
              </span>
              <div className={classes.revenueValue}>
                {currency} {compactNumber.format(totalRevenue)}
              </div>
              <div className={classes.revenueMeta}>
                Across {compactNumber.format(totalOrders)} synced orders
              </div>
            </div>
            {sparkPoints.length > 0 && (
              <div className={classes.trend}>
                <span className={classes.trendLabel}>Trend</span>
                <div className={classes.spark} aria-hidden="true">
                  {sparkPoints.map((p) => (
                    <span
                      key={p.date}
                      className={classes.sparkBar}
                      style={{
                        height: `${Math.max(12, (p.revenue / sparkMax) * 44)}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </AppCard>

          <AppCard className={classes.metricCard}>
            <span className={ui.eyebrow}>Orders</span>
            <span className={classes.metricValue}>
              {compactNumber.format(totalOrders)}
            </span>
            <span className={cx(classes.metricMeta, classes.metaTertiary)}>
              {shippedPct}% shipped
            </span>
            <span className={classes.progressTrack}>
              <span
                className={cx(classes.progress, classes.progressTertiary)}
                style={{ width: `${shippedPct}%` }}
              />
            </span>
          </AppCard>

          <AppCard className={classes.metricCard}>
            <span className={ui.eyebrow}>Units sold</span>
            <span className={classes.metricValue}>—</span>
            <span className={cx(classes.metricMeta, classes.metaMuted)}>
              Coming soon
            </span>
            <span className={classes.progressTrack} />
          </AppCard>

          <AppCard className={classes.metricCard}>
            <span className={ui.eyebrow}>AOV</span>
            <span className={classes.metricValue}>
              {currency} {aov.toFixed(2)}
            </span>
            <span className={cx(classes.metricMeta, classes.metaBrand)}>
              Revenue ÷ orders
            </span>
            <span className={classes.progressTrack}>
              <span
                className={cx(classes.progress, classes.progressBrand)}
                style={{ width: aov > 0 ? "100%" : "0%" }}
              />
            </span>
          </AppCard>
        </div>

        {/* ── Sales performance + breakdown ───────────────────── */}
        <div className={classes.chartRow}>
          <AppCard>
            <CardHeader
              title="Sales performance"
              subtitle="Net revenue and orders over time"
              right={
                <div className={classes.legend}>
                  <span className={classes.legendActive}>Revenue</span>
                  <Tooltip label="Orders over time is coming soon">
                    <span className={classes.legendMuted}>Orders</span>
                  </Tooltip>
                </div>
              }
            />
            {revenueLoading ? (
              <Text c="dimmed" size="sm" ta="center" py="xl">
                Loading revenue...
              </Text>
            ) : chartPoints.length === 0 ? (
              <ComingSoon
                title="No revenue data yet"
                description="Revenue will chart here once invoices are generated."
                minHeight={200}
              />
            ) : (
              <div className={classes.chart}>
                <div className={classes.bars}>
                  {chartPoints.map((p, i) => (
                    <div
                      key={p.date}
                      className={classes.barSlot}
                      title={`${formatShortDate(p.date)} · ${currency} ${compactNumber.format(p.revenue)}`}
                    >
                      <span
                        className={cx(
                          classes.bar,
                          i === chartPoints.length - 1 && classes.barLatest,
                        )}
                        style={{
                          height: `${Math.max(4, (p.revenue / chartMax) * 100)}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className={classes.axis}>
                  {chartPoints.map((p, i) => (
                    <span key={p.date} className={classes.axisLabel}>
                      {i % 2 === 0 || i === chartPoints.length - 1
                        ? formatShortDate(p.date)
                        : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </AppCard>

          <AppCard>
            <CardHeader
              title="Revenue breakdown"
              subtitle="Where your revenue went"
            />
            <ComingSoon
              title="Fees, refunds & taxes"
              description="Gross-to-net revenue breakdown will appear here."
              minHeight={220}
            />
          </AppCard>
        </div>

        {/* ── Orders overview + top products ──────────────────── */}
        <div className={classes.chartRow}>
          <AppCard>
            <CardHeader
              title="Orders overview"
              subtitle="Latest activity across the selected marketplace"
            />
            <table className={classes.miniTable}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th className={classes.alignEnd}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={classes.emptyCell}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => {
                    const status = getOrderStatus(order);
                    return (
                      <tr key={order.orderId}>
                        <td className={classes.strong}>{order.orderId}</td>
                        <td className={classes.mutedCell}>
                          {getBuyerName(order)}
                        </td>
                        <td>
                          <StatusPill tone={orderStatusTone(status)}>
                            {formatStatusLabel(status)}
                          </StatusPill>
                        </td>
                        <td className={cx(classes.strong, classes.alignEnd)}>
                          {getOrderTotal(order)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <Link to={PATH_APPS.orders} className={cx(ui.linkText, classes.viewAll)}>
              View all orders →
            </Link>
          </AppCard>

          <AppCard>
            <CardHeader
              title="Top products"
              subtitle="By net revenue this period"
            />
            <ComingSoon
              title="Product performance"
              description="Your best-selling products will be ranked here."
              minHeight={160}
            />
          </AppCard>
        </div>

        {/* ── Invoice activity (existing dashboard functionality) ─ */}
        <AppCard className={classes.invoiceCard}>
          <CardHeader
            title="Invoice activity"
            subtitle="Filter, review and download your invoices"
          />
          <InvoiceFilters
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          <div className={classes.invoiceList}>
            <InvoiceList
              invoices={invoices}
              loading={loading}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onInvoiceClick={handleInvoiceClick}
            />
          </div>
        </AppCard>

        {/* Modals */}
        <InvoiceDetailsModal
          invoiceId={selectedInvoiceId}
          opened={detailsModalOpened}
          onClose={handleCloseDetailsModal}
        />

        <InvoiceExportModal
          opened={exportModalOpened}
          onClose={() => setExportModalOpened(false)}
          userPlan={activePlan}
        />
      </MainLayout>
    </>
  );
}

export default DashBoard;
