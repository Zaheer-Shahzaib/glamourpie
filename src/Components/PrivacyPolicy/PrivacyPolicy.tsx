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
  useMantineColorScheme
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
          <Text size="xl" color="dimmed" align-item="center" maw={1200} mt={16}>
  At <strong>RunAnalytic Technology</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SaaS platform, which integrates with Amazon Seller accounts to automate invoicing processes.
</Text>

          <Text size="md" color="dimmed" mt={8}>
            Website: <Anchor href="https://runanalytic.com/" target="_blank" underline="hover">https://runanalytic.com/</Anchor>
          </Text>
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
              We may collect and process the following information:
            </Text>
            <Space h={8} />
            <Title order={3} size="md" fw={600}>Amazon Information (via Amazon Selling Partner API)</Title>
            <List size="md" spacing={12} withPadding listStyleType="disc">
            <List.Item>Order IDs</List.Item>
            <List.Item>Customer Names</List.Item>
            <List.Item>Shipping/Billing Addresses</List.Item>
            <List.Item>Phone Numbers</List.Item>
            <List.Item>Email Addresses (if provided by Amazon)</List.Item>
            <List.Item>Order Details</List.Item>
          </List>

            
            <Title order={3} size="md" fw={600}>Account Information</Title>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Seller Account IDs</List.Item>
              <List.Item>Company Name</List.Item>
              <List.Item>Contact Information</List.Item>
            </List>
            
            <Title order={3} size="md" fw={600}>Technical Information</Title>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>IP address</List.Item>
              <List.Item>Device information</List.Item>
              <List.Item>Browser information</List.Item>
              <List.Item>Log data</List.Item>
            </List>
          </Stack>

          {/* Data Usage */}
          <Stack gap={24}>
  <Group gap={16} align="center">
    
    <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
      How We Use Your Information
    </Title>
  </Group>

  <Text size="md">
    We use the collected information for the following purposes:
  </Text>

  <List size="md" spacing={12} withPadding listStyleType="disc">
    <List.Item>To generate tax-compliant invoices</List.Item>
    <List.Item>To fulfill our legal and regulatory obligations (e.g., VAT compliance in UAE)</List.Item>
    <List.Item>To provide support and customer service</List.Item>
    <List.Item>To improve and secure our services</List.Item>
    <List.Item>To comply with Amazon's Selling Partner API data protection policies</List.Item>
  </List>
</Stack>


          {/* Data Sharing */}
          <Stack gap={24}>
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
          </Stack>
          {/* Data storage */}
          <Stack gap={24}>
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
            
          </Stack>

          {/* Data Protection */}
<Stack gap={24}>
  <Group gap={16}>
   
    <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
      Data Security
    </Title>
  </Group>


  
  <Text size="md">
    We employ strong security measures:
  </Text>

  <Stack gap={8}>
    <Group gap={12}>
      <IconShieldLock size={20} color="#228be6" />
      <Text size="md">Role-Based Access Control (RBAC)</Text>
    </Group>
    <Group gap={12}>
      <IconShieldLock size={20} color="#7950f2" />
      <Text size="md">Multi-Factor Authentication (MFA)</Text>
    </Group>
    <Group gap={12}>
      <IconShieldLock size={20} color="#fd7e14" />
      <Text size="md">Intrusion Detection Systems (IDS)</Text>
    </Group>
    <Group gap={12}>
      <IconShieldLock size={20} color="#40c057" />
      <Text size="md">Encryption at rest and in transit</Text>
    </Group>
    <Group gap={12}>
      <IconShieldLock size={20} color="#e64980" />
      <Text size="md">Continuous monitoring and auditing</Text>
    </Group>
  </Stack>
</Stack>

          {/* Your Rights */}
          <Stack gap={24}>
            <Group gap={16}>
              
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Your Rights
              </Title>
            </Group>
            <Text size="md">
              You have the right to:
            </Text>
            <List size="md" spacing={12} withPadding listStyleType="disc">
              <List.Item>Access your data</List.Item>
              <List.Item>Request correction of inaccurate data</List.Item>
              <List.Item>Request deletion of your data</List.Item>
              <List.Item>File complaints with data protection authorities</List.Item>
            </List>
            <Space h={16} />
            <Group gap={12}>
              <IconMail size={24} color="#228be6" />
              <Text size="md">
                Please contact us at <Anchor href="mailto:support@runanalytic.com" fw={600}>support@runanalytic.com</Anchor> for any requests
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
              We may update this policy. We will notify users via email or system notification.
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
                Email: <Anchor href="mailto:support@runanalytic.com">support@runanalytic.com</Anchor>
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