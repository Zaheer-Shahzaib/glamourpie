import { useLayoutEffect } from "react";
import "../styles/app-theme.scss";

const APP_BODY_CLASS = "ra-app";

/**
 * Switches Mantine (including its portals: modals, menus, notifications) to the Seller
 * Center theme defined in `styles/app-theme.scss` while the calling component is mounted.
 * Used by the app shell and by the auth screens.
 */
export const useAppTheme = (): void => {
  useLayoutEffect(() => {
    document.body.classList.add(APP_BODY_CLASS);
    return () => document.body.classList.remove(APP_BODY_CLASS);
  }, []);
};
