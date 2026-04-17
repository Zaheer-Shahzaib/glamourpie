import { useState, useEffect } from "react";
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
  ActionIcon,
  Tooltip,
  Modal,
} from "@mantine/core";
import { IconEye, IconRefresh } from "@tabler/icons-react";
import { useAuth } from "../Context/useAuth";
import { notifications } from "@mantine/notifications";
import {
  fetchInvoices,
  fetchInvoiceDetails,
} from "../Services/invoice-services";
import { Invoice } from "../types/invoice.types";
import MainLayout from "../layout/Main";
import { getStatusColor } from "../utils/helperFunctions";

// const getStatusColor = (status: string | undefined): string => {
//     switch (status) {
//         case 'Paid':
//             return 'green';
//         case 'Pending':
//         case 'Unpaid':
//             return 'orange';
//         case 'Cancelled':
//             return 'red';
//         default:
//             return 'gray';
//     }
// };

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (
  amount: number | undefined,
  currency: string | undefined,
): string => {
  if (amount === undefined) return "N/A";
  return `${currency || ""} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function InvoicesPage() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [token]);

  const loadInvoices = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetchInvoices(token);
      setInvoices(response?.payload?.invoices || []);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load invoices",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (invoiceId: string) => {
    if (!token) return;

    try {
      setDetailsLoading(true);
      setDetailsModalOpened(true);
      // Wait to ensure modal pops open showing loading state
      const response = await fetchInvoiceDetails(token, invoiceId);
      setSelectedInvoice(response.payload.invoice);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load invoice details",
        color: "red",
      });
      setDetailsModalOpened(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container fluid py="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2}>Invoices</Title>
              <Text c="dimmed" size="sm">
                View and manage your Amazon invoices
              </Text>
            </div>
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={loadInvoices}
              loading={loading}
            >
              Refresh
            </Button>
          </Group>

          {/* Invoices Table */}
          <Paper radius="md" withBorder>
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Invoice ID</Table.Th>
                    <Table.Th>Issue Date</Table.Th>
                    <Table.Th>Amazon Order ID</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Subtotal</Table.Th>
                    <Table.Th>Tax</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl">
                          Loading invoices...
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : invoices.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text ta="center" py="xl" c="dimmed">
                          No invoices found
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    invoices.map((invoice: any, idx: number) => {
                      const displayId =
                        invoice.invoiceNumber ??
                        invoice.id ??
                        invoice.amazonOrderId;
                      return (
                        <Table.Tr key={invoice.id || idx}>
                          <Table.Td>
                            <Text fw={600} size="sm">
                              {displayId}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {formatDate(invoice.issueDate)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {invoice.amazonOrderId || "N/A"}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={getStatusColor(invoice.invoiceStatus)}
                              variant="filled"
                            >
                              {invoice.invoiceStatus || "Pending"}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600} size="sm">
                              {formatCurrency(
                                invoice.totalAmount?.amount,
                                invoice.totalAmount?.currencyCode,
                              )}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">
                              {formatCurrency(
                                invoice.taxAmount?.amount,
                                invoice.taxAmount?.currencyCode,
                              ) || "N/A"}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => handleViewDetails(displayId)}
                              >
                                <IconEye size={18} />
                              </ActionIcon>
                            </Tooltip>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Stack>
      </Container>

      {/* Invoice Details Modal */}
      <Modal
        opened={detailsModalOpened}
        onClose={() => setDetailsModalOpened(false)}
        title="Invoice Details"
        size="lg"
        padding="lg"
      >
        {detailsLoading || !selectedInvoice ? (
          <Text>Loading invoice details...</Text>
        ) : (
          <Stack gap="lg">
            <Paper p="md" withBorder>
              <Group justify="space-between" mb="md">
                <div>
                  <Text fw={700} size="lg">
                    {selectedInvoice.invoiceNumber || selectedInvoice.id}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Issued: {formatDate(selectedInvoice.issueDate)}
                  </Text>
                </div>
                <Badge
                  size="lg"
                  color={getStatusColor(selectedInvoice.invoiceStatus)}
                  variant="filled"
                >
                  {selectedInvoice.invoiceStatus || "Pending"}
                </Badge>
              </Group>

              <Text size="sm" mb="xs">
                <strong>Amazon Order ID:</strong>{" "}
                {selectedInvoice.amazonOrderId || "N/A"}
              </Text>
              <Text size="sm">
                <strong>Buyer:</strong> {selectedInvoice.buyerName || "N/A"}
              </Text>
            </Paper>

            <Paper p="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text>Total Amount:</Text>
                <Text fw={700}>
                  {formatCurrency(
                    selectedInvoice.totalAmount?.amount,
                    selectedInvoice.totalAmount?.currencyCode,
                  )}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text>Tax Amount:</Text>
                <Text>
                  {formatCurrency(
                    selectedInvoice.taxAmount?.amount,
                    selectedInvoice.taxAmount?.currencyCode,
                  )}
                </Text>
              </Group>
            </Paper>

            <Text size="sm" c="dimmed" ta="center">
              Note: If connecting to Sandbox, Amazon SP-API mock invoices may be
              sparse.
            </Text>
          </Stack>
        )}
      </Modal>
    </MainLayout>
  );
}
