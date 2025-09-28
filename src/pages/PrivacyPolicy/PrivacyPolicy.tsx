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

            <Title className="text-3xl text-[#424242] pb-12 font-bold">
              <strong>Privacy Policy – RunAnalytic</strong>
            </Title>
          </Group>
          <Text className="w-full text-start text-m text-[#636363] font-semibold">Last updated: 10-Sep-2025</Text>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
          <Text className="text-lg text-[#636363]" style={{ lineHeight: '2' }}>
          At RunAnalytic, we take your privacy and data protection seriously. This policy explains how we handle Personally Identifiable Information (PII) accessed through the <Anchor href="https://developer-docs.amazon.com/sp-api/docs/welcome?ld=ASXXSPAPIDirect&pageName=US%3ASPDS%3ASPAPI-home" target="_blank" className="text-lg">Amazon Selling Partner API (SP-API)</Anchor> and other related services. 
          </Text>


        </Stack>

        {/* Main Content */}


        <Stack gap={48}>
          {/* Information Collection */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-2xl text-[#424242] font-bold">
                1. Information We Collect
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
              We only access and process the minimum Amazon customer data required to generate tax-compliant invoices. This may include:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">

              <List.Item>Customer Names</List.Item>
              <List.Item>Shipping/Billing Addresses</List.Item>
              <List.Item>Order ID</List.Item>
              <List.Item>Tax details (e.g., VAT)</List.Item>
            </List>
            <Text className="pt-4 text-lg  text-[#636363]">We do not collect or process any information not required for invoice generation. We never use Amazon customer data for marketing, resale, or unrelated purposes.</Text>
          </Stack>

          {/* purpose of data collection */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
                2. Data Storage and Retention
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>Amazon customer PII is used in real time to generate invoices</List.Item>
              <List.Item>We do not permanently store customer PII.</List.Item>
              <List.Item>All retrieved data is automatically deleted within 30 days, in compliance with <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="text-lg">Amazon’s Data Protection Policy.</Anchor>
              </List.Item>
              <List.Item>Customers may request earlier deletion of their data by contacting us at <Anchor href="mailto:support@runanalytic.com" target="_blank" className="text-lg">support@runanalytic.com</Anchor></List.Item>
            </List>
          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">
              <Title className="text-2xl text-[#424242] font-bold">
              3. Backups & Deletion
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            All active PII is deleted within 30 days. Any residual data in backups is securely deleted within 90 days.</Text>
          </Stack>

          {/* Legal basis */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
              4. Data Security & Encryption
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            We protect all PII using industry best practices:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>In transit: Data is encrypted using TLS 1.2 or higher.</List.Item>
              <List.Item>At rest: Data is encrypted using AES-256 encryption.</List.Item>
              <List.Item className="leading-relaxed">Hosting: Data is securely processed and stored on Namecheap servers in the USA, which are contractually required to follow Amazon’s Data Protection Policy and maintain equivalent security standards.</List.Item>
              <List.Item>Firewalls, intrusion detection, and access controls are in place to protect against unauthorized access.
              </List.Item>
              <List.Item>Regular vulnerability scans and penetration testing</List.Item>
              <List.Item>Monitoring via Security Information and Event Management (SIEM) systems</List.Item>
              <List.Item>Incident response procedures including Amazon notification within 24 hours of any data breach involving Amazon Information</List.Item>
            </List>
          </Stack>

          {/* Data Usage */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
                5.  Logging and Monitoring
              </Title>
            </Group>

            <Text className="text-lg text-[#636363]">
            We strictly follow Amazon’s<Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN" target="_blank" className="text-lg"> Acceptable Use Policy (AUP)</Anchor> and <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="text-lg">Data Protection Policies (DDP)</Anchor>:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>No Amazon customer PII is ever stored in logs.
              </List.Item>
              <List.Item>Logs are limited to technical metadata only (e.g., timestamps, request IDs, error codes).</List.Item>
              <List.Item>Any sensitive data (names, addresses, phone numbers) is automatically masked or excluded from logs.</List.Item>
            </List>
          </Stack>


          {/* Accees control  */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
                6. Access Controls
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item style={{ lineHeight: '2' }}>PII is only accessible by authorized automated systems.
              </List.Item>
              <List.Item style={{ lineHeight: '2' }}>RunAnalytic staff do not have direct access to Amazon customer PII unless explicitly required for troubleshooting under a confidentiality agreement.
              </List.Item>
              <List.Item style={{ lineHeight: '2' }}>All employees with access to Amazon Information are under strict confidentiality obligations.
              </List.Item>
              <List.Item>All administrative access requires Multi-Factor Authentication (MFA).</List.Item>
              <List.Item>Role-based access control (RBAC) with least-privilege principles.</List.Item>


            </List>
          </Stack>

          {/* Your Rights */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-2xl text-[#424242] font-bold">
              7. Password and Authentication Policy
              </Title>
            </Group>
            <List spacing={12} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>User passwords must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters.
              </List.Item>
              <List.Item>3 failed attempts allowed with an invalid password before a temporary lock-out.</List.Item>
              <List.Item>1 day of minimum password age</List.Item>
              <List.Item>180 days of password expiry time</List.Item>
              <List.Item>MFA is enforced for all administrative accounts.</List.Item>
            </List>

          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
              8. Incident Response
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            In the event of a data breach involving Amazon customer PII:
            </Text>
            <List spacing={12} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>We will notify Amazon and affected parties within 24 hours via email to 3p-security@amazon.com and security@amazon.com
              </List.Item>
              <List.Item>Affected accounts will be secured immediately, and a full investigation will be conducted.</List.Item>
            </List>
          </Stack>



          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-2xl text-[#424242] font-bold">
              9. Compliance
              </Title>
            </Group>
            <List spacing={12} withPadding listStyleType="disc" className="text-lg text-[#636363] font-weight-500">
              <List.Item>We comply with Amazon’s <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN" target="_blank" className="text-lg">Acceptable Use Policy </Anchor>and <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="text-lg">Data Protection Policy</Anchor>.
              </List.Item>
              <List.Item>We follow international best practices (NIST/ISO27001 guidelines) for data protection and security.</List.Item>
            </List>
          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">
              <Title className="text-2xl text-[#424242] font-bold">
              10. Training & Awareness
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            All employees with potential access to Amazon Information receive annual security and data protection training.</Text>
          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">
              <Title className="text-2xl text-[#424242] font-bold">
              11. Scope of Services
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">We only use Amazon Information to provide the services requested by sellers (e.g., generating invoices). We do not use Amazon Information for advertising, profiling, or any unrelated purposes.</Text>
          </Stack>


          

          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-2xl text-[#424242] font-bold">
                12. Changes to This Privacy Policy
              </Title>
            </Group>
            <Text className="text-lg text-[#636363]">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.</Text>
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

        {/* FAQ Section */}
        <Space h={64} />
      </Container>
    </GuestLayout>
  );
}