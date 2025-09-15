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
        <Stack align="center" mb={64} gap={8}>
          <Group gap={16}>

            <Title className="text-5xl text-[#424242] pb-12 font-bold">
              <strong>About Us</strong>
            </Title>
          </Group>
          <Text className="w-full text-center text-lg text-[#636363] font-semibold">Who We Are</Text>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
          <Text className="text-lg text-[#424242]" style={{ lineHeight: '2' }}>
            <strong>RunAnalytic Technology</strong> is a UAE-based technology company specializing in e-commerce automation solutions for Amazon sellers. Our mission is to help online merchants simplify compliance, save time, and grow their business with secure, efficient tools.
          </Text>

          <Text className="pt-4 text-md text-[#636363]">We are committed to providing innovative solutions that make e-commerce compliance simple and efficient.</Text>

        </Stack>

        {/* Main Content */}
        <Stack gap={48}>
          {/* What we do */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-3xl text-[#424242] font-bold">
                1. What We Do
              </Title>
            </Group>
            <Text className="text-md text-[#636363]" style={{ lineHeight: '1.9' }}>
              We are the creators of a cloud-based SaaS platform that integrates directly with <strong>Amazon's Selling Partner API (SP-API)</strong>. Our solution automatically generates <strong>UAE VAT-compliant invoices</strong> for every Amazon order, ensuring sellers meet <Anchor href="https://tax.gov.ae/en/default.aspx" target="_blank" fw={600}>Federal Tax Authority (FTA) </Anchor> regulations without manual effort. After uploading the generated invoice via SP-API to comply with amazon invoice uploaded policy.
            </Text>
            <Text className="text-md text-[#636363]">With RunAnalytic, Amazon sellers benefit from:</Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Automated invoice creation and delivery</List.Item>
              <List.Item>Real-time order synchronization</List.Item>
              <List.Item>Reduced errors and administrative workload</List.Item>
              <List.Item>Secure handling of customer data (<strong>PII</strong>)</List.Item>
              <List.Item>Full compliance with <strong>UAE VAT</strong> laws</List.Item>
            </List>
          </Stack>

          {/* Our values */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-3xl text-[#424242] font-bold">
                2. Our Values
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Security First: We apply enterprise-grade security practices including encryption, access control, and incident response procedures</List.Item>
              <List.Item>Compliance by Design: Our systems are built around UAE Federal Tax Authority requirements to keep sellers compliant.</List.Item>
              <List.Item>Seller Success: We focus on eliminating manual tasks so sellers can spend more time growing their business.</List.Item>
              <List.Item>Innovation: We continuously improve our platform to support additional marketplaces such as KSA, UK, USA.</List.Item>
            </List>
          </Stack>

          {/* Why Choose RunAnalytic */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-3xl text-[#424242] font-bold">
                3. Why Choose RunAnalytic
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Localized for <strong>UAE VAT compliance</strong></List.Item>
              <List.Item>Backed by a dedicated team of engineers and compliance specialists</List.Item>
              <List.Item>Secure, reliable, and trusted automation for Amazon sellers</List.Item>
              <List.Item>Committed to transparency and best practices in data privacy </List.Item>
            </List>
          </Stack>

          {/* Contact */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                4. Contact Us
              </Title>
            </Group>
            <Text className="text-md text-[#636363]">
              If you have any questions, please contact:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>
                Email: <Anchor href="mailto:support@runanalytic.com" fw={600}>support@runanalytic.com</Anchor>
              </List.Item>
              <List.Item>
                Address: Butina Sharjah UAE
              </List.Item>
            </List>
          </Stack>
        </Stack>

        <Space h={64} />
      </Container>
    </GuestLayout>
  );
}
