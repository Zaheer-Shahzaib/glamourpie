import LegalPage, { LegalSection } from "../../Components/LegalPage/LegalPage";

const AMAZON_AUP =
  "https://sellercentral.amazon.es/mws/static/policy?documentType=AUP&locale=en_EN";
const AMAZON_DPP =
  "https://sellercentral.amazon.es/mws/static/policy?documentType=DPP&locale=en_EN";

const SECTIONS: LegalSection[] = [
  {
    id: "information-we-collect",
    navLabel: "Information we collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          We only access and process the minimum Amazon customer data required
          to generate tax-compliant invoices. This may include:
        </p>
        <ul>
          <li>Customer Names</li>
          <li>Shipping/Billing Addresses</li>
          <li>Order ID</li>
          <li>Tax details (e.g., VAT)</li>
        </ul>
        <p>
          We do not collect or process any information not required for invoice
          generation. We never use Amazon customer data for marketing, resale,
          or unrelated purposes.
        </p>
      </>
    ),
  },
  {
    id: "data-storage-and-retention",
    navLabel: "Storage & retention",
    title: "2. Data Storage and Retention",
    content: (
      <ul>
        <li>Amazon customer PII is used in real time to generate invoices</li>
        <li>We do not permanently store customer PII.</li>
        <li>
          All retrieved data is automatically deleted within 30 days, in
          compliance with{" "}
          <a href={AMAZON_DPP} target="_blank" rel="noopener noreferrer">
            Amazon’s Data Protection Policy.
          </a>
        </li>
        <li>
          Customers may request earlier deletion of their data by contacting us
          at{" "}
          <a
            href="mailto:support@runanalytic.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            support@runanalytic.com
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: "backups-and-deletion",
    navLabel: "Backups & deletion",
    title: "3. Backups & Deletion",
    content: (
      <p>
        All active PII is deleted within 30 days. Any residual data in backups
        is securely deleted within 90 days.
      </p>
    ),
  },
  {
    id: "data-security-and-encryption",
    navLabel: "Security & encryption",
    title: "4. Data Security & Encryption",
    content: (
      <>
        <p>We protect all PII using industry best practices:</p>
        <ul>
          <li>In transit: Data is encrypted using TLS 1.2 or higher.</li>
          <li>At rest: Data is encrypted using AES-256 encryption.</li>
          <li>
            Hosting: Data is securely processed and stored on Namecheap servers
            in the USA, which are contractually required to follow Amazon’s
            Data Protection Policy and maintain equivalent security standards.
          </li>
          <li>
            Firewalls, intrusion detection, and access controls are in place to
            protect against unauthorized access.
          </li>
          <li>Regular vulnerability scans and penetration testing</li>
          <li>
            Monitoring via Security Information and Event Management (SIEM)
            systems
          </li>
          <li>
            Incident response procedures including Amazon notification within
            24 hours of any data breach involving Amazon Information
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "logging-and-monitoring",
    navLabel: "Logging & monitoring",
    title: "5. Logging and Monitoring",
    content: (
      <>
        <p>
          We strictly follow Amazon’s{" "}
          <a href={AMAZON_AUP} target="_blank" rel="noopener noreferrer">
            Acceptable Use Policy (AUP)
          </a>{" "}
          and{" "}
          <a href={AMAZON_DPP} target="_blank" rel="noopener noreferrer">
            Data Protection Policies (DDP)
          </a>
          :
        </p>
        <ul>
          <li>No Amazon customer PII is ever stored in logs.</li>
          <li>
            Logs are limited to technical metadata only (e.g., timestamps,
            request IDs, error codes).
          </li>
          <li>
            Any sensitive data (names, addresses, phone numbers) is
            automatically masked or excluded from logs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "access-controls",
    navLabel: "Access controls",
    title: "6. Access Controls",
    content: (
      <ul>
        <li>PII is only accessible by authorized automated systems.</li>
        <li>
          RunAnalytic staff do not have direct access to Amazon customer PII
          unless explicitly required for troubleshooting under a
          confidentiality agreement.
        </li>
        <li>
          All employees with access to Amazon Information are under strict
          confidentiality obligations.
        </li>
        <li>
          All administrative access requires Multi-Factor Authentication (MFA).
        </li>
        <li>Role-based access control (RBAC) with least-privilege principles.</li>
      </ul>
    ),
  },
  {
    id: "password-and-authentication",
    navLabel: "Password & authentication",
    title: "7. Password and Authentication Policy",
    content: (
      <ul>
        <li>
          User passwords must be at least 12 characters long and include
          uppercase, lowercase, numbers, and special characters.
        </li>
        <li>
          3 failed attempts allowed with an invalid password before a temporary
          lock-out.
        </li>
        <li>1 day of minimum password age</li>
        <li>90 days of password expiry time</li>
        <li>MFA is enforced for all administrative accounts.</li>
      </ul>
    ),
  },
  {
    id: "incident-response",
    navLabel: "Incident response",
    title: "8. Incident Response",
    content: (
      <>
        <p>In the event of a data breach involving Amazon customer PII:</p>
        <ul>
          <li>
            We will notify Amazon and affected parties within 24 hours via
            email to 3p-security@amazon.com and security@amazon.com
          </li>
          <li>
            Affected accounts will be secured immediately, and a full
            investigation will be conducted.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "compliance",
    navLabel: "Compliance",
    title: "9. Compliance",
    content: (
      <ul>
        <li>
          We comply with Amazon’s{" "}
          <a href={AMAZON_AUP} target="_blank" rel="noopener noreferrer">
            Acceptable Use Policy
          </a>{" "}
          and{" "}
          <a href={AMAZON_DPP} target="_blank" rel="noopener noreferrer">
            Data Protection Policy
          </a>
          .
        </li>
        <li>
          We follow international best practices (NIST/ISO27001 guidelines) for
          data protection and security.
        </li>
      </ul>
    ),
  },
  {
    id: "training-and-awareness",
    navLabel: "Training & awareness",
    title: "10. Training & Awareness",
    content: (
      <p>
        All employees with potential access to Amazon Information receive annual
        security and data protection training.
      </p>
    ),
  },
  {
    id: "scope-of-services",
    navLabel: "Scope of services",
    title: "11. Scope of Services",
    content: (
      <p>
        We only use Amazon Information to provide the services requested by
        sellers (e.g., generating invoices). We do not use Amazon Information
        for advertising, profiling, or any unrelated purposes.
      </p>
    ),
  },
  {
    id: "changes-to-this-policy",
    navLabel: "Changes to this policy",
    title: "12. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with a revised effective date.
      </p>
    ),
  },
  {
    id: "contact",
    navLabel: "Contact",
    title: "13. Contact Us",
    content: (
      <>
        <p>
          If you have questions about this policy or would like to exercise your
          rights regarding PII, please contact us:
        </p>
        <ul>
          <li>
            Email: <a href="mailto:support@runanalytic.com">support@runanalytic.com</a>
          </li>
          <li>
            Webiste:{" "}
            <a
              href="https://www.runanalytic.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.runanalytic.com
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy — RunAnalytic"
      dateLabel="Last updated: 10-Sep-2025"
      intro={
        <p>
          At RunAnalytic, we take your privacy and data protection seriously.
          This policy explains how we handle Personally Identifiable Information
          (PII) accessed through the{" "}
          <a
            href="https://developer-docs.amazon.com/sp-api/docs/welcome?ld=ASXXSPAPIDirect&pageName=US%3ASPDS%3ASPAPI-home"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon Selling Partner API (SP-API)
          </a>{" "}
          and other related services.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
