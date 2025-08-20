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
import { PATH_PAGES } from "../../routes";

export default function TermsService() {
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
                            Terms of Service
                        </Title>
                    </Group>
                    <Text w="100%" ta="left" size="xl" fw={700}>Effective Date: 01-Aug-2025</Text>
                    <Text size="xl" align-item="center" maw={1200} mt={16}>
                        Welcome to <strong>RunAnalytic Technology</strong> (“we,” “our,” “us”). By accessing  our services, including our Amazon SP-API integrated invoicing application (“Service”), you agree to be bound by these Terms of Service.
                    </Text>

                    <Text w="100%" ta="left" size="l" align-item="center" fw={500} mt={10}>If you do not agree to these Terms, please do not use our Service.</Text>

                </Stack>

                {/* Main Content */}
                <Stack gap={48}>
                    {/* Eligiblity */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Eligibility
                            </Title>
                        </Group>
                        <Text size="md" >
                            You must:
                        </Text>
                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Be at least 18 years old.</List.Item>
                            <List.Item>Have an active Amazon Seller Central account.</List.Item>
                            <List.Item>Be legally authorized to use Amazon’s invoice Selling Partner API (<Anchor href="https://developer-docs.amazon.com/sp-api/docs/invoices-api" target="_blank" fw={600}>SP-API</Anchor>).</List.Item>
                        </List>
                    </Stack>

                    {/* Our Services */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Our Services
                            </Title>
                        </Group>

                        <Text size="md">
                            We provide a SaaS platform that:
                        </Text>

                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Automates <strong>UAE VAT-compliant invoice generation</strong> for Amazon orders.</List.Item>
                            <List.Item>Retrieves order and customer data (<strong>PII</strong>) from <Anchor href="https://developer-docs.amazon.com/sp-api/docs/invoices-api" fw={600} target="_blank">Amazon SP-API</Anchor>.</List.Item>
                            <List.Item>Generates and securely delivers invoices to Amazon or to customers.</List.Item>
                        </List>
                        <Text>We may enhance, update, or discontinue features of our Service at any time, with or without notice.</Text>
                    </Stack>

                    {/* User Responsibilities */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                User Responsibilities
                            </Title>
                        </Group>

                        <Text size="md">
                            When using our Service, you agree to:
                        </Text>

                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Provide accurate and lawful information.</List.Item>
                            <List.Item>Use the Service only for your authorized Amazon Seller account.</List.Item>
                            <List.Item>Comply with all applicable laws, including <Anchor href="https://tax.gov.ae/en/taxes/Vat.aspx" target="_blank" fw={600} >UAE VAT regulations</Anchor>.</List.Item>
                            <List.Item>Not misuse the Service for scraping, unauthorized automation, or violating Amazon’s policies.</List.Item>
                        </List>
                    </Stack>

                    {/* Data Privacy & Security*/}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Data Privacy & Security
                            </Title>
                        </Group>
                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>We collect and process Amazon Information only as necessary to provide the Service.</List.Item>
                            <List.Item>Data is encrypted in transit (TLS 1.2+) and at rest (AES-256).</List.Item>
                            <List.Item>PII is retained for no longer than 30 days after shipment, unless longer retention is required by law.</List.Item>
                            <List.Item>For full details, please see our <Anchor href={PATH_PAGES.privacy} fw={600}>Privacy Policy</Anchor>.</List.Item>

                        </List>
                    </Stack>

                    {/* Intellectual Property */}
                    <Stack gap={24}>
                        <Group gap={16}>
                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Intellectual Property
                            </Title>
                        </Group>
                        <Text size="md">
                            All content, code, design, and branding on our website and within our Service are the property of <strong>RunAnalytic Technology</strong>. You may not copy, modify, or redistribute our intellectual property without prior written consent.
                        </Text>
                    </Stack>

                    {/* Service Availability */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Service Availability
                            </Title>
                        </Group>
                        <Text size="md">
                            We strive to provide reliable, uninterrupted access, but we do not guarantee:
                        </Text>
                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Continuous availability of the Service.</List.Item>
                            <List.Item>That the Service will be error-free or free of vulnerabilities.</List.Item>
                        </List>
                        <Text size="md">We may suspend access temporarily for maintenance, upgrades, or security reasons.</Text>
                    </Stack>



                    {/* Limitation of Liability */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">
                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Limitation of Liability
                            </Title>
                        </Group>

                        <Text size="md">
                            To the maximum extent permitted by law, <strong>RunAnalytic Technology</strong> is not liable for:
                        </Text>
                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Any indirect, incidental, or consequential damages.</List.Item>
                            <List.Item>Loss of data, profits, or business opportunities resulting from Service use.</List.Item>
                            <List.Item>Issues caused by Amazon SP-API downtime, errors, or policy changes.</List.Item>
                        </List>
                    </Stack>

                    {/* Termination*/}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Termination
                            </Title>
                        </Group>
                        <Text size="md">
                            We may suspend or terminate your access to the Service if you:
                        </Text>
                        <List size="md" spacing={12} withPadding listStyleType="disc">
                            <List.Item>Breach these Terms.</List.Item>
                            <List.Item>Misuse Amazon SP-API or violate Amazon’s Developer Agreement.</List.Item>
                            <List.Item>Engage in fraudulent, abusive, or unlawful activity.</List.Item>
                        </List>
                        <Text>You may stop using the Service at any time by revoking SP-API authorization in Amazon Seller Central.</Text>

                    </Stack>

                    {/* Governing Law*/}
                    <Stack gap={24}>
                        <Group gap={16}>
                            <Title order={2} c={headingColor} style={{ color: 'black', fontWeight: 600 }}>
                                Governing Law
                            </Title>
                        </Group>
                        <Text size="md">
                            These Terms are governed by the laws of the United Arab Emirates. Any disputes will be resolved in the courts of the UAE.
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