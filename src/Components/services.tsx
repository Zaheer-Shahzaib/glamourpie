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
import GuestLayout from "../layout/Guest";
import { theme } from "../theme/theme";
import { Link } from "react-router-dom";
import { PATH_PAGES } from "../routes";
import { PATH_AUTH } from "../routes";
export default function Services() {
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
              <strong>Our Services</strong>
            </Title>
          </Group>
          <Text className="w-full text-center text-lg text-[#636363] font-semibold">Empower your Amazon business with automation and compliance.</Text>
          <Text className="text-lg text-[#636363]" style={{ lineHeight: '2' }}>
            RunAnalytic helps sellers save time, eliminate manual invoicing, and stay fully compliant with Amazon's Invoice Upload Policy and UAE VAT regulations.
          </Text>

        </Stack>

        {/* Main Content */}
        <Stack gap={48}>
          {/* Automatic Invoice Uploading */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                🚀 Automatic Invoice Uploading
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Eliminate manual work with our seamless SP-API integration. RunAnalytic automatically generates tax-compliant invoices for every Amazon order and uploads them directly to Seller Central. Save hours each week while reducing errors and avoiding compliance penalties.
            </Text>
          </Stack>

          {/* Smart Invoice Templates */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                🧾 Smart Invoice Templates
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Choose from Simple or Premium invoice designs tailored for both VAT and non-VAT registered sellers. Every template is aligned with UAE Federal Tax Authority (FTA) requirements and Amazon's invoicing standards so you can sell with confidence.
            </Text>
          </Stack>

          {/* Built for Amazon Sellers */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                🛒 Built for Amazon Sellers
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Unlike generic invoicing tools, RunAnalytic is designed specifically for Amazon. Our platform is optimized to handle invoice authorization codes, upload rules, and compliance requirements, ensuring you never miss an Amazon policy update.
            </Text>
          </Stack>

          {/* Track Everything */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                📊 Track Everything
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Stay in control with a real-time dashboard.
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Monitor all paid orders</List.Item>
              <List.Item>Track invoice upload confirmations</List.Item>
              <List.Item>Review compliance status in one place</List.Item>
            </List>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Our intuitive dashboard makes compliance simple and transparent.
            </Text>
          </Stack>

          {/* Transparent Pricing */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                💰 Transparent Pricing
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Start free, no setup fees, no surprises. Only pay as your business grows. RunAnalytic is built for scalability, so small sellers can start lean and larger businesses can handle high-volume invoicing with ease.
            </Text>
          </Stack>

          {/* Mobile App Coming Soon */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                📱 Mobile App Coming Soon
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Take compliance with you wherever you go. Our upcoming iOS and Android apps will let you create, upload, and track invoices on the move giving you flexibility and peace of mind.
            </Text>
          </Stack>

          {/* Security & Compliance */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                🔒 Security & Compliance
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              Trust is our top priority. RunAnalytic is fully aligned with Amazon's SP-API <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="text-lg"> Data Protection Policy (DPP)</Anchor> and <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN" target="_blank" className="text-lg">Acceptable Use Policy (AUP)</Anchor>.
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>TLS 1.2/1.3 encryption in transit</List.Item>
              <List.Item>AES-256 encryption at rest</List.Item>
              <List.Item>Role-based access controls with MFA</List.Item>
              <List.Item>PII automatically deleted within 30 days (backups within 90 days)</List.Item>
            </List>
          </Stack>

          {/* Why Sellers Choose RunAnalytic */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                🌍 Why Sellers Choose RunAnalytic
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Currently localized for UAE VAT compliance, with planned expansion to KSA, UK, and USA.</List.Item>
              <List.Item>Backed by experienced engineers and compliance specialists</List.Item>
              <List.Item>Transparent, reliable, and trusted automation for Amazon sellers</List.Item>
              <List.Item>Built to simplify compliance, so you can focus on growing your business</List.Item>
            </List>
          </Stack>

          {/* Get Started Today */}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-2xl text-[#424242] font-bold">
                📞 Get Started Today
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]" style={{ lineHeight: '1.9' }}>
              RunAnalytic is the easiest way to automate VAT-compliant invoicing for Amazon sellers. Try it risk-free and experience seamless automation in minutes.
            </Text>
            <Text className="text-lg text-[#636363]">
              👉 <Anchor  component={Link} to={PATH_AUTH.signup} className="text-lg text-blue-600">Start Free Trial</Anchor>
            </Text>
          </Stack>
        </Stack>

      </Container>
      </GuestLayout>

  );
}
