import { useMemo, useState } from "react";
import { Slider } from "@mantine/core";
import { Link } from "react-router-dom";
import { PATH_AUTH } from "../../routes";
import { CALCULATOR } from "./landing.content";
import SectionHeader from "./SectionHeader";
import landing from "./Landing.module.scss";
import classes from "./SavingsCalculator.module.scss";

const numberFormat = new Intl.NumberFormat("en-US");

/**
 * Savings estimate. Assumptions live in `CALCULATOR` (landing.content.ts) and
 * reproduce the design's reference result: 3,500 orders -> 29 hrs -> AED 4,350.
 */
export const estimateSavings = (orders: number) => {
  const hours = Math.round((orders * CALCULATOR.minutesSavedPerOrder) / 60);
  const aed = hours * CALCULATOR.hourlyCostAed;
  const sar = Math.round(aed * CALCULATOR.sarPerAed);
  return { hours, aed, sar };
};

/** Interactive savings calculator. Anchor target: `#calculator`. */
const SavingsCalculator = () => {
  const [orders, setOrders] = useState<number>(CALCULATOR.defaultOrders);
  const { hours, aed, sar } = useMemo(() => estimateSavings(orders), [orders]);

  const ordersLabel =
    orders >= CALCULATOR.max
      ? `${numberFormat.format(CALCULATOR.max)}+`
      : numberFormat.format(orders);

  return (
    <section
      id="calculator"
      className={`${landing.section} ${landing.bgBase}`}
      aria-labelledby="landing-calculator-title"
    >
      <div className={landing.container}>
        <SectionHeader
          id="landing-calculator-title"
          eyebrow={CALCULATOR.eyebrow}
          title={CALCULATOR.title}
          lead={CALCULATOR.lead}
        />

        <div className={classes.card}>
          <div className={classes.inputs}>
            <div className={classes.inputHead}>
              <span className={classes.label}>{CALCULATOR.inputLabel}</span>
              <output className={classes.value} aria-live="polite">
                {ordersLabel}
              </output>
            </div>

            <Slider
              className={classes.slider}
              classNames={{
                track: classes.track,
                bar: classes.bar,
                thumb: classes.thumb,
              }}
              value={orders}
              onChange={setOrders}
              min={CALCULATOR.min}
              max={CALCULATOR.max}
              step={CALCULATOR.step}
              size={10}
              thumbSize={20}
              color="var(--ra-color-brand)"
              label={null}
              thumbLabel={CALCULATOR.inputLabel}
            />

            <div className={classes.axis} aria-hidden="true">
              {CALCULATOR.axisLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className={classes.guarantee}>
              <p className={classes.guaranteeTitle}>{CALCULATOR.guarantee}</p>
              <p className={classes.guaranteeText}>
                {CALCULATOR.guaranteeDetail}
              </p>
            </div>
          </div>

          <div className={classes.result}>
            <p className={classes.resultLabel}>{CALCULATOR.resultLabel}</p>
            <p className={classes.resultHours}>{hours} hrs</p>
            <p className={classes.resultText}>{CALCULATOR.hoursLabel}</p>
            <p className={classes.resultCost}>
              AED {numberFormat.format(aed)} / SAR {numberFormat.format(sar)}
            </p>
            <p className={classes.resultText}>{CALCULATOR.costLabel}</p>
            <Link
              to={PATH_AUTH.signup}
              className={`${landing.btn} ${landing.btnPrimary} ${classes.cta}`}
            >
              {CALCULATOR.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsCalculator;
