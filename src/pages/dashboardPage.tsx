"use client";

import {
  Button,
  Container,
  Stack,
  Text,
  Group,
  Title,
  Alert,
} from "@mantine/core";
import { IconFileExport, IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import MainLayout from "../layout/Main";
import { useAuth } from "../Context/useAuth";
import InvoiceStatsGrid from "../Components/Invoice/InvoiceStatsGrid";
import InvoiceList from "../Components/Invoice/InvoiceList";
import InvoiceFilters from "../Components/Invoice/InvoiceFilters";
import InvoiceDetailsModal from "../Components/Invoice/InvoiceDetailsModal";
import InvoiceRevenueChart from "../Components/Invoice/InvoiceRevenueChart";
import InvoiceExportModal from "../Components/Invoice/InvoiceExportModal";
import { useInvoices } from "../hooks/useInvoices";
import { InvoiceQueryParams, InvoiceStats } from "../types/invoice.types";
import {
  fetchInvoiceStats,
  fetchRevenueData,
} from "../Services/invoice-services";
import { RevenueDataPoint } from "../types/invoice.types";
import RevenueChart from "../Components/RevenueChart/RevenueChart";
import DetailedStatsGrid from "../Components/StatsGrid/detailsStatsGrid";
import {
  getSubscriptionStatus,
  getCustomerInvoicesDetails,
} from "../Services/stripeService";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

function DashBoard() {
  const { token } = useAuth();
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
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  const {
    invoices,
    loading,
    pagination,
    refetch,
    setFilters: updateFilters,
  } = useInvoices(filters);

  const [hasPastDue, setHasPastDue] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  // Fetch billing status to check for past due subscriptions and active plan
  useEffect(() => {
    if (!token) return;
    setSubLoading(true);
    getSubscriptionStatus()
      .then((data) => {
        setHasPastDue(data.hasPastDue || false);
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
          return (PLAN_RANK[currentPlan] ?? -1) > (PLAN_RANK[accPlan] ?? -1)
            ? p
            : acc;
        }, null);
        setActivePlan(best);
      })
      .catch(() => {
        setHasPastDue(false);
        setActivePlan(null);
      })
      .finally(() => setSubLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    getCustomerInvoicesDetails()
      .then((data) => console.log("Stripe Invoices Fetched:", data))
      .catch((err) => console.error("Failed to fetch customer invoices:", err));
  }, [token]);

  // Fetch invoice statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!token) return;

      try {
        setStatsLoading(true);
        const data = await fetchInvoiceStats(token);
        setStats(data.payload);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
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
        <Container fluid>
          <Stack gap="lg">
            {/* Header */}
            <Group justify="space-between">
              <div>
                <Title order={2} size="xl" fw={550}>
                  Invoice Dashboard
                </Title>
                <Text c="dimmed" size="sm">
                  Manage and track your Amazon marketplace invoices
                </Text>
              </div>
              <Group>
                <Button
                  leftSection={<IconFileExport size={18} />}
                  variant="light"
                  onClick={handleOpenExport}
                >
                  Export Invoices
                </Button>
              </Group>
            </Group>

            {hasPastDue && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Payment Action Required"
                color="red"
                variant="filled"
              >
                Your recent subscription payment failed. The ability to export
                and generate invoices may be restricted.{" "}
                <Text
                  span
                  bg="transparent"
                  td="underline"
                  style={{ cursor: "pointer", fontWeight: 600 }}
                  onClick={() => navigate("/dashboard/settings?tab=billing")}
                >
                  Update your payment details
                </Text>
              </Alert>
            )}

            <InvoiceStatsGrid stats={stats} loading={statsLoading} />

            {/* Revenue Chart */}
            {/* <InvoiceRevenueChart data={revenueData} loading={revenueLoading} /> */}

            {/* Filters */}
            <InvoiceFilters
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Invoice List */}
            <InvoiceList
              invoices={invoices}
              loading={loading}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onInvoiceClick={handleInvoiceClick}
            />
          </Stack>
        </Container>

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
