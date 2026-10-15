import {
  ACCREDITATIONS,
  ACCREDITATIONS_TITLE,
  TRUST_STATS,
} from "./landing.content";
import classes from "./Landing.module.scss";

/** Accreditation chips + headline statistics. Anchor target: `#compliance`. */
const TrustSection = () => (
  <section
    id="compliance"
    className={`${classes.section} ${classes.bgLow}`}
    aria-labelledby="landing-trust-title"
  >
    <div className={classes.container}>
      <h2 id="landing-trust-title" className={classes.trustTitle}>
        {ACCREDITATIONS_TITLE}
      </h2>

      <ul className={classes.chips}>
        {ACCREDITATIONS.map((item) => (
          <li key={item.label} className={classes.chip}>
            <span className={classes.chipGlyph} aria-hidden="true">
              {item.glyph}
            </span>
            {item.label}
          </li>
        ))}
      </ul>

      <ul className={classes.statGrid}>
        {TRUST_STATS.map((stat) => (
          <li key={stat.title} className={classes.statCard}>
            <p
              className={`${classes.statValue} ${
                stat.tone === "brand" ? classes.toneBrand : classes.toneTertiary
              }`}
            >
              {stat.value}
            </p>
            <p className={classes.statTitle}>{stat.title}</p>
            <p className={classes.statText}>{stat.description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TrustSection;
