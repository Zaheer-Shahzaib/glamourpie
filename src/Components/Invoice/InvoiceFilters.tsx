import { Select, TextInput, Group, Button, Stack, Paper } from '@mantine/core';
// import { DatePickerInput } from '@mantine/dates';
import { IconFilter, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { InvoiceQueryParams, InvoiceStatus, InvoiceType, MarketplaceId } from '../../types/invoice.types';
import { DatePickerInput } from '@mantine/dates';

interface InvoiceFiltersProps {
    onFilterChange: (filters: InvoiceQueryParams) => void;
    onClearFilters: () => void;
}

export default function InvoiceFilters({ onFilterChange, onClearFilters }: InvoiceFiltersProps) {
    const [status, setStatus] = useState<InvoiceStatus | null>(null);
    const [type, setType] = useState<InvoiceType | null>(null);
    const [marketplace, setMarketplace] = useState<MarketplaceId | null>(null);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    const handleApplyFilters = () => {
        const filters: InvoiceQueryParams = {};

        if (status) filters.status = status;
        if (type) filters.type = type;
        if (marketplace) filters.marketplaceId = marketplace;
        if (dateRange[0]) filters.dateFrom = dateRange[0].toISOString();
        if (dateRange[1]) filters.dateTo = dateRange[1].toISOString();

        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setStatus(null);
        setType(null);
        setMarketplace(null);
        setDateRange([null, null]);
        onClearFilters();
    };

    return (
        <Paper p="md" radius="md" withBorder>
            <Stack gap="md">
                <Group grow>
                    <Select
                        label="Status"
                        placeholder="All statuses"
                        value={status}
                        onChange={(value) => setStatus(value as InvoiceStatus)}
                        data={[
                            { value: 'DRAFT', label: 'Draft' },
                            { value: 'SUBMITTED', label: 'Submitted' },
                            { value: 'ACCEPTED', label: 'Accepted' },
                            { value: 'REJECTED', label: 'Rejected' },
                        ]}
                        clearable
                        size="sm"
                    />

                    <Select
                        label="Type"
                        placeholder="All types"
                        value={type}
                        onChange={(value) => setType(value as InvoiceType)}
                        data={[
                            { value: 'INVOICE', label: 'Invoice' },
                            { value: 'CREDIT_NOTE', label: 'Credit Note' },
                            { value: 'DEBIT_NOTE', label: 'Debit Note' },
                        ]}
                        clearable
                        size="sm"
                    />

                    <Select
                        label="Marketplace"
                        placeholder="All marketplaces"
                        value={marketplace}
                        onChange={(value) => setMarketplace(value as MarketplaceId)}
                        data={[
                            { value: 'amazon.ae', label: 'Amazon UAE' },
                            { value: 'amazon.com.br', label: 'Amazon Brazil' },
                            { value: 'amazon.in', label: 'Amazon India' },
                            { value: 'amazon.com', label: 'Amazon US' },
                        ]}
                        clearable
                        size="sm"
                    />
                </Group>

                <Group grow>
                    <DatePickerInput
                        type="range"
                        label="Date Range"
                        placeholder="Select date range"
                        value={dateRange}
                        onChange={() => setDateRange}
                        clearable
                        size="sm"
                    />
                </Group>

                <Group justify="flex-end">
                    <Button
                        variant="subtle"
                        leftSection={<IconX size={16} />}
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                    <Button
                        leftSection={<IconFilter size={16} />}
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}
