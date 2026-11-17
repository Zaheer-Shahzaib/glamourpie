import { Container, Stack, Title, Text } from '@mantine/core';
import StatsGrid from '../Components/StatsGrid/StatsGrid';
import { awsSalesMetricsMockData } from '../constant/aws-mock-data';
import DetailedStatsGrid from '../Components/StatsGrid/detailsStatsGrid';
import RevenueChart from '../Components/RevenueChart/RevenueChart';

export default function AnalyticsPage() {
    return (
        <Container fluid py="xl">
                <Stack gap="lg">
                    {/* Header */}
                    <div>
                        <Title order={2}>Analytics Dashboard</Title>
                        <Text c="dimmed" size="sm">
                            Sales performance metrics from Amazon Seller Partner API
                        </Text>
                    </div>

                    {/* Sales Statistics Grid */}
                    <DetailedStatsGrid />
                    <RevenueChart />
                    {/* <StatsGrid
                        data={awsSalesMetricsMockData}
                        loading={false}
                    /> */}
                </Stack>
            </Container>
    );
}
