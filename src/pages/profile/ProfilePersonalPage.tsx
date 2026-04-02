import { useState, useEffect } from 'react';
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
    Select,
    FileButton,
    ActionIcon,
    useMantineTheme,
} from '@mantine/core';
import {
    IconUser,
    IconMail,
    IconPhone,
    IconBuilding,
    IconMapPin,
    IconCamera,
    IconTrash,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { UpdateProfileData } from '../../types/profile.types';
import { useAuth } from '../../Context/useAuth';
import { deleteAvatar, updateUserProfile, uploadAvatar } from '../../Services/user-services';
import MainLayout from '../../layout/Main';
import { getAvatarUrl } from '../../utils/helperFunctions';


export default function ProfilePersonalPage() {
    const { profile, token, loading } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const theme = useMantineTheme()

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

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                firstname: profile.firstname || '',
                lastname: profile.lastname || '',
                phone: profile.phone || '',
                company: profile.company || '',
                taxId: profile.taxId || '',
                marketplace: profile.marketplace || '',
                address: {
                    street: profile.address?.street || '',
                    city: profile.address?.city || '',
                    state: profile.address?.state || '',
                    postalCode: profile.address?.postalCode || '',
                    country: profile.address?.country || '',
                },
            });
        }
    }, [profile]);

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

            // window.location.reload();
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
                    {/* Header with Avatar */}
                    <Paper p="xl" radius="md" withBorder>
                        <Group justify="space-between">
                            <Group>
                                <div style={{ position: 'relative' }}>
                                    <Avatar src={getAvatarUrl(profile?.avatar)} size={100} radius='md'>
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
                                    <Title order={2}>{profile.firstname}</Title>
                                    <Text c={theme.colors.green[4]} size="sm">{profile.email}</Text>
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

                    {/* Personal Information */}
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
                                        size="sm"
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Email"
                                        value={profile.email}
                                        disabled
                                        leftSection={<IconMail size={16} />}
                                        size="sm"
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
                                        size="sm"
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        disabled={!editMode}
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
                                    />
                                </Grid.Col>
                            </Grid>

                            <Grid>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="Tax ID / VAT Number"
                                        placeholder="Enter tax ID"
                                        value={formData.taxId}
                                        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                        disabled={!editMode}
                                        size="sm"
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
                                        size="sm"
                                    />
                                </Grid.Col>
                            </Grid>

                            <Title order={4} mt="md">Address</Title>

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
                                size="sm"
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
                                        size="sm"
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput
                                        label="State / Province"
                                        placeholder="Enter state"
                                        value={formData.address?.state}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: { ...formData.address, state: e.target.value },
                                            })
                                        }
                                        disabled={!editMode}
                                        size="sm"
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
                                        size="sm"
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
                                        size="sm"
                                    />
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </MainLayout>
    );
}
