import { useMemo } from "react";
import CountUp from "react-countup";
import { AppCard, CardHeader, StatusPill } from "../AppUi";
import { formatCurrency, getOrderAmount, getOrderStatus } from "../../utils/orderFields";
import classes from "./OrderRevenueCard.module.scss";

// Cancelled / unfulfillable orders never produce revenue
const NON_REVENUE = new Set(["CANCELLED", "UNFULFILLABLE"]);
const MAX_BARS = 14;

type OrderRevenueCardProps = {
  /** Orders after all filters were applied */
  orders: any[];
  /** e.g. "Oct 1 – Oct 13, 2026" or "Loaded orders" */
  periodLabel: string;
  loading?: boolean;
};

const dayKey = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const dayLabel = (key: string): string => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/** Revenue for the currently filtered orders, with a day-by-day breakdown. */
export default function OrderRevenueCard({
  orders,
  periodLabel,
  loading,
}: OrderRevenueCardProps) {
  const summary = useMemo(() => {
    const byCurrency = new Map<string, number>();
    let counted = 0;
    let cancelled = 0;
    let items = 0;
    const byDay = new Map<string, { amount: number; currency: string }>();

    orders.forEach((order) => {
      const status = getOrderStatus(order).toUpperCase().replace(/\s+/g, "_");
      if (NON_REVENUE.has(status)) {
        cancelled += 1;
        return;
      }
      const total = getOrderAmount(order);
      if (!total) return;

      counted += 1;
      byCurrency.set(
        total.currency,
        (byCurrency.get(total.currency) ?? 0) + total.amount,
      );
      items += order.orderItems
        ? order.orderItems.reduce(
            (s: number, i: any) => s + (i.quantityOrdered || 1),
            0,
          )
        : (order.numberOfItemsShipped ?? 0) +
          (order.numberOfItemsUnshipped ?? 0);

      if (order.createdTime) {
        const key = dayKey(order.createdTime);
        const prev = byDay.get(key);
        byDay.set(key, {
          amount: (prev?.amount ?? 0) + total.amount,
          currency: total.currency,
        });
      }
    });

    // Headline currency = the one with the most revenue
    const ranked = Array.from(byCurrency.entries()).sort((a, b) => b[1] - a[1]);
    const primary = ranked[0]?.[0] ?? "";
    const others = ranked.slice(1);

    const days = Array.from(byDay.entries())
      .filter(([, v]) => v.currency === primary)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-MAX_BARS);
    const maxDay = Math.max(1, ...days.map(([, v]) => v.amount));

    return {
      primary,
      total: byCurrency.get(primary) ?? 0,
      others,
      counted,
      cancelled,
      items,
      average: counted > 0 ? (byCurrency.get(primary) ?? 0) / counted : 0,
      days,
      maxDay,
    };
  }, [orders]);

  return (
    <AppCard className={classes.card}>
      <CardHeader
        title="Order revenue"
        subtitle="Revenue from the orders matching your filters. Cancelled orders are excluded."
        right={<StatusPill tone="info">{periodLabel}</StatusPill>}
      />

      {loading && orders.length === 0 ? (
        <p className={classes.empty}>Calculating revenue…</p>
      ) : summary.counted === 0 ? (
        <p className={classes.empty}>No revenue in this period.</p>
      ) : (
        <div className={classes.body}>
          <div className={classes.main}>
            <span className={classes.label}>Total revenue</span>
            <span className={classes.value}>
              <span className={classes.currency}>{summary.primary}</span>
              <CountUp
                end={summary.total}
                decimals={2}
                duration={1}
                separator=","
                preserveValue
              />
            </span>
            {summary.others.length > 0 && (
              <span className={classes.other}>
                Also:{" "}
                {summary.others
                  .map(([cur, amt]) => formatCurrency(amt, cur))
                  .join(" · ")}
              </span>
            )}

            <dl className={classes.stats}>
              <div>
                <dt>Orders</dt>
                <dd>{summary.counted}</dd>
              </div>
              <div>
                <dt>Avg. order value</dt>
                <dd>{formatCurrency(summary.average, summary.primary)}</dd>
              </div>
              <div>
                <dt>Items</dt>
                <dd>{summary.items}</dd>
              </div>
              <div>
                <dt>Cancelled</dt>
                <dd>{summary.cancelled}</dd>
              </div>
            </dl>
          </div>

          <div className={classes.chart} aria-label="Revenue by day">
            <span className={classes.label}>Revenue by day</span>
            <div className={classes.bars}>
              {summary.days.map(([key, v]) => (
                <div
                  key={key}
                  className={classes.barCol}
                  title={`${dayLabel(key)} · ${formatCurrency(v.amount, v.currency)}`}
                >
                  <span
                    className={classes.bar}
                    style={{ height: `${Math.max(6, (v.amount / summary.maxDay) * 100)}%` }}
                  />
                  <span className={classes.barLabel}>{dayLabel(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppCard>
  );
}
