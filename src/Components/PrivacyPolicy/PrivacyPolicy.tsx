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
    <IconShieldLock size={40} color="#228be6" />
    <Title order={1} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
      Privacy Policy
    </Title>
  </Group>
  <Text size="xl" color="dimmed" align-item="center" maw={800} mt={16}>
    At <strong>RunAnalytic Technology</strong>, we prioritize your privacy and data security.
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
              <IconDatabase size={32} color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Information We Collect
              </Title>
            </Group>
            <Text size="md" color="dimmed">
              We collect only what's necessary to provide our services:
            </Text>
            <Space h={8} />
            <List size="md" spacing={12}>
              <List.Item>
                <Text size="md">Amazon order details via Selling Partner API</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Seller account information (name, email, ID)</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Device and connection information</Text>
              </List.Item>
            </List>
          </Stack>

          {/* Data Usage */}
          <Stack gap={24}>
            <Group gap={16}>
              <IconUser size={32} color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                How We Use Your Data
              </Title>
            </Group>
            <List size="md" spacing={12}>
              <List.Item>
                <Text size="md">Generate tax-compliant invoices automatically</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Provide personalized customer support</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Ensure compliance with regulations</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Improve our services</Text>
              </List.Item>
            </List>
          </Stack>

          {/* Data Protection */}
          <Stack gap={24}>
            <Group gap={16}>
              <IconKey size={32} color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Protection
              </Title>
            </Group>
            <Text size="md" color="dimmed">
              Your data is protected with industry-leading security measures:
            </Text>
            <Space h={8} />
            <Stack gap={8}>
              <Group gap={12}>
                <IconKey size={20} color="#40c057" />
                <Text size="md" fw={500}>End-to-end encryption</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#228be6" />
                <Text size="md" fw={500}>Role-based access controls</Text>
              </Group>
              <Group gap={12}>
                <IconShieldLock size={20} color="#7950f2" />
                <Text size="md" fw={500}>Regular security audits</Text>
              </Group>
            </Stack>
          </Stack>

          {/* Your Rights */}
          <Stack gap={24}>
            <Group gap={16}>
              <IconUser size={32}  color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Your Rights
              </Title>
            </Group>
            <List size="md" spacing={12}>
              <List.Item>
                <Text size="md">Access your data anytime</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Request corrections</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Delete your account</Text>
              </List.Item>
              <List.Item>
                <Text size="md">Export your data</Text>
              </List.Item>
            </List>
            <Space h={16} />
            <Group gap={12}>
              <IconMail size={24} color="#228be6" />
              <Text size="md">
                Contact us at <Anchor href="mailto:support@runanalytic.com" fw={600}>support@runanalytic.com</Anchor> for any requests
              </Text>
            </Group>
          </Stack>

          {/* Data Retention */}
          <Stack gap={24}>
            <Group gap={16}>
              <IconClock size={32} color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Data Retention
              </Title>
            </Group>
            <Text size="md" color="dimmed">
              We retain personal information only as long as necessary:
            </Text>
            <Space h={8} />
            <Text size="md" fw={500}>
              → 30 days after order completion for PII
            </Text>
            <Text size="md" fw={500}>
              → 1 year for business records (anonymized where possible)
            </Text>
          </Stack>

          {/* Policy Updates */}
          <Stack gap={24}>
            <Group gap={16}>
              <IconRefresh size={32} color="#228be6" />
              <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                Policy Updates
              </Title>
            </Group>
            <Text size="md">
              We'll notify you 30 days before implementing significant changes to this policy, either by email or through in-app notifications.
            </Text>
          </Stack>
        </Stack>

        {/* FAQ Section */}
        <Space h={64} />
        <Title order={2} c={headingColor} mb={32} style={{ color: 'black', fontWeight: 600 }}>
          Frequently Asked Questions
        </Title>
        
        <Accordion variant="default" chevronPosition="right">
          <Accordion.Item value="data-collection">
            <Accordion.Control>
              <Text size="md" fw={600}>What specific Amazon data do you access?</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" color="dimmed" mt={8}>
                We only access order information required for invoice generation: order IDs, customer names, addresses, product details, and payment amounts. We never access sensitive payment information like credit card numbers.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="data-storage">
            <Accordion.Control>
              <Text size="md"  fw={600}>Where is my data stored?</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" color="dimmed" mt={8}>
                All data is stored securely in AWS data centers located in the UAE region. We use multiple availability zones for redundancy and automatic failover protection.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="data-deletion">
            <Accordion.Control>
              <Text size="md" fw={600}>How quickly is my data deleted when I request it?</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" color="dimmed" mt={8}>
                Account deletion requests are processed within 7 business days. Data is permanently removed from our active systems within 24 hours of processing, and from backups within 30 days.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="compliance">
            <Accordion.Control>
              <Text size="md" fw={600}>Which privacy regulations do you comply with?</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="md" color="dimmed" mt={8}>
                We comply with UAE data protection regulations, Amazon's Selling Partner API requirements, and follow GDPR principles as a global standard for data protection.
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </GuestLayout>
  );
}