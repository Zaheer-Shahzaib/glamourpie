import {
  Button,
  Group,
  List,
  Paper,
  PaperProps,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import CountUp from "react-countup";
import Surface from "../Surface/Surface";

type PricingCardProps = {
  tier: string;
  description: string;
  price: {
    month: number;
    year?: number;
  };
  features: string[];
  preferred: boolean;
  actionText: string;
  monthly: boolean;
  customPrice?: boolean;
  onAction?: () => void;
  loading?: boolean;
  isCurrentPlan?: boolean;
} & PaperProps;

const PricingCard = (props: PricingCardProps) => {
  const {
    price,
    actionText,
    preferred,
    features,
    tier,
    monthly,
    description,
    customPrice,
    onAction,
    loading,
    isCurrentPlan,
    ...others
  } = props;

  return (
    <Surface
      component={Paper}
      {...others}
    >
      <Group
        gap={4}
        align='center'
        justify='center'
      >
        {customPrice ? (
          <Title size={40} ta='center'>
            Custom Pricing
          </Title>
        ) : (
          <>
            <Text size='xl' fw={700} mb={6} style={{ alignSelf: 'flex-end' }}>AED</Text>
            <Group
              align='flex-end'
              gap={1}
            >
              <Title size={48}>
                <CountUp end={monthly && price.year ? price.year : price.month} />
              </Title>
              <Text
                size='md'
                fw={500}
                mb={6}
              >
                /mo
              </Text>
            </Group>
          </>
        )}
      </Group>
      <Title
        ta='center'
        my='md'
        tt='capitalize'
        order={3}
        fw={600}
      >
        {tier}
      </Title>
      <Text ta='center'>{description}</Text>
      <List
        spacing='xs'
        size='md'
        center
        my='xl'
        icon={
          <ThemeIcon
            size={24}
            radius='xl'
            variant={preferred ? "dark" : "filled"}
            color={preferred ? "blue" : "dark"}
          >
            <IconCheck size={16} />
          </ThemeIcon>
        }
      >
        {features.map((f, i) => (
          <List.Item
            key={`${f}-${i}`}
            mb='md'
          >
            {f}
          </List.Item>
        ))}
      </List>
      <Stack justify="flex-end" mt={"xl"} h={'inherit'} >
        <Button
          variant={isCurrentPlan ? "filled" : preferred ? "filled" : "outline"}
          color={isCurrentPlan ? "green" : undefined}
          rightSection={!loading && !isCurrentPlan ? <IconArrowRight size={18} /> : undefined}
          fullWidth
          size='md'
          mb='sm'
          style={{ textTransform: "capitalize" }}
          onClick={onAction}
          loading={loading}
          disabled={isCurrentPlan}
        >
          {actionText}
        </Button>
        {
         'Free' === tier && (
            <Text
              ta='center'
              c='dimmed'
              size='sm'
            >
              No card required
            </Text>
          )
        }
      </Stack>
    </Surface>
  );
};

export default PricingCard;
