import { ReactNode, useEffect, useState } from "react";
import GuestLayout from "../../layout/Guest";
import classes from "./LegalPage.module.scss";

export type LegalSection = {
  /** Anchor id, also used by the "On this page" navigation */
  id: string;
  /** Heading shown in the content column, e.g. "1. Information We Collect" */
  title: string;
  /** Short label for the "On this page" navigation */
  navLabel: string;
  content: ReactNode;
};

type LegalPageProps = {
  title: string;
  /** Full date line, e.g. "Last updated: 10-Sep-2025" */
  dateLabel: string;
  intro: ReactNode;
  sections: LegalSection[];
};

/**
 * Layout shared by the Privacy Policy and Terms of Service pages:
 * centred hero, sticky "On this page" navigation and a readable content column.
 */
const LegalPage = ({ title, dateLabel, intro, sections }: LegalPageProps) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const goToSection = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <GuestLayout>
      <div className={classes.page}>
        <header className={classes.hero}>
          <h1 className={classes.title}>{title}</h1>
          <p className={classes.date}>{dateLabel}</p>
          <span className={classes.rule} aria-hidden="true" />
          <div className={classes.intro}>{intro}</div>
        </header>

        <div className={classes.layout}>
          <nav className={classes.toc} aria-label="On this page">
            <p className={classes.tocTitle}>On this page</p>
            <ul className={classes.tocList}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={classes.tocLink}
                    data-active={section.id === activeId || undefined}
                    aria-current={section.id === activeId ? "location" : undefined}
                    onClick={goToSection(section.id)}
                  >
                    {section.navLabel}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className={classes.content}>
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className={classes.section}
              >
                <h2 className={classes.sectionTitle}>{section.title}</h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </div>
    </GuestLayout>
  );
};

export default LegalPage;
