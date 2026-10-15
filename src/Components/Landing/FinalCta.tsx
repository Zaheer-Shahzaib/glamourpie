import { Link } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../routes";
import { FINAL_CTA } from "./landing.content";
import classes from "./Landing.module.scss";

/** Closing call-to-action band. */
const FinalCta = () => (
  <section
    className={`${classes.section} ${classes.bgInverse}`}
    aria-labelledby="landing-cta-title"
  >
    <div className={classes.ctaInner}>
      <span className={classes.ctaPill}>{FINAL_CTA.pill}</span>
      <h2 id="landing-cta-title" className={classes.ctaTitle}>
        {FINAL_CTA.title}
      </h2>
      <p className={classes.ctaLead}>{FINAL_CTA.lead}</p>

      <div className={classes.ctaActions}>
        <Link to={PATH_AUTH.signup} className={`${classes.btn} ${classes.btnLight}`}>
          {FINAL_CTA.primary}
          <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link to={PATH_PAGES.contact} className={`${classes.btn} ${classes.btnDark}`}>
          {FINAL_CTA.secondary}
        </Link>
      </div>

      <ul className={classes.assurances}>
        {FINAL_CTA.assurances.map((item) => (
          <li key={item}>
            <span aria-hidden="true">&#10003; </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default FinalCta;
