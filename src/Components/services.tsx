import {
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconDeviceMobile,
  IconFileInvoice,
  IconProps,
  IconReceipt2,
  IconReportMoney,
  IconStar,
  IconUpload,
  IconWallet,
} from "@tabler/icons-react";

export const serviceCards = [
  {
    title: "Create Invoice/Quote",
    badge: "Coming Soon",
    description:
      "Generate professional invoices and quotes in just a few clicks.",
    icon: IconFileInvoice,
  },
  {
    title: "Send Payment Receipt",
    badge: "Coming Soon",
    description:
      "Easily send payment receipts to your customers with complete details.",
    icon: IconReceipt2,
  },
  {
    title: "Easily Manage Expenses",
    badge: "Coming Soon",
    description:
      "Track, categorize, and manage all your business expenses efficiently.",
    icon: IconWallet,
  },
  {
    title: "Track Invoices & Payments",
    badge: "Coming Soon",
    description:
      "Stay updated with real-time tracking of invoices and received payments.",
    icon: IconReportMoney,
  },
  {
    title: "Mobile Availability",
    badge: "Coming Soon",
    description:
      "Access your dashboard and manage finances anytime, anywhere on mobile.",
    icon: IconDeviceMobile,
  },
  {
    title: "Automatic Invoice Uploading",
    badge: "Available",
    description:
      "Save time with automatic uploading and organization of your invoices.",
    icon: IconUpload,
  },
  {
    title: "Automatic Review Request",
    badge: "Coming Soon",
    description:
      "Automatically send review requests after each transaction to gather feedback.",
    icon: IconStar,
  },
];
type ServicesCardProps = {
  title: string;
  badge: string;
  description: string;
  icon: React.FC<IconProps>;
};

export function ServicesCard({
  title,
  badge,
  description,
  icon: Icon,
}: ServicesCardProps) {
  const theme = useMantineTheme();
  const isComingSoon = badge === "Coming Soon";

  return (
    <Card
      shadow='xs'
      padding='lg'
      radius='md'
    >
      {/* <Card.Section>
        <Center>

        </Center>
      </Card.Section> */}

      <Group
        justify='space-between'
        mt='md'
        mb='xs'
      >
        <Group>
        <Icon size={20} />
          <Text fw={500}>{title}</Text>
        </Group>
        <Badge color={badge === "Available" ? "green" : "yellow"}>
          {badge}
        </Badge>
      </Group>

      <Text
        size='sm'
        c='dimmed'
        style={{ minHeight: 50 }}
      >
        {description}
      </Text>

      <Button
        color={theme.primaryColor}
        fullWidth
        mt='md'
        radius='md'
        disabled={isComingSoon}
        variant={isComingSoon ? "light" : "filled"}
      >
        {isComingSoon ? "Coming Soon" : "Avail"}
      </Button>
    </Card>
  );
}

export default function Services() {
  return (
    <Stack gap='lg'>
      <Paper style={{ backgroundColor: "transparent" }}>
        <Stack>
          <Title
            order={2}
            ta='center'
          >
            Our Services
          </Title>
          <Text
            size='lg'
            ta='center'
          >
            Empower your business with simple, smart tools. From automated
            invoicing to expense tracking, our suite of services is designed to
            save you time and help you grow with confidence.
          </Text>
        </Stack>
      </Paper>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: "xl" }}
        verticalSpacing={{ base: "md", sm: "xl" }}
      >
        {serviceCards.map((card) => (
          <ServicesCard
            key={card.title}
            title={card.title}
            badge={card.badge}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
