import {
  Container,
  Stack,
  Text,
  Title,
  Space,
  Group,
  useMantineColorScheme,
  List,
  Anchor
} from "@mantine/core";
import GuestLayout from "../../layout/Guest";
import { theme } from "../../theme/theme";

export default function About() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const headingColor = isDark ? theme.white : theme.black;

  return (
    <GuestLayout>
      <Container size="lg" py={48}>
        {/* Hero Section */}
        <Stack align="center" mb={56} gap={8}>
          <Group gap={16}>
            <Title
              order={1}
              c={headingColor}
              style={{ color: "black", fontWeight: 550 }}
            >
              About Us
            </Title>
          </Group>

          <Text w="100%" ta="left" size="xl" >Who We Are</Text>
          <Text
            size="xl" align-item="center" maw="100%" mt={8}>
            <strong>RunAnalytic Technology</strong> is a UAE-based technology company specializing in e-commerce automation solutions for Amazon sellers. Our mission is to help online merchants simplify compliance, save time, and grow their business with secure, efficient tools.
          </Text>
        </Stack>

          {/* WHat we do */}
          <Stack gap={24} >
            <Group gap={16}>
              <Title order={2} c={headingColor} style={{color: 'black', fontWeight: 600}}>
              What We Do
              </Title>
            </Group>
            <Text size="md">
            We are the creators of a cloud-based SaaS platform that integrates directly with <strong>Amazon’s Selling Partner API (SP-API)</strong>. Our solution automatically generates <strong>UAE VAT-compliant invoices</strong> for every Amazon order, ensuring sellers meet <Anchor href="https://tax.gov.ae/en/default.aspx" target="_blank" fw={600}>Federal Tax Authority (FTA) </Anchor> regulations without manual effort. After uploading the generated invoice via SP-API to comply with amazon invoice uploaded policy.
            </Text>
            <Text>With RunAnalytic, Amazon sellers benefit from:</Text>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Automated invoice creation and delivery</List.Item>
              <List.Item>Real-time order synchronization</List.Item>
              <List.Item>Reduced errors and administrative workload</List.Item>
              <List.Item>Secure handling of customer data (<strong>PII</strong>)</List.Item>
              <List.Item>Full compliance with <strong>UAE VAT</strong> laws</List.Item>
            </List>
          </Stack>

          {/* our values */}
          <Stack gap={24} mt={20}>
            <Group gap={16}>
              <Title order={2} c={headingColor} style={{color: 'black', fontWeight: 600}}>
              Our Values
              </Title>
            </Group>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Security First: We apply enterprise-grade security practices including encryption, access control, and incident response procedures</List.Item>
              <List.Item>Compliance by Design: Our systems are built around UAE Federal Tax Authority requirements to keep sellers compliant.</List.Item>
              <List.Item>Seller Success: We focus on eliminating manual tasks so sellers can spend more time growing their business.</List.Item>
              <List.Item>Innovation: We continuously improve our platform to support additional marketplaces such as KSA, UK, USA.</List.Item>
            </List>
          </Stack>

          {/* Why Choose RunAnalytic */}
          <Stack gap={24} mt={20}>
            <Group gap={16}>
              <Title order={2} c={headingColor} style={{color: 'black', fontWeight: 600}}>
              Why Choose RunAnalytic
              </Title>
            </Group>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Localized for <strong>UAE VAT compliance</strong></List.Item>
              <List.Item>Backed by a dedicated team of engineers and compliance specialists</List.Item>
              <List.Item>Secure, reliable, and trusted automation for Amazon sellers</List.Item>
              <List.Item>Committed to transparency and best practices in data privacy </List.Item>
            </List>
          </Stack>

          {/* Contact */}
          <Stack gap={24} mt={20}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Contact Us
              </Title>
            </Group>
            <Text size="md">
              If you have any questions, please contact:
            </Text>
            <List size="md" spacing={12}>
              <List.Item>
                Email: <Anchor href="mailto:support@runanalytic.com" fw={600}>support@runanalytic.com</Anchor>
              </List.Item>
              <List.Item>
                Address: Butina Sharjah UAE
              </List.Item>
            </List>
          </Stack>

          <Space h={64} />
      </Container>
    </GuestLayout>
  );
}
