import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "../../Components/LegalPage/LegalPage";
import { PATH_PAGES } from "../../routes";

const SECTIONS: LegalSection[] = [
  {
    id: "eligibility",
    navLabel: "Eligibility",
    title: "1. Eligibility",
    content: (
      <>
        <p>You must:</p>
        <ul>
          <li>Be at least 18 years old.</li>
          <li>Have an active Amazon Seller Central account.</li>
          <li>
            Be legally authorized to use{" "}
            <a
              href="https://developer-docs.amazon.com/sp-api/docs/invoices-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon’s invoice Selling Partner API (SP-API)
            </a>
            .
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "our-services",
    navLabel: "Our services",
    title: "2. Our Services",
    content: (
      <>
        <p>We provide a SaaS platform that:</p>
        <ul>
          <li>
            Automates UAE VAT-compliant invoice generation for Amazon orders.
          </li>
          <li>
            Retrieves minimum Amazon customer data to generate tax-compliant
            invoices.
          </li>
          <li>
            Generates and securely delivers invoices to Amazon or to customers.
          </li>
        </ul>
        <p>
          We may enhance, update, or discontinue features of our Service at any
          time, with or without notice.
        </p>
      </>
    ),
  },
  {
    id: "user-responsibilities",
    navLabel: "User responsibilities",
    title: "3. User Responsibilities",
    content: (
      <>
        <p>When using our Service, you agree to:</p>
        <ul>
          <li>Provide accurate and lawful information.</li>
          <li>Use the Service only for your authorized Amazon Seller account.</li>
          <li>
            Comply with all applicable laws, including{" "}
            <a
              href="https://tax.gov.ae/en/taxes/Vat.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              UAE VAT regulations
            </a>
            .
          </li>
          <li>
            Not misuse the Service for scraping, unauthorized automation, or
            violating Amazon’s policies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-privacy-and-security",
    navLabel: "Data privacy & security",
    title: "4. Data Privacy & Security",
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
            Incident response procedures including Amazon will be notification
            within 24 hours of any data breach involving Amazon Information
          </li>
          <li>
            For full details, please see our{" "}
            <Link to={PATH_PAGES.privacy}>Privacy Policy</Link>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    navLabel: "Intellectual property",
    title: "5. Intellectual Property",
    content: (
      <p>
        All content, code, design, and branding on our website and within our
        Service are the property of RunAnalytic Technology. You may not copy,
        modify, or redistribute our intellectual property without prior written
        consent.
      </p>
    ),
  },
  {
    id: "service-availability",
    navLabel: "Service availability",
    title: "6. Service Availability",
    content: (
      <>
        <p>
          We strive to provide reliable, uninterrupted access, but we do not
          guarantee:
        </p>
        <ul>
          <li>Continuous availability of the Service.</li>
          <li>That the Service will be error-free or free of vulnerabilities.</li>
        </ul>
        <p>
          We may suspend access temporarily for maintenance, upgrades, or
          security reasons.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    navLabel: "Limitation of liability",
    title: "7. Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by law, RunAnalytic Technology is not
          liable for:
        </p>
        <ul>
          <li>Any indirect, incidental, or consequential damages.</li>
          <li>
            Loss of data, profits, or business opportunities resulting from
            Service use.
          </li>
          <li>
            Issues caused by Amazon SP-API downtime, errors, or policy changes.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "termination",
    navLabel: "Termination",
    title: "8. Termination",
    content: (
      <>
        <p>We may suspend or terminate your access to the Service if you:</p>
        <ul>
          <li>Breach these Terms.</li>
          <li>
            Misuse Amazon SP-API or violate Amazon’s Developer Agreement.
          </li>
          <li>Engage in fraudulent, abusive, or unlawful activity.</li>
        </ul>
        <p>
          You may stop using the Service at any time by revoking SP-API
          authorization in Amazon Seller Central. Upon termination, any Amazon
          customer data (PII) processed through the Service will be deleted in
          accordance with our{" "}
          <Link to={PATH_PAGES.privacy}>Privacy Policy</Link> within 30 days for
          active data and within 90 days for backups.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    navLabel: "Governing law",
    title: "9. Governing Law",
    content: (
      <p>
        These Terms are governed by the laws of the United Arab Emirates. Any
        disputes will be resolved in the courts of the UAE.
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

export default function TermsService() {
  return (
    <LegalPage
      title="Terms of Service — RunAnalytic"
      dateLabel="Effective Date: 10-Sep-2025"
      intro={
        <p>
          Welcome to RunAnalytic Technology. By accessing our services,
          including our Amazon SP-API integrated invoicing application
          (“Service”), you agree to be bound by these Terms of Service. If you
          do not agree to these Terms, please do not use our Service.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
