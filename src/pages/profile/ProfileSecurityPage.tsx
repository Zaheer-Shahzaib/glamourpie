import { useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Stack,
    Button,
    PasswordInput,
} from '@mantine/core';
import { IconKey } from '@tabler/icons-react';
import { useAuth } from '../../Context/useAuth';
import { notifications } from '@mantine/notifications';
import { changePassword } from '../../Services/user-services';
import { ChangePasswordData } from '../../types/profile.types';
import MainLayout from '../../layout/Main';

export default function ProfileSecurityPage() {
    const { token } = useAuth();
    const [saving, setSaving] = useState(false);

    const [passwordData, setPasswordData] = useState<ChangePasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = async () => {
        if (!token) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            notifications.show({
                title: 'Error',
                message: 'Passwords do not match',
                color: 'red',
            });
            return;
        }

        try {
            setSaving(true);
            const response = await changePassword(token, passwordData);

            notifications.show({
                title: 'Success',
                message: response.message || 'Password changed successfully',
                color: 'green',
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to change password',
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Paper p="xl" radius="md" withBorder>
                    <Title order={3} mb="lg">Change Password</Title>

                    <Stack gap="md" style={{ maxWidth: 500 }}>
                        <PasswordInput
                            label="Current Password"
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                        />

                        <PasswordInput
                            label="New Password"
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                        />

                        <Button
                            onClick={handlePasswordChange}
                            loading={saving}
                            leftSection={<IconKey size={16} />}
                        >
                            Change Password
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </MainLayout>
    );
}
