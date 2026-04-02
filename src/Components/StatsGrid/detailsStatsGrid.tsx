import {
  Card,
  Group,
  Text,
  Divider,
  Stack,
  Title,
  Box,
  Grid,
} from "@mantine/core";
import { detailedStatsMockData } from "../../constant/mock-data";

type DetailedStatsCardProps = {
  date: string;
  sales: string;
  orders: number;
  units: number;
  refunds: number;
  advCost: string;
  estPayout: string;
  grossProfit: string;
  netProfit: string;
};

function DetailedStatsCard({
  date,
  sales,
  orders,
  units,
  refunds,
  advCost,
  estPayout,
  grossProfit,
  netProfit,
}: DetailedStatsCardProps) {
  return (
    <Card
      shadow='md'
      padding='lg'
      radius='md'
      withBorder
    >
      <Stack gap={8}>
        <Text
          size='xs'
          c='dimmed'
          fw={600}
          tt='uppercase'
          style={{ letterSpacing: '0.05em' }}
        >
          Today
        </Text>
        <Text
          size="xs"
          c='dimmed'
        >
          {date}
        </Text>
        <Title order={4} fw={600} mt={8}>Sales</Title>
        <Title
          order={2}
          fw={700}
          style={{ letterSpacing: '-0.025em' }}
        >
          ${sales}
        </Title>
      </Stack>

      <Divider my='sm' />

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Orders / Units</Text>
        <Text size='sm' fw={600}>
          {orders} / {units}
        </Text>
      </Group>

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Refunds</Text>
        <Text size='sm' fw={600}>{refunds}</Text>
      </Group>

      <Divider my='sm' />

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Adv. cost</Text>
        <Text
          size='sm'
          c='red'
          fw={600}
        >
          {advCost}
        </Text>
      </Group>

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Est. payout</Text>
        <Text size='sm' fw={600}>{estPayout}</Text>
      </Group>

      <Divider my='sm' />

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Gross profit</Text>
        <Text size='sm' fw={600}>{grossProfit}</Text>
      </Group>

      <Group justify='space-between' mt={4}>
        <Text size='xs' c='dimmed' fw={500}>Net profit</Text>
        <Text size='sm' fw={600}>{netProfit}</Text>
      </Group>

      <Box mt='sm'>
        <Text
          size='sm'
          c='blue'
          style={{ cursor: "pointer" }}
        >
          More
        </Text>
      </Box>
    </Card>
  );
}

export default function DetailedStatsGrid() {
  return (
    <Grid>
      {detailedStatsMockData.data.map((item, index) => (
        <Grid.Col
          span={{ base: 12, sm: 6, md: 3 }}
          key={index}
        >
          <DetailedStatsCard {...item} />
        </Grid.Col>
      ))}
    </Grid>
  );
};
