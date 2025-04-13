import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/theme";
import "@mantine/core/styles.css";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider withCssVariables withGlobalClasses theme={theme}defaultColorScheme='light'
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
