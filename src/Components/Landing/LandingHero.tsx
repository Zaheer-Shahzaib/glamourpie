import { Link } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../routes";
import { HERO } from "./landing.content";
import ProductTour from "./ProductTour";
import classes from "./Landing.module.scss";

const LandingHero = () => (
  <section
    className={`${classes.hero} ${classes.bgBase}`}
    aria-labelledby="landing-hero-title"
  >
    <div className={classes.heroInner}>
      <span className={classes.eyebrow}>{HERO.eyebrow}</span>

      <h1 id="landing-hero-title" className={classes.heroTitle}>
        <span className={classes.heroTitleLine}>{HERO.titleLine1}</span>
        <span className={`${classes.heroTitleLine} ${classes.heroTitleAccent}`}>
          {HERO.titleLine2}
        </span>
      </h1>

      <p className={classes.heroLead}>{HERO.lead}</p>

      <div className={classes.heroActions}>
        <Link to={PATH_AUTH.signup} className={`${classes.btn} ${classes.btnPrimary}`}>
          {HERO.primaryCta}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={PATH_PAGES.contact}
          className={`${classes.btn} ${classes.btnSecondary}`}
        >
          <span aria-hidden="true">&#9673;</span>
          {HERO.secondaryCta}
        </Link>
      </div>

      <ul className={classes.proof}>
        <li>
          <span className={classes.stars} aria-hidden="true">
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </span>{" "}
          <span aria-label={`Rated ${HERO.rating.replace("/", " out of ")}`}>
            {HERO.rating}
          </span>
        </li>
        <li>{HERO.proof}</li>
        <li>{HERO.trial}</li>
      </ul>

      <div className={classes.tourWrap}>
        <span className={`${classes.floatBadge} ${classes.floatBadgeLeft}`}>
          {HERO.badgeLeft}
        </span>
        {/* <span className={`${classes.floatBadge} ${classes.floatBadgeRight}`}>
          {HERO.badgeRight}
        </span> */} 
        <ProductTour />
      </div>
    </div>
  </section>
);

export default LandingHero;
