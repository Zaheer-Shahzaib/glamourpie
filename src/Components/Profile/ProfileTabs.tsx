import { Link } from "react-router-dom";
import { PATH_APPS } from "../../routes";
import { cx } from "../AppUi";
import classes from "./ProfileTabs.module.scss";

type ProfileTabsProps = {
  active: "personal" | "security";
};

/** "Personal info | Security" tab strip shown inside the Profile card (Figma › Profile). */
export default function ProfileTabs({ active }: ProfileTabsProps) {
  return (
    <nav className={classes.tabs} aria-label="Profile sections">
      <Link
        to={PATH_APPS.profile.personal}
        className={cx(classes.tab, active === "personal" && classes.active)}
        aria-current={active === "personal" ? "page" : undefined}
      >
        Personal info
      </Link>
      <Link
        to={PATH_APPS.profile.security}
        className={cx(classes.tab, active === "security" && classes.active)}
        aria-current={active === "security" ? "page" : undefined}
      >
        Security
      </Link>
    </nav>
  );
}
