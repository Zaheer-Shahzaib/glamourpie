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

                        <Title className="text-3xl text-[#424242] pb-12 font-bold" >
                            <strong>Terms of Service – RunAnalytic</strong>
                        </Title>
                    </Group>
                    <Text className="w-full text-start text-m text-[#636363] font-semibold">Effective Date: 10-Sep-2025</Text>
                    <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
                    <Text className="text-lg text-[#424242]" style={{ lineHeight: '2' }}>
                        Welcome to <strong>RunAnalytic Technology</strong>. By accessing  our services, including our Amazon SP-API integrated invoicing application (“Service”), you agree to be bound by these Terms of Service.
                        If you do not agree to these Terms, please do not use our Service.

                    </Text>

                    <Text className="pt-4 text-md text-[#636363]">If you do not agree to these Terms, please do not use our Service.</Text>

                </Stack>

                {/* Main Content */}
                <Stack gap={48}>
                    {/* Eligiblity */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                1. Eligibility
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                            You must:
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Be at least 18 years old.</List.Item>
                            <List.Item>Have an active Amazon Seller Central account.</List.Item>
                            <List.Item>Be legally authorized to use  <Anchor href="https://developer-docs.amazon.com/sp-api/docs/invoices-api" target="_blank" >Amazon’s invoice Selling Partner API (SP-API)</Anchor>.</List.Item>
                        </List>
                    </Stack>

                    {/* Our Services */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                2. Our Services
                            </Title>
                        </Group>

                        <Text className="text-md text-[#636363]">
                            We provide a SaaS platform that:
                        </Text>

                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Automates <strong>UAE VAT-compliant invoice generation</strong> for Amazon orders.</List.Item>
                            <List.Item>Retrieves minimum Amazon customer data  to generate tax-compliant invoices</List.Item>
                            <List.Item>Generates and securely delivers invoices to Amazon or to customers.</List.Item>
                        </List>
                        <Text className="text-md text-[#636363]">We may enhance, update, or discontinue features of our Service at any time, with or without notice.</Text>
                    </Stack>

                    {/* User Responsibilities */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                3. User Responsibilities
                            </Title>
                        </Group>

                        <Text className="text-md text-[#636363]">
                            When using our Service, you agree to:
                        </Text>

                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Provide accurate and lawful information.</List.Item>
                            <List.Item>Use the Service only for your authorized Amazon Seller account.</List.Item>
                            <List.Item>Comply with all applicable laws, including <Anchor href="https://tax.gov.ae/en/taxes/Vat.aspx" target="_blank" >UAE VAT regulations</Anchor>.</List.Item>
                            <List.Item>Not misuse the Service for scraping, unauthorized automation, or violating Amazon’s policies.</List.Item>
                        </List>
                    </Stack>

                    {/* Data Privacy & Security*/}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                4. Data Privacy & Security
                            </Title>

                            <Text className="text-md text-[#636363]">
                            We protect all PII using industry best practices:
                        </Text>
                        </Group>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>In transit: Data is encrypted using TLS 1.2 or higher.</List.Item>
                            <List.Item>At rest: Data is encrypted using AES-256 encryption.</List.Item>
                            <List.Item>Hosting: Data is stored on secure [AWS/Cloud Provider] servers in [Region, USA].
                            </List.Item>
                            <List.Item>Firewalls, intrusion detection, and access controls are in place to protect against unauthorized access.</List.Item>
                            <List.Item>Regular vulnerability scans and penetration testing
                            </List.Item>
                            <List.Item>Monitoring via Security Information and Event Management (SIEM) systems
                            </List.Item>
                            <List.Item>Incident response procedures including Amazon notification within 72 hours of any data breach involving Amazon Information</List.Item>
                            <List.Item>For full details, please see our <Anchor href={PATH_PAGES.privacy} >Privacy Policy</Anchor>.</List.Item>

                        </List>
                    </Stack>

                    {/* Intellectual Property */}
                    <Stack gap={24}>
                        <Group gap={16}>
                            <Title className="text-2xl text-[#424242] font-bold">
                                5. Intellectual Property
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                        All content, code, design, and branding on our website and within our Service are the property of <strong>RunAnalytic Technology</strong>. You may not copy, modify, or redistribute our intellectual property without prior written consent.

                        </Text>
                    </Stack>

                    {/* Service Availability */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                6. Service Availability
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                            We strive to provide reliable, uninterrupted access, but we do not guarantee:
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Continuous availability of the Service.</List.Item>
                            <List.Item>That the Service will be error-free or free of vulnerabilities.</List.Item>
                        </List>
                        <Text className="text-md text-[#636363]">We may suspend access temporarily for maintenance, upgrades, or security reasons.</Text>
                    </Stack>



                    {/* Limitation of Liability */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">
                            <Title className="text-2xl text-[#424242] font-bold">
                                7. Limitation of Liability
                            </Title>
                        </Group>

                        <Text className="text-md text-[#636363]">
                            To the maximum extent permitted by law, <strong>RunAnalytic Technology</strong> is not liable for:
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Any indirect, incidental, or consequential damages.</List.Item>
                            <List.Item>Loss of data, profits, or business opportunities resulting from Service use.</List.Item>
                            <List.Item>Issues caused by Amazon SP-API downtime, errors, or policy changes.</List.Item>
                        </List>
                    </Stack>

                    {/* Termination*/}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                8. Termination
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                            We may suspend or terminate your access to the Service if you:
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>Breach these Terms.</List.Item>
                            <List.Item>Misuse Amazon SP-API or violate Amazon’s Developer Agreement.</List.Item>
                            <List.Item>Engage in fraudulent, abusive, or unlawful activity.</List.Item>
                        </List>
                        <Text className="text-md text-[#636363]">You may stop using the Service at any time by revoking SP-API authorization in Amazon Seller Central.</Text>

                    </Stack>



                    {/* Governing Law*/}
                    <Stack gap={24}>
                        <Group gap={16}>
                            <Title className="text-2xl text-[#424242] font-bold">
                                9. Governing Law
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                            These Terms are governed by the laws of the United Arab Emirates. Any disputes will be resolved in the courts of the UAE.
                        </Text>
                    </Stack>

                    {/* Contact */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                10. Contact Us
                            </Title>
                        </Group>
                        <Text className="text-md text-[#636363]">
                            If you have any questions, please contact:
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>
                                Email: <Anchor href="mailto:support@runanalytic.com" >support@runanalytic.com</Anchor>
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