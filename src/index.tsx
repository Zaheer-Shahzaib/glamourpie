import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/theme";
import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import { AuthProvider } from "./Context/useAuth";
import { ScrollProvider } from "./Context/scrollContext";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/index.css";
import "./styles/globals.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // Data stays "fresh" for 5 minutes — no re-fetch on navigation
      gcTime: 1000 * 60 * 30,         // Keep unused cache for 30 minutes
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,     // Don't re-fetch just because user switched windows
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withCssVariables
        withGlobalClasses
        theme={theme}
        defaultColorScheme="light"
      >
        <Notifications />
        <AuthProvider>
          <Router>
            <ScrollProvider>
              <App />
            </ScrollProvider>
          </Router>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
