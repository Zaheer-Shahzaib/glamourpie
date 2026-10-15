import { Loader, Paper, Table } from "@mantine/core";
import {
  AppModal,
  StatusPill,
  cx,
  orderStatusTone,
  ui,
} from "../AppUi";
import { formatCurrency, formatStatusLabel } from "../../utils/orderFields";
import classes from "./OrderDetailsModal.module.scss";

type OrderDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
  loading: boolean;
  order: any | null;
  items: any[];
};

const formatDateTime = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatShipBy = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const isDeduction = (type: string) =>
  ["DISCOUNT", "PROMOTION", "COUPON"].includes(type?.toUpperCase());

const BREAKDOWN_LABEL: Record<string, string> = {
  ITEM: "Items subtotal",
  SHIPPING: "Shipping",
  GIFT_WRAP: "Gift wrap",
  DISCOUNT: "Discount",
  PROMOTION: "Promotion",
  COUPON: "Coupon",
  TAX: "Tax",
  FEE: "Fee",
};

/** Order details modal (Figma "04 Auth & Modals › Order Details Modal"). */
export default function OrderDetailsModal({
  opened,
  onClose,
  loading,
  order,
  items,
}: OrderDetailsModalProps) {
  const status = order
    ? order.orderStatus || order.fulfillment?.fulfillmentStatus
    : undefined;

  // SP-API 2026-01-01: address is under deliveryAddress
  const addr = order?.recipient
    ? order.recipient.deliveryAddress || order.recipient.address
    : undefined;

  // Collect all breakdowns: prefer item-level, fall back to order-level
  const itemBreakdowns: any[] = [];
  items.forEach((item) => {
    item.proceeds?.breakdowns?.forEach((b: any) => {
      itemBreakdowns.push({ ...b, _itemId: item.orderItemId });
    });
  });
  const breakdowns: any[] = itemBreakdowns.length
    ? itemBreakdowns
    : order?.proceeds?.breakdowns || [];
  const grandTotal = order?.proceeds?.grandTotal || order?.orderTotal;

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Order details"
      subtitle="A complete view of the order, fulfilment, and customer delivery information."
      size={740}
    >
      {loading || !order ? (
        <div className={classes.loading}>
          <Loader size="md" />
          <span className={ui.modalMuted}>Loading order details…</span>
        </div>
      ) : (
        <div className={classes.stack}>
          {/* Order summary */}
          <Paper className={ui.modalCard}>
            <div className={ui.modalRow}>
              <div>
                <h3 className={ui.modalSectionTitle} style={{ marginBottom: 2 }}>
                  Order summary
                </h3>
                <div className={classes.orderId}>{order.orderId}</div>
              </div>
              {status && (
                <StatusPill tone={orderStatusTone(status)}>
                  {formatStatusLabel(status).toUpperCase()}
                </StatusPill>
              )}
            </div>

            <div className={classes.meta}>
              {order.createdTime && (
                <span className={ui.modalMuted}>
                  Purchased: {formatDateTime(order.createdTime)}
                </span>
              )}
              {order.lastUpdatedTime && (
                <span className={ui.modalMuted}>
                  Last updated: {formatDateTime(order.lastUpdatedTime)}
                </span>
              )}
              {(order.buyer?.buyerName || order.buyer?.name) && (
                <span className={ui.modalMuted}>
                  Buyer: {order.buyer?.buyerName || order.buyer?.name}
                </span>
              )}
            </div>

            <div className={classes.facts}>
              <div>
                <div className={ui.modalLabel}>Marketplace</div>
                <StatusPill tone="info">
                  {(order.salesChannel?.marketplaceName || "—").toUpperCase()}
                </StatusPill>
              </div>
              <div>
                <div className={ui.modalLabel}>Channel</div>
                <StatusPill tone="success">
                  {(order.salesChannel?.channelName || "—").toUpperCase()}
                </StatusPill>
              </div>
              {order.fulfillment?.shipByWindow?.latestDateTime && (
                <div>
                  <div className={ui.modalLabel}>Ship by</div>
                  <div className={ui.modalValue}>
                    {formatShipBy(order.fulfillment.shipByWindow.latestDateTime)}
                  </div>
                </div>
              )}
              <div>
                <div className={ui.modalLabel}>Marketplace ID</div>
                <div className={cx(ui.modalValue, classes.mono)}>
                  {order.salesChannel?.marketplaceId || "—"}
                </div>
              </div>
              <div>
                <div className={ui.modalLabel}>Fulfilled by</div>
                <div className={ui.modalValue}>
                  {order.fulfillment?.fulfilledBy ||
                    order.fulfillmentChannel ||
                    "—"}
                </div>
              </div>
              {order.fulfillment?.fulfillmentServiceLevel && (
                <div>
                  <div className={ui.modalLabel}>Service level</div>
                  <div className={ui.modalValue}>
                    {order.fulfillment.fulfillmentServiceLevel}
                  </div>
                </div>
              )}
            </div>
          </Paper>

          {/* Shipping address */}
          {order.recipient && (
            <Paper className={ui.modalCard}>
              <h3 className={ui.modalSectionTitle}>Shipping address</h3>
              <div className={classes.address}>
                {addr?.name && <span className={ui.modalValue}>{addr.name}</span>}
                {addr?.addressLine1 && (
                  <span className={ui.modalValue}>{addr.addressLine1}</span>
                )}
                {(addr?.city || addr?.postalCode) && (
                  <span className={ui.modalValue}>
                    {[addr?.city, addr?.postalCode].filter(Boolean).join(", ")}
                  </span>
                )}
                {(addr?.districtOrCounty || addr?.countryCode) && (
                  <span className={ui.modalMuted}>
                    {[addr?.districtOrCounty, addr?.countryCode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
            </Paper>
          )}

          {/* Order items */}
          <Paper className={ui.modalCard}>
            <h3 className={ui.modalSectionTitle}>Order items</h3>
            <Table.ScrollContainer minWidth={520}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Price</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items.map((item) => {
                    // SP-API 2026-01-01: product info is nested under item.product
                    const product = item.product || item;
                    const price =
                      product.price?.unitPrice ||
                      item.proceeds?.proceedsTotal ||
                      item.itemPrice;
                    const title =
                      product.title ||
                      item.title ||
                      item.productTitle ||
                      product.asin;
                    const asin = product.asin || item.asin;
                    const sku = product.sellerSku || item.sellerSku || item.sku;

                    return (
                      <Table.Tr key={item.orderItemId}>
                        <Table.Td>
                          <div className={ui.modalValue}>{title}</div>
                          <div className={ui.modalMuted}>ASIN: {asin}</div>
                        </Table.Td>
                        <Table.Td>{sku || "—"}</Table.Td>
                        <Table.Td>{item.quantityOrdered}</Table.Td>
                        <Table.Td>
                          <span className={ui.modalRowValue}>
                            {price
                              ? formatCurrency(
                                  parseFloat(price.amount),
                                  price.currencyCode,
                                )
                              : "—"}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>

          {/* Price breakdown — SP-API 2026-01-01 proceeds.breakdowns */}
          {(breakdowns.length > 0 || grandTotal) && (
            <Paper className={ui.modalCard}>
              <h3 className={ui.modalSectionTitle}>Price breakdown</h3>
              {breakdowns.map((b: any, i: number) => {
                const deduction = isDeduction(b.type);
                const label = BREAKDOWN_LABEL[b.type?.toUpperCase()] || b.type;
                const amt = parseFloat(b.subtotal?.amount || "0");
                const currency = b.subtotal?.currencyCode || "";

                return (
                  <div key={i}>
                    <div className={ui.modalRow}>
                      <span className={ui.modalRowLabel}>{label}</span>
                      <span
                        className={
                          deduction ? ui.modalRowNegative : ui.modalRowValue
                        }
                      >
                        {deduction ? "− " : ""}
                        {formatCurrency(amt, currency)}
                      </span>
                    </div>
                    {/* Detailed sub-breakdowns (e.g. DISCOUNT → SHIPPING) */}
                    {b.detailedBreakdowns?.map((d: any, j: number) => (
                      <div
                        key={j}
                        className={cx(ui.modalRow, classes.subRow)}
                      >
                        <span className={ui.modalMuted}>└ {d.subtype}</span>
                        <span className={ui.modalMuted}>
                          {formatCurrency(
                            parseFloat(d.value?.amount || "0"),
                            d.value?.currencyCode || currency,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}

              {grandTotal && (
                <>
                  <div className={ui.modalDivider} />
                  <div className={cx(ui.modalRow, ui.modalTotal)}>
                    <span>Order total</span>
                    <span>
                      {formatCurrency(
                        parseFloat(grandTotal.amount),
                        grandTotal.currencyCode,
                      )}
                    </span>
                  </div>
                </>
              )}
            </Paper>
          )}
        </div>
      )}
    </AppModal>
  );
}
