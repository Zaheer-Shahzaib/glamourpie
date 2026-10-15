import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Select, TextInput, Tooltip } from "@mantine/core";
import {
  IconRefresh,
  IconDownload,
  IconFileExport,
  IconCheck,
  IconSearch,
  IconPlus,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAuth } from "../Context/useAuth";
import { notifications } from "@mantine/notifications";
import { useInvoices } from "../hooks/useInvoices";
import {
  pickBestPlan,
  useSubscriptionStatus,
} from "../hooks/useSubscriptionStatus";
import InvoiceList from "../Components/Invoice/InvoiceList";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceExportModal from "../Components/Invoice/InvoiceExportModal";
import MainLayout from "../layout/Main";
import {
  AppCard,
  PageHeader,
  appButton,
  cx,
  ui,
} from "../Components/AppUi";
import { PATH_APPS } from "../routes";
import { downloadInvoiceDocument } from "../Services/invoice-services";
import classes from "./InvoicesPage.module.scss";

const LIMIT = 20;

const PENDING_STATUSES = new Set(["PENDING", "DRAFT"]);
const ACCEPTED_STATUSES = new Set(["ACCEPTED", "PAID", "SUBMITTED"]);

const statusOf = (inv: any): string =>
  String(inv.invoiceStatus || inv.status || "").toUpperCase();

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function InvoicesPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [exportOpened, setExportOpened] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // Ledger filters (applied to the invoices on the current page)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Subscription info — used to gate/configure the export modal
  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus();
  const activePlan = useMemo(
    () => pickBestPlan(subscription?.activePlans || []),
    [subscription],
  );

  // Real stats from the backend (total amounts across all pages + usage limits)
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    import("../Services/invoice-services").then(({ fetchInvoiceStats }) => {
      fetchInvoiceStats(token)
        .then((res) => setStats(res.payload))
        .catch(console.error);
    });
  }, [token]);

  const { invoices, loading, pagination, refetch } = useInvoices({
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
  });

  const totalPages = pagination ? Math.ceil(pagination.total / LIMIT) : 1;

  const visibleInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();
    return invoices.filter((inv: any) => {
      if (statusFilter) {
        const s = statusOf(inv);
        const match =
          statusFilter === "ACCEPTED"
            ? ACCEPTED_STATUSES.has(s)
            : statusFilter === "PENDING"
              ? PENDING_STATUSES.has(s)
              : s === statusFilter;
        if (!match) return false;
      }
      if (!term) return true;
      return [inv.invoiceNumber, inv.invoiceId, inv.amazonOrderId, inv.buyerName]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(term));
    });
  }, [invoices, search, statusFilter]);

  const handleInvoiceClick = useCallback((invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setDetailsOpened(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpened(false);
    setSelectedInvoiceId(null);
  }, []);

  // ── Export button handler ────────────────────────────────────────────────
  const handleOpenExport = () => {
    const isFreeOrNone = !activePlan || activePlan.toLowerCase() === "free";
    if (isFreeOrNone && !subLoading) {
      // No plan at all or "Free" plan — open modal anyway so the gate screen shows
      notifications.show({
        title: "Subscription Required",
        message:
          "You need an active plan to export invoices. Choose a plan to get started.",
        color: "orange",
        icon: <IconFileExport size={16} />,
        autoClose: 6000,
      });
    }
    setExportOpened(true);
  };

  // ── Bulk download ────────────────────────────────────────────────────────
  const handleDownloadAll = async () => {
    if (!token || invoices.length === 0) return;
    try {
      setDownloadingAll(true);
      for (const inv of invoices) {
        const id = (inv as any).invoiceNumber ?? (inv as any).id;
        await downloadInvoiceDocument(token, id);
        await new Promise((r) => setTimeout(r, 600));
      }
      notifications.show({
        title: "Download complete",
        message: `${invoices.length} invoice(s) downloaded`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Some downloads failed — please try again",
        color: "red",
      });
    } finally {
      setDownloadingAll(false);
    }
  };

  // ── KPIs (backend stats, falling back to the loaded page) ────────────────
  const totalInvoices =
    stats?.totalInvoices ?? pagination?.total ?? invoices.length;
  const totalRevenue =
    stats?.totalRevenue ??
    invoices.reduce(
      (acc: number, inv: any) =>
        acc + (inv.totalAmount?.amount || inv.totalAmount || 0),
      0,
    );
  const pendingCount = invoices.filter((inv: any) =>
    PENDING_STATUSES.has(statusOf(inv)),
  ).length;
  const acceptedCount = invoices.filter((inv: any) =>
    ACCEPTED_STATUSES.has(statusOf(inv)),
  ).length;
  const successRate =
    invoices.length > 0
      ? `${((acceptedCount / invoices.length) * 100).toFixed(1)}% success`
      : "—";

  const usageLimit = stats?.usage?.limit || 20;
  const usageGenerated = stats?.usage?.generatedThisMonth || 0;
  const isLimitReached = usageGenerated >= usageLimit;

  return (
    <MainLayout>
      <PageHeader
        title="Invoices"
        subtitle="A financial command center for compliant Amazon documents."
        actions={
          <>
            <Tooltip label="Refresh invoices">
              <Button
                className={appButton("light")}
                onClick={() => refetch()}
                loading={loading}
                aria-label="Refresh invoices"
                px={12}
              >
                <IconRefresh size={16} />
              </Button>
            </Tooltip>
            <Button
              className={appButton("light")}
              leftSection={<IconDownload size={16} />}
              onClick={handleDownloadAll}
              loading={downloadingAll}
              disabled={invoices.length === 0}
            >
              Download all
            </Button>
            <Button
              className={appButton("light")}
              leftSection={<IconFileExport size={16} />}
              onClick={handleOpenExport}
              loading={subLoading}
            >
              Export invoices
            </Button>
          </>
        }
      />

      {/* ── KPIs ───────────────────────────────────────────────── */}
      <AppCard className={classes.kpis}>
        <div className={classes.kpiGrid}>
          <div className={classes.kpi}>
            <span className={ui.eyebrow}>Total invoices</span>
            <span className={classes.kpiValue}>
              {Number(totalInvoices).toLocaleString("en-US")}
            </span>
            <span className={cx(classes.kpiMeta, classes.metaInfo)}>
              All generated
            </span>
          </div>
          <div className={classes.kpi}>
            <span className={ui.eyebrow}>Pending review</span>
            <span className={classes.kpiValue}>{pendingCount}</span>
            <span
              className={cx(
                classes.kpiMeta,
                pendingCount > 0 ? classes.metaWarning : classes.metaInfo,
              )}
            >
              {pendingCount > 0 ? "Needs attention" : "All clear"}
            </span>
          </div>
          <div className={classes.kpi}>
            <span className={ui.eyebrow}>Accepted</span>
            <span className={classes.kpiValue}>{acceptedCount}</span>
            <span className={cx(classes.kpiMeta, classes.metaSuccess)}>
              {successRate}
            </span>
          </div>
          <div className={classes.kpi}>
            <span className={ui.eyebrow}>Revenue covered</span>
            <span className={classes.kpiValue}>
              {stats?.currencyCode || "USD"}{" "}
              {compactNumber.format(Number(totalRevenue) || 0)}
            </span>
            <span className={cx(classes.kpiMeta, classes.metaBrand)}>
              Across all invoices
            </span>
          </div>
        </div>
      </AppCard>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <AppCard className={classes.toolbar}>
        <TextInput
          className={classes.search}
          placeholder="Search invoice or order"
          aria-label="Search invoice or order"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
        />
        <Select
          className={classes.chipSelect}
          aria-label="Filter by status"
          placeholder="All statuses"
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { value: "ACCEPTED", label: "Accepted" },
            { value: "PENDING", label: "Pending" },
            { value: "REJECTED", label: "Rejected" },
          ]}
          clearable
          allowDeselect
        />
        <Tooltip label="Date range filtering is coming soon">
          <span
            className={cx(classes.chip, classes.chipDisabled)}
            aria-disabled="true"
          >
            Last 30 days
            <IconChevronDown size={12} />
          </span>
        </Tooltip>

        <span className={classes.toolbarNote}>
          Invoices are generated against linked orders
          <span
            className={cx(
              classes.usage,
              isLimitReached && classes.usageLimit,
            )}
          >
            {" "}
            · {usageGenerated} / {usageLimit !== 99999 ? usageLimit : "∞"} used
            this month
          </span>
        </span>

        <Button
          className={appButton("dark")}
          component={Link}
          to={PATH_APPS.orders}
          rightSection={<IconPlus size={14} />}
        >
          Generate invoice
        </Button>
      </AppCard>

      {/* ── Ledger ─────────────────────────────────────────────── */}
      <AppCard className={classes.ledger}>
        <div className={cx(ui.eyebrow, classes.ledgerTitle)}>Invoice ledger</div>
        <InvoiceList
          invoices={visibleInvoices as any}
          loading={loading}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onInvoiceClick={handleInvoiceClick}
          emptyMessage={
            invoices.length > 0
              ? "No invoices match your filters"
              : "No invoices found"
          }
        />
      </AppCard>

      <p className={ui.pageFootnote}>
        Invoices stay separated by marketplace, status, and tax workflow.
      </p>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <InvoiceDetailsModal
        invoiceId={selectedInvoiceId}
        opened={detailsOpened}
        onClose={handleCloseDetails}
      />

      <InvoiceExportModal
        opened={exportOpened}
        onClose={() => setExportOpened(false)}
        userPlan={activePlan}
      />
    </MainLayout>
  );
}
