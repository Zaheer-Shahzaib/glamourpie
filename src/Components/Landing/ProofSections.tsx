import { IMPACT, ROI } from "./landing.content";
import SectionHeader from "./SectionHeader";
import classes from "./Landing.module.scss";

/** Benefits list + manual vs. automated comparison. */
export const RoiSection = () => (
  <section
    className={`${classes.section} ${classes.bgBase}`}
    aria-labelledby="landing-roi-title"
  >
    <div className={`${classes.container} ${classes.roiLayout}`}>
      <div className={classes.roiCopy}>
        <span className={classes.eyebrow}>{ROI.eyebrow}</span>
        <h2 id="landing-roi-title" className={classes.roiTitle}>
          {ROI.title}
        </h2>
        <p className={classes.roiLead}>{ROI.lead}</p>

        <ul className={classes.benefits}>
          {ROI.benefits.map((benefit) => (
            <li key={benefit.title} className={classes.benefit}>
              <span
                className={`${classes.benefitIcon} ${
                  benefit.glyph.length === 1 ? classes.benefitIconGlyph : ""
                }`}
                aria-hidden="true"
              >
                {benefit.glyph}
              </span>
              <div>
                <h3 className={classes.benefitTitle}>{benefit.title}</h3>
                <p className={classes.benefitText}>{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={classes.compare}>
        <article className={classes.compareCard}>
          <div className={classes.compareHead}>
            <h3 className={classes.compareLabel}>{ROI.manual.label}</h3>
            <span className={classes.riskBadge}>{ROI.manual.risk}</span>
          </div>
          <ul className={classes.checkList}>
            {ROI.manual.items.map((item) => (
              <li key={item} className={classes.checkItem}>
                <span
                  className={`${classes.checkMark} ${classes.checkMarkDanger}`}
                  aria-hidden="true"
                >
                  &#10005;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className={`${classes.compareCard} ${classes.compareCardBrand}`}>
          <div className={classes.compareHead}>
            <h3 className={`${classes.compareLabel} ${classes.compareLabelBrand}`}>
              {ROI.automated.label}
            </h3>
          </div>
          <ul className={classes.checkList}>
            {ROI.automated.items.map((item) => (
              <li
                key={item}
                className={`${classes.checkItem} ${classes.checkItemBrand}`}
              >
                <span className={classes.checkMark} aria-hidden="true">
                  &#10003;
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className={classes.defectCard}>
          <p className={classes.defectValue}>{ROI.defectRate.value}</p>
          <h3 className={classes.defectTitle}>{ROI.defectRate.title}</h3>
          <p className={classes.defectText}>{ROI.defectRate.description}</p>
        </article>
      </div>
    </div>
  </section>
);

/** Customer stories. Anchor target: `#case-studies`. */
export const ImpactSection = () => (
  <section
    id="case-studies"
    className={`${classes.section} ${classes.bgLow}`}
    aria-labelledby="landing-impact-title"
  >
    <div className={classes.container}>
      <SectionHeader
        id="landing-impact-title"
        eyebrow={IMPACT.eyebrow}
        title={IMPACT.title}
        lead={IMPACT.lead}
      />
      <ul className={classes.storyGrid}>
        {IMPACT.stories.map((story) => {
          const brand = story.tone === "brand";
          return (
            <li key={story.company}>
              <article className={classes.story}>
                <div className={classes.storyHead}>
                  <div>
                    <h3 className={classes.storyCompany}>{story.company}</h3>
                    <p className={classes.storyMeta}>{story.meta}</p>
                  </div>
                  <span
                    className={`${classes.storyBadge} ${
                      brand ? classes.storyBadgeBrand : classes.storyBadgeTertiary
                    }`}
                  >
                    {story.badge}
                  </span>
                </div>

                <div className={classes.storyStats}>
                  <p
                    className={`${classes.storyHeadline} ${
                      brand ? classes.toneBrand : classes.toneTertiary
                    }`}
                  >
                    {story.headline}
                  </p>
                  {story.stats.map((stat) => (
                    <dl key={stat.label} className={classes.storyStat}>
                      <dt>{stat.value}</dt>
                      <dd>{stat.label}</dd>
                    </dl>
                  ))}
                </div>

                <blockquote className={classes.storyQuote}>
                  {story.quote}
                </blockquote>
                <p className={classes.storyAuthor}>{story.author}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);
