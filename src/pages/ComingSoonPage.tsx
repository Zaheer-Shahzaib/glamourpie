import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    ThemeIcon,
    Group,
} from '@mantine/core';
import { IconTools } from '@tabler/icons-react';
import MainLayout from '../layout/Main';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
}

export default function ComingSoonPage({
    title = 'Coming Soon',
    description = 'This feature is currently under development and will be available soon.'
}: ComingSoonPageProps) {
    return (
        <MainLayout>
            <Container size="md" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Stack align="center" gap="lg" py="xl">
                        <ThemeIcon size={80} radius="xl" variant="light" color="blue">
                            <IconTools size={40} stroke={1.5} />
                        </ThemeIcon>

                        <Title order={2} ta="center">
                            {title}
                        </Title>

                        <Text c="dimmed" ta="center" size="sm" maw={400}>
                            {description}
                        </Text>

                        <Group gap="xs">
                            <Text size="xs" c="dimmed">
                                We're working hard to bring you this feature.
                            </Text>
                        </Group>
                    </Stack>
                </Paper>
            </Container>
        </MainLayout>
    );
}
