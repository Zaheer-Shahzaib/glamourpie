import { Link } from "react-router-dom";
import classes from "./Wordmark.module.scss";

type WordmarkProps = {
  /** "onLight" = dark text for light backgrounds, "onDark" = white text for navy backgrounds */
  tone?: "onLight" | "onDark";
  /** Small line under the name, e.g. "LEAD WITH INTELLIGENCE" or "MENA SP-API PARTNER" */
  tagline?: string;
  /** Render as a router link to the home page */
  to?: string;
  className?: string;
};

/**
 * Text logo lockup used across the public site (header, footer, onboarding).
 */
const Wordmark = ({
  tone = "onLight",
  tagline = "LEAD WITH INTELLIGENCE",
  to,
  className,
}: WordmarkProps) => {
  const content = (
    <>
      <span className={classes.name}>RunAnalytic</span>
      <span className={classes.tagline} aria-hidden="true">
        {tagline}
      </span>
    </>
  );

  const rootClass = [classes.root, classes[tone], className]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={rootClass} aria-label="RunAnalytic home">
        {content}
      </Link>
    );
  }

  return <span className={rootClass}>{content}</span>;
};

export default Wordmark;
