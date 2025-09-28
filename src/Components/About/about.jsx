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

            <Title className="text-3xl text-[#424242] pb-3 font-bold">
              <strong>About Us</strong>
            </Title>
          </Group>
          <Text className="w-full text-center text-lg text-[#636363] font-semibold">Who We Are</Text>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
          <Text className="text-lg text-[#636363]" style={{ lineHeight: '2' }}>
          RunAnalytic Technology is a UAE-based technology company specializing in e-commerce automation solutions for Amazon sellers. Our mission is to help online merchants simplify compliance, save time, and grow their business with secure, efficient tools.
          </Text>

        </Stack>

        {/* Main Content */}
        <Stack gap={48}>
          {/* What we do */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                1. What We Do
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
            We are the creators of a cloud-based SaaS platform that integrates directly with Amazon’s Selling Partner API (SP-API). Our solution automatically generates UAE VAT-compliant invoices for every Amazon order, helping sellers comply with <Anchor href="https://tax.gov.ae/en/default.aspx" target="_blank" className="text-lg">Federal Tax Authority (FTA)</Anchor> regulations without manual effort. Invoices are then automatically uploaded to Amazon via SP-API, in full compliance with Amazon’s Invoice Upload Policy.
            </Text>
            <Text className="text-lg text-[#636363]">With RunAnalytic, Amazon sellers benefit from:</Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Automated invoice creation and delivery</List.Item>
              <List.Item>Real-time order synchronization</List.Item>
              <List.Item>Reduced errors and administrative workload</List.Item>
              <List.Item>Secure handling of customer data (PII)</List.Item>
              <List.Item>Full compliance with UAE VAT laws</List.Item>
            </List>
          </Stack>

          {/* Our values */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                2. Our Values
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Security First: We apply enterprise-grade security practices including encryption, access control, and incident response procedures.</List.Item>
              <List.Item>Compliance by Design: Our systems are built around UAE Federal Tax Authority requirements to keep sellers compliant.
              </List.Item>
              <List.Item>Seller Success: We focus on eliminating manual tasks so sellers can spend more time growing their business.</List.Item>
              <List.Item>Innovation: We continuously enhance our platform to expand support to additional marketplaces including KSA, UK, and USA.
              </List.Item>
            </List>
          </Stack>

          {/* Why Choose RunAnalytic */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                3. Why Choose RunAnalytic
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Localized for UAE VAT compliance.</List.Item>
              <List.Item>Backed by a dedicated team of engineers and compliance specialists.</List.Item>
              <List.Item>A secure and reliable platform trusted by Amazon sellers to simplify compliance and scale their business.</List.Item>
              <List.Item>Committed to transparency and best practices in data privacy.</List.Item>
            </List>
          </Stack>


          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                4. Compliance Commitment
              </Title>
            </Group>
            <Text className="text-lg leading-relaxed text-[#636363]">RunAnalytic complies with Amazon’s SP-API Data Protection Policy and Acceptable Use Policy. We only access the minimum customer data required to generate invoices, encrypt all data in transit and at rest, never store PII in logs, and automatically delete all customer data within 30 days.
            </Text>
          </Stack>

          {/* Contact */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-2xl text-[#424242] font-bold">
                13. Contact Us
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            If you have questions about this policy or would like to exercise your rights regarding PII, please contact us:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>
                Email: <Anchor href="mailto:support@runanalytic.com" className="text-lg">support@runanalytic.com</Anchor>
              </List.Item>
              <List.Item>
                Webiste: <Anchor href="https://www.runanalytic.com/" target="_blank" className="text-lg">www.runanalytic.com</Anchor>
              </List.Item>
            </List>
          </Stack>
        </Stack>

        <Space h={64} />
      </Container>
    </GuestLayout>
  );
}
