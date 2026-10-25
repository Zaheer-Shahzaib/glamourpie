import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { DatePickerInput, type DatesRangeValue } from "@mantine/dates";
import {
  IconCloudUpload,
  IconFileInvoice,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import MainLayout from "../layout/Main";
import { useAuth } from "../Context/useAuth";
import {
  bulkGenerateHistoricalInvoices,
  bulkUploadHistoricalInvoices,
  getPastInvoiceBalance,
  lookupHistoricalOrders,
  refreshHistoricalUploadStatus,
  uploadHistoricalInvoiceToAmazon,
} from "../Services/past-invoice-services";
import {
  MissingInvoiceRow,
  MissingLookupPagination,
  MissingLookupSuccess,
  PastInvoiceBalance,
  isMissingLookupSuccess,
} from "../types/missing-invoice.types";
import { Link, Navigate } from "react-router-dom";
import { PATH_APPS } from "../routes";
import { getInvoiceGenerationError } from "../utils/vatDisplay";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceUploadSubNav from "../Components/Invoice/InvoiceUploadSubNav";

/** Mantine DatePickerInput may yield Date or ISO/date strings depending on version. */
const toApiDateString = (value: Date | string | null | undefined): string | null => {
  if (value == null) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime())
      ? null
      : parsed.toISOString().slice(0, 10);
  }
  return null;
};

const uploadStatusColor = (status: string | null) => {
  switch (status) {
    case "UPLOADED":
      return "green";
    case "UPLOADING":
      return "blue";
    case "FAILED":
      return "red";
    case "PENDING":
      return "yellow";
    default:
      return "gray";
  }
};

export default function HistoricalOrdersPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<MissingInvoiceRow[]>([]);
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasHistoricalAccess, setHasHistoricalAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkGenLoading, setBulkGenLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [rowBusy, setRowBusy] = useState<Record<string, string>>({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [dateRange, setDateRange] = useState<DatesRangeValue<string>>([
    null,
    null,
  ]);
  const [lastLookup, setLastLookup] = useState<{
    type: "dateRange";
    start: string;
    end: string;
  } | null>(null);
  const [datePageTokens, setDatePageTokens] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const [datePageIndex, setDatePageIndex] = useState(0);
  const [dateRangePagination, setDateRangePagination] =
    useState<MissingLookupPagination | null>(null);
  const [pastBalance, setPastBalance] = useState<PastInvoiceBalance | null>(
    null,
  );
  const reloadPastBalance = async () => {
    if (!token) return;
    try {
      const res = await getPastInvoiceBalance(token);
      if (res.success) {
        setPastBalance(res.pastInvoiceBalance);
        setHasHistoricalAccess(
          res.hasHistoricalAccess ??
            (res.pastInvoiceBalance.purchasedQuantity ?? 0) > 0,
        );
      }
    } catch {
      /* ignore */
    } finally {
      setAccessChecked(true);
    }
  };

  useEffect(() => {
    reloadPastBalance();
  }, [token]);

  const eligibleOrderIds = useMemo(
    () => rows.filter((r) => r.generationEligible).map((r) => r.orderId),
    [rows],
  );

  const uploadableOrderIds = useMemo(
    () => rows.filter((r) => r.canUpload).map((r) => r.orderId),
    [rows],
  );

  const applyLookupResponse = (
    res: MissingLookupSuccess,
    options?: { quiet?: boolean },
  ) => {
    setRows(res.results);
    if (res.pastInvoiceBalance) {
      setPastBalance(res.pastInvoiceBalance);
    }
    if (res.pagination) {
      setDateRangePagination(res.pagination);
    }
    if (!options?.quiet) {
      notifications.show({
        color: "green",
        title: "Orders loaded",
        message: `${res.summary.total} order(s) on this page — ${res.summary.invoiceMissing} missing invoice(s).`,
      });
    }
  };

  const loadDateRangePage = async (
    pageIndex: number,
    startDate: string,
    endDate: string,
    tokens: (string | undefined)[],
  ) => {
    if (!token) return;
    const pageToken = tokens[pageIndex];
    const res = await lookupHistoricalOrders(
      token,
      pageToken
        ? { nextToken: pageToken }
        : { startDate, endDate },
    );
    if (!isMissingLookupSuccess(res)) {
      throw new Error(res.message || "Search failed");
    }
    applyLookupResponse(res, { quiet: pageIndex > 0 });
    return res;
  };

  const refreshCurrentPage = async () => {
    if (!token || lastLookup?.type !== "dateRange") return;
    await loadDateRangePage(
      datePageIndex,
      lastLookup.start,
      lastLookup.end,
      datePageTokens,
    );
  };

  const refreshTable = async () => {
    if (!token || !lastLookup) return;
    setLoading(true);
    try {
      if (rows.length > 0) {
        const statusRes = await refreshHistoricalUploadStatus(
          token,
          rows.map((r) => r.orderId),
        );
        if (statusRes.success) {
          setRows((prev) =>
            prev.map((row) => {
              const hit = statusRes.results.find((r) => r.orderId === row.orderId);
              if (!hit) return row;
              return {
                ...row,
                uploadStatus: hit.uploadStatus ?? row.uploadStatus,
                lifecycleStatus:
                  (hit as { lifecycleStatus?: string }).lifecycleStatus ??
                  row.lifecycleStatus,
                errorMessage: hit.errorMessage ?? row.errorMessage,
              };
            }),
          );
        }
      }
      await refreshCurrentPage();
    } finally {
      setLoading(false);
    }
  };

  const handleLookupDateRange = async () => {
    if (!token) return;
    const [start, end] = dateRange;
    if (!start || !end) {
      notifications.show({
        color: "orange",
        title: "Date range required",
        message: "Select both start and end dates.",
      });
      return;
    }
    const startDate = toApiDateString(start);
    const endDate = toApiDateString(end);
    if (!startDate || !endDate) {
      notifications.show({
        color: "orange",
        title: "Invalid dates",
        message: "Could not read the selected date range. Pick the range again.",
      });
      return;
    }
    setLoading(true);
    try {
      setDatePageTokens([undefined]);
      setDatePageIndex(0);
      setLastLookup({ type: "dateRange", start: startDate, end: endDate });
      await loadDateRangePage(0, startDate, endDate, [undefined]);
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      const message =
        axiosMsg || (err instanceof Error ? err.message : "Search failed");
      notifications.show({
        color: "red",
        title: "Search failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const dateHasMore = Boolean(
    dateRangePagination?.hasMore ?? dateRangePagination?.nextToken,
  );

  const handleDateRangeNextPage = async () => {
    if (!token || lastLookup?.type !== "dateRange") return;
    const nextToken = dateRangePagination?.nextToken;
    if (!nextToken) return;
    setLoading(true);
    try {
      const newTokens = [...datePageTokens.slice(0, datePageIndex + 1), nextToken];
      const newIndex = datePageIndex + 1;
      setDatePageTokens(newTokens);
      setDatePageIndex(newIndex);
      await loadDateRangePage(
        newIndex,
        lastLookup.start,
        lastLookup.end,
        newTokens,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Next page failed";
      notifications.show({ color: "red", title: "Pagination failed", message });
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangePrevPage = async () => {
    if (!token || lastLookup?.type !== "dateRange" || datePageIndex <= 0) return;
    setLoading(true);
    try {
      const newIndex = datePageIndex - 1;
      setDatePageIndex(newIndex);
      await loadDateRangePage(
        newIndex,
        lastLookup.start,
        lastLookup.end,
        datePageTokens,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Previous page failed";
      notifications.show({ color: "red", title: "Pagination failed", message });
    } finally {
      setLoading(false);
    }
  };

  const handleRowGenerate = async (row: MissingInvoiceRow) => {
    if (!token) return;
    setRowBusy((b) => ({ ...b, [row.orderId]: "generate" }));
    try {
      const res = await bulkGenerateHistoricalInvoices(token, [row.orderId], true);
      const item = res.results[0];
      if (!item?.success) {
        const { title, message } = getInvoiceGenerationError({
          response: {
            data: {
              message: item?.error,
              errorCode: item?.errorCode,
            },
          },
        });
        throw new Error(`${title}: ${message}`);
      }
      notifications.show({
        color: "green",
        title: item.alreadyExists ? "Already exists" : "Invoice generated",
        message: item.invoiceNumber || row.orderId,
      });
      await refreshCurrentPage();
      await reloadPastBalance();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed";
      notifications.show({ color: "red", title: "Generate failed", message });
    } finally {
      setRowBusy((b) => {
        const next = { ...b };
        delete next[row.orderId];
        return next;
      });
    }
  };

  const handleRowUpload = async (row: MissingInvoiceRow) => {
    if (!token || !row.invoiceId) return;
    setRowBusy((b) => ({ ...b, [row.orderId]: "upload" }));
    try {
      const forceRetry = row.uploadStatus === "FAILED";
      const res = await uploadHistoricalInvoiceToAmazon(token, row.invoiceId, forceRetry);
      if (!res.success) {
        throw new Error(res.message || "Upload failed");
      }
      const done =
        res.uploadStatus === "UPLOADED" ||
        (res as { lifecycleStatus?: string }).lifecycleStatus === "SUBMITTED";
      notifications.show({
        color: done ? "green" : "blue",
        title: done ? "Submitted to Amazon" : "Upload submitted",
        message:
          res.feedId && done
            ? `Feed ${res.feedId} completed`
            : res.feedId
              ? `Feed ${res.feedId} — ${res.processingStatus || "processing"}`
              : "Upload queued",
      });
      await refreshCurrentPage();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      notifications.show({ color: "red", title: "Upload failed", message });
    } finally {
      setRowBusy((b) => {
        const next = { ...b };
        delete next[row.orderId];
        return next;
      });
    }
  };

  const handleBulkGenerate = async () => {
    if (!token || eligibleOrderIds.length === 0) return;
    setBulkGenLoading(true);
    try {
      const res = await bulkGenerateHistoricalInvoices(token, eligibleOrderIds, true);
      const ok = res.results.filter((r) => r.success).length;
      notifications.show({
        color: "green",
        title: "Bulk generate complete",
        message: `${ok}/${res.results.length} succeeded.`,
      });
      await refreshCurrentPage();
      await reloadPastBalance();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk generate failed";
      notifications.show({ color: "red", title: "Bulk generate failed", message });
    } finally {
      setBulkGenLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!token || uploadableOrderIds.length === 0) return;
    setBulkUploadLoading(true);
    try {
      const res = await bulkUploadHistoricalInvoices(token, uploadableOrderIds);
      const ok = res.results.filter((r) => r.success).length;
      notifications.show({
        color: "green",
        title: "Bulk upload complete",
        message: `${ok}/${res.results.length} submitted.`,
      });
      await refreshCurrentPage();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk upload failed";
      notifications.show({ color: "red", title: "Bulk upload failed", message });
    } finally {
      setBulkUploadLoading(false);
    }
  };

  if (!accessChecked) {
    return (
      <MainLayout>
        <Container size="xl" py="xl">
          <Text c="dimmed">Loading…</Text>
        </Container>
      </MainLayout>
    );
  }

  if (!hasHistoricalAccess) {
    return <Navigate to={PATH_APPS.settings.billing} replace />;
  }

  return (
    <MainLayout>
      <Container size="xl" py="md">
        <Stack gap="md">
          <InvoiceUploadSubNav showHistorical />

          <div>
            <Title order={2}>Historical Amazon Orders</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Search by purchase date, generate historical invoices (PRE-series
              numbering), and upload to Amazon. Usage is deducted from your
              historical invoice add-on only—not your monthly plan.
            </Text>
          </div>

          <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
              <Text fw={600}>Historical invoice allowance</Text>
              <Text size="sm" c="dimmed">
                Purchased: {pastBalance?.purchasedQuantity ?? 0} · Used:{" "}
                {pastBalance?.usedQuantity ?? 0} · Remaining:{" "}
                <Text span fw={700} c={pastBalance?.remaining ? "teal" : "red"}>
                  {pastBalance?.remaining ?? 0}
                </Text>
              </Text>
              {(pastBalance?.remaining ?? 0) === 0 && (
                <Text size="sm" c="orange">
                  Allowance exhausted — add capacity in{" "}
                  <Text component={Link} to={PATH_APPS.settings.billing} span>
                    Billing & Subscription
                  </Text>
                  .
                </Text>
              )}
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="md">
            <Stack gap="sm">
              <DatePickerInput
                type="range"
                label="Purchase date range"
                placeholder="Start — End"
                value={dateRange}
                onChange={setDateRange}
                required
              />
              <Button
                leftSection={<IconSearch size={16} />}
                loading={loading}
                onClick={handleLookupDateRange}
              >
                Search Amazon orders
              </Button>
            </Stack>
          </Paper>

          {lastLookup?.type === "dateRange" &&
            rows.length === 0 &&
            !loading &&
            !dateHasMore &&
            datePageIndex === 0 && (
              <Text size="sm" c="dimmed">
                No invoice-eligible orders on this page for the selected dates.
              </Text>
            )}

          {rows.length > 0 && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {rows.length} row(s) · {eligibleOrderIds.length} eligible to
                generate · {uploadableOrderIds.length} eligible to upload
              </Text>
              <Group>
                <Button
                  variant="light"
                  leftSection={<IconFileInvoice size={16} />}
                  loading={bulkGenLoading}
                  disabled={eligibleOrderIds.length === 0}
                  onClick={handleBulkGenerate}
                >
                  Generate all eligible
                </Button>
                <Button
                  variant="light"
                  leftSection={<IconCloudUpload size={16} />}
                  loading={bulkUploadLoading}
                  disabled={uploadableOrderIds.length === 0}
                  onClick={handleBulkUpload}
                >
                  Upload all eligible
                </Button>
                <ActionIcon
                  variant="subtle"
                  aria-label="Refresh table"
                  onClick={() => refreshTable()}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Group>
            </Group>
          )}

          {lastLookup?.type === "dateRange" && (datePageIndex > 0 || dateHasMore) && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Amazon date search · Page {datePageIndex + 1}
                {dateRangePagination?.pageSize
                  ? ` · up to ${dateRangePagination.pageSize} orders per page`
                  : ""}
                {" · wait ~2–3 min between pages if Amazon throttles"}
              </Text>
              <Group>
                <Button
                  variant="default"
                  size="xs"
                  disabled={datePageIndex <= 0 || loading}
                  onClick={handleDateRangePrevPage}
                >
                  Previous
                </Button>
                <Button
                  variant="default"
                  size="xs"
                  disabled={!dateHasMore || loading}
                  onClick={handleDateRangeNextPage}
                >
                  Next
                </Button>
              </Group>
            </Group>
          )}

          {rows.length > 0 && (
            <Paper withBorder radius="md" style={{ overflow: "auto" }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order ID</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Invoice</Table.Th>
                    <Table.Th>Invoice status</Table.Th>
                    <Table.Th>Upload</Table.Th>
                    <Table.Th>Error</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((row) => (
                    <Table.Tr key={row.orderId}>
                      <Table.Td>{row.orderId}</Table.Td>
                      <Table.Td>
                        {row.fetchSuccess ? (
                          <Badge variant="light">{row.orderStatus || "—"}</Badge>
                        ) : (
                          <Badge color="red">Fetch failed</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {row.currency && row.totalAmount != null
                          ? `${row.currency} ${row.totalAmount.toFixed(2)}`
                          : "—"}
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={row.invoiceStatus === "exists" ? "green" : "orange"}
                        >
                          {row.invoiceStatus}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            row.lifecycleStatus === "SUBMITTED"
                              ? "green"
                              : row.lifecycleStatus === "DRAFT"
                                ? "gray"
                                : "blue"
                          }
                        >
                          {row.lifecycleStatus || "—"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={uploadStatusColor(row.uploadStatus)}>
                          {row.uploadStatus || "—"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {row.fetchError ||
                            row.errorMessage ||
                            row.generationBlockReason ||
                            row.uploadBlockReason ||
                            "—"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Tooltip label={row.generationBlockReason || "Generate invoice"}>
                            <Button
                              size="xs"
                              variant="light"
                              disabled={!row.generationEligible}
                              loading={rowBusy[row.orderId] === "generate"}
                              onClick={() => handleRowGenerate(row)}
                            >
                              Generate
                            </Button>
                          </Tooltip>
                          <Tooltip
                            label={
                              row.uploadBlockReason ||
                              (row.uploadStatus === "FAILED"
                                ? "Retry upload"
                                : "Upload to Amazon")
                            }
                          >
                            <Button
                              size="xs"
                              variant="light"
                              disabled={
                                !row.invoiceId ||
                                (!row.canUpload && row.uploadStatus !== "FAILED")
                              }
                              loading={rowBusy[row.orderId] === "upload"}
                              onClick={() => handleRowUpload(row)}
                            >
                              {row.uploadStatus === "FAILED" ? "Retry" : "Upload"}
                            </Button>
                          </Tooltip>
                          {row.invoiceId && (
                            <Button
                              size="xs"
                              variant="subtle"
                              onClick={() => setSelectedInvoiceId(row.invoiceId)}
                            >
                              View
                            </Button>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          )}
        </Stack>

        <InvoiceDetailsModal
          opened={!!selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
          invoiceId={selectedInvoiceId}
        />
      </Container>
    </MainLayout>
  );
}
