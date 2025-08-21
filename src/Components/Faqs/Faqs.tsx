import { Accordion, Box, BoxProps, Title } from "@mantine/core";

import classes from "./Faqs.module.scss";

const placeholder =
  "RunAnalytic is a cloud-based SaaS platform that connects with Amazon Seller accounts to automatically generate tax-compliant invoices and deliver them to customers via the Amazon API.";
  const placeholder1 =
  "Amazon sellers in the UAE (and other supported regions) who are required to provide invoices for every order will benefit from RunAnalytic’s automation and compliance features.";
  const placeholder2 =
  "Yes, we follow Amazon’s Selling Partner API (SP-API) guidelines and data protection policies strictly, including encryption, access controls, and minimal data retention.";
  const placeholder3 =
  "We access only the data required to generate invoices, including order ID, buyer name, shipping address, and order details, in compliance with Amazon’s PII handling policies.";
  const placeholder4 =
  "Yes. All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). We use AWS for secure cloud hosting and apply strict role-based access control (RBAC) and multi-factor authentication (MFA).";
  const placeholder5 =
  "PII is retained for no longer than 30 days after order shipment unless a longer period is required by law.";
  const placeholder6 =
  "Currently, RunAnalytic is optimized for Amazon UAE and MENA region sellers. We plan to expand to more marketplaces in the future.";
  const placeholder7 = (
    <span>
      You can contact our support team at{" "}
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=support@runanalytic.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        support@runanalytic.com
      </a>
      . We typically respond within 24 hours.
    </span>
  );
  
  const placeholder9 =
  "Yes! We offer a limited-time free trial so you can experience the full features of our platform before committing.";

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
        <Accordion.Item value='reset-password'>
          <Accordion.Control>What is RunAnalytic?</Accordion.Control>
          <Accordion.Panel>{placeholder}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='another-account'>
          <Accordion.Control>
          Who should use RunAnalytic?
          </Accordion.Control>
          <Accordion.Panel>{placeholder1}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='newsletter'>
          <Accordion.Control>
          Is RunAnalytic approved by Amazon?
          </Accordion.Control>
          <Accordion.Panel>{placeholder2}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='credit-card'>
          <Accordion.Control>
          What kind of data does RunAnalytic access?
          </Accordion.Control>
          <Accordion.Panel>{placeholder3}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='data'>
          <Accordion.Control>
          Is my data secure?
          </Accordion.Control>
          <Accordion.Panel>{placeholder4}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='PII'>
          <Accordion.Control>
          How long is Personally Identifiable Information (PII) stored?
          </Accordion.Control>
          <Accordion.Panel>{placeholder5}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='marketplaces'>
          <Accordion.Control>
          Can I use RunAnalytic for other marketplaces?
          </Accordion.Control>
          <Accordion.Panel>{placeholder6}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='support'>
          <Accordion.Control>
          How do I get support?
          </Accordion.Control>
          <Accordion.Panel>{placeholder7}</Accordion.Panel>
        </Accordion.Item>

        

        <Accordion.Item value='trials'>
          <Accordion.Control>
          Is there a free trial?
          </Accordion.Control>
          <Accordion.Panel>{placeholder9}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default Faqs;
