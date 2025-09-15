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

            <Title className="text-5xl text-[#424242] pb-12 font-bold">
              <strong>Privacy Policy</strong>
            </Title>
          </Group>
          <Text className="w-full text-center text-m text-[#636363] font-semibold">Effective Date: 01-Aug-2025</Text>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
          <Text className="text-lg text-[#424242]" style={{ lineHeight: '2' }}>
            <strong>RunAnalytic Technology</strong> ("we," "our," "us") respects your privacy and is committed to protecting the information you share with us. This Privacy Policy describes how we collect, use, store, and protect data, including Personally Identifiable Information (PII), obtained from Amazon's Selling Partner API (SP-API) and other sources.
          </Text>

          <Text className="pt-4 text-md text-[#636363]">If you have any questions about this Privacy Policy, please contact us.</Text>

        </Stack>

        {/* Main Content */}
        <Stack gap={48}>
          {/* Information Collection */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                1. Information We Collect
              </Title>
            </Group>
            <Text className="text-md text-[#636363]">
              When authorized by you, we collect data from Amazon SP-API, including:
            </Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">

              <List.Item>Customer Names</List.Item>
              <List.Item>Shipping/Billing Addresses</List.Item>
              <List.Item>Phone Number if available</List.Item>
              <List.Item>Order details (items, quantities, prices and order number)</List.Item>
              <List.Item>VAT-related transaction information</List.Item>
            </List>


            <Title className="text-xl text-[#424242] font-semibold">1.1 Account Information</Title>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Seller Account IDs</List.Item>
              <List.Item>Company Name as per Seller account</List.Item>
              <List.Item>Contact Information</List.Item>
            </List>

            <Title className="text-xl text-[#424242] font-semibold">1.2 Technical Information</Title>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Device information</List.Item>
              <List.Item>Browser information</List.Item>
              <List.Item>Log data</List.Item>
            </List>
            <Text className="pt-4 text-md text-[#636363]">We do not collect any information beyond what is necessary to perform the agreed services.</Text>
          </Stack>

          {/* purpose of data collection */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                2. Purpose of Data Collection
              </Title>
            </Group>

            <Text className="text-md text-[#636363]">
              We collect and process this data to:
            </Text>

            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Generate UAE VAT-compliant tax invoices for VAT register sellers and commercial invoice for non VAT register sellers,  for Amazon orders.</List.Item>
              <List.Item>Deliver invoices to Amazon systems as required by UAE Federal Tax Authority regulations.</List.Item>
              <List.Item>Maintain accurate VAT records for compliance purposes.</List.Item>
            </List>
          </Stack>

          {/* Legal basis */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                3. Legal Basis
              </Title>
            </Group>

            <Text className="text-md text-[#636363]">
              Our processing is based on:
            </Text>

            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Your explicit consent when authorizing our application via Amazon SP-API.</List.Item>
              <List.Item><strong>Legal obligations</strong> under UAE VAT laws and <Anchor href="https://www.tax.gov.ae/" target="_blank" fw={600} >Federal Tax Authority (FTA)</Anchor> requirements.</List.Item>
            </List>
          </Stack>

          {/* Data Usage */}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                4. Data Retention
              </Title>
            </Group>

            <Text className="text-md text-[#636363]">
              We retain PII for no longer than 30 days after the order shipment date, unless a longer period is required by applicable law. After the retention period, data is securely deleted using industry-standard deletion methods.
            </Text>

          </Stack>


          {/* Data Protection */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                5. Data Security
              </Title>
            </Group>



            <Text className="text-md text-[#636363]">
              We apply industry best practices to protect your data, including:
            </Text>

            <Stack gap={24} >
              <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                <List.Item>Encryption in transit: TLS 1.2 or higher</List.Item>
                <List.Item>Encryption at rest: AES-256</List.Item>
                <List.Item>Role-Based Access Control (RBAC) with least-privilege principles</List.Item>
                <List.Item>Multi-Factor Authentication (MFA) for all administrative accounts</List.Item>
                <List.Item>Regular vulnerability scans and penetration testing</List.Item>
                <List.Item>Monitoring via Security Information and Event Management (SIEM) systems</List.Item>
                <List.Item>Incident response procedures including Amazon notification within 72 hours of any data breach involving Amazon Information</List.Item>
              </List>
            </Stack>
            <Title className="text-xl text-[#424242] font-semibold">5.1 Passwords and credentials management</Title>
            <Text className="text-md text-[#636363]">The company sets minimum requirements on passwords and credentials for access to systems. These requirements are:</Text>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Minimum  12 or more characters of password length</List.Item>
              <List.Item>Passwords must include, at least: one uppercase, one lowercase, one number and one special character</List.Item>
              <List.Item>1 day of minimum password age</List.Item>
              <List.Item>180 days of password expiry time</List.Item>
              <List.Item>3 failed attempts allowed with an invalid password before a temporary lock-out</List.Item>
            </List>
          </Stack>

          {/* Data Privacy & Security*/}
          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                6. Logging and Monitoring
              </Title>
            </Group>
            <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item style={{ lineHeight: '2' }}>An internal process log file is generated each day, and is manually cleared by the administrator user when the anomaly has been resolved, not earlier than 90 days after the log is recorded, in order to have a reference for a security incident.</List.Item>
              <List.Item style={{ lineHeight: '2' }}>No PII is ever logged anywhere on <strong>RunAnalytic Technology</strong>. Code changes are logged to specific
                users. API logs are stored in databases on our privately hosted cloud servers.</List.Item>
              <List.Item style={{ lineHeight: '2' }}>Unauthorized access or unexpected request rates are flagged and suspicious activity is monitored by system administrators who will instigate an investigation as detailed in the Incident Response Plan.</List.Item>


            </List>
          </Stack>

          {/* Your Rights */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                7. Your Rights
              </Title>
            </Group>
            <Text className="text-md text-[#636363]">
              You may request at any time to:
            </Text>
            <List spacing={12} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
              <List.Item>Access the data we hold about you</List.Item>
              <List.Item>Request corrections to your data</List.Item>
              <List.Item>Request deletion of your data</List.Item>
              <List.Item>Withdraw SP-API authorization</List.Item>
            </List>

          </Stack>

          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                8. Sharing of Data
              </Title>
            </Group>

            <Text className="text-md text-[#636363]">
              We do not sell, rent, or share Amazon Information with third parties.
              Access is limited to authorized employees who require it to perform their duties.
            </Text>
          </Stack>



          <Stack gap={24}>
            <Group gap={16} align="center">

              <Title className="text-3xl text-[#424242] font-bold">
                9. International Data Transfers
              </Title>
            </Group>

            <Text className="text-md text-[#636363]">
              Data is stored securely in our cloud infrastructure located in the United States. All transfers comply with applicable data protection laws.
            </Text>
          </Stack>




          {/* Governing Law*/}
          <Stack gap={24}>
            <Group gap={16}>
              <Title className="text-3xl text-[#424242] font-bold">
                10. Secure Coding Practices
              </Title>
            </Group>
            <Text className="text-md text-[#636363]" style={{ lineHeight: '2' }}>
              The developers will never save or store keys, credentials or passwords in the application code or in public repositories, and will always keep their development and production environments separated.
            </Text>
          </Stack>






          {/* Children's Privacy */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                11. Children's Privacy
              </Title>
            </Group>
            <Text className="text-md text-[#636363]">
              Our services are not intended for individuals under the age of 18.
            </Text>
          </Stack>

          {/* Policy Updates */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                12. Changes to This Privacy Policy
              </Title>
            </Group>
            <Text className="text-md text-[#636363]">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised effective date.
            </Text>
          </Stack>

          {/* Contact */}
          <Stack gap={24}>
            <Group gap={16}>

              <Title className="text-3xl text-[#424242] font-bold">
                13. Contact Us
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

        {/* FAQ Section */}
        <Space h={64} />



      </Container>
    </GuestLayout>
  );
}