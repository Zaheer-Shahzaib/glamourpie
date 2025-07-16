"use client";

import { useState } from "react";

import {
  Container,
  Flex,
  Paper,
  PaperProps,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import PricingCard from "../Components/PricingCard/PricingCard";
const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
};

const PRICING = [
  {
    tier: "basic",
    price: {
      month: 0,
      year: 0,
    },
    features: [
      "Generate up to 10 invoices/month",
      "Standard invoice templates",
      "Amazon compliance check",
      "Manual PDF download",
    ],
    preferred: false,
    actionText: "Get started for free",
    description: "Perfect for new Amazon sellers just starting out",
  },
  {
    tier: "standard",
    price: {
      month: 19,
      year: 180, // discount applied for yearly
    },
    features: [
      "Up to 200 invoices/month",
      "Customizable invoice templates",
      "Auto-fill invoice data from order",
      "Amazon VAT compliance assistant",
      "Upload invoices directly to Amazon",
      "Priority email support",
    ],
    preferred: true,
    actionText: "Upgrade to Standard",
    description:
      "Ideal for growing Amazon businesses that need speed and automation",
  },
  {
    tier: "premium",
    price: {
      month: 39,
      year: 360,
    },
    features: [
      "Unlimited invoices",
      "AI-powered data extraction",
      "Bulk invoice generation",
      "Advanced compliance insights",
      "One-click Amazon uploads",
      "24/7 priority chat support",
      "Team access & role permissions",
      "Audit-ready archive (1 year)",
    ],
    preferred: false,
    actionText: "Go Premium",
    description:
      "Best for high-volume sellers and teams who want full automation",
  },
];

function Pricing() {
  const [checked, setChecked] = useState(false);
  const pricingItems = PRICING.map((p) => (
    <PricingCard
      key={p.tier}
      monthly={checked}
      {...p}
      {...PAPER_PROPS}
    />
  ));

  return (
    <>
      <>
        <title>Amazon Management</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <Container fluid>
        <Stack gap='lg'>
          <Paper style={{ backgroundColor: "transparent" }}>
            <Stack>
              <Title
                order={2}
                ta='center'
              >
                Simple, fair pricing.
              </Title>
              <Text
                size='lg'
                ta='center'
              >
                All types of businesses need access to development resources, so
                we give you the option to decide how much you need to use.
              </Text>
              <Flex
                justify='center'
                gap='md'
              >
                <Text>Annual</Text>
                <Switch
                  size='md'
                  checked={checked}
                  onChange={(event) => setChecked(event.currentTarget.checked)}
                />
                <Text>Monthly</Text>
              </Flex>
            </Stack>
          </Paper>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {pricingItems}
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default Pricing;
