import classes from "./Landing.module.scss";

type SectionHeaderProps = {
  /** Id of the heading element, used by `aria-labelledby` on the section. */
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
};

/** Centered eyebrow pill + title + lead used by every landing section. */
const SectionHeader = ({ id, eyebrow, title, lead }: SectionHeaderProps) => (
  <header className={classes.header}>
    <span className={classes.eyebrow}>{eyebrow}</span>
    <h2 id={id} className={classes.headerTitle}>
      {title}
    </h2>
    {lead && <p className={classes.headerLead}>{lead}</p>}
  </header>
);

export default SectionHeader;
