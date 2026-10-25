import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Container,
  FileButton,
  Group,
  Paper,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  Title,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  IconCloudUpload,
  IconFileInvoice,
  IconRefresh,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import MainLayout from "../layout/Main";
import { useAuth } from "../Context/useAuth";
import {
  bulkGenerateMissingInvoices,
  bulkUploadMissingInvoices,
  lookupMissingInvoices,
  lookupMissingInvoicesFile,
  refreshMissingUploadStatus,
  uploadInvoiceToAmazon,
} from "../Services/missing-invoice-services";
import {
  MissingInvoiceRow,
  MissingLookupFailure,
  MissingLookupSuccess,
  isMissingLookupSuccess,
} from "../types/missing-invoice.types";
import { getInvoiceGenerationError } from "../utils/vatDisplay";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceUploadSubNav from "../Components/Invoice/InvoiceUploadSubNav";

const MAX_MANUAL_IDS = 5;
const MAX_EXCEL_IDS = 20;

const countManualIds = (text: string) =>
  text
    .split(/[,;\n\r\t]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

type ApiErrorBody = { message?: string; code?: string };

const getLookupApiError = (err: unknown) => {
  const data = (err as { response?: { data?: ApiErrorBody } })?.response?.data;
  return {
    message:
      data?.message ||
      (err instanceof Error ? err.message : "Lookup failed"),
    code: data?.code,
  };
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

export default function MissingInvoicesPage() {
  const { token } = useAuth();
  const [orderIdsText, setOrderIdsText] = useState("");
  const [rows, setRows] = useState<MissingInvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkGenLoading, setBulkGenLoading] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [rowBusy, setRowBusy] = useState<Record<string, string>>({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [lastLookup, setLastLookup] = useState<
    | { type: "manual"; orderIdsText: string }
    | { type: "excel" }
    | null
  >(null);
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
    if (!options?.quiet) {
      notifications.show({
        color: "green",
        title: "Orders loaded",
        message: `${res.summary.total} order(s) on this page — ${res.summary.invoiceMissing} missing invoice(s).`,
      });
    }
  };

  const refreshTable = async () => {
    if (!token || !lastLookup) return;
    setLoading(true);
    try {
      if (lastLookup.type === "manual") {
        const res = await lookupMissingInvoices(token, {
          orderIdsText: lastLookup.orderIdsText,
        });
        if (isMissingLookupSuccess(res)) setRows(res.results);
      } else if (rows.length > 0) {
        const statusRes = await refreshMissingUploadStatus(
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
                errorMessage: hit.errorMessage ?? row.errorMessage,
              };
            }),
          );
        }
        await refreshLookup(rows.map((r) => r.orderId));
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshLookup = async (orderIds: string[]) => {
    if (!token || orderIds.length === 0) return;
    const res = await lookupMissingInvoices(token, { orderIds });
    if (isMissingLookupSuccess(res)) setRows(res.results);
  };

  const notifyLookupFailure = (
    res: MissingLookupFailure,
    title = "Lookup failed",
  ) => {
    setRows([]);
    notifications.show({
      color: "red",
      title:
        res.code === "ORDER_BEFORE_SELLER_JOIN"
          ? "Historical orders not allowed"
          : title,
      message: res.message || "Lookup failed",
      autoClose: 9000,
    });
  };

  const handleLookupText = async () => {
    if (!token) return;
    const trimmed = orderIdsText.trim();
    if (!trimmed) {
      notifications.show({
        color: "orange",
        title: "Order IDs required",
        message: "Enter up to 5 comma-separated Amazon order IDs.",
      });
      return;
    }
    const count = countManualIds(trimmed);
    if (count > MAX_MANUAL_IDS) {
      notifications.show({
        color: "orange",
        title: "Too many order IDs",
        message: `Maximum ${MAX_MANUAL_IDS} IDs allowed (you entered ${count}).`,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await lookupMissingInvoices(token, { orderIdsText: trimmed });
      if (!isMissingLookupSuccess(res)) {
        notifyLookupFailure(res);
        return;
      }
      setLastLookup({ type: "manual", orderIdsText: trimmed });
      applyLookupResponse(res);
    } catch (err: unknown) {
      const { message, code } = getLookupApiError(err);
      setRows([]);
      notifications.show({
        color: "red",
        title:
          code === "ORDER_BEFORE_SELLER_JOIN"
            ? "Historical orders not allowed"
            : "Lookup failed",
        message,
        autoClose: 9000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookupFile = async (file: File | null) => {
    if (!token || !file) return;
    setLoading(true);
    try {
      const res = await lookupMissingInvoicesFile(token, file);
      if (!isMissingLookupSuccess(res)) {
        notifyLookupFailure(res, "File lookup failed");
        return;
      }
      if (res.summary.total > MAX_EXCEL_IDS) {
        throw new Error(`File may contain at most ${MAX_EXCEL_IDS} order IDs.`);
      }
      setLastLookup({ type: "excel" });
      applyLookupResponse(res);
      setOrderIdsText(res.results.map((r) => r.orderId).join(", "));
      notifications.show({
        color: "green",
        title: "File processed",
        message: `${res.summary.total} order ID(s) loaded (max ${MAX_EXCEL_IDS}).`,
      });
    } catch (err: unknown) {
      const { message, code } = getLookupApiError(err);
      setRows([]);
      notifications.show({
        color: "red",
        title:
          code === "ORDER_BEFORE_SELLER_JOIN"
            ? "Historical orders not allowed"
            : "File lookup failed",
        message,
        autoClose: 9000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowGenerate = async (row: MissingInvoiceRow) => {
    if (!token) return;
    setRowBusy((b) => ({ ...b, [row.orderId]: "generate" }));
    try {
      const res = await bulkGenerateMissingInvoices(token, [row.orderId], true);
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
      await refreshLookup([row.orderId]);
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
      const res = await uploadInvoiceToAmazon(token, row.invoiceId, forceRetry);
      if (!res.success) {
        throw new Error(res.message || "Upload failed");
      }
      const done = res.uploadStatus === "UPLOADED";
      notifications.show({
        color: done ? "green" : "blue",
        title: done ? "Uploaded to Amazon" : "Submitted to Amazon",
        message:
          res.feedId && done
            ? `Feed ${res.feedId} completed`
            : res.feedId
              ? `Feed ${res.feedId} — ${res.processingStatus || "processing"}`
              : "Upload queued",
      });
      await refreshLookup([row.orderId]);
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
      const res = await bulkGenerateMissingInvoices(token, eligibleOrderIds, true);
      const ok = res.results.filter((r) => r.success).length;
      notifications.show({
        color: "green",
        title: "Bulk generate complete",
        message: `${ok}/${res.results.length} succeeded.`,
      });
      await refreshLookup(rows.map((r) => r.orderId));
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
      const res = await bulkUploadMissingInvoices(token, uploadableOrderIds);
      const ok = res.results.filter((r) => r.success).length;
      notifications.show({
        color: "green",
        title: "Bulk upload complete",
        message: `${ok}/${res.results.length} submitted.`,
      });
      await refreshLookup(rows.map((r) => r.orderId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bulk upload failed";
      notifications.show({ color: "red", title: "Bulk upload failed", message });
    } finally {
      setBulkUploadLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container size="xl" py="md">
        <Stack gap="md">
          <InvoiceUploadSubNav />

          <div>
            <Title order={2}>Upload missing invoices</Title>
            <Text c="dimmed" size="sm" mt={4}>
              Find orders that are missing invoices on Amazon, generate PDFs, and
              upload them. Only orders on or after your seller account join date
              are allowed here (same rule as automatic order sync). Counts against
              your subscription monthly invoice limit. For older orders, purchase
              the add-on in Billing and use Historical Amazon Orders.
            </Text>
          </div>

          <Paper withBorder p="md" radius="md">
            <Tabs defaultValue="text">
              <Tabs.List>
                <Tabs.Tab value="text">Order IDs (max {MAX_MANUAL_IDS})</Tabs.Tab>
                <Tabs.Tab value="excel">Excel / CSV (max {MAX_EXCEL_IDS})</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="text" pt="md">
                <Stack gap="sm">
                  <Textarea
                    placeholder="402-1234567-7654321, 402-9876543-2109876"
                    minRows={3}
                    value={orderIdsText}
                    onChange={(e) => setOrderIdsText(e.currentTarget.value)}
                    description={`Comma-separated, maximum ${MAX_MANUAL_IDS} order IDs.`}
                  />
                  <Button
                    leftSection={<IconSearch size={16} />}
                    loading={loading}
                    onClick={handleLookupText}
                  >
                    Fetch orders
                  </Button>
                </Stack>
              </Tabs.Panel>
              <Tabs.Panel value="excel" pt="md">
                <Stack gap="sm">
                  <Text size="sm" c="dimmed">
                    Upload .xlsx or .csv (max {MAX_EXCEL_IDS} IDs) with an
                    &quot;Amazon Order ID&quot; column or IDs in the first column.
                  </Text>
                  <FileButton onChange={handleLookupFile} accept=".xlsx,.xls,.csv">
                    {(props) => (
                      <Button {...props} leftSection={<IconUpload size={16} />} loading={loading}>
                        Choose file
                      </Button>
                    )}
                  </FileButton>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Paper>

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

          {rows.length > 0 && (
            <Paper withBorder radius="md" style={{ overflow: "auto" }}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order ID</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Invoice</Table.Th>
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
