import { useState, useCallback, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import {
  IconRefresh,
  IconFileInvoice,
  IconDownload,
  IconCurrencyDollar,
  IconFileExport,
  IconCheck,
} from "@tabler/icons-react";
import { useAuth } from "../Context/useAuth";
import { notifications } from "@mantine/notifications";
import { useInvoices } from "../hooks/useInvoices";
import InvoiceList from "../Components/Invoice/InvoiceList";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceExportModal from "../Components/Invoice/InvoiceExportModal";
import MainLayout from "../layout/Main";
import { downloadInvoiceDocument } from "../Services/invoice-services";
import { getSubscriptionStatus } from "../Services/stripeService";

const LIMIT = 20;

export default function InvoicesPage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [exportOpened, setExportOpened] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // Subscription info — used to gate/configure the export modal
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setSubLoading(true);
    getSubscriptionStatus()
      .then((data) => {
        // activePlans = ['starter', 'growth', ...]  — pick highest
        const plans: string[] = data.activePlans || [];
        const PLAN_RANK: Record<string, number> = {
          free: 0,
          starter: 1,
          growth: 2,
          scale: 3,
          enterprise: 4,
        };
        const best = plans.reduce<string | null>((acc, p) => {
          if (!acc) return p;
          const currentPlan = p.toLowerCase();
          const accPlan = acc.toLowerCase();
          return (PLAN_RANK[currentPlan] ?? -1) > (PLAN_RANK[accPlan] ?? -1) ? p : acc;
        }, null);
        setActivePlan(best);
      })
      .catch(() => setActivePlan(null))
      .finally(() => setSubLoading(false));
  }, [token]);

  const { invoices, loading, pagination, refetch } = useInvoices({
    limit: LIMIT,
    offset: (page - 1) * LIMIT,
  });

  const totalPages = pagination ? Math.ceil(pagination.total / LIMIT) : 1;

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

  // ── Quick stats ──────────────────────────────────────────────────────────
  const totalRevenue = invoices.reduce(
    (acc: number, inv: any) => acc + (inv.totalAmount?.amount || 0),
    0,
  );
  const paidCount = invoices.filter(
    (inv: any) => (inv.invoiceStatus || "").toLowerCase() === "paid",
  ).length;

  return (
    <MainLayout>
      <Container fluid py="xl">
        <Stack gap="lg">
          {/* ── Header ──────────────────────────────────────────── */}
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2}>Invoices</Title>
              <Text c="dimmed" size="sm" mt={4}>
                View, download, and manage your Amazon invoices
              </Text>
            </div>
            <Group gap="sm">
              <Tooltip label="Refresh invoices">
                <ActionIcon
                  variant="default"
                  size="lg"
                  onClick={refetch}
                  loading={loading}
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Tooltip>

              <Button
                leftSection={<IconDownload size={16} />}
                variant="light"
                color="green"
                onClick={handleDownloadAll}
                loading={downloadingAll}
                disabled={invoices.length === 0}
              >
                Download All
              </Button>

              <Button
                leftSection={<IconFileExport size={16} />}
                variant="filled"
                color="blue"
                onClick={handleOpenExport}
                loading={subLoading}
              >
                Export Invoices
              </Button>
            </Group>
          </Group>

          {/* ── Quick Stats ──────────────────────────────────────── */}
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" variant="light" color="blue" radius="md">
                  <IconFileInvoice size={22} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600} lts={0.5}>
                    Total Invoices
                  </Text>
                  <Text fw={700} size="xl" lh={1.2}>
                    {pagination?.total ?? invoices.length}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" variant="light" color="green" radius="md">
                  <IconCurrencyDollar size={22} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600} lts={0.5}>
                    Revenue (this page)
                  </Text>
                  <Text fw={700} size="xl" lh={1.2}>
                    USD{" "}
                    {totalRevenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Group>
                <ThemeIcon size="xl" variant="light" color="teal" radius="md">
                  <IconCheck size={22} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={600} lts={0.5}>
                    Paid Invoices
                  </Text>
                  <Text fw={700} size="xl" lh={1.2}>
                    {paidCount}
                    <Text component="span" size="sm" c="dimmed" ml={6}>
                      / {invoices.length}
                    </Text>
                  </Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* ── Invoice Table ────────────────────────────────────── */}
          <InvoiceList
            invoices={invoices as any}
            loading={loading}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            onInvoiceClick={handleInvoiceClick}
          />
        </Stack>
      </Container>

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
