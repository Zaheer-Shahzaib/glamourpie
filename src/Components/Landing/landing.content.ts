/**
 * Copy and static data for the landing page
 * (Figma: "Landing Page / HTML Reference / Desktop 1440", node 30:3).
 */

export const HERO = {
  eyebrow: "MENA'S #1 AMAZON SP-API COMPLIANCE PLATFORM",
  titleLine1: "Automate Amazon Invoicing.",
  titleLine2: "Stay Compliant. Scale Faster.",
  lead: "RunAnalytic automatically generates, manages, and uploads Amazon-compliant invoices through SP-API integration, helping sellers save time, eliminate manual work, and grow confidently across UAE and KSA.",
  primaryCta: "Start Free",
  secondaryCta: "Book a Demo",
  rating: "4.9/5",
  proof: "Trusted by 500+ Top Sellers in Dubai & Riyadh",
  trial: "14-Day Free Trial \u2022 No Credit Card Required",
  badgeLeft: "\u26A1 0.8s Auto-Upload Speed",
  // badgeRight: "\uD83D\uDD12 100% Tax Compliant Guarantee",   
};

/** Product tour carousel (Figma node 183:2). */
export const PRODUCT_TOUR = {
  breadcrumb: "RunAnalytic  /  SellerCenter",
  hint: "Drag or use arrows to explore the product",
  legend: "Orders \u00B7 Invoices \u00B7 Analytics",
  slides: [
    { id: "orders", label: "Orders" },
    { id: "invoices", label: "Invoices" },
    { id: "analytics", label: "Analytics" },
  ],
  orders: {
    title: "Orders",
    subtitle: "Live order sync \u00B7 Amazon.com \u00B7 Updated just now",
    orderId: "123-4567890-1234567",
    customer: "John Smith \u00B7 Smith Industries LLC",
    status: "SHIPPED",
    total: "$154.99",
    columns: ["Order items", "Fulfillment", "Marketplace", "Actions"],
    rows: [
      {
        item: "2\u00D7 Echo Dot (4th Gen)",
        fulfillment: "Merchant",
        badge: "DELIVERED",
        tone: "brand",
      },
      {
        item: "1\u00D7 Fire TV Stick 4K",
        fulfillment: "Standard",
        badge: "UPS",
        tone: "tertiary",
      },
    ],
  },
  invoices: {
    title: "Invoices",
    subtitle: "Auto-generated from orders",
    count: "39",
    countLabel: "Total invoices",
    badges: [
      { label: "DRAFT", tone: "muted" },
      { label: "PAID", tone: "brand" },
    ],
    revenue: "AED 1,617.27 revenue",
  },
  analytics: {
    title: "Analytics",
    subtitle: "ROI & compliance insights",
    value: "AED 4,350",
    valueLabel: "Monthly savings",
    /** Bar heights in px, matching the design. */
    bars: [46, 72, 92, 62, 110],
    highlightedBar: 3,
    caption: "Automation impact",
  },
};

export const ACCREDITATIONS_TITLE =
  "VERIFIED INFRASTRUCTURE & STATUTORY COMPLIANCE ACCREDITATIONS";

export const ACCREDITATIONS = [
  { glyph: "\u25C8", label: "Amazon SP-API" },
  { glyph: "\u25A3", label: "UAE FTA Ready" },
  { glyph: "\u2317", label: "ZATCA Phase 2" },
  { glyph: "\u25C9", label: "GDPR Compliant" },
  { glyph: "\u25C6", label: "256-Bit AES" },
  { glyph: "\u2601", label: "AWS Secure Cloud" },
];

export const TRUST_STATS = [
  {
    value: "100,000+",
    title: "Invoices Processed",
    description: "Validated under GCC e-invoicing standards",
    tone: "brand",
  },
  {
    value: "500+",
    title: "Active GCC Sellers",
    description: "High-volume sellers in UAE, KSA, & Egypt",
    tone: "tertiary",
  },
  {
    value: "99.9%",
    title: "Platform Reliability SLA",
    description: "Zero downtime during peak Prime events",
    tone: "brand",
  },
  {
    value: "90%",
    title: "Less Manual Labor",
    description: "Total elimination of repetitive copy-pasting",
    tone: "tertiary",
  },
] as const;

export const FEATURES_SECTION = {
  eyebrow: "POWERFUL AUTOMATION",
  title: "Everything Amazon Sellers Need to Eliminate Invoicing Headaches",
  lead: "Engineered specifically for the nuances of GCC multi-entity Amazon operations, tax requirements, and buyer communication.",
};

export const FEATURES = [
  {
    glyph: "\u21BB",
    title: "Automatic Invoice Generation",
    description:
      "Generate tax-compliant, professional Amazon invoices immediately as orders clear. Zero human touch and zero missed orders.",
    footer: "Instant Trigger on Settlement",
  },
  {
    glyph: "\u2318",
    title: "Direct Amazon SP-API Sync",
    description:
      "Sync complex order fee matrices, buyer registration parameters, FBA vs. FBM channels, and regional tax breakdowns in real time.",
    footer: "Official SP-API Verified",
  },
  {
    glyph: "\u2601",
    title: "Auto Upload to Amazon",
    description:
      "Upload certified PDF invoices straight into Amazon Seller Central so buyers can download them instantly.",
    footer: "Zero Late-Upload Warnings",
  },
  {
    glyph: "\u0639",
    title: "Smart Bilingual Templates",
    description:
      "Dynamic Arabic and English layouts adhering to UAE FTA and ZATCA Phase 2 guidelines.",
    footer: "Dual-Language Rendering",
  },
  {
    glyph: "\u25A6",
    title: "Real-Time Dashboard",
    description:
      "See incoming orders, cleared transactions, pending stamps, and live upload telemetry across every seller account.",
    footer: "Unified Multi-Account Rail",
  },
  {
    glyph: "\u25D2",
    title: "Advanced Analytics & Audit",
    description:
      "Generate tax reports, monitor AED and SAR trends, and maintain audit-proof digital archives.",
    footer: "Export FTA / ZATCA Ledgers",
  },
];

export const STEPS_SECTION = {
  eyebrow: "SEAMLESS IMPLEMENTATION",
  title: "From Amazon Order to Compliant Invoice in 4 Automated Steps",
  lead: "Connect once via secure OAuth. RunAnalytic takes care of fiscal verification, stamping, and upload forever.",
};

export const STEPS = [
  {
    number: "1",
    glyph: "\u2301",
    title: "Connect Amazon Account",
    description:
      "1-click secure OAuth authorization with Amazon SP-API. No developer credentials required.",
    footer: "Under 2 minutes setup",
  },
  {
    number: "2",
    glyph: "\u2194",
    title: "Sync Orders Automatically",
    description:
      "Continuous ingestion feeds FBA & FBM transactions, pricing, customer TRNs, and settlement details.",
    footer: "Real-time SP-API streams",
  },
  {
    number: "3",
    glyph: "\u2317",
    title: "Generate & Upload Invoices",
    description:
      "Embed ZATCA Phase 2 QR codes or UAE FTA references, generate PDFs, and push them back to Amazon.",
    footer: "0.8s dispatch average",
  },
  {
    number: "4",
    glyph: "\u2713",
    title: "Track & Export Audits",
    description:
      "Maintain an encrypted, audit-ready archive and export pre-formatted tax returns for your accountant.",
    footer: "FTA & ZATCA audit ready",
  },
];

export const ROI = {
  eyebrow: "UNCOMPROMISING ROI",
  title: "Built for GCC Sellers Who Value Growth Over Paperwork",
  lead: "Manual invoice creation in Excel or Seller Central eats up countless hours and exposes your business to non-compliance penalties. RunAnalytic replaces this friction with automated precision.",
  benefits: [
    {
      glyph: "20+ hrs",
      title: "Save 20+ Hours Every Week",
      description:
        "Free up your operations team for supplier negotiations, inventory restocking, and PPC campaigns.",
    },
    {
      glyph: "\u2713",
      title: "Reduce Compliance & Fine Risks",
      description:
        "Prevent punitive tax authority penalties with strict adherence to ZATCA Phase 2 and UAE FTA requirements.",
    },
    {
      glyph: "\u221E",
      title: "Scale Without Additional Staff",
      description:
        "Process 50,000+ orders during White Friday or Prime Day without temporary accounting clerks.",
    },
    {
      glyph: "\u25C6",
      title: "Protect Account Health & Buy Box",
      description:
        "Prompt invoice uploading keeps your customer service and defect-rate metrics healthy.",
    },
  ],
  manual: {
    label: "MANUAL PROCESSING",
    risk: "HIGH RISK",
    items: [
      "10\u201315 mins per batch in Excel",
      "Manual PDF export and upload",
      "Hard to audit at scale",
    ],
  },
  automated: {
    label: "RUNANALYTIC",
    items: [
      "Automated cryptographic QR",
      "Guaranteed buyer delivery",
      "Audit-ready digital archive",
    ],
  },
  defectRate: {
    value: "0%",
    title: "Invoice Defect Rate",
    description: "Lowest possible IDR across GCC accounts.",
  },
};

export const IMPACT = {
  eyebrow: "PROVEN IMPACT",
  title: "Trusted by Growing Amazon Sellers Across UAE & KSA",
  lead: "Real sellers. Real automation. Real business results.",
  stories: [
    {
      company: "Desert Commerce UAE",
      meta: "Consumer Electronics \u2022 Amazon.ae",
      badge: "95% Less Manual Work",
      headline: "2,500+",
      stats: [
        { value: "95%", label: "Time / error reduction" },
        { value: "12 hrs", label: "Operational impact" },
      ],
      quote:
        "\u201CRunAnalytic transformed our invoicing process. During seasonal spikes our team used to drown in PDF uploads and reconciliations. Now it runs on autopilot with zero Seller Central warnings.\u201D",
      author: "Tariq Al-Mansoor  \u00B7  Founder & COO",
      tone: "brand",
    },
    {
      company: "Gulf Home Essentials",
      meta: "Home & Kitchen \u2022 Amazon.sa & Amazon.ae",
      badge: "98% Fewer Errors",
      headline: "4,200+",
      stats: [
        { value: "98%", label: "Time / error reduction" },
        { value: "100%", label: "Operational impact" },
      ],
      quote:
        "\u201COperating across Saudi Arabia and UAE had become a compliance nightmare. RunAnalytic solved both countries in less than 15 minutes of onboarding.\u201D",
      author: "Sarah Al-Ghamdi  \u00B7  Head of E-Commerce",
      tone: "tertiary",
    },
  ],
} as const;

export const CALCULATOR = {
  eyebrow: "CALCULATE YOUR SAVINGS",
  title: "See How Much Time & Capital You'll Reclaim",
  lead: "Slide to your monthly Amazon order volume across UAE and Saudi Arabia to estimate instant operational payback.",
  inputLabel: "Monthly Amazon Orders",
  min: 500,
  max: 25000,
  step: 100,
  defaultOrders: 3500,
  axisLabels: ["500 orders", "10,000", "25,000+ orders"],
  guarantee: "\u2713 Compliance Guarantee Included",
  guaranteeDetail: "ZATCA Phase 2 XML, UAE FTA tax logs, and upload retries.",
  resultLabel: "ESTIMATED MONTHLY PAYBACK",
  hoursLabel: "manual hours saved",
  costLabel: "staff labor cost reclaimed",
  cta: "Claim These Savings \u2192",
  /**
   * Assumptions derived from the design's reference result
   * (3,500 orders -> 29 hrs -> AED 4,350 -> SAR 4,437).
   */
  minutesSavedPerOrder: 0.5,
  hourlyCostAed: 150,
  sarPerAed: 1.02,
};

export const FINAL_CTA = {
  pill: "START IN 2 MINUTES \u2022 SP-API READY",
  title: "Ready to Put Your Amazon Invoicing on Autopilot?",
  lead: "Join 500+ sellers across Dubai, Riyadh, Jeddah, and Abu Dhabi. Start your 14-day free trial and experience hassle-free GCC compliance.",
  primary: "Start Free Trial Now",
  secondary: "Schedule Personalized Demo",
  assurances: [
    "Instant 2-minute setup",
    "No credit card required",
    "Cancel anytime in 1-click",
  ],
};
