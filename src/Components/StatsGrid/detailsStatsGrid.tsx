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
      <Stack gap={4}>
        <Text
          size='sm'
          c='dimmed'
        >
          Today
        </Text>
        <Text
         size="xs"
          c='dimmed'
        >
          {date}
        </Text>
        <Title order={2}>Sales</Title>
        <Title
          order={1}
          fw={700}
        >
          ${sales}
        </Title>
      </Stack>

      <Divider my='sm' />

      <Group justify='space-between'>
        <Text size='sm'>Orders / Units</Text>
        <Text size='sm'>
          {orders} / {units}
        </Text>
      </Group>

      <Group justify='space-between'>
        <Text size='sm'>Refunds</Text>
        <Text size='sm'>{refunds}</Text>
      </Group>

      <Divider my='sm' />

      <Group justify='space-between'>
        <Text size='sm'>Adv. cost</Text>
        <Text
          size='sm'
          c='red'
        >
          {advCost}
        </Text>
      </Group>

      <Group justify='space-between'>
        <Text size='sm'>Est. payout</Text>
        <Text size='sm'>{estPayout}</Text>
      </Group>

      <Divider my='sm' />

      <Group justify='space-between'>
        <Text size='sm'>Gross profit</Text>
        <Text size='sm'>{grossProfit}</Text>
      </Group>

      <Group justify='space-between'>
        <Text size='sm'>Net profit</Text>
        <Text size='sm'>{netProfit}</Text>
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

export default function DetailedStatsGrid () {
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
