import { Accordion, Box, BoxProps, Title, List } from "@mantine/core";

import classes from "./Faqs.module.scss";

const placeholder = (
  <span className="text-base">
    RunAnalytic is a cloud-based SaaS platform that connects with Amazon Seller accounts to automatically generate tax-compliant invoices and deliver them to customers via the Amazon API.
  </span>
);

const placeholder1 = (
  <span className="text-base">
    Amazon sellers in the UAE (and other supported regions) who are required to provide invoices for every order will benefit from RunAnalytic’s automation and compliance features.
  </span>
);
const placeholder2 = (
  <span className="text-base">
    Yes, we follow Amazon’s Selling Partner API (SP-API) guidelines and data protection policies strictly, including encryption, access controls, and minimal data retention.
  </span>
);
const placeholder3 = (
  <span className="text-base">
    We only access the information required to create invoices: order ID, customer name, shipping address, and tax details. No other customer data is collected or used. This data is retrieved via Amazon’s SP-API only, not stored permanently, and auto-deleted after use.
  </span>
);
const placeholder4 = (
  <span className="text-base">
   No. We do not permanently store Amazon customer data (PII). All retrieved data is automatically deleted within 30 days. Logs only capture technical metadata (timestamps, error codes, request IDs) and never contain Amazon customer data (PII).

  </span>
);
const placeholder5 = (
  <span className="text-base">
    No. We do not permanently store Amazon customer data (PII). All retrieved data is automatically deleted within 30 days. Logs only capture technical metadata (timestamps, error codes, request IDs) and never contain Amazon customer data (PII).

  </span>
);
const placeholder6 = (
  <span className="text-base">
   Currently, RunAnalytic supports Amazon UAE(amazon.ae) sellers through SP-API integration. We plan to add integration with other Amazon marketplaces in the future.
  </span>
);
const placeholder7 = (
  <span className="text-base">
    You can reach our support team via email within standard support hours at {" "}
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@runanalytic.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-blue-600"
    >
      support@runanalytic.com
    </a>
    .  We provide assistance for setup, troubleshooting, and compliance-related questions. Additional resources, including documentation and FAQs, are also available on our website.

  </span>
);

const placeholder9 = (
  <span className="text-base">
    Yes! We offer a limited-time free trial so you can explore all features of our platform before making a commitment. This allows Amazon sellers to test our invoice automation, compliance features, and SP-API integration with no upfront cost. Even during free trials, all Amazon SP-API data handling follows <a href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="hover:underline text-blue-600">Amazon’s Data Protection Policy</a>.
  </span>
);

const placeholder8 = (
  <span className="text-base">
    RunAnalytic is a secure, cloud-based SaaS platform that connects with Amazon Seller accounts through the Selling Partner API (SP-API) to generate and upload tax-compliant invoices directly to Amazon. We access only the minimum order data required, never use customer information for any other purpose, encrypt all data in transit and at rest, and automatically delete Amazon customer data (PII) within 30 days in accordance with{' '}
    <a
      href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-blue-600"
    >
      Amazon’s Data Protection Policy
    </a>
    .
  </span>
);

const placeholder10 = (
  <span className="text-base">
    RunAnalytic helps Amazon sellers in the UAE and other supported regions automatically generate and upload tax-compliant invoices for every order, ensuring full compliance with Amazon’s invoicing requirements.
  </span>
);

const placeholder11 = (<span className="text-base">
  <span className="block leading-relaxed py-3"> Yes. RunAnalytic strictly follows Amazon’s SP-API guidelines and Data Protection Policy. Our compliance measures include:</span>
  <List spacing={12} withPadding listStyleType="disc" className=" font-weight-500 ">
    <List.Item><span className="underline font-semibold">Encryption:</span> All Amazon customer data (PII) is encrypted in transit (TLS 1.2/1.3) and at rest (AES-256).</List.Item>
    <List.Item><span className="underline font-semibold">Access Controls:</span> Data access is restricted to authorized automated processes. Administrative accounts are protected by strong password policies and Multi-Factor Authentication (MFA).</List.Item>
    <List.Item><span className="underline font-semibold">Minimal Data Retention:</span> We only use Amazon customer data (PII) for invoice generation. All Amazon customer data (PII) is automatically deleted within 30 days, in accordance with Amazon’s Data Protection Policy.</List.Item>
    <List.Item><span className="underline font-semibold">Logging Practices:</span> Amazon customer data (PII) is never stored in application logs. Logs contain only non-sensitive technical metadata.</List.Item>
    <List.Item><span className="underline font-semibold">Purpose Limitation:</span> Data retrieved via SP-API is used exclusively to generate and upload tax-compliant invoices.</List.Item>
  </List>
</span>)

const placeholder12 = (
  <span className="text-base">
    Amazon customer data (PII) is processed automatically by our systems. RunAnalytic staff do not have direct access to Amazon customer data (PII), except if strictly required for troubleshooting under a confidentiality agreement. Administrative access is protected by strong passwords and Multi-Factor Authentication (MFA).
  </span>
);

const placeholder13 = (<span className="text-base">
  <List spacing={12} withPadding listStyleType="disc" className="text-md  font-weight-500 pt-3 ">
    <List.Item>Passwords must be at least 12 characters long with uppercase, lowercase, numbers, and special characters.</List.Item>
    <List.Item>3 failed attempts allowed before a temporary lock-out.</List.Item>
    <List.Item>1 day of minimum password age.</List.Item>
    <List.Item>180 days of password expiry time.</List.Item>
    <List.Item>Multi-Factor Authentication (MFA) is enforced for all administrative accounts.</List.Item>
  </List>
</span>);

const placeholder14 = (
  <span className="text-base">
    In the unlikely event of a data breach affecting Amazon customer data (PII), we will immediately secure affected systems, notify amazon security team via email (security@amazon.com) and impacted parties within 24 hours, and carry out a full investigation in line with industry best practices and legal requirements.
  </span>
);

const placeholder15 = (<span className="leading-relaxed text-base">
  <List spacing={12} withPadding listStyleType="disc" className="text-md  font-weight-500 pt-3">
    <List.Item>Amazon’s SP-API <span className="hover:underline text-blue-600">
      <a href="https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN" target="_blank">Acceptable Use Policy</a>
      </span>.</List.Item>
      <List.Item>Amazon’s <a href="https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN" target="_blank" className="hover:underline text-blue-600">
        Amazon’s Data Protection Policy</a> (DPP).</List.Item>
      <List.Item><a href="https://developer-docs.amazon.com/sp-api/docs/policies-and-agreements?utm_source=chatgpt.com" target="_blank" className="hover:underline text-blue-600">Amazon Services API Developer Agreement</a> for UAE region</List.Item>
      <List.Item>International best practices such as NIST/ISO27001 security standards.</List.Item>
  </List>
  
</span>);




type FaqsProps = BoxProps;

const Faqs = ({ ...others }: FaqsProps) => {
  return (
    <Box {...others}>
      <Title
        order={3}
        my='md'
        ta='center'
      >
        Frequently Asked Questions
      </Title>

      <Accordion
        radius='md'
        classNames={{
          root: classes.root,
          item: classes.item,
          panel: classes.panel,
          chevron: classes.chevron,
        }}
      >
        {/* <Accordion.Item value='reset-password'>
          <Accordion.Control>What is RunAnalytic?</Accordion.Control>
          <Accordion.Panel>{placeholder}</Accordion.Panel>
        </Accordion.Item> */}

        <Accordion.Item value='policies'>
          <Accordion.Control>What does RunAnalytic do and how does it comply with Amazon’s SP-API policies?</Accordion.Control>
          <Accordion.Panel>{placeholder8}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='benefit'>
          <Accordion.Control>Who can benefit from using RunAnalytic?</Accordion.Control>
          <Accordion.Panel>{placeholder10}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='data-protection'>
          <Accordion.Control>Does RunAnalytic comply with Amazon’s SP-API guidelines and data protection policies?</Accordion.Control>
          <Accordion.Panel>{placeholder11}</Accordion.Panel>
        </Accordion.Item>



        {/* <Accordion.Item value='another-account'>
          <Accordion.Control>
            Who should use RunAnalytic?
          </Accordion.Control>
          <Accordion.Panel>{placeholder1}</Accordion.Panel>
        </Accordion.Item> */}

        {/* <Accordion.Item value='newsletter'>
          <Accordion.Control>
            Is RunAnalytic approved by Amazon?
          </Accordion.Control>
          <Accordion.Panel>{placeholder2}</Accordion.Panel>
        </Accordion.Item> */}

        <Accordion.Item value='credit-card'>
          <Accordion.Control>
            What Amazon customer data (PII) does RunAnalytic access?
          </Accordion.Control>
          <Accordion.Panel>{placeholder3}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='data'>
          <Accordion.Control>
          How does RunAnalytic protect Amazon customer data (PII)?
          </Accordion.Control>
          <Accordion.Panel>{placeholder4}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='PII'>
          <Accordion.Control>
          Does RunAnalytic store or log Amazon customer data (PII)?
          </Accordion.Control>
          <Accordion.Panel>{placeholder5}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='marketplaces'>
          <Accordion.Control>
          Which Amazon marketplaces does RunAnalytic currently support?
          </Accordion.Control>
          <Accordion.Panel>{placeholder6}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='data-access'>
          <Accordion.Control>
          Who can access Amazon customer data (PII) within RunAnalytic?
          </Accordion.Control>
          <Accordion.Panel>{placeholder12}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='rules'>
          <Accordion.Control>
          What password and authentication rules do you enforce?
          </Accordion.Control>
          <Accordion.Panel>{placeholder13}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='data-breach'>
          <Accordion.Control>
          What happens if there is a data breach?
          </Accordion.Control>
          <Accordion.Panel>{placeholder14}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='comply'>
          <Accordion.Control>
          Which Amazon policies do you comply with?
          </Accordion.Control>
          <Accordion.Panel>{placeholder15}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='support'>
          <Accordion.Control>
            How do I get support?
          </Accordion.Control>
          <Accordion.Panel>{placeholder7}</Accordion.Panel>
        </Accordion.Item>



        <Accordion.Item value='trials'>
          <Accordion.Control>
          Does RunAnalytic offer a free trial?
          </Accordion.Control>
          <Accordion.Panel>{placeholder9}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default Faqs;
