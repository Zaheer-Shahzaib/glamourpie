import { Paper, Group, Text, ThemeIcon, SimpleGrid } from '@mantine/core';
import {
    IconFileInvoice,
    IconClock,
    IconCheck,
    IconX,
    IconCurrencyDollar,
    IconChartLine,
} from '@tabler/icons-react';
import CountUp from 'react-countup';
import { InvoiceStats } from '../../types/invoice.types';

interface InvoiceStatsGridProps {
    stats: InvoiceStats | null;
    loading?: boolean;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

const StatCard = ({ title, value, icon, color, prefix = '', suffix = '', decimals = 0 }: StatCardProps) => {
    return (
        <Paper p="md" radius="md" withBorder>
            <Group justify="space-between">
                <div>
                    <Text size="sm" c="dimmed" tt="uppercase" fw={700}>
                        {title}
                    </Text>
                    <Text fw={550} size="md" mt="xs">
                        {prefix}
                        <CountUp end={value} duration={1.5} decimals={decimals} separator="," />
                        {suffix}
                    </Text>
                </div>
                <ThemeIcon color={color} size={44} radius="md" variant="light">
                    {icon}
                </ThemeIcon>
            </Group>
        </Paper>
    );
};

export default function InvoiceStatsGrid({ stats, loading }: InvoiceStatsGridProps) {
    if (loading || !stats) {
        return (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
                {[...Array(6)].map((_, index) => (
                    <Paper key={index} p="md" radius="md" withBorder>
                        <Group justify="space-between">
                            <div style={{ width: '100%' }}>
                                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                                    Loading...
                                </Text>
                                <Text fw={600} size="xl" mt="xs">
                                    --
                                </Text>
                            </div>
                        </Group>
                    </Paper>
                ))}
            </SimpleGrid>
        );
    }

    const statCards: StatCardProps[] = [
        {
            title: 'Total Invoices',
            value: stats.totalInvoices,
            icon: <IconFileInvoice size={24} stroke={1.5} />,
            color: 'blue',
        },
        {
            title: 'Pending',
            value: stats.draftInvoices + stats.submittedInvoices,
            icon: <IconClock size={24} stroke={1.5} />,
            color: 'orange',
        },
        {
            title: 'Accepted',
            value: stats.acceptedInvoices,
            icon: <IconCheck size={24} stroke={1.5} />,
            color: 'green',
        },
        {
            title: 'Rejected',
            value: stats.rejectedInvoices,
            icon: <IconX size={24} stroke={1.5} />,
            color: 'red',
        },
        {
            title: 'Total Revenue',
            value: stats.totalRevenue,
            icon: <IconCurrencyDollar size={24} stroke={1.5} />,
            color: 'teal',
            prefix: stats.currency + ' ',
            decimals: 2,
        },
        {
            title: 'Avg Invoice',
            value: stats.averageInvoiceValue,
            icon: <IconChartLine size={24} stroke={1.5} />,
            color: 'violet',
            prefix: stats.currency + ' ',
            decimals: 2,
        },
    ];

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
            {statCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </SimpleGrid>
    );
}
