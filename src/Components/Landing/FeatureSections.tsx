import {
  FEATURES,
  FEATURES_SECTION,
  STEPS,
  STEPS_SECTION,
} from "./landing.content";
import SectionHeader from "./SectionHeader";
import classes from "./Landing.module.scss";

/** Six-card feature grid. Anchor target: `#features`. */
export const FeaturesSection = () => (
  <section
    id="features"
    className={`${classes.section} ${classes.bgBase}`}
    aria-labelledby="landing-features-title"
  >
    <div className={classes.container}>
      <SectionHeader id="landing-features-title" {...FEATURES_SECTION} />
      <ul className={`${classes.cardGrid} ${classes.cardGrid3}`}>
        {FEATURES.map((feature) => (
          <li key={feature.title}>
            <article className={classes.card}>
              <span className={classes.iconBox} aria-hidden="true">
                {feature.glyph}
              </span>
              <h3 className={classes.cardTitle}>{feature.title}</h3>
              <p className={classes.cardText}>{feature.description}</p>
              <div className={classes.cardFooter}>
                <span>{feature.footer}</span>
                <span className={classes.cardArrow} aria-hidden="true">
                  &rarr;
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

/** Four-step onboarding flow. Anchor target: `#how-it-works`. */
export const HowItWorksSection = () => (
  <section
    id="how-it-works"
    className={`${classes.section} ${classes.bgLow}`}
    aria-labelledby="landing-steps-title"
  >
    <div className={classes.container}>
      <SectionHeader id="landing-steps-title" {...STEPS_SECTION} />
      <ol className={`${classes.cardGrid} ${classes.cardGrid4}`}>
        {STEPS.map((step) => (
          <li key={step.title}>
            <article className={classes.card}>
              <div className={classes.cardTop}>
                <span className={classes.stepNumber} aria-hidden="true">
                  {step.number}
                </span>
                <span className={classes.stepGlyph} aria-hidden="true">
                  {step.glyph}
                </span>
              </div>
              <h3 className={classes.cardTitle}>{step.title}</h3>
              <p className={classes.cardText}>{step.description}</p>
              <div className={classes.cardFooter}>
                <span>{step.footer}</span>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
