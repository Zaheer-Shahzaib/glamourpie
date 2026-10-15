/**
 * Design tokens for the public marketing / legal / onboarding pages
 * (Figma: "RunAnalytic SellerCenter — New Product System", page "05 Public Pages").
 *
 * These are the single source of truth for the public-site look. They are exposed
 * to CSS as `--ra-*` variables through `cssVariablesResolver` in `theme.ts`, so SCSS
 * modules never need raw hex values.
 */

export const publicSiteColors = {
  // Brand
  brand: "#00685f",
  brandContainer: "#008378",
  brandFixed: "#89f5e7",
  brandFixedDim: "#6bd8cb",
  brandTertiary: "#006577",

  // Surfaces
  surface: "#f8f9ff",
  surfaceLow: "#eff4ff",
  surfaceHigh: "#dce9ff",
  surfaceVariant: "#d3e4fe",
  surfaceWhite: "#ffffff",
  surfaceInverse: "#213145",
  surfaceInverseDeep: "#121e35",
  pageBg: "#f6f9fc",
  border: "#dbe3ed",

  // Text
  textPrimary: "#0b1c30",
  textSecondary: "#3d4947",
  textMuted: "#6d7a77",
  textInverse: "#eaf1ff",
  textInverseSoft: "#d4e0f2",
  textField: "#090e17",

  // Feedback / misc
  danger: "#ba1a1a",
  dangerSoft: "#ffebeb",
  link: "#256bd1",

  // Final call-to-action band
  ctaPill: "#264057",
  ctaSecondary: "#2e4259",
} as const;

export const publicSiteFonts = {
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  heading:
    '"Plus Jakarta Sans", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

export const publicSiteRadii = {
  sm: "8px",
  md: "10px",
  lg: "14px",
  xl: "18px",
  full: "999px",
} as const;

export const publicSiteTokens = {
  colors: publicSiteColors,
  fonts: publicSiteFonts,
  radii: publicSiteRadii,
} as const;

export type PublicSiteTokens = typeof publicSiteTokens;
