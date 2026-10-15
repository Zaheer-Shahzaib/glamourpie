/**
 * Additional design tokens used by the authenticated Seller Center UI
 * (Figma: "RunAnalytic SellerCenter — New Product System", page "01 Product UI").
 *
 * The brand / surface / text colours already live in `publicSiteTokens.ts`; this file
 * only holds the product-UI specific values that page does not define. They are exposed
 * as `--ra-color-*` CSS variables through `cssVariablesResolver` in `theme.ts`.
 */

export const appColors = {
  // Sidebar brand sub-line ("SELLERCENTER")
  brandTertiaryFixedDim: "#4cd7f6",

  // Hover / pressed state for the primary (brand) button
  brandHover: "#005a52",

  // Status colours
  warning: "#d97706",
  warningSoft: "#fff6e6",
  dangerSoftAlt: "#feecec",

  // Form fields
  fieldDisabled: "#f3f4f6",
  fieldDisabledText: "#a5afbd",
} as const;

export type AppColors = typeof appColors;
