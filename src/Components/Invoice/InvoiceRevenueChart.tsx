import { Paper, Text, Group, SegmentedControl } from '@mantine/core';
import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { RevenueDataPoint } from '../../types/invoice.types';

interface InvoiceRevenueChartProps {
    data: RevenueDataPoint[];
    loading?: boolean;
}

export default function InvoiceRevenueChart({ data, loading }: InvoiceRevenueChartProps) {
    const [chartType, setChartType] = useState<'revenue' | 'count'>('revenue');

    const chartOptions: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        xaxis: {
            type: 'datetime',
            categories: data.map((point) => point.date),
            labels: {
                format: 'MMM dd',
            },
        },
        yaxis: {
            title: {
                text: chartType === 'revenue' ? 'Revenue (AED)' : 'Invoice Count',
            },
            labels: {
                formatter: (value) => {
                    if (chartType === 'revenue') {
                        return value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                    }
                    return Math.round(value).toString();
                },
            },
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy',
            },
            y: {
                formatter: (value) => {
                    if (chartType === 'revenue') {
                        return `AED ${value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`;
                    }
                    return `${Math.round(value)} invoices`;
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100],
            },
        },
        colors: ['#228be6'],
        grid: {
            borderColor: '#e0e0e0',
            strokeDashArray: 5,
        },
    };

    const series = [
        {
            name: chartType === 'revenue' ? 'Revenue' : 'Invoice Count',
            data: data.map((point) =>
                chartType === 'revenue' ? point.revenue : point.invoiceCount
            ),
        },
    ];

    if (loading) {
        return (
            <Paper p="md" radius="md" withBorder>
                <Text c="dimmed">Loading chart...</Text>
            </Paper>
        );
    }

    return (
        <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
                <Text size="lg" fw={600}>
                    Invoice Trends
                </Text>
                <SegmentedControl
                    value={chartType}
                    onChange={(value) => setChartType(value as 'revenue' | 'count')}
                    data={[
                        { label: 'Revenue', value: 'revenue' },
                        { label: 'Count', value: 'count' },
                    ]}
                />
            </Group>

            <ReactApexChart
                options={chartOptions}
                series={series}
                type="area"
                height={350}
            />
        </Paper>
    );
}
