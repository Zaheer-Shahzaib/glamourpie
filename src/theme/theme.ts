import { createTheme } from "@mantine/core";
import { colors } from "./colors";

export const theme = createTheme({
  fontFamily: "Plus Jakarta Sans, sans-serif",
  headings: {
    fontFamily: "Plus Jakarta Sans, sans-serif",
    // sizes: {
    //   h1: { fontSize: "72px", lineHeight: "90px", fontWeight: "700" },
    //   h2: { fontSize: "60px", lineHeight: "72px", fontWeight: "700" },
    //   h3: { fontSize: "48px", lineHeight: "60px", fontWeight: "700" },
    //   h4: { fontSize: "36px", lineHeight: "44px", fontWeight: "700" },
    //   h5: { fontSize: "30px", lineHeight: "38px", fontWeight: "700" },
    //   h6: { fontSize: "24px", lineHeight: "32px", fontWeight: "700" },
    // },
  },
  other: {
    paragraphs: {
      xl: { fontSize: "20px", lineHeight: "30px", letterSpacing: "0" },
      l: { fontSize: "18px", lineHeight: "28px", letterSpacing: "0" },
      m: { fontSize: "16px", lineHeight: "24px", letterSpacing: "0" },
      s: { fontSize: "14px", lineHeight: "20px", letterSpacing: "0" },
      xs: { fontSize: "12px", lineHeight: "18px", letterSpacing: "0" },
    },
  },
  colors,
  white: "#FFFFFF",
  black: "#000000",
  primaryColor: "cyan",
  primaryShade: { light:4, dark: 6 },
  spacing: {
    none: "0px",
    xxs: "2px",
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "10px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "20px",
    "4xl": "24px",
    "5xl": "32px",
    "6xl": "40px",
    "7xl": "48px",
    "8xl": "64px",
    "9xl": "80px",
    "10xl": "96px",
    "11xl": "128px",
  },
  scale: 0.96,
  // TODO: in figma we have negative spread value which mantine doesn't support natively. So need to verify following in the UI.
  // shadows: {
  //   xs: "0px 1px 2px #181E2714",
  //   s: "0px 2px 4px #181E2714",
  //   m: "0px 4px 6px #181E2714",
  //   l: "0px 6px 8px #181E2714",
  //   xl: "0px 8px 12px #181E2714",
  //   "2xl": "0px 12px 16px #181E2714",
  // },

  // radius: {
  //   none: "0",
  //   xxs: "2px",
  //   xs: "4px",
  //   s: "6px",
  //   m: "8px",
  //   l: "10px",
  //   xl: "12px",
  //   "2xl": "16px",
  //   "3xl": "20px",
  //   "4xl": "24px",
  //   full: "9999px",
  // },
  // /** Key of theme.radius or any valid CSS value. Default border-radius used by most components */
  // defaultRadius: MantineRadius;

  // /** Object of values that are used to control font-size property in all components */
  // fontSizes: MantineFontSizesValues;

  // /** Object of values that are used to control line-height property in Text component */
  // lineHeights: MantineLineHeightValues;

  // /** Object of values that are used to control breakpoints in all components,
  //  *  values are expected to be defined in em
  //  * */
  // breakpoints: MantineBreakpointsValues;

  // /** Determines whether user OS settings to reduce motion should be respected, false by default */
  // respectReducedMotion: boolean;

  // /** Determines which cursor type will be used for interactive elements
  //  * - default – cursor that is used by native HTML elements, for example, input[type="checkbox"] has cursor: default styles
  //  * - pointer – sets cursor: pointer on interactive elements that do not have these styles by default
  //  */
  // cursorType: 'default' | 'pointer';

  // /** Default gradient configuration for components that support variant="gradient" */
  // defaultGradient: MantineGradient;

  // /** Class added to the elements that have active styles, for example, Button and ActionIcon */
  // activeClassName: string;

  // /** Class added to the elements that have focus styles, for example, Button or ActionIcon.
  //  *  Overrides theme.focusRing property.
  //  */
  // focusClassName: ;
// focusRing: "never", // Disables default focus ring if needed
//   focusClassName: "custom-focus",
  // /** Allows adding classNames, styles and defaultProps to any component */
  // components: MantineThemeComponents;
  // /** Any other properties that you want to access with the theme objects */
});