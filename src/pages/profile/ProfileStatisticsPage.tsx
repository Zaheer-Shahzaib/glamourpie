import { useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Grid,
    Stack,
    Group,
    Button,
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { getProfileStats } from '../../Services/user-services';
import { ProfileStats } from '../../types/profile.types';
import MainLayout from '../../layout/Main';

export default function ProfileStatisticsPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState(false);

    const loadStats = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const data = await getProfileStats(token);
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Group justify="space-between" mb="lg">
                        <Title order={3}>Account Statistics</Title>
                        <Button onClick={loadStats} loading={loading}>
                            Refresh Stats
                        </Button>
                    </Group>

                    {stats ? (
                        <Grid>
                            <Grid.Col span={6}>
                                <Paper p="md" withBorder>
                                    <Text size="sm" c="dimmed">Total Invoices</Text>
                                    <Title order={2}>{stats.totalInvoices}</Title>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Paper p="md" withBorder>
                                    <Text size="sm" c="dimmed">Total Orders</Text>
                                    <Title order={2}>{stats.totalOrders}</Title>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Paper p="md" withBorder>
                                    <Text size="sm" c="dimmed">Account Age</Text>
                                    <Title order={2}>{stats.accountAge}</Title>
                                </Paper>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Paper p="md" withBorder>
                                    <Text size="sm" c="dimmed">Last Login</Text>
                                    <Text size="sm">{new Date(stats.lastLogin).toLocaleString()}</Text>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    ) : (
                        <Text c="dimmed">Click "Refresh Stats" to view your account statistics</Text>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
}
