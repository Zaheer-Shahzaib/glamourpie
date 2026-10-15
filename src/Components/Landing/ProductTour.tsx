import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { PRODUCT_TOUR } from "./landing.content";
import classes from "./ProductTour.module.scss";

const SWIPE_THRESHOLD = 40;

type Tone = "brand" | "tertiary" | "muted";

const toneClass: Record<Tone, string> = {
  brand: classes.pillBrand,
  tertiary: classes.pillTertiary,
  muted: classes.pillMuted,
};

/**
 * Product tour carousel (Figma node 183:2).
 * One slide per product area; the active slide's panel is emphasised.
 * On narrow screens only the active panel is shown.
 */
const ProductTour = () => {
  const { slides, orders, invoices, analytics } = PRODUCT_TOUR;
  const [index, setIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const count = slides.length;

  const go = (step: number) =>
    setIndex((current) => (current + step + count) % count);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
  };

  const activeId = slides[index].id;
  const panelState = (id: string) => (id === activeId ? "active" : "idle");

  return (
    <section
      className={classes.tour}
      aria-roledescription="carousel"
      aria-label="Product tour"
      onKeyDown={handleKeyDown}
    >
      <div className={classes.topBar}>
        <span className={classes.breadcrumb}>{PRODUCT_TOUR.breadcrumb}</span>
        <div className={classes.controls}>
          <span className={classes.counter} aria-live="polite">
            Product tour &middot; {index + 1} of {count}
          </span>
          <button
            type="button"
            className={classes.arrow}
            aria-label="Previous slide"
            onClick={() => go(-1)}
          >
            &lsaquo;
          </button>
          <button
            type="button"
            className={classes.arrow}
            aria-label="Next slide"
            onClick={() => go(1)}
          >
            &rsaquo;
          </button>
        </div>
      </div>

      <div
        className={classes.stage}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <article
          className={`${classes.panel} ${classes.panelOrders}`}
          data-state={panelState("orders")}
          aria-label="Orders preview"
        >
          <h3 className={classes.panelTitle}>{orders.title}</h3>
          <p className={classes.panelSub}>{orders.subtitle}</p>
          <hr className={classes.rule} />

          <div className={classes.orderRow}>
            <div>
              <p className={classes.orderId}>{orders.orderId}</p>
              <p className={classes.orderCustomer}>{orders.customer}</p>
            </div>
            <span className={`${classes.pill} ${classes.pillBrand}`}>
              {orders.status}
            </span>
            <p className={classes.orderTotal}>{orders.total}</p>
          </div>
          <hr className={classes.rule} />

          <div className={classes.table} role="table" aria-label="Order items">
            <div className={classes.tableHead} role="row">
              {orders.columns.map((column, i) => (
                <span
                  key={column}
                  role="columnheader"
                  className={i === orders.columns.length - 1 ? classes.alignEnd : undefined}
                >
                  {column}
                </span>
              ))}
            </div>
            {orders.rows.map((row) => (
              <div key={row.item} className={classes.tableRow} role="row">
                <span role="cell" className={classes.itemName}>
                  {row.item}
                </span>
                <span role="cell">{row.fulfillment}</span>
                <span role="cell" />
                <span role="cell" className={classes.alignEnd}>
                  <span
                    className={`${classes.pill} ${toneClass[row.tone as Tone]}`}
                  >
                    {row.badge}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </article>

        <article
          className={`${classes.panel} ${classes.panelSide}`}
          data-state={panelState("invoices")}
          aria-label="Invoices preview"
        >
          <h3 className={classes.panelTitle}>{invoices.title}</h3>
          <p className={classes.panelSub}>{invoices.subtitle}</p>
          <hr className={classes.rule} />
          <p className={`${classes.metric} ${classes.metricBrand}`}>
            {invoices.count}
          </p>
          <p className={classes.panelSub}>{invoices.countLabel}</p>
          <div className={classes.pillRow}>
            {invoices.badges.map((badge) => (
              <span
                key={badge.label}
                className={`${classes.pill} ${toneClass[badge.tone as Tone]}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
          <p className={classes.panelSub}>{invoices.revenue}</p>
        </article>

        <article
          className={`${classes.panel} ${classes.panelSide}`}
          data-state={panelState("analytics")}
          aria-label="Analytics preview"
        >
          <h3 className={classes.panelTitle}>{analytics.title}</h3>
          <p className={classes.panelSub}>{analytics.subtitle}</p>
          <hr className={classes.rule} />
          <p className={`${classes.metric} ${classes.metricTertiary}`}>
            {analytics.value}
          </p>
          <p className={classes.panelSub}>{analytics.valueLabel}</p>
          <div className={classes.bars} aria-hidden="true">
            {analytics.bars.map((height, barIndex) => (
              <span
                key={barIndex}
                className={classes.bar}
                data-strong={barIndex === analytics.highlightedBar || undefined}
                style={{ height }}
              />
            ))}
          </div>
          <p className={classes.panelSub}>{analytics.caption}</p>
        </article>
      </div>

      <div className={classes.footer}>
        <span className={classes.hint}>{PRODUCT_TOUR.hint}</span>
        <div className={classes.dots}>
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              className={classes.dot}
              aria-label={`Show ${slide.label}`}
              aria-current={slideIndex === index || undefined}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
        <span className={classes.legend}>{PRODUCT_TOUR.legend}</span>
      </div>
    </section>
  );
};

export default ProductTour;
