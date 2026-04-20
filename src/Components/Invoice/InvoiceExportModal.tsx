import {
  Modal,
  Stack,
  Group,
  Button,
  Select,
  Paper,
  Text,
  Badge,
  Table,
  Loader,
  Center,
  Alert,
  Divider,
  ThemeIcon,
  Tooltip,
  Title,
  Anchor,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconFileExport,
  IconDownload,
  IconClock,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconLock,
  IconCrown,
  IconFileTypePdf,
  IconFileTypeCsv,
  IconArrowRight,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import {
  ExportParams,
  ExportFormat,
  InvoiceStatus,
  InvoiceType,
  ExportStatus,
  InvoiceExport,
} from "../../types/invoice.types";
import { useInvoiceExport } from "../../hooks/useInvoiceExport";
import { notifications } from "@mantine/notifications";
import { InvoiceStatusOptions } from "../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import { downloadExportedFile } from "../../Services/invoice-services";

interface InvoiceExportModalProps {
  opened: boolean;
  onClose: () => void;
  /** Pass the current plan name to gate CSV. undefined = no subscription */
  userPlan?: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getExportStatusColor = (status: ExportStatus): string => {
  switch (status) {
    case "PENDING":
      return "gray";
    case "IN_PROGRESS":
      return "blue";
    case "COMPLETED":
      return "green";
    case "FAILED":
      return "red";
    default:
      return "gray";
  }
};

const getExportStatusIcon = (status: ExportStatus) => {
  switch (status) {
    case "PENDING":
      return <IconClock size={14} />;
    case "IN_PROGRESS":
      return <Loader size={14} />;
    case "COMPLETED":
      return <IconCheck size={14} />;
    case "FAILED":
      return <IconX size={14} />;
    default:
      return null;
  }
};

const formatExportId = (id: string) =>
  id.length > 20 ? `${id.slice(0, 18)}…` : id;

// ─── Component ────────────────────────────────────────────────────────────────

export default function InvoiceExportModal({
  opened,
  onClose,
  userPlan,
}: InvoiceExportModalProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    exports,
    loading,
    subscriptionError,
    createExport,
    refreshExports,
    pollExportStatus,
  } = useInvoiceExport();

  // Form state
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [format, setFormat] = useState<ExportFormat>("PDF");
  const [creating, setCreating] = useState(false);

  // Load export history when modal opens
  useEffect(() => {
    if (opened) {
      refreshExports();
    }
  }, [opened, refreshExports]);

  // Ensure the plan name is lowercased for safe comparison (e.g., 'Starter' -> 'starter')
  const normalizedPlan = (userPlan || "").toLowerCase();

  // Decide if PDF/export is available at all: Must be 'starter', 'growth', 'scale', or 'enterprise'.
  // 'free' or empty means NO export access.
  const hasSubscription = !!normalizedPlan && normalizedPlan !== "free";
  const noSubscription = !hasSubscription;

  // Decide if CSV is available: Must be 'growth', 'scale', or 'enterprise'.
  const csvAvailable =
    normalizedPlan === "growth" ||
    normalizedPlan === "scale" ||
    normalizedPlan === "enterprise";

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreateExport = async () => {
    const params: ExportParams = { format };

    // In handleCreateExport:
    if (dateRange[0]) params.dateFrom = new Date(dateRange[0]).toISOString();
    if (dateRange[1]) params.dateTo = new Date(dateRange[1]).toISOString();
    if (selectedStatus)
      params.invoiceStatus = [selectedStatus as InvoiceStatus];
    if (selectedType) params.invoiceTypes = [selectedType as InvoiceType];

    setCreating(true);
    const exportId = await createExport(params);
    setCreating(false);

    if (exportId) {
      notifications.show({
        title: "Export Started",
        message: "Your export is being processed…",
        color: "blue",
        icon: <IconFileExport size={16} />,
      });

      pollExportStatus(exportId, (expData) => {
        notifications.show({
          title: "Export Complete ✓",
          message: `${expData.exportedRecords} invoice(s) exported successfully`,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        refreshExports();
      });
    }
  };

  const handleDownload = async (url: string) => {
    if (!token) return;
    try {
      await downloadExportedFile(token, url);
    } catch (error) {
      notifications.show({
        title: "Download Failed",
        message: "Could not download the file securely. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  // ── No Subscription Gate ──────────────────────────────────────────────────

  const SubscriptionGate = () => (
    <Center py="xl">
      <Stack align="center" gap="lg" maw={380}>
        <ThemeIcon size={72} radius="xl" variant="light" color="orange">
          <IconCrown size={38} />
        </ThemeIcon>

        <div style={{ textAlign: "center" }}>
          <Title order={4} mb={6}>
            Subscription Required
          </Title>
          <Text size="sm" c="dimmed" lh={1.6}>
            Invoice exports are available on paid plans. Subscribe to{" "}
            <strong>Starter</strong> or higher to export your invoices as PDF,
            and <strong>Growth</strong>+ to unlock CSV exports.
          </Text>
        </div>

        <Alert
          icon={<IconAlertCircle size={16} />}
          color="orange"
          variant="light"
          radius="md"
          style={{ width: "100%" }}
        >
          {subscriptionError ||
            "No active subscription found. Please subscribe to a plan to continue."}
        </Alert>

        <Group gap="sm">
          <Button
            variant="filled"
            color="orange"
            rightSection={<IconArrowRight size={16} />}
            onClick={() => {
              onClose();
              navigate("/price");
            }}
          >
            View Plans & Pricing
          </Button>
          <Button variant="default" onClick={onClose}>
            Maybe Later
          </Button>
        </Group>
      </Stack>
    </Center>
  );

  // ── Main Export UI ────────────────────────────────────────────────────────

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconFileExport size={14} />
          </ThemeIcon>
          <Text fw={600}>Export Invoices</Text>
          {userPlan && (
            <Badge variant="dot" color="green" size="sm" tt="capitalize">
              {userPlan} plan
            </Badge>
          )}
        </Group>
      }
      size="lg"
      padding="lg"
    >
      {/* ── Subscription gate: no plan at all ── */}
      {noSubscription && !creating ? (
        <SubscriptionGate />
      ) : (
        <Stack gap="lg">
          {/* Inline error after trying to export (limit reached / past_due) */}
          {subscriptionError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
              title="Export unavailable"
              withCloseButton
            >
              {subscriptionError}{" "}
              <Anchor
                size="sm"
                onClick={() => {
                  onClose();
                  navigate("/price");
                }}
              >
                Upgrade your plan →
              </Anchor>
            </Alert>
          )}

          {/* ── Export Configuration ─────────────────────────────── */}
          <Paper p="md" radius="md" withBorder>
            <Text fw={600} size="sm" mb="md">
              Export Configuration
            </Text>
            <Stack gap="sm">
              {/* Date range */}
              <DatePickerInput
                type="range"
                label="Date Range"
                placeholder="Filter by issue date (optional)"
                value={dateRange}
                onChange={setDateRange}
                size="sm"
                clearable
                popoverProps={{ withinPortal: true }}
              />

              {/* Status filter */}
              <Select
                label="Invoice Status"
                placeholder="All statuses"
                data={InvoiceStatusOptions.map((s) => ({
                  value: s.value,
                  label: s.label,
                }))}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
                size="sm"
              />

              {/* Type filter */}
              <Select
                label="Invoice Type"
                placeholder="All types"
                data={[
                  { value: "INVOICE", label: "Invoice" },
                  { value: "CREDIT_NOTE", label: "Credit Note" },
                  { value: "DEBIT_NOTE", label: "Debit Note" },
                ]}
                value={selectedType}
                onChange={setSelectedType}
                clearable
                size="sm"
              />

              {/* Format selector */}
              <div>
                <Text size="sm" fw={500} mb={6}>
                  Export Format
                </Text>
                <Group gap="sm">
                  {/* PDF — always available */}
                  <Paper
                    p="sm"
                    radius="md"
                    withBorder
                    style={{
                      cursor: "pointer",
                      flex: 1,
                      borderColor:
                        format === "PDF"
                          ? "var(--mantine-color-blue-6)"
                          : undefined,
                      background:
                        format === "PDF"
                          ? "var(--mantine-color-blue-0)"
                          : undefined,
                    }}
                    onClick={() => setFormat("PDF")}
                  >
                    <Group gap="xs" justify="center">
                      <ThemeIcon size="sm" variant="light" color="red">
                        <IconFileTypePdf size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={600}>
                        PDF
                      </Text>
                      {format === "PDF" && (
                        <Badge size="xs" color="blue" variant="filled">
                          Selected
                        </Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed" ta="center" mt={4}>
                      Available on all paid plans
                    </Text>
                  </Paper>

                  {/* CSV — Growth+ only */}
                  <Tooltip
                    label="CSV export requires Growth or Scale plan"
                    disabled={csvAvailable}
                    position="top"
                    withArrow
                  >
                    <Paper
                      p="sm"
                      radius="md"
                      withBorder
                      style={{
                        cursor: csvAvailable ? "pointer" : "not-allowed",
                        flex: 1,
                        opacity: csvAvailable ? 1 : 0.5,
                        borderColor:
                          format === "CSV" && csvAvailable
                            ? "var(--mantine-color-blue-6)"
                            : undefined,
                        background:
                          format === "CSV" && csvAvailable
                            ? "var(--mantine-color-blue-0)"
                            : undefined,
                      }}
                      onClick={() => csvAvailable && setFormat("CSV")}
                    >
                      <Group gap="xs" justify="center">
                        <ThemeIcon size="sm" variant="light" color="green">
                          <IconFileTypeCsv size={14} />
                        </ThemeIcon>
                        <Text size="sm" fw={600}>
                          CSV
                        </Text>
                        {!csvAvailable && (
                          <IconLock
                            size={12}
                            color="var(--mantine-color-dimmed)"
                          />
                        )}
                      </Group>
                      <Text size="xs" c="dimmed" ta="center" mt={4}>
                        {csvAvailable ? "Available" : "Growth plan required"}
                      </Text>
                    </Paper>
                  </Tooltip>
                </Group>
              </div>

              <Button
                fullWidth
                leftSection={<IconFileExport size={18} />}
                onClick={handleCreateExport}
                loading={creating}
                mt="xs"
              >
                Create Export
              </Button>
            </Stack>
          </Paper>

          <Divider label="Export History" labelPosition="center" />

          {/* ── Export History ───────────────────────────────────── */}
          <Paper radius="md" withBorder>
            {loading ? (
              <Center h={160}>
                <Stack align="center" gap="sm">
                  <Loader size="md" />
                  <Text size="sm" c="dimmed">
                    Loading history…
                  </Text>
                </Stack>
              </Center>
            ) : exports.length === 0 ? (
              <Center h={120}>
                <Stack align="center" gap="xs">
                  <ThemeIcon size="xl" variant="light" color="gray">
                    <IconFileExport size={20} />
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    No exports yet
                  </Text>
                </Stack>
              </Center>
            ) : (
              <Table.ScrollContainer minWidth={500}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Export ID</Table.Th>
                      <Table.Th>Format</Table.Th>
                      <Table.Th>Records</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Created</Table.Th>
                      <Table.Th>Download</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {exports.map((exp: InvoiceExport) => (
                      <Table.Tr key={exp.exportId}>
                        <Table.Td>
                          <Text size="xs" fw={500} c="dimmed" ff="monospace">
                            {formatExportId(exp.exportId)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">
                            {exp.exportFormat}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {exp.exportedRecords}{" "}
                            <Text component="span" c="dimmed" size="xs">
                              / {exp.totalRecords}
                            </Text>
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={getExportStatusColor(exp.status)}
                            leftSection={getExportStatusIcon(exp.status)}
                            size="sm"
                          >
                            {exp.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" c="dimmed">
                            {new Date(exp.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {exp.status === "COMPLETED" && exp.exportedFileUrl ? (
                            <Button
                              size="xs"
                              variant="subtle"
                              color="blue"
                              leftSection={<IconDownload size={12} />}
                              onClick={() =>
                                handleDownload(exp.exportedFileUrl!)
                              }
                            >
                              Download
                            </Button>
                          ) : (
                            <Text size="xs" c="dimmed">
                              —
                            </Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}
          </Paper>
        </Stack>
      )}
    </Modal>
  );
}
