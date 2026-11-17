import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import Surface from '../Components/Surface/Surface';
import { PATH_DASHBOARD, PATH_PAGES } from '../routes';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get('plan');        // set for free plan direct redirect
  const sessionId = searchParams.get('session_id'); // set for Stripe paid plans
  const purchase = searchParams.get('purchase');

  const [headline, setHeadline] = useState('Your plan is now active.');
  const [detail, setDetail] = useState('Start generating invoices and automating your Amazon seller workflow.');

  useEffect(() => {
    if (purchase === 'past_invoice') {
      setHeadline('Your Past Invoice Add-on is now active.');
      setDetail(
        'Historical invoice allowance has been added to your account. Use Invoice Upload → Historical Amazon Invoice to get started.',
      );
      return;
    }
    if (plan) {
      const label = plan.charAt(0).toUpperCase() + plan.slice(1);
      setHeadline(`Your ${label} Plan is now active.`);
      setDetail(
        'Start generating invoices and automating your Amazon seller workflow.',
      );
      return;
    }
    if (sessionId) {
      setHeadline('Your payment was successful.');
      setDetail(
        'Your subscription or add-on will appear on Billing within a moment.',
      );
      return;
    }
    setHeadline('Your plan is now active.');
  }, [plan, purchase, sessionId]);

  return (
    <>
      <title>Payment Successful — Runanalytic Invoice</title>
      <Container size="sm" py="xl">
        <Surface component={Paper} p="xl" radius="md" shadow="md">
          <Stack align="center" gap="lg">
            <ThemeIcon size={80} radius="xl" color="green" variant="light">
              <IconCircleCheck size={48} />
            </ThemeIcon>

            <Title order={2} ta="center">
              🎉 You're all set!
            </Title>

            <Text size="lg" ta="center" c="dimmed">
              <strong>{headline}</strong>
              {sessionId && (
                <>
                  {' '}
                  <br />
                  <Text size="xs" c="dimmed" mt="xs">
                    Session ID: {sessionId}
                  </Text>
                </>
              )}
            </Text>

            <Text ta="center" size="sm" c="dimmed">
              {detail}
            </Text>

            <Stack gap="sm" w="100%">
              <Button
                fullWidth
                size="md"
                onClick={() => navigate(PATH_DASHBOARD.default)}
              >
                Go to Dashboard
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
