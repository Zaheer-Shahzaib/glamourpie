import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Loader, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuth } from "../Context/useAuth";
import { useInvoiceDetails } from "../hooks/useInvoices";
import { downloadInvoiceDocument } from "../Services/invoice-services";
import { formatCurrency, formatDate } from "../utils/helperFunctions";
import { PATH_APPS } from "../routes";
import {
  StatusPill,
  appButton,
  cx,
  invoiceStatusTone,
} from "../Components/AppUi";
import classes from "./InvoicePreviewPage.module.scss";

const documentStatusLabel = (status?: string): string => {
  switch ((status || "").toUpperCase()) {
    case "DRAFT":
      return "Ready for review";
    case "":
      return "—";
    default: {
      const s = status!.replace(/_/g, " ").toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
};

/** Full-page invoice document preview (Figma "04 Auth & Modals › Invoice Document View"). */
export default function InvoicePreviewPage() {
  useAppTheme();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { token } = useAuth();
  const { invoice, loading } = useInvoiceDetails(invoiceId ?? null);
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

  const currency = invoice?.currency || "";

  return (
    <div className={classes.root}>
      <header className={classes.topbar}>
        <Link to={PATH_APPS.invoices.root} className={classes.back}>
          <IconArrowLeft size={16} />
          Back to invoices
        </Link>
        <h1 className={classes.title}>Invoice preview</h1>
        <div className={classes.topActions}>
          <Button
            className={appButton("primary")}
            onClick={handleDownload}
            loading={downloading}
            disabled={!invoice}
          >
            Download
          </Button>
          <Button
            className={appButton("dark")}
            onClick={() => window.print()}
            disabled={!invoice}
          >
            Print
          </Button>
        </div>
      </header>

      {loading || !invoice ? (
        <div className={classes.state}>
          {loading ? (
            <>
              <Loader size="md" />
              <span>Loading invoice…</span>
            </>
          ) : (
            <span>We could not find this invoice.</span>
          )}
        </div>
      ) : (
        <main className={classes.layout}>
          <article className={classes.paper} aria-label="Invoice document">
            <p className={classes.brand}>RUNANALYTIC</p>
            <h2 className={classes.docTitle}>TAX INVOICE</h2>

            <div className={classes.metaRow}>
              <div>
                <div className={classes.metaLabel}>Invoice number</div>
                <div className={classes.metaValue}>{invoice.invoiceNumber}</div>
              </div>
              <div>
                <div className={classes.metaLabel}>Issued</div>
                <div className={classes.metaValue}>
                  {formatDate(invoice.issueDate)}
                </div>
              </div>
            </div>

            <hr className={classes.rule} />

            <div className={classes.parties}>
              <div>
                <div className={classes.partyLabel}>Seller</div>
                <div className={classes.partyName}>
                  {invoice.seller?.name || "—"}
                </div>
                <div className={classes.partyMeta}>
                  Tax ID: {invoice.seller?.taxId || "—"}
                </div>
                {invoice.seller?.address && (
                  <div className={classes.partyMeta}>{invoice.seller.address}</div>
                )}
              </div>
              <div>
                <div className={classes.partyLabel}>Buyer</div>
                <div className={classes.partyName}>
                  {invoice.buyer?.name || invoice.buyerName || "—"}
                </div>
                {invoice.buyer?.taxId && (
                  <div className={classes.partyMeta}>
                    Tax ID: {invoice.buyer.taxId}
                  </div>
                )}
                <div className={classes.partyMeta}>
                  {invoice.buyer?.address || "—"}
                </div>
              </div>
            </div>

            <hr className={classes.rule} />

            <table className={classes.items}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th className={classes.num}>Quantity</th>
                  <th className={classes.num}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems?.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.description}</td>
                    <td className={classes.num}>{item.quantity}</td>
                    <td className={cx(classes.num, classes.strong)}>
                      {formatCurrency(item.lineTotal, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className={classes.rule} />

            <dl className={classes.totals}>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatCurrency(invoice.subtotal || 0, currency)}</dd>
              </div>
              {(invoice.discounts ?? 0) > 0 && (
                <div>
                  <dt>Discounts</dt>
                  <dd className={classes.negative}>
                    − {formatCurrency(invoice.discounts, currency)}
                  </dd>
                </div>
              )}
              <div>
                <dt>Tax ({invoice.taxRate ?? 5}%)</dt>
                <dd>{formatCurrency(invoice.taxAmount ?? 0, currency)}</dd>
              </div>
              {(invoice.shippingCharges ?? 0) > 0 && (
                <div>
                  <dt>Shipping</dt>
                  <dd>{formatCurrency(invoice.shippingCharges, currency)}</dd>
                </div>
              )}
              <div className={classes.grand}>
                <dt>Total amount</dt>
                <dd>{formatCurrency(invoice.totalAmount ?? 0, currency)}</dd>
              </div>
            </dl>
          </article>

          <aside className={classes.rail}>
            <h2 className={classes.railTitle}>Invoice actions</h2>
            <div className={classes.railPill}>
              <StatusPill tone={invoiceStatusTone(invoice.status)}>
                {String(invoice.status).toUpperCase()}
              </StatusPill>
            </div>

            <div className={classes.railLabel}>Linked order</div>
            <div className={classes.railValue}>#{invoice.amazonOrderId}</div>

            <hr className={classes.railRule} />

            <div className={classes.railLabel}>Document status</div>
            <div className={cx(classes.railValue, classes.railStatus)}>
              {documentStatusLabel(invoice.status)}
            </div>

            <div className={classes.railButtons}>
              <Button
                fullWidth
                className={appButton("primary")}
                onClick={handleDownload}
                loading={downloading}
              >
                Download document
              </Button>
              {/* No "accept invoice" endpoint exists yet, so this stays disabled. */}
              <Tooltip label="Coming soon" position="bottom">
                <div>
                  <Button
                    fullWidth
                    disabled
                    className={appButton("light")}
                  >
                    Mark as accepted
                  </Button>
                </div>
              </Tooltip>
            </div>

            <p className={classes.railNote}>
              This invoice remains linked to the source order and marketplace.
            </p>
          </aside>
        </main>
      )}
    </div>
  );
}
