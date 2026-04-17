import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Select,
  Checkbox,
  Button,
  Stack,
  Group,
  Avatar,
  Box,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { AMAZON_MARKETPLACES, Marketplace } from "../constants/marketplaces";
import { getAmazonAuthUrl } from "../Services/spapi-services";
import { IconAlertCircle, IconExternalLink } from "@tabler/icons-react";

const ConnectSellerPage: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for selections
  const [selectedMarketplaceDomain, setSelectedMarketplaceDomain] = useState<
    string | null
  >("amazon.ae");
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(
    "AED",
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Parse error from URL if redirected back from Amazon with failure
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("amazon_auth") === "error") {
      setError(
        "Amazon authorization failed. Please try again or check your account permissions.",
      );
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/authentication/signin");
  };
  // Handle marketplace change (auto-update currency)
  const handleMarketplaceChange = (domain: string | null) => {
    setSelectedMarketplaceDomain(domain);
    const marketplace = AMAZON_MARKETPLACES.find((m) => m.domain === domain);
    if (marketplace) {
      setSelectedCurrency(marketplace.currency);
    }
  };

  const handleConnect = async () => {
    if (!selectedMarketplaceDomain || !selectedCurrency || !termsAccepted)
      return;

    setLoading(true);
    setError(null);

    const marketplace = AMAZON_MARKETPLACES.find(
      (m) => m.domain === selectedMarketplaceDomain,
    )!;
    console.log("marketplace", marketplace);
    console.log("selectedMarketplaceDomain", selectedMarketplaceDomain);
    console.log("selectedCurrency", selectedCurrency);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await getAmazonAuthUrl(token, {
        marketplace: marketplace.domain,
        currency: selectedCurrency,
        region: marketplace.region,
      });

      if (response.success && response.url) {
        // Redirect to Amazon
        window.location.href = response.url;
      } else {
        setError("Failed to generate Amazon authorization link.");
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while connecting to Amazon.",
      );
    } finally {
      setLoading(false);
    }
  };

  const marketplaceData = React.useMemo(() => {
    return (AMAZON_MARKETPLACES || []).map((m) => ({
      value: m.domain,
      label: `${m.flag} ${m.name} (${m.domain})`,
      // group: m.region === 'EU' ? 'Europe & Middle East' : 'North America'
    }));
  }, []);

  const currencyData = React.useMemo(() => {
    const currencies = (AMAZON_MARKETPLACES || []).map((m) => m.currency);
    return Array.from(new Set(currencies)).map((c) => ({
      value: c,
      label: c,
    }));
  }, []);

  return (
    <Box mih="100vh" bg="gray.0" py={100}>
      <Container size="sm">
        <Stack align="center" mb={40}>
          <Box
            component="img"
            src="/logo.png"
            alt="RunAnalytics"
            h={40}
            style={{ filter: "grayscale(0.5)" }}
          />
          <Title order={1} fw={900} size="h2" style={{ color: "#1A1B1E" }}>
            Connect to Seller Central
          </Title>
        </Stack>

        <Paper
          withBorder
          shadow="md"
          p={30}
          radius="md"
          style={{ position: "relative" }}
        >
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

          <Stack gap="xl">
            {error && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Connection Error"
                color="red"
              >
                {error}
              </Alert>
            )}

            <Box>
              <Text fw={700} mb={5} size="sm">
                Choose your main marketplace:
              </Text>
              <Select
                placeholder="Pick a marketplace"
                data={marketplaceData || []}
                value={selectedMarketplaceDomain}
                onChange={handleMarketplaceChange}
                searchable
                size="md"
                allowDeselect={false}
              />
            </Box>

            <Box>
              <Text fw={700} mb={5} size="sm">
                Choose your main currency:
              </Text>
              <Select
                placeholder="Pick a currency"
                data={currencyData || []}
                value={selectedCurrency}
                onChange={handleMarketplaceChange}
                size="md"
                allowDeselect={false}
              />
            </Box>

            <Stack gap="sm" mt="md">
              <Checkbox
                label={
                  <Text size="sm">
                    I have read and accepted RunAnalytics{" "}
                    <Text
                      span
                      c="blue"
                      inherit
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      terms and conditions
                    </Text>
                  </Text>
                }
                checked={termsAccepted}
                onChange={(event) =>
                  setTermsAccepted(event.currentTarget.checked)
                }
              />
              <Checkbox
                label={
                  <Text size="sm">
                    Subscribe to our newsletter. Only important updates, no
                    spam!
                  </Text>
                }
                checked={newsletterSubscribed}
                onChange={(event) =>
                  setNewsletterSubscribed(event.currentTarget.checked)
                }
              />
            </Stack>

            <Box mt="lg">
              <Button
                fullWidth
                size="lg"
                color="blue"
                onClick={handleConnect}
                disabled={!termsAccepted || !selectedMarketplaceDomain}
                rightSection={<IconExternalLink size="1.2rem" />}
                style={{ height: 50, fontSize: 18 }}
              >
                Connect to Seller Central
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Group justify="center" mt="xl">
          <Text size="sm" c="dimmed">
            Looking for other marketplaces?
          </Text>
          <Text
            size="sm"
            c="blue"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Log out
          </Text>
        </Group>
      </Container>
    </Box>
  );
};

export default ConnectSellerPage;
