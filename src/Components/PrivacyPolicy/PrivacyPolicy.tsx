import {
  Container,
  Stack,
  Text,
  Title,
  Space,
  List,
  Anchor,
  Accordion,
  Group,
  useMantineColorScheme,
  px
} from "@mantine/core";
import { IconShieldLock, IconDatabase, IconUser, IconMail, IconKey, IconClock, IconRefresh } from "@tabler/icons-react";
import GuestLayout from "../../layout/Guest";
import { theme } from "../../theme/theme";

export default function PrivacyPolicy() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const headingColor = isDark ? theme.white : theme.black;
  return (
    <GuestLayout>
      <Container size="lg" py={48}>
        {/* Hero Section */}
        <Stack align="center" mb={64} gap={8}>
          <Group gap={16}>

            <Title order={1} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
              Privacy Policy
            </Title>
          </Group>
          <Text w="100%" ta="left" size="xl" fw={700}>Effective Date: 01-Aug-2025</Text>
          <Text size="xl" color="dimmed" align-item="center" maw={1200} mt={16}>
            <strong>RunAnalytic Technology</strong> (“we,” “our,” “us”) respects your privacy and is committed to protecting the information you share with us. This Privacy Policy describes how we collect, use, store, and protect data, including Personally Identifiable Information (PII), obtained from Amazon’s Selling Partner API (SP-API) and other sources.
          </Text>

          {/* <Text size="md" color="dimmed" mt={8}>
            Website: <Anchor href="https://runanalytic.com/" target="_blank" underline="hover">https://runanalytic.com/</Anchor>
          </Text> */}
        </Stack>

        {/* Main Content */}
        <Stack gap={48}>
          {/* Information Collection */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Information We Collect
              </Title>
            </Group>
            <Text size="md" color="dimmed">
              When authorized by you, we collect data from Amazon SP-API, including:
            </Text>
            {/* <Space h={8} /> */}
            {/* <Title order={3} size="md" fw={600}>Amazon Information (via Amazon Selling Partner API)</Title> */}
            <List size="md" spacing={12} withPadding listStyleType="disc">
              {/* <List.Item>Order IDs</List.Item> */}
              <List.Item>Customer Names</List.Item>
              <List.Item>Shipping/Billing Addresses</List.Item>
              <List.Item>Phone Number if available</List.Item>
              {/* <List.Item>Email Addresses (if provided by Amazon)</List.Item> */}
              <List.Item>Order details (items, quantities, prices and order number)</List.Item>
              <List.Item>VAT-related transaction information</List.Item>
            </List>


            <Title order={3} size="md" fw={600}>Account Information</Title>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Seller Account IDs</List.Item>
              <List.Item>Company Name as per Seller account</List.Item>
              <List.Item>Contact Information</List.Item>
            </List>

            <Title order={3} size="md" fw={600}>Technical Information</Title>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              {/* <List.Item>IP address</List.Item> */}
              <List.Item>Device information</List.Item>
              <List.Item>Browser information</List.Item>
              <List.Item>Log data</List.Item>
            </List>
            <Text pt="sm">We do not collect any information beyond what is necessary to perform the agreed services.</Text>
          </Stack>

          {/* purpose of data collection */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Purpose of Data Collection
              </Title>
            </Group>

            <Text size="md">
              We collect and process this data to:
            </Text>

            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Generate UAE VAT-compliant tax invoices for VAT register sellers and commercial invoice for non VAT register sellers,  for Amazon orders.</List.Item>
              <List.Item>Deliver invoices to Amazon systems as required by UAE Federal Tax Authority regulations.</List.Item>
              <List.Item>Maintain accurate VAT records for compliance purposes.</List.Item>
            </List>
          </Stack>

          {/* Legal basis */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Legal Basis
              </Title>
            </Group>

            <Text size="md">
              Our processing is based on:
            </Text>

            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Your explicit consent when authorizing our application via Amazon SP-API.</List.Item>
              <List.Item><strong>Legal obligations</strong> under UAE VAT laws and <Anchor href="https://www.tax.gov.ae/" target="_blank" fw={600} >Federal Tax Authority (FTA)</Anchor> requirements.</List.Item>
            </List>
          </Stack>

          {/* Data Usage */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Retention
              </Title>
            </Group>

            <Text size="md">
              We retain PII for no longer than 30 days after the order shipment date, unless a longer period is required by applicable law. After the retention period, data is securely deleted using industry-standard deletion methods.
            </Text>

          </Stack>


          {/* Data Sharing */}
          {/* <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Sharing and Disclosure
              </Title>
            </Group>
            <Text size="md">
              We do not share your Amazon data with any third parties, except:
            </Text>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>To comply with legal obligations</List.Item>
              <List.Item>With authorized cloud service providers (AWS, etc.) for secure hosting</List.Item>
              <List.Item>With your consent</List.Item>
            </List>
            <Text size="md" fw={600}>
              We do not sell or rent your data.
            </Text>
          </Stack> */}
          {/* Data storage */}
          {/* <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Storage and Retention
              </Title>
            </Group>

            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Amazon data is stored securely on servers hosted on AWS (Amazon Web Services).</List.Item>
              <List.Item>All data is encrypted in transit (TLS 1.2+) and at rest (AES-256).</List.Item>
              <List.Item>Personally Identifiable Information (PII) is retained for no longer than 30 days after order shipment, unless otherwise required by law.
              </List.Item>
            </List>

          </Stack> */}

          {/* Data Protection */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Security
              </Title>
            </Group>



            <Text size="md">
              We apply industry best practices to protect your data, including:
            </Text>

            <Stack gap={24} >
              <Group gap={12}>
                <IconShieldLock size={20} color="#7950f2" />
                <Text>Encryption in transit:TLS 1.2 or higher</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#20c997" />
                <Text>Encryption at rest:AES-256</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#2f9e44" />
                <Text size="md">Role-Based Access Control (RBAC) with least-privilege principles</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#1971c2" />
                <Text size="md">Multi-Factor Authentication (MFA) for all administrative accounts</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#fd7e14" />
                <Text size="md">Regular vulnerability scans and penetration testing</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#e64980" />
                <Text size="md">Monitoring via Security Information and Event Management (SIEM) systems</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#343a40" />
                <Text size="md">Incident response procedures including Amazon notification within 72 hours of any data breach involving Amazon Information</Text>
              </Group>
            </Stack>
          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Sharing of Data
              </Title>
            </Group>

            <Text size="md">
              We do not sell, rent, or share Amazon Information with third parties.
              Access is limited to authorized employees who require it to perform their duties.
            </Text>
          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                International Data Transfers
              </Title>
            </Group>

            <Text size="md">
              Data is stored securely in our cloud infrastructure located in the United States. All transfers comply with applicable data protection laws.
            </Text>
          </Stack>

          {/* Your Rights */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Your Rights
              </Title>
            </Group>
            <Text size="md">
              You may request at any time to:
            </Text>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Access the data we hold about you</List.Item>
              <List.Item>Request corrections to your data</List.Item>
              <List.Item>Request deletion of your data</List.Item>
              <List.Item>Withdraw SP-API authorization</List.Item>
            </List>
            <Space h={16} />
            <Group gap={12}>
              <IconMail size={24} color="#228be6" />
              <Text size="md">
                Please contact us at <Anchor href="mailto:support@runanalytic.com" fw={600}> support@runanalytic.com</Anchor> for any requests
              </Text>
            </Group>
          </Stack>



          {/* Children's Privacy */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Children's Privacy
              </Title>
            </Group>
            <Text size="md">
              Our services are not intended for individuals under the age of 18.
            </Text>
          </Stack>

          {/* Policy Updates */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Changes to This Privacy Policy
              </Title>
            </Group>
            <Text size="md">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.
            </Text>
          </Stack>

          {/* Contact */}
          <Stack gap={24}>
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
        </Stack>

        {/* FAQ Section */}
        <Space h={64} />



      </Container>
    </GuestLayout>
  );
}