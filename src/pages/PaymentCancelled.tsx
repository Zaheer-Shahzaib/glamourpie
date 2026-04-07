import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';
import Surface from '../Components/Surface/Surface';
import { PATH_PAGES } from '../routes';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <>
      <title>Payment Cancelled — Runanalytic Invoice</title>
      <Container size="sm" py="xl">
        <Surface component={Paper} p="xl" radius="md" shadow="md">
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius="xl" color="red" variant="light">
              <IconXboxX size={48} />
            </ThemeIcon>

            <Title order={2} ta="center">
              Payment Cancelled
            </Title>

            <Text size="lg" ta="center" c="dimmed">
              Your payment was not completed. No charges have been made.
            </Text>

            <Text ta="center" size="sm" c="dimmed">
              You can try again anytime — choose a plan that works for your business.
            </Text>

            <Stack gap="sm" w="100%">
              <Button
                fullWidth
                size="md"
                onClick={() => navigate(PATH_PAGES.root, { state: { scrollToId: 'pricing' } })}
              >
                Back to Pricing
              </Button>
              <Button
                fullWidth
                size="md"
                variant="subtle"
                onClick={() => navigate(PATH_PAGES.root)}
              >
                Back to Home
              </Button>
            </Stack>
          </Stack>
        </Surface>
      </Container>
    </>
  );
}
