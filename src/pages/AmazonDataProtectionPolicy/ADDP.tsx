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
import { Link } from "react-router-dom";
import { PATH_PAGES } from "../../routes/index";

export default function ADDP() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const headingColor = isDark ? theme.white : theme.black;
    return (
        <GuestLayout>
            <Container size="lg" py={48}>
                {/* Hero Section */}
                <Stack align="center" mb={30} gap={8}>
                    <Group gap={16}>

                        <Title className="text-3xl text-[#424242] pb-12 font-bold">
                            <strong>Amazon Data Protection Policy – RunAnalytic</strong>
                        </Title>
                    </Group>
                    <Text className="w-full flex justify-start text-center text-m text-[#636363] font-semibold">Last Updated: 10-Sep-2025</Text>
                    <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>

                    <Text className=" text-base text-[#424242]">This Policy is intended for Amazon, our partners, and customers to understand how RunAnalytic securely manages Amazon Information in line with Amazon’s requirements.
                    </Text>

                    <Text className="text-lg text-[#424242]" style={{ lineHeight: '1.8' }}>
                        At RunAnalytic Technology, we take the protection of Amazon Information very seriously. This Amazon Data Protection Policy describes how we handle data accessed, processed, and transmitted through Amazon’s Selling Partner API (SP-API). It is designed to demonstrate compliance with:
                    </Text>
                    
                </Stack>

                <List spacing={10} withPadding listStyleType="disc" className="text-base text-[#636363] font-weight-500 mb-6">

                        <List.Item>Amazon’s <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" >Data Protection Policy (DPP)</Anchor>
                        </List.Item>
                        <List.Item>Amazon’s <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN" target="_blank" >Acceptable Use Policy (AUP)
                        </Anchor>
                        </List.Item>
                        <List.Item>The <Anchor href="https://developer-docs.amazon.com/sp-api/docs/welcome?ld=ASXXSPAPIDirect&pageName=US%3ASPDS%3ASPAPI-home" target="_blank" > Amazon Services API Developer Agreement
                        </Anchor>
                        </List.Item>
                    </List>
                    <Text className="text-base text-[#424242] m-6">For broader information about how we handle data and user privacy, please see our <Anchor component={Link} to={PATH_PAGES.privacy}>Privacy Policy</Anchor>.</Text>


                {/* Main Content */}


                <Stack gap={48}>
                    {/* Scope */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                1. Scope
                            </Title>
                        </Group>
                        <Text className="text-base text-[#636363] leading-relaxed">
                        This Policy applies specifically to Amazon Information (including order data and customer Personally Identifiable Information, “PII”) retrieved via SP-API. The data is used exclusively for generating and uploading tax-compliant invoices and is never repurposed for marketing, profiling, or resale.

                        </Text>
                    </Stack>

                    {/*  Security & Access*/}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                2.  Security & Access
                            </Title>
                        </Group>

                        <List spacing={10} withPadding listStyleType="disc" className=" text-[#636363] font-weight-500 text-base">
                            <List.Item>Access is strictly limited to authorized automated systems.</List.Item>
                            <List.Item>Any exceptional human access (e.g., troubleshooting) requires approval, a confidentiality agreement, and audit logging.</List.Item>
                            <List.Item>Administrative access is protected with role-based access controls (RBAC) and Multi-Factor Authentication (MFA).</List.Item>
                        </List>
                    </Stack>

                    {/* Data Protection Practices */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                3. Data Protection Practices
                            </Title>
                        </Group>

                        <List spacing={10} withPadding listStyleType="disc" className="text-base text-[#636363] font-weight-500">
                            <List.Item><span className="font-semibold">Encryption</span>: Data is encrypted in transit (TLS 1.2/1.3) and at rest (AES-256).</List.Item>
                            <List.Item><span className="font-semibold">Retention</span>: Amazon customer data is deleted within <strong>30 days</strong>; backups are securely deleted within <strong>90 days</strong>.</List.Item>
                            <List.Item><span className="font-semibold">Logging</span>: PII is never stored in logs. Only non-sensitive technical metadata (timestamps, request IDs, error codes) is retained for troubleshooting.</List.Item>
                            <List.Item>For broader information about how RunAnalytic protects personal data beyond Amazon Information, see our <Anchor component={Link} to={PATH_PAGES.privacy}>Privacy Policy</Anchor>.</List.Item>
                            
                        </List>
                    </Stack>

                    {/* Incident Response Plan */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                4.  Incident Response Plan
                            </Title>
                        </Group>

                        <Text className="text-base text-[#636363] leading-relaxed">
                        In the event of unauthorized access, system compromise, or data leakage involving Amazon Information, RunAnalytic will notify Amazon Security (<strong>3p-security@amazon.com</strong> and <strong>security@amazon.com</strong>) within 24 hours, immediately secure affected systems, and follow our documented incident response runbook aligned with <strong>NIST SP 800-61</strong> and <strong>NIST SP 800-88</strong>. If required by applicable law, we will notify supervisory authorities within 72 hours and inform affected individuals without undue delay. Every incident is fully documented with root cause, corrective actions, and preventive measures, and Amazon may request access to logs or documentation at any time, which we will provide promptly. RunAnalytic staff will never speak on behalf of Amazon to authorities or customers unless explicitly authorized in writing by Amazon.

                        </Text>
                    </Stack>


                    {/* Compliance & Audits */}
                    <Stack gap={24}>
                        <Group gap={16} align="center">

                            <Title className="text-2xl text-[#424242] font-bold">
                                5. Compliance & Audits
                            </Title>
                        </Group>
                        <List spacing={10} withPadding listStyleType="disc" className="text-base text-[#636363] font-weight-500">
                            <List.Item >RunAnalytic complies with <Anchor href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank">Amazon’s DPP, AUP</Anchor>, and <Anchor href="https://developer-docs.amazon.com/sp-api/docs/welcome?ld=ASXXSPAPIDirect&pageName=US%3ASPDS%3ASPAPI-home" target="_blank">Developer Agreement</Anchor>.
                            </List.Item>
                            <List.Item >We cooperate fully with Amazon audits and provide relevant logs or documentation when requested.
                            </List.Item>
                            <List.Item >Our staff with potential access to Amazon Information undergo annual security and data protection training.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Secure Development & Asset Management */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                6. Secure Development & Asset Management
                            </Title>
                        </Group>
                        <List spacing={12} withPadding listStyleType="disc" className="text-base text-[#636363] font-weight-500">
                            <List.Item>No credentials or API keys are hard-coded in source code.
                            </List.Item>
                            <List.Item>Secrets are managed securely and rotated regularly.</List.Item>
                            <List.Item>Physical and digital assets handling Amazon Information are tracked and secured under strict internal policies</List.Item>
                        </List>

                    </Stack>

                    {/* Contact */}
                    <Stack gap={24}>
                        <Group gap={16}>

                            <Title className="text-2xl text-[#424242] font-bold">
                                11. Contact & Request
                            </Title>
                        </Group>
                        <Text className="text-base text-[#636363]">
                        All compliance-related inquiries (including deletion requests and audit support) are acknowledged within 24 hours and resolved promptly.
                        </Text>
                        <List spacing={10} withPadding listStyleType="disc" className="text-md text-[#636363] font-weight-500">
                            <List.Item>
                                Email: <Anchor href="mailto:support@runanalytic.com" >support@runanalytic.com</Anchor>
                            </List.Item>
                            <List.Item>
                                Webiste: <Anchor href="https://www.runanalytic.com/">www.runanalytic.com</Anchor>
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