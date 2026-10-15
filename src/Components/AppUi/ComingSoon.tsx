import classes from "./AppUi.module.scss";

type ComingSoonProps = {
  title: string;
  description?: string;
  minHeight?: number;
};

/**
 * Placeholder for design elements that have no backend / route yet
 * (e.g. Top products, Revenue breakdown on the Overview screen).
 */
const ComingSoon = ({
  title,
  description = "This view is on the roadmap and will appear here soon.",
  minHeight,
}: ComingSoonProps) => (
  <div className={classes.comingSoon} style={minHeight ? { minHeight } : undefined}>
    <span className={classes.comingSoonTag}>Coming soon</span>
    <span className={classes.comingSoonTitle}>{title}</span>
    <span className={classes.comingSoonText}>{description}</span>
  </div>
);

export default ComingSoon;
