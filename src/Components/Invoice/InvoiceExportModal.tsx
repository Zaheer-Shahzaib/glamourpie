import { Modal, Stack, Group, Button, Select, Paper, Text, Badge, Table, Loader, Center } from '@mantine/core';
// import { DatePickerInput } from '@mantine/dates';
import { IconFileExport, IconDownload, IconClock, IconCheck, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { ExportParams, ExportFormat, InvoiceStatus, InvoiceType, ExportStatus } from '../../types/invoice.types';
import { useInvoiceExport } from '../../hooks/useInvoiceExport';
import { notifications } from '@mantine/notifications';
import { DatePicker, DatePickerInput } from '@mantine/dates';

interface InvoiceExportModalProps {
    opened: boolean;
    onClose: () => void;
}

const getExportStatusColor = (status: ExportStatus): string => {
    switch (status) {
        case 'PENDING': return 'gray';
        case 'IN_PROGRESS': return 'blue';
        case 'COMPLETED': return 'green';
        case 'FAILED': return 'red';
        default: return 'gray';
    }
};

const getExportStatusIcon = (status: ExportStatus) => {
    switch (status) {
        case 'PENDING': return <IconClock size={16} />;
        case 'IN_PROGRESS': return <Loader size={16} />;
        case 'COMPLETED': return <IconCheck size={16} />;
        case 'FAILED': return <IconX size={16} />;
        default: return null;
    }
};

export default function InvoiceExportModal({ opened, onClose }: InvoiceExportModalProps) {
    const { exports, loading, createExport, refreshExports, pollExportStatus } = useInvoiceExport();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [format, setFormat] = useState<ExportFormat>('JSON');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (opened) {
            refreshExports();
        }
    }, [opened, refreshExports]);

    const handleCreateExport = async () => {
        const params: ExportParams = {
            format,
        };

        if (dateRange[0]) params.dateFrom = dateRange[0].toISOString();
        if (dateRange[1]) params.dateTo = dateRange[1].toISOString();
        if (selectedStatuses.length > 0) params.invoiceStatus = selectedStatuses as InvoiceStatus[];
        if (selectedTypes.length > 0) params.invoiceTypes = selectedTypes as InvoiceType[];

        setCreating(true);
        const exportId = await createExport(params);
        setCreating(false);

        if (exportId) {
            notifications.show({
                title: 'Export Created',
                message: 'Your export is being processed...',
                color: 'blue',
            });

            // Start polling for completion
            pollExportStatus(exportId, (exportData) => {
                notifications.show({
                    title: 'Export Complete',
                    message: `${exportData.exportedRecords} invoices exported successfully`,
                    color: 'green',
                });
                refreshExports();
            });
        }
    };

    const handleDownload = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Export Invoices"
            size="lg"
            padding="lg"
        >
            <Stack gap="lg">
                {/* Export Configuration */}
                <Paper p="md" withBorder>
                    <Text fw={600} mb="md">Export Configuration</Text>
                    <Stack gap="md">
                        <DatePickerInput
                            label="Date Range"
                            placeholder="Select date range"
                            value={dateRange}
                            type="range"
                            onChange={() => setDateRange}
                            defaultDate={Date.now().toString()}
                            size="sm"
                        />

                        <Select
                            label="Invoice Status"
                            placeholder="Select statuses"
                            data={[
                                { value: 'DRAFT', label: 'Draft' },
                                { value: 'SUBMITTED', label: 'Submitted' },
                                { value: 'ACCEPTED', label: 'Accepted' },
                                { value: 'REJECTED', label: 'Rejected' },
                            ]}
                            value={selectedStatuses[0] || null}
                            onChange={(value) => setSelectedStatuses(value ? [value] : [])}
                            clearable
                            size="sm"
                        />

                        <Select
                            label="Invoice Type"
                            placeholder="Select types"
                            data={[
                                { value: 'INVOICE', label: 'Invoice' },
                                { value: 'CREDIT_NOTE', label: 'Credit Note' },
                                { value: 'DEBIT_NOTE', label: 'Debit Note' },
                            ]}
                            value={selectedTypes[0] || null}
                            onChange={(value) => setSelectedTypes(value ? [value] : [])}
                            clearable
                            size="sm"
                        />

                        <Select
                            label="Export Format"
                            placeholder="Select format"
                            value={format}
                            onChange={(value) => setFormat(value as ExportFormat)}
                            data={[
                                { value: 'JSON', label: 'JSON' },
                                { value: 'CSV', label: 'CSV' },
                                { value: 'PDF', label: 'PDF' },
                            ]}
                            required
                            size="sm"
                        />

                        <Button
                            fullWidth
                            leftSection={<IconFileExport size={18} />}
                            onClick={handleCreateExport}
                            loading={creating}
                        >
                            Create Export
                        </Button>
                    </Stack>
                </Paper>

                {/* Export History */}
                <Paper p="md" withBorder>
                    <Text fw={600} mb="md">Export History</Text>

                    {loading ? (
                        <Center h={200}>
                            <Loader size="md" />
                        </Center>
                    ) : exports.length === 0 ? (
                        <Center h={200}>
                            <Text c="dimmed">No exports yet</Text>
                        </Center>
                    ) : (
                        <Table.ScrollContainer minWidth={500}>
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Export ID</Table.Th>
                                        <Table.Th>Format</Table.Th>
                                        <Table.Th>Records</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th>Created</Table.Th>
                                        <Table.Th>Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {exports.map((exp) => (
                                        <Table.Tr key={exp.exportId}>
                                            <Table.Td>
                                                <Text size="sm" fw={500}>{exp.exportId}</Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge variant="outline">{exp.exportFormat}</Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {exp.exportedRecords} / {exp.totalRecords}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={getExportStatusColor(exp.status)}
                                                    leftSection={getExportStatusIcon(exp.status)}
                                                >
                                                    {exp.status}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {new Date(exp.createdAt).toLocaleDateString()}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                {exp.status === 'COMPLETED' && exp.exportedFileUrl && (
                                                    <Button
                                                        size="xs"
                                                        variant="subtle"
                                                        leftSection={<IconDownload size={14} />}
                                                        onClick={() => handleDownload(exp.exportedFileUrl!)}
                                                    >
                                                        Download
                                                    </Button>
                                                )}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    )}
                </Paper>
            </Stack>
        </Modal>
    );
}
