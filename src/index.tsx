import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/theme";
import "@mantine/core/styles.css";
import { AuthProvider } from "./Context/useAuth";
import { ScrollProvider } from "./Context/scrollContext";
import {   BrowserRouter as Router } from "react-router-dom";
import './styles/index.css'
import "./styles/globals.scss";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider
      withCssVariables
      withGlobalClasses
      theme={theme}
      defaultColorScheme='light'
    >
      <AuthProvider>
        <Router>
          <ScrollProvider>
            <App />
          </ScrollProvider>
        </Router>
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);
