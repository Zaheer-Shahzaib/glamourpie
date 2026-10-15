import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./Links.module.scss";

export interface LinksGroupProps {
  label: string;
  /** Destination for a simple item */
  link?: string;
  /** Path prefix that keeps the item highlighted on nested routes */
  matchPrefix?: string;
  /** Items without a route yet are rendered disabled with a "Soon" tag */
  soon?: boolean;
  /** Nested items (e.g. Settings › Marketplace) */
  links?: { label: string; link: string }[];
  /** Called after a navigation click (used to close the mobile drawer) */
  onNavigate?: () => void;
}

/**
 * One entry of the Seller Center sidebar: a plain link, a disabled "soon" item,
 * or an expandable group with sub-links.
 */
export function LinksGroup({
  label,
  link,
  matchPrefix,
  soon,
  links,
  onNavigate,
}: LinksGroupProps) {
  const { pathname } = useLocation();
  const path = pathname.toLowerCase();
  const hasLinks = Array.isArray(links) && links.length > 0;

  const isActive = matchPrefix
    ? path.startsWith(matchPrefix.toLowerCase())
    : !!link && path === link.toLowerCase();

  const [opened, setOpened] = useState(isActive && hasLinks);

  // Expand the group automatically when one of its routes becomes active.
  useEffect(() => {
    if (hasLinks && isActive) setOpened(true);
  }, [hasLinks, isActive]);

  if (soon) {
    return (
      <span
        className={classes.item}
        data-soon="true"
        aria-disabled="true"
        title="Coming soon"
      >
        <span>{label}</span>
        <span className={classes.soonTag}>Soon</span>
      </span>
    );
  }

  if (hasLinks) {
    return (
      <div>
        <button
          type="button"
          className={classes.item}
          data-active={isActive || undefined}
          aria-expanded={opened}
          onClick={() => setOpened((o) => !o)}
        >
          <span>{label}</span>
          <IconChevronRight
            size={14}
            className={classes.chevron}
            data-open={opened || undefined}
          />
        </button>
        {opened && (
          <div className={classes.subList}>
            {links!.map((child) => (
              <Link
                key={child.link}
                to={child.link}
                className={classes.subItem}
                data-active={path === child.link.toLowerCase() || undefined}
                onClick={onNavigate}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={link || "#"}
      className={classes.item}
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      <span>{label}</span>
    </Link>
  );
}
