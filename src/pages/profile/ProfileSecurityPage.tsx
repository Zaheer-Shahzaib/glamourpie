import { useState } from 'react';
import {
    Stack,
    Button,
    PasswordInput,
} from '@mantine/core';
import { AppCard, PageHeader, appButton } from '../../Components/AppUi';
import ProfileTabs from '../../Components/Profile/ProfileTabs';
import classes from './ProfilePage.module.scss';
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
            <PageHeader
                title="Profile"
                subtitle="Manage your identity, contact details, and account security."
            />
            <AppCard>
                    <ProfileTabs active="security" />
                    <h2 className={classes.securityTitle}>Change password</h2>
                    <p className={classes.securitySubtitle}>
                        Keep your SellerCenter account secure with a strong password.
                    </p>
                    <hr className={classes.securityRule} />

                    <Stack gap="md" className={classes.securityForm}>
                        <PasswordInput
                            label="Current password"
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                        />

                        <PasswordInput
                            label="New password"
                            placeholder="Enter new password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                        />

                        <PasswordInput
                            label="Confirm new password"
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                        />

                        <Button
                            className={appButton('primary')}
                            onClick={handlePasswordChange}
                            loading={saving}
                            leftSection={<IconKey size={16} />}
                            fullWidth
                            mt="sm"
                        >
                            Change password
                        </Button>
                    </Stack>
            </AppCard>
        </MainLayout>
    );
}
