import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Image,
  ImageProps,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";

export const serviceCards = [
  // {
  //   title: "Create Invoice/Quote",
  //   badge: "Coming Soon",
  //   description:
  //     "Generate professional invoices and quotes in just a few clicks.",
  //   image: "/assets/create-invoice.jpg",
  // },
  // {
  //   title: "Send Payment Receipt",
  //   badge: "Coming Soon",
  //   description:
  //     "Easily send payment receipts to your customers with complete details.",
  //   image: "/assets/send-recipent.jpg",
  // },
  // {
  //   title: "Easily Manage Expenses",
  //   badge: "Coming Soon",
  //   description:
  //     "Track, categorize, and manage all your business expenses efficiently.",
  //   image: "/assets/manage-expense.jpg",
  // },
  // {
  //   title: "Track Invoices & Payments",
  //   badge: "Coming Soon",
  //   description:
  //     "Stay updated with real-time tracking of invoices and received payments.",
  //   image: "/assets/track-invoice.jpeg",
  // },
  // {
  //   title: "Mobile Availability",
  //   badge: "Coming Soon",
  //   description:
  //     "Access your dashboard and manage finances anytime, anywhere on mobile.",
  //   image: "/assets/mobile-app.jpg",
  // },
  {
    title: "Automatic Invoice Uploading",
    badge: "Available",
    description:
      "Eliminate manual work with instant invoice capture, auto-categorization, and seamless accounting integration. Saves hours weekly while reducing errors.",
    image: "/assets/upload-invoice.jpeg",
  },
  // {
  //   title: "Automatic Review Request",
  //   badge: "Coming Soon",
  //   description:
  //     "Automatically send review requests after each transaction to gather feedback.",
  //   image: '/assets/review-request.jpg',
  // },
];

type ServicesCardProps = {
  title: string;
  badge: string;
  description: string;
  image: ImageProps["src"];
};

export function ServicesCard({
  title,
  badge,
  description,
  image,
}: ServicesCardProps) {
  const theme = useMantineTheme();
  const isComingSoon = badge === "Coming Soon";

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows.md,
        }
      }}
    >
      <Card.Section>
        <Center p="md">
          <Image
            src={image}
            alt={title}
            height={160}
            style={{ 
              objectFit: 'cover',
              width: '100%',
              borderRadius: theme.radius.md,
            }}
          />
        </Center>
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={700} size="lg">
          {title}
        </Text>
        
      </Group>

      <Text size="sm" c="dimmed" mt="sm" mb="md" style={{ flexGrow: 1 }}>
        {description}
      </Text>

      
    </Card>
  );
}

export default function Services() {
  const isSingleCard = serviceCards.length === 1;
  const theme = useMantineTheme();

  return (
    <Stack gap="xl" py="xl">
      <Paper 
        style={{ 
          backgroundColor: "transparent",
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
        }}
        px="md"
      >
        <Stack gap="sm">
          <Title order={2} fw={800} style={{ color: theme.colors.dark[9] }}>
            Our Services
          </Title>
          <Text size="lg" c="dimmed">
            Empower your business with simple, smart tools. From automated
            invoicing to expense tracking, our suite of services is designed to
            save you time and help you grow with confidence.
          </Text>
        </Stack>
      </Paper>

      {isSingleCard ? (
        <Center>
          <div style={{ maxWidth: 400, width: "100%" }}>
            <ServicesCard
              key={serviceCards[0].title}
              title={serviceCards[0].title}
              badge={serviceCards[0].badge}
              description={serviceCards[0].description}
              image={serviceCards[0].image}
            />
          </div>
        </Center>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: "md", sm: "lg" }}
          verticalSpacing={{ base: "md", sm: "lg" }}
          px={{ base: "sm", sm: "xl" }}
          style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}
        >
          {serviceCards.map((card) => (
            <ServicesCard
              key={card.title}
              title={card.title}
              badge={card.badge}
              description={card.description}
              image={card.image}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}