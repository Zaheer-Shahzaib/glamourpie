import { useState } from "react";
import {
  Table,
  Text,
  Tooltip,
  Pagination,
  Loader,
  Center,
  Stack,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { useAuth } from "../../Context/useAuth";
import { downloadInvoiceDocument } from "../../Services/invoice-services";
import { notifications } from "@mantine/notifications";
import { InvoiceListItem } from "../../types/invoice.types";
import { formatCurrency, formatDate } from "../../utils/helperFunctions";
import { StatusPill, invoiceStatusTone } from "../AppUi";
import classes from "./InvoiceList.module.scss";

interface InvoiceListProps {
  invoices: InvoiceListItem[];
  loading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onInvoiceClick?: (invoiceId: string) => void;
  /** Message shown when there are no rows (e.g. when filters hide everything) */
  emptyMessage?: string;
}

/**
 * Invoice ledger (Figma "Invoice ledger"). Renders only the table + pagination —
 * the surrounding card / heading is supplied by the page.
 */
export default function InvoiceList({
  invoices,
  loading,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onInvoiceClick,
  emptyMessage = "No invoices found",
}: InvoiceListProps) {
  const { token } = useAuth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (invoiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!token) {
      notifications.show({
        title: "Error",
        message: "Authentication required",
        color: "red",
      });
      return;
    }

    try {
      setDownloadingId(invoiceId);
      await downloadInvoiceDocument(token, invoiceId);
      notifications.show({
        title: "Success",
        message: "Invoice PDF downloaded",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to download invoice PDF. Please try again.",
        color: "red",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <Center h={240}>
        <Stack align="center" gap="sm">
          <Loader size="md" color="teal" />
          <Text c="dimmed" size="sm">
            Loading invoices...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (invoices.length === 0) {
    return (
      <Center h={200}>
        <Stack align="center" gap={4}>
          <Text fw={600} size="sm">
            {emptyMessage}
          </Text>
          <Text size="xs" c="dimmed">
            Invoices appear here once they are generated from your orders.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <div>
      <Table.ScrollContainer minWidth={760}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Invoice</Table.Th>
              <Table.Th>Issued</Table.Th>
              <Table.Th>Source order</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Tax</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {invoices.map((invoice: InvoiceListItem) => {
              // Serializer returns invoiceId (string ID like GP-2026-0027); fall back to amazonOrderId
              const displayId =
                invoice.invoiceNumber ??
                invoice.invoiceId ??
                invoice.amazonOrderId;
              return (
                <Table.Tr
                  key={invoice.invoiceId || displayId}
                  className={classes.row}
                  onClick={() => onInvoiceClick?.(displayId)}
                >
                  <Table.Td>
                    <span className={classes.invoiceId}>{displayId}</span>
                    {invoice.buyerName && (
                      <span className={classes.buyer}>{invoice.buyerName}</span>
                    )}
                  </Table.Td>
                  <Table.Td className={classes.muted}>
                    {formatDate(invoice.invoiceDate)}
                  </Table.Td>
                  <Table.Td>
                    <span className={classes.orderLink}>
                      {invoice.amazonOrderId
                        ? `#${invoice.amazonOrderId}`
                        : "—"}
                    </span>
                  </Table.Td>
                  <Table.Td>
                    <StatusPill tone={invoiceStatusTone(invoice.status)}>
                      {invoice.status || "Pending"}
                    </StatusPill>
                  </Table.Td>
                  <Table.Td className={classes.amount}>
                    {formatCurrency(invoice.totalAmount, invoice.currency)}
                  </Table.Td>
                  <Table.Td className={classes.muted}>
                    {formatCurrency(invoice.taxAmount, invoice.currency) || "—"}
                  </Table.Td>
                  <Table.Td>
                    <div className={classes.actions}>
                      <button
                        type="button"
                        className={classes.viewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onInvoiceClick?.(displayId);
                        }}
                      >
                        View
                      </button>
                      <Tooltip label="Download PDF">
                        <button
                          type="button"
                          className={classes.viewBtn}
                          aria-label="Download PDF"
                          disabled={downloadingId === displayId}
                          onClick={(e) => handleDownload(displayId, e)}
                        >
                          {downloadingId === displayId ? (
                            <Loader size={12} color="teal" />
                          ) : (
                            <IconDownload size={14} />
                          )}
                        </button>
                      </Tooltip>
                    </div>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <div className={classes.pagination}>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={onPageChange}
            size="sm"
            color="teal"
          />
        </div>
      )}
    </div>
  );
}
