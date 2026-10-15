import { Button, Loader, Paper, Table } from "@mantine/core";
import { IconFileDownload, IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useInvoiceDetails } from "../../hooks/useInvoices";
import { useAuth } from "../../Context/useAuth";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { downloadInvoiceDocument } from "../../Services/invoice-services";
import { formatCurrency, formatDate } from "../../utils/helperFunctions";
import { PATH_APPS } from "../../routes";
import {
  AppModal,
  StatusPill,
  appButton,
  cx,
  invoiceStatusTone,
  ui,
} from "../AppUi";
import classes from "./InvoiceDetailsModal.module.scss";

interface InvoiceDetailsModalProps {
  invoiceId: string | null;
  opened: boolean;
  onClose: () => void;
}

/** Invoice details modal (Figma "04 Auth & Modals › Invoice Details Modal"). */
export default function InvoiceDetailsModal({
  invoiceId,
  opened,
  onClose,
}: InvoiceDetailsModalProps) {
  const { invoice, loading } = useInvoiceDetails(invoiceId);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!token || !invoiceId) return;

    try {
      setDownloading(true);
      await downloadInvoiceDocument(token, invoiceId);

      notifications.show({
        title: "Success",
        message: "Invoice PDF downloaded",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to download invoice PDF",
        color: "red",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleView = () => {
    if (!invoiceId) return;
    onClose();
    navigate(PATH_APPS.invoices.preview(invoiceId));
  };

  const ready = !loading && invoice;

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Invoice details"
      subtitle={
        ready && invoice.amazonOrderId
          ? `Linked to order #${invoice.amazonOrderId}`
          : undefined
      }
      aside={
        ready ? (
          <StatusPill tone={invoiceStatusTone(invoice.status)}>
            {String(invoice.status).toUpperCase()}
          </StatusPill>
        ) : undefined
      }
      size={700}
    >
      {!ready ? (
        <div className={classes.loading}>
          <Loader size="md" />
          <span className={ui.modalMuted}>Loading invoice details…</span>
        </div>
      ) : (
        <div className={classes.stack}>
          {/* Header */}
          <Paper className={ui.modalCard}>
            <div className={ui.modalRow}>
              <h3 className={ui.modalSectionTitle} style={{ marginBottom: 0 }}>
                Invoice header
              </h3>
              {invoice.marketplaceId && (
                <span className={classes.marketplace}>
                  {invoice.marketplaceId}
                </span>
              )}
            </div>
            <div className={classes.invoiceNumber}>{invoice.invoiceNumber}</div>
            <div className={ui.modalMuted}>
              Issued {formatDate(invoice.issueDate)}
              {invoice.currency ? ` · ${invoice.currency}` : ""}
              {invoice.invoiceType
                ? ` · ${String(invoice.invoiceType).replace(/_/g, " ")}`
                : ""}
            </div>
          </Paper>

          {/* Seller & Buyer Information */}
          <div className={classes.parties}>
            <Paper className={ui.modalCard}>
              <h3 className={ui.modalSectionTitle}>Seller information</h3>
              <div className={ui.modalValue}>{invoice.seller?.name || "-"}</div>
              <div className={ui.modalMuted}>
                Tax ID: {invoice.seller?.taxId || "-"}
              </div>
              {invoice.seller?.address && (
                <div className={ui.modalMuted}>{invoice.seller.address}</div>
              )}
              {invoice.seller?.email && (
                <div className={ui.modalMuted}>{invoice.seller.email}</div>
              )}
            </Paper>

            <Paper className={ui.modalCard}>
              <h3 className={ui.modalSectionTitle}>Buyer information</h3>
              <div className={ui.modalValue}>
                {invoice.buyer?.name || invoice.buyerName || "-"}
              </div>
              {invoice.buyer?.taxId && (
                <div className={ui.modalMuted}>
                  Tax ID: {invoice.buyer.taxId}
                </div>
              )}
              <div className={ui.modalMuted}>
                {invoice.buyer?.address || "-"}
              </div>
              {invoice.buyer?.email && (
                <div className={ui.modalMuted}>{invoice.buyer.email}</div>
              )}
            </Paper>
          </div>

          {/* Line Items */}
          <Paper className={ui.modalCard}>
            <h3 className={ui.modalSectionTitle}>Line items</h3>
            <Table.ScrollContainer minWidth={480}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Unit price</Table.Th>
                    <Table.Th>Tax</Table.Th>
                    <Table.Th style={{ textAlign: "right" }}>Total</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invoice.lineItems?.map((item) => (
                    <Table.Tr key={item.itemId}>
                      <Table.Td>
                        <div className={ui.modalValue}>{item.description}</div>
                        {item.hsnCode && (
                          <div className={ui.modalMuted}>
                            HSN: {item.hsnCode}
                          </div>
                        )}
                      </Table.Td>
                      <Table.Td>{item.quantity}</Table.Td>
                      <Table.Td>
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </Table.Td>
                      <Table.Td>
                        <div>{(item.taxRate ?? 5).toFixed(0)}%</div>
                        <div className={ui.modalMuted}>
                          {formatCurrency(item.taxAmount, invoice.currency)}
                        </div>
                      </Table.Td>
                      <Table.Td style={{ textAlign: "right" }}>
                        <span className={ui.modalRowValue}>
                          {formatCurrency(item.lineTotal, invoice.currency)}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>

          {/* Financial Summary */}
          <Paper className={ui.modalCard}>
            <h3 className={ui.modalSectionTitle}>Financial summary</h3>
            <div className={ui.modalRow}>
              <span className={ui.modalRowLabel}>Subtotal:</span>
              <span className={ui.modalRowValue}>
                {formatCurrency(invoice.subtotal || 0, invoice.currency)}
              </span>
            </div>
            {(invoice.discounts ?? 0) > 0 && (
              <div className={ui.modalRow}>
                <span className={ui.modalRowLabel}>Discounts:</span>
                <span className={ui.modalRowNegative}>
                  − {formatCurrency(invoice.discounts || 0, invoice.currency)}
                </span>
              </div>
            )}
            <div className={ui.modalRow}>
              <span className={ui.modalRowLabel}>
                Tax amount ({invoice.taxRate ?? 5}%):
              </span>
              <span className={ui.modalRowValue}>
                {formatCurrency(invoice.taxAmount ?? 0, invoice.currency)}
              </span>
            </div>
            {(invoice.shippingCharges ?? 0) > 0 && (
              <div className={ui.modalRow}>
                <span className={ui.modalRowLabel}>Shipping:</span>
                <span className={ui.modalRowValue}>
                  {formatCurrency(invoice.shippingCharges || 0, invoice.currency)}
                </span>
              </div>
            )}
            <div className={ui.modalDivider} />
            <div className={cx(ui.modalRow, ui.modalRowValue)}>
              <span>Total amount:</span>
              <span>
                {formatCurrency(invoice.totalAmount ?? 0, invoice.currency)}
              </span>
            </div>
          </Paper>

          {/* Payment Information */}
          {invoice.paymentMethod && (
            <Paper className={ui.modalCard}>
              <h3 className={ui.modalSectionTitle}>Payment information</h3>
              <div className={classes.parties}>
                <div>
                  <div className={ui.modalLabel}>Payment method</div>
                  <div className={ui.modalValue}>{invoice.paymentMethod}</div>
                </div>
                {invoice.paymentDueDate && (
                  <div>
                    <div className={ui.modalLabel}>Due date</div>
                    <div className={ui.modalValue}>
                      {formatDate(invoice.paymentDueDate)}
                    </div>
                  </div>
                )}
              </div>
            </Paper>
          )}

          {/* Actions */}
          <div className={classes.actions}>
            <Button
              className={appButton("light")}
              leftSection={<IconEye size={16} />}
              onClick={handleView}
            >
              View document
            </Button>
            <Button
              className={appButton("primary")}
              leftSection={<IconFileDownload size={16} />}
              onClick={handleDownload}
              loading={downloading}
            >
              Download document
            </Button>
          </div>
        </div>
      )}
    </AppModal>
  );
}
