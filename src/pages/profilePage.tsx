import { useState } from 'react';
import {
    Container,
    Paper,
    Title,
    Text,
    Stack,
    Group,
    Avatar,
    Button,
    TextInput,
    Grid,
    Divider,
    Badge,
    FileButton,
    ActionIcon,
    Tabs,
    PasswordInput,
    Select,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconPhone,
    IconBuilding,
    IconMapPin,
    IconCamera,
    IconTrash,
    IconKey,
    IconShield,
    IconChartBar,
} from '@tabler/icons-react';
import { useAuth } from '../Context/useAuth';
import { notifications } from '@mantine/notifications';
import {
    updateUserProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    getApiCredentials,
    updateApiCredentials,
    getProfileStats,
} from '../Services/user-services';
import { UpdateProfileData, ChangePasswordData, ApiCredentials, ProfileStats } from '../types/profile.types';
import MainLayout from '../layout/Main';

export default function ProfilePage() {
    const { profile, token, loading } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Profile form state
    const [formData, setFormData] = useState<UpdateProfileData>({
        username: profile?.username || '',
        firstname: profile?.firstname || '',
        lastname: profile?.lastname || '',
        phone: profile?.phone || '',
        company: profile?.company || '',
        taxId: profile?.taxId || '',
        marketplace: profile?.marketplace || '',
        address: {
            street: profile?.address?.street || '',
            city: profile?.address?.city || '',
            state: profile?.address?.state || '',
            postalCode: profile?.address?.postalCode || '',
            country: profile?.address?.country || '',
        },
    });

    // Password form state
    const [passwordData, setPasswordData] = useState<ChangePasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // API Credentials state
    const [credentials, setCredentials] = useState<ApiCredentials | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);

    const handleAvatarUpload = async (file: File | null) => {
        if (!file || !token) return;

        try {
            setUploading(true);
            const response = await uploadAvatar(token, file);

            notifications.show({
                title: 'Success',
                message: response.message || 'Avatar uploaded successfully',
                color: 'green',
            });

            // Refresh page to show new avatar
            window.location.reload();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to upload avatar',
                color: 'red',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!token) return;

        try {
            setUploading(true);
            const response = await deleteAvatar(token);

            notifications.show({
                title: 'Success',
                message: response.message || 'Avatar deleted successfully',
                color: 'green',
            });

            window.location.reload();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete avatar',
                color: 'red',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async () => {
        if (!token) return;

        try {
            setSaving(true);
            await updateUserProfile(token, formData);

            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
            });

            setEditMode(false);
            window.location.reload();
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to update profile',
                color: 'red',
            });
        } finally {
            setSaving(false);
        }
    };

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

    const loadCredentials = async () => {
        if (!token) return;

        try {
            const data = await getApiCredentials(token);
            setCredentials(data);
        } catch (error) {
            console.error('Failed to load credentials:', error);
        }
    };

    const loadStats = async () => {
        if (!token) return;

        try {
            const data = await getProfileStats(token);
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    if (loading || !profile) {
        return (
            <MainLayout>
                <Container size="lg" py="xl">
                    <Text>Loading profile...</Text>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container size="lg" py="xl">
                <Stack gap="lg">
                    {/* Header */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group justify="space-between">
                            <Group>
                                <div style={{ position: 'relative' }}>
                                    <Avatar
                                        src={profile.avatar}
                                        size={100}
                                        radius="xl"
                                    >
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <FileButton onChange={handleAvatarUpload} accept="image/*">
                                        {(props) => (
                                            <ActionIcon
                                                {...props}
                                                variant="filled"
                                                color="blue"
                                                size="sm"
                                                radius="xl"
                                                loading={uploading}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                }}
                                            >
                                                <IconCamera size={14} />
                                            </ActionIcon>
                                        )}
                                    </FileButton>
                                </div>

                                <div>
                                    <Title order={2}>{profile.username}</Title>
                                    <Text c="dimmed" size="sm">{profile.email}</Text>
                                    {profile.company && (
                                        <Badge variant="light" mt="xs">
                                            {profile.company}
                                        </Badge>
                                    )}
                                </div>
                            </Group>

                            {profile.avatar && (
                                <Button
                                    variant="subtle"
                                    color="red"
                                    leftSection={<IconTrash size={16} />}
                                    onClick={handleAvatarDelete}
                                    loading={uploading}
                                >
                                    Remove Avatar
                                </Button>
                            )}
                        </Group>
                    </Paper>

                    {/* Tabs */}
                    <Tabs defaultValue="profile">
                        <Tabs.List>
                            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                                Profile Information
                            </Tabs.Tab>
                            <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
                                Security
                            </Tabs.Tab>
                            <Tabs.Tab value="api" leftSection={<IconKey size={16} />}>
                                API Credentials
                            </Tabs.Tab>
                            <Tabs.Tab value="stats" leftSection={<IconChartBar size={16} />}>
                                Statistics
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* Profile Tab */}
                        <Tabs.Panel value="profile" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Group justify="space-between" mb="lg">
                                    <Title order={3}>Personal Information</Title>
                                    {!editMode ? (
                                        <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                                    ) : (
                                        <Group>
                                            <Button variant="subtle" onClick={() => setEditMode(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleProfileUpdate} loading={saving}>
                                                Save Changes
                                            </Button>
                                        </Group>
                                    )}
                                </Group>

                                <Stack gap="md">
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Username"
                                                placeholder="Enter username"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                disabled={!editMode}
                                                leftSection={<IconUser size={16} />}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Email"
                                                value={profile.email}
                                                disabled
                                                leftSection={<IconMail size={16} />}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="First Name"
                                                placeholder="Enter first name"
                                                value={formData.firstname}
                                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Last Name"
                                                placeholder="Enter last name"
                                                value={formData.lastname}
                                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Phone"
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={!editMode}
                                                leftSection={<IconPhone size={16} />}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Company"
                                                placeholder="Enter company name"
                                                value={formData.company}
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                                disabled={!editMode}
                                                leftSection={<IconBuilding size={16} />}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Divider label="Business Information" labelPosition="center" />

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Tax ID / VAT Number"
                                                placeholder="Enter tax ID"
                                                value={formData.taxId}
                                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Select
                                                label="Primary Marketplace"
                                                placeholder="Select marketplace"
                                                value={formData.marketplace}
                                                onChange={(value) => setFormData({ ...formData, marketplace: value || '' })}
                                                disabled={!editMode}
                                                data={[
                                                    { value: 'amazon.ae', label: 'Amazon UAE' },
                                                    { value: 'amazon.com.br', label: 'Amazon Brazil' },
                                                    { value: 'amazon.in', label: 'Amazon India' },
                                                    { value: 'amazon.com', label: 'Amazon US' },
                                                ]}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Divider label="Address" labelPosition="center" />

                                    <TextInput
                                        label="Street Address"
                                        placeholder="Enter street address"
                                        value={formData.address?.street}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: { ...formData.address, street: e.target.value },
                                            })
                                        }
                                        disabled={!editMode}
                                        leftSection={<IconMapPin size={16} />}
                                    />

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="City"
                                                placeholder="Enter city"
                                                value={formData.address?.city}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, city: e.target.value },
                                                    })
                                                }
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="State/Province"
                                                placeholder="Enter state"
                                                value={formData.address?.state}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, state: e.target.value },
                                                    })
                                                }
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Postal Code"
                                                placeholder="Enter postal code"
                                                value={formData.address?.postalCode}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, postalCode: e.target.value },
                                                    })
                                                }
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <TextInput
                                                label="Country"
                                                placeholder="Enter country"
                                                value={formData.address?.country}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, country: e.target.value },
                                                    })
                                                }
                                                disabled={!editMode}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                </Stack>
                            </Paper>
                        </Tabs.Panel>

                        {/* Security Tab */}
                        <Tabs.Panel value="security" pt="lg">
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
                        </Tabs.Panel>

                        {/* API Credentials Tab */}
                        <Tabs.Panel value="api" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Group justify="space-between" mb="lg">
                                    <Title order={3}>Amazon SP-API Credentials</Title>
                                    <Button onClick={loadCredentials}>Load Credentials</Button>
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
                        </Tabs.Panel>

                        {/* Statistics Tab */}
                        <Tabs.Panel value="stats" pt="lg">
                            <Paper p="xl" radius="md" withBorder>
                                <Group justify="space-between" mb="lg">
                                    <Title order={3}>Account Statistics</Title>
                                    <Button onClick={loadStats}>Refresh Stats</Button>
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
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Container>
        </MainLayout>
    );
}
