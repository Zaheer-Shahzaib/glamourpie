import { useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Button,
    TextInput,
    Badge,
} from '@mantine/core';
import { useAuth } from '../../Context/useAuth';
import { getApiCredentials } from '../../Services/user-services';
import { ApiCredentials } from '../../types/profile.types';
import MainLayout from '../../layout/Main';

export default function ProfileCredentialsPage() {
    const { token } = useAuth();
    const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
    const [loading, setLoading] = useState(false);

    const loadCredentials = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const data = await getApiCredentials(token);
            setCredentials(data);
        } catch (error) {
            console.error('Failed to load credentials:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Group justify="space-between" mb="lg">
                        <Title order={3}>Amazon SP-API Credentials</Title>
                        <Button onClick={loadCredentials} loading={loading}>
                            Load Credentials
                        </Button>
                    </Group>

                    {credentials ? (
                        <Stack gap="md">
                            <TextInput
                                label="Seller ID"
                                value={credentials.sellerId}
                                disabled
                            />
                            <TextInput
                                label="Marketplace ID"
                                value={credentials.marketplaceId}
                                disabled
                            />
                            <Badge color={credentials.isActive ? 'green' : 'red'}>
                                {credentials.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {credentials.lastSynced && (
                                <Text size="sm" c="dimmed">
                                    Last synced: {new Date(credentials.lastSynced).toLocaleString()}
                                </Text>
                            )}
                        </Stack>
                    ) : (
                        <Text c="dimmed">Click "Load Credentials" to view your API credentials</Text>
                    )}
                </Paper>
            </Container>
        </MainLayout>
    );
}
