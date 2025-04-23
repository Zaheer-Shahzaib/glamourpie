import { ReactNode, use } from 'react';

import { Alert, AlertProps, Badge, Group, Paper, PaperProps, SimpleGrid, Skeleton, Text, useMantineTheme } from '@mantine/core';

import classes from './StatsGrid.module.scss';
import Surface from '../Surface/Surface';
import { IconArrowDownRight, IconArrowUpRight, IconBug } from '@tabler/icons-react';

type StatsGridProps = {
  data?: { title: string; value: string; diff: number; period?: string }[];
  paperProps?: PaperProps;
  error?: ReactNode;
  loading?: boolean;
};


type StatsCardProps = {
  data: { title: string; value: string; diff: number; period?: string };
} & PaperProps;

type Props = { message: ReactNode } & AlertProps;

const ErrorAlert = ({ message, ...others }: Props) => {
  const icon = <IconBug size={18} />;
  const { title } = others;

  return (
    <Alert variant="light" color="red" title={title} icon={icon} {...others}>
      {message || ''}
    </Alert>
  );
};
const StatsCard = ({ data, ...others }: StatsCardProps) => {
  const { title, value, period, diff } = data;
  const DiffIcon = diff > 0 ? IconArrowUpRight : IconArrowDownRight;
const theme = useMantineTheme();
  return (
    <Surface component={Paper} {...others}>
      <Group justify="space-between">
        <Text size="xs" c="dimmed" className={classes.title}>
          {title}
        </Text>
        {period && (
          <Badge variant="filled" radius="sm">
            {period}
          </Badge>
        )}
      </Group>

      <Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{value}</Text>
        <Text
          c={diff > 0 ? theme.colors.teal[6] : theme.colors.red[6]}
          fz="sm"
          fw={600}
          className={classes.diff}
        >
          <span>{diff}%</span>
          <DiffIcon size="1rem" stroke={1.5} />
        </Text>
      </Group>

      <Text fz="xs" c="dimmed" mt={7}>
        Compared to previous month
      </Text>
    </Surface>
  );
};
export default function StatsGrid({
  data,
  loading,
  error,
  paperProps,
}: StatsGridProps) {
  const stats = data?.map((stat) => (
    <StatsCard key={stat.title} data={stat} {...paperProps} />
  ));

  return (
    <div className={classes.root}>
      {error ? (
        <ErrorAlert title="Error loading stats" message={error.toString()} />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((o, i) => (
                <Skeleton
                  key={`stats-loading-${i}`}
                  visible={true}
                  height={200}
                />
              ))
            : stats}
        </SimpleGrid>
      )}
    </div>
  );
}
