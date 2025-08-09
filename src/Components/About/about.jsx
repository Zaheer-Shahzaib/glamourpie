import {
    Container,
    Stack,
    Text,
    Title,
    Space,
    Group,
    useMantineColorScheme
  } from "@mantine/core";
  import GuestLayout from "../../layout/Guest";
  import { theme } from "../../theme/theme";
  
  export default function About() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const headingColor = isDark ? theme.white : theme.black;
  
    return (
      <GuestLayout>
        <Container size="lg" py={48}>
          {/* Hero Section */}
          <Stack align="center" mb={56} gap={8}>
            <Group gap={16}>
              <Title
                order={1}
                c={headingColor}
                style={{ color: "black", fontWeight: 550 }}
              >
                About Us
              </Title>
            </Group>
            <Text
              size="xl"
              color="dimmed"
              maw={800}
              mt={16}
              align="center"
            >
              RunAnalytic Technology is focused on building smart, scalable tools
              for Amazon sellers. Our mission is to simplify e-commerce operations
              through powerful applications that integrate with the Amazon Selling
              Partner API (SP-API). We provide secure, reliable solutions that help
              sellers track performance, manage inventory, and grow their
              businesses efficiently. Backed by a skilled team and a commitment to
              data protection, we aim to deliver real value to the global seller
              community.
            </Text>
          </Stack>
  
          <Space h={64} />
        </Container>
      </GuestLayout>
    );
  }
  