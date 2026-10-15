import { useState, useEffect } from "react";
import {
  Text,
  Stack,
  Group,
  Button,
  Divider,
  Alert,
  Badge,
  Table,
  Modal,
  Loader,
  Center,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconDownload,
  IconHistory,
} from "@tabler/icons-react";
import { useAuth } from "../../Context/useAuth";
import { pickBestPlan } from "../../hooks/useSubscriptionStatus";
import { notifications } from "@mantine/notifications";
import {
  getSubscriptionStatus,
  getCustomerInvoicesDetails,
  cancelSubscription,
} from "../../Services/stripeService";
import MainLayout from "../../layout/Main";
import { Link } from "react-router-dom";
import { useScroll } from "../../Context/scrollContext";
import {
  AppCard,
  PageHeader,
  PillTone,
  StatusPill,
  appButton,
  ui,
} from "../../Components/AppUi";
import classes from "./Billing.module.scss";

/** Stripe subscription status → pill tone */
const subTone = (status: string, cancelAtPeriodEnd: boolean): PillTone => {
  if (cancelAtPeriodEnd) return "warning";
  switch (status) {
    case "active":
    case "trialing":
      return "success";
    case "past_due":
      return "danger";
    default:
      return "neutral";
  }
};

/** Stripe invoice status → pill tone */
const receiptTone = (status: string): PillTone => {
  switch (status) {
    case "paid":
      return "success";
    case "open":
      return "warning";
    case "void":
    case "uncollectible":
      return "danger";
    default:
      return "neutral";
  }
};

export default function SettingsBillingPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);

  // Real Data Arrays
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Aggregation state
  const [activePlans, setActivePlans] = useState<string[]>([]);
  const [totalAllowedInvoices, setTotalAllowedInvoices] = useState<number>(0);
  const [invoicesGeneratedThisMonth, setInvoicesGeneratedThisMonth] =
    useState<number>(0);
  const [hasPastDue, setHasPastDue] = useState(false);

  // Modal
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);

  // Invoice View Modal State
  const [invoiceModalOpened, { open: openInvoice, close: closeInvoice }] =
    useDisclosure(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const { navigateToSection } = useScroll();
  const handleViewInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    openInvoice();
  };

  useEffect(() => {
    loadBillingData();
  }, [token]);

  const loadBillingData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Promise.all to fetch concurrently
      const [subData, invData] = await Promise.all([
        getSubscriptionStatus(),
        getCustomerInvoicesDetails(),
      ]);
      setSubscriptions(subData.subscriptions || []);
      setActivePlans(subData.activePlans || []);
      setTotalAllowedInvoices(subData.totalAllowedInvoices || 0);
      setInvoicesGeneratedThisMonth(subData.invoicesGeneratedThisMonth || 0);
      setHasPastDue(subData.hasPastDue || false);
      setInvoices(invData.data || []);
    } catch (error) {
      console.error("Failed to fetch billing status", error);
      notifications.show({
        title: "Error",
        message: "Could not load all billing history.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (subId: number) => {
    setSelectedSubId(subId);
    open();
  };

  const confirmCancel = async () => {
    if (!selectedSubId) return;
    setCanceling(true);
    try {
      await cancelSubscription(selectedSubId);
      notifications.show({
        title: "Success",
        message:
          "Subscription canceled successfully. You will maintain access until the end of the current billing cycle.",
        color: "green",
      });
      close();
      loadBillingData();
    } catch (err: any) {
      notifications.show({
        title: "Cancellation Error",
        message:
          err?.response?.data?.error ||
          "Failed to cancel subscription natively.",
        color: "red",
      });
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatUnix = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Primary plan shown in the "Active plan" card (highest-ranking live subscription)
  const liveSubs = subscriptions.filter((s) =>
    ["active", "trialing", "past_due"].includes(s.status),
  );
  const bestPlan = pickBestPlan(liveSubs.map((s) => s.plan));
  const primarySub =
    liveSubs.find((s) => s.plan === bestPlan) ?? liveSubs[0] ?? null;

  const remainingInvoices = Math.max(
    totalAllowedInvoices - invoicesGeneratedThisMonth,
    0,
  );
  const usedPct =
    totalAllowedInvoices > 0
      ? Math.min(
          100,
          Math.round((invoicesGeneratedThisMonth / totalAllowedInvoices) * 100),
        )
      : 0;

  return (
    <MainLayout>
      <PageHeader
        title="Subscription & billing"
        subtitle="Manage your active plan, usage, and payment history."
      />

      {hasPastDue && (
        <Alert
          mb="lg"
          icon={<IconAlertCircle size={16} />}
          title="Payment Action Required"
          color="red"
          variant="filled"
        >
          Your recent subscription payment failed. Your automated invoicing
          feature is currently paused.
        </Alert>
      )}

      {/* ── Plan + usage ─────────────────────────────────────── */}
      <div className={classes.planRow}>
        <AppCard tone="dark" className={classes.planCard}>
          <span className={classes.planEyebrow}>Active plan</span>
          {primarySub ? (
            <>
              <div className={classes.planTop}>
                <span className={classes.planName}>
                  {primarySub.plan.charAt(0).toUpperCase() +
                    primarySub.plan.slice(1)}
                </span>
                {primarySub.currentPeriodEnd && (
                  <span className={classes.planRenew}>
                    {primarySub.cancel_at_period_end ? "Ends" : "Renews"}{" "}
                    {formatDate(primarySub.currentPeriodEnd)}
                  </span>
                )}
              </div>
              <div className={classes.planBottom}>
                <StatusPill
                  tone={subTone(primarySub.status, primarySub.cancel_at_period_end)}
                  className={classes.upper}
                >
                  {primarySub.cancel_at_period_end
                    ? "Cancels at period end"
                    : primarySub.status.replace(/_/g, " ")}
                </StatusPill>
                {primarySub.plan.toLowerCase() === "free" && (
                  <Button
                    className={appButton("primary", true)}
                    onClick={() => navigateToSection("pricing", "/")}
                  >
                    Upgrade plan
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={classes.planTop}>
                <span className={classes.planName}>No active plan</span>
              </div>
              <div className={classes.planBottom}>
                <Button
                  className={appButton("primary", true)}
                  onClick={() => navigateToSection("pricing", "/")}
                >
                  Subscribe
                </Button>
              </div>
            </>
          )}
        </AppCard>

        <AppCard className={classes.usageCard}>
          <div className={classes.usageText}>
            <span className={ui.eyebrow}>Monthly invoices remaining</span>
            <span className={classes.usageValue}>
              {remainingInvoices.toLocaleString()} left
            </span>
            <span className={ui.mutedText}>
              {invoicesGeneratedThisMonth.toLocaleString()} used out of{" "}
              {totalAllowedInvoices.toLocaleString()} limit
            </span>
          </div>
          <span className={classes.usageTrack}>
            <span
              className={classes.usageBar}
              style={{ width: `${usedPct}%` }}
            />
          </span>
        </AppCard>
      </div>

      {/* ── Subscription history ─────────────────────────────── */}
      <AppCard className={classes.tableCard}>
        <h2 className={classes.tableTitle}>Subscription history</h2>
        {loading ? (
          <Center py="xl">
            <Loader color="teal" />
          </Center>
        ) : subscriptions.length > 0 ? (
          <Table.ScrollContainer minWidth={640}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Plan</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Activation date</Table.Th>
                  <Table.Th>Current period end</Table.Th>
                  <Table.Th ta="right">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {subscriptions.map((sub: any) => (
                  <Table.Tr key={sub.id}>
                    <Table.Td className={classes.strong} tt="capitalize">
                      {sub.plan}
                    </Table.Td>
                    <Table.Td>
                      <StatusPill
                        tone={subTone(sub.status, sub.cancel_at_period_end)}
                        className={classes.upper}
                      >
                        {sub.cancel_at_period_end
                          ? "Cancels at period end"
                          : sub.status.replace(/_/g, " ")}
                      </StatusPill>
                    </Table.Td>
                    <Table.Td className={ui.mutedText}>
                      {formatDate(sub.createdAt)}
                    </Table.Td>
                    <Table.Td className={ui.mutedText}>
                      {formatDate(sub.currentPeriodEnd)}
                    </Table.Td>
                    <Table.Td ta="right">
                      {sub.status === "active" && !sub.cancel_at_period_end && (
                        <Button
                          className={appButton("dangerText", true)}
                          onClick={() => handleCancelClick(sub.id)}
                        >
                          Cancel plan
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : (
          <Text size="sm" c="dimmed">
            No subscriptions found on your account.
          </Text>
        )}
      </AppCard>

      {/* ── Invoices & receipts ──────────────────────────────── */}
      <AppCard className={classes.tableCard}>
        <h2 className={classes.tableTitle}>Invoices &amp; receipts</h2>
        {loading ? (
          <Center py="xl">
            <Loader color="teal" />
          </Center>
        ) : invoices.length > 0 ? (
          <Table.ScrollContainer minWidth={560}>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((inv: any) => (
                  <Table.Tr key={inv.id}>
                    <Table.Td className={ui.mutedText}>
                      {formatUnix(inv.created)}
                    </Table.Td>
                    <Table.Td className={classes.strong}>
                      {inv.currency.toUpperCase()}{" "}
                      {(inv.amount_paid / 100).toFixed(2)}
                    </Table.Td>
                    <Table.Td>
                      <StatusPill
                        tone={receiptTone(inv.status)}
                        className={classes.upper}
                      >
                        {inv.status}
                      </StatusPill>
                    </Table.Td>
                    <Table.Td>
                      <div className={classes.rowActions}>
                        {inv.hosted_invoice_url && (
                          <Button
                            className={appButton("soft", true)}
                            onClick={() => handleViewInvoice(inv)}
                          >
                            View
                          </Button>
                        )}
                        {inv.invoice_pdf && (
                          <Button
                            className={appButton("soft", true)}
                            component="a"
                            href={inv.invoice_pdf}
                            download
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : (
          <Group gap="sm" mt="md">
            <IconHistory size={20} color="gray" />
            <Text size="sm" c="dimmed">
              No historical invoices have been generated yet.
            </Text>
          </Group>
        )}
      </AppCard>

      <Modal
        opened={opened}
        onClose={close}
        title="Confirm Subscription Cancellation"
        centered
      >
        <Text size="sm">
          Are you sure you want to cancel this subscription?
        </Text>
        <Alert
          mt="md"
          mb="md"
          color="blue"
          title="Important Notification"
          variant="light"
          icon={<IconAlertCircle size={16} />}
        >
          You can continue utilizing your extracted invoice limits and all
          features associated with this plan until the{" "}
          <b>end of your current paid billing cycle</b>. You will not be billed
          again.
        </Alert>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={close} disabled={canceling}>
            Keep Plan
          </Button>
          <Button color="red" onClick={confirmCancel} loading={canceling}>
            Yes, Cancel Plan
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={invoiceModalOpened}
        onClose={closeInvoice}
        title="Invoice Summary"
        size="lg"
        centered
      >
        {selectedInvoice && (
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={700} size="lg">
                Invoice #
                {selectedInvoice.number || selectedInvoice.id.slice(0, 8)}
              </Text>
              <Badge color={selectedInvoice.paid ? "green" : "orange"}>
                {selectedInvoice.status.toUpperCase()}
              </Badge>
            </Group>
            <Divider />

            <Group justify="space-between">
              <Text c="dimmed" size="sm">
                Date Billed:
              </Text>
              <Text fw={500}>{formatUnix(selectedInvoice.created)}</Text>
            </Group>

            <Box mt="md">
              <Text fw={600} mb="sm" tt="uppercase" size="xs" c="dimmed">
                Line Items
              </Text>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Description</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Amount</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedInvoice.lines?.data?.map((line: any) => (
                    <Table.Tr key={line.id}>
                      <Table.Td>{line.description}</Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        {(line.amount / 100).toFixed(2)}{" "}
                        {selectedInvoice.currency.toUpperCase()}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>

            <Divider mt="md" />
            <Group justify="space-between" mt="xs">
              <Text fw={700} size="lg">
                Total Paid:
              </Text>
              <Text fw={700} size="lg" c="blue">
                {(selectedInvoice.amount_paid / 100).toFixed(2)}{" "}
                {selectedInvoice.currency.toUpperCase()}
              </Text>
            </Group>

            <Group justify="flex-end" mt="xl">
              <Button variant="default" onClick={closeInvoice}>
                Close
              </Button>
              {selectedInvoice.invoice_pdf && (
                <Button
                  component="a"
                  href={selectedInvoice.invoice_pdf}
                  download
                  leftSection={<IconDownload size={16} />}
                >
                  Download External PDF
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
    </MainLayout>
  );
}
