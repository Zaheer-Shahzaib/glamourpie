import { useState } from "react";
import {
  Paper,
  Table,
  Badge,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Pagination,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import { IconEye, IconFileDownload } from "@tabler/icons-react";
import { InvoiceStatus, InvoiceType } from "../../types/invoice.types";
import { useAuth } from "../../Context/useAuth";
// import { fetchInvoiceDocument } from '../../Services/invoice-services';
import { notifications } from "@mantine/notifications";
import { Invoice } from "../../types/invoice.types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/helperFunctions";

interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onInvoiceClick?: (invoiceId: string) => void;
}

export default function InvoiceList({
  invoices,
  loading,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onInvoiceClick,
}: InvoiceListProps) {
  const { token } = useAuth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // const handleDownload = async (invoiceId: string, e: React.MouseEvent) => {
  //     e.stopPropagation();

  //     if (!token) {
  //         notifications.show({
  //             title: 'Error',
  //             message: 'Authentication required',
  //             color: 'red',
  //         });
  //         return;
  //     }

  //     try {
  //         setDownloadingId(invoiceId);
  //         // const response = await fetchInvoiceDocument(token, invoiceId);

  //         // Open document in new tab
  //         // window.open(response.payload.documentUrl, '_blank');

  //         notifications.show({
  //             title: 'Success',
  //             message: 'Invoice document opened',
  //             color: 'green',
  //         });
  //     } catch (error) {
  //         notifications.show({
  //             title: 'Error',
  //             message: 'Failed to download invoice document',
  //             color: 'red',
  //         });
  //     } finally {
  //         setDownloadingId(null);
  //     }
  // };

  if (loading) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Center h={300}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Loading invoices...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  if (invoices.length === 0) {
    return (
      <Paper p="md" radius="md" withBorder>
        <Center h={300}>
          <Stack align="center" gap="md">
            <Text size="xl" c="dimmed">
              No invoices found
            </Text>
            <Text size="sm" c="dimmed">
              Try adjusting your filters or create a new invoice
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <Paper radius="md" withBorder>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Invoice Number</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Marketplace</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoices.map((invoice) => (
                <Table.Tr
                  key={invoice.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => onInvoiceClick?.(invoice.id)}
                >
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {invoice.invoiceNumber}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatDate(invoice.issueDate)}</Table.Td>
                  <Table.Td>{invoice.buyerName}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {invoice.amazonOrderId}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {/* <Badge color={getTypeColor(invoice.invoiceType)} variant="light">
                                            {invoice.invoiceType.replace('_', ' ')}
                                        </Badge> */}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getStatusColor(
                        invoice.invoiceStatus.toUpperCase(),
                      )}
                      variant="filled"
                    >
                      {invoice.invoiceStatus}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {formatCurrency(
                        invoice.totalAmount.amount,
                        invoice.totalAmount.currencyCode,
                      )}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline">{invoice.marketplaceId}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInvoiceClick?.(invoice.id);
                          }}
                        >
                          <IconEye size={18} />
                        </ActionIcon>
                      </Tooltip>
                      {/* <Tooltip label="Download Document">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="green"
                                                    onClick={(e) => handleDownload(invoice.invoiceId, e)}
                                                    loading={downloadingId === invoice.invoiceId}
                                                >
                                                    <IconFileDownload size={18} />
                                                </ActionIcon>
                                            </Tooltip> */}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            size="md"
          />
        </Group>
      )}
    </Stack>
  );
}
