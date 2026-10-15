import { useState, useEffect, useMemo } from "react";
import {
  Text,
  Avatar,
  Button,
  TextInput,
  Select,
  FileButton,
  ActionIcon,
} from "@mantine/core";
import { IconCamera, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { UpdateProfileData } from "../../types/profile.types";
import { useAuth } from "../../Context/useAuth";
import {
  deleteAvatar,
  updateUserProfile,
  uploadAvatar,
} from "../../Services/user-services";
import MainLayout from "../../layout/Main";
import { getAvatarUrl } from "../../utils/helperFunctions";
import {
  AppCard,
  PageHeader,
  appButton,
  ui,
} from "../../Components/AppUi";
import ProfileTabs from "../../Components/Profile/ProfileTabs";
import {
  pickBestPlan,
  useSubscriptionStatus,
} from "../../hooks/useSubscriptionStatus";
import classes from "./ProfilePage.module.scss";

const MARKETPLACE_OPTIONS = [
  { value: "amazon.ae", label: "Amazon UAE" },
  { value: "amazon.com.br", label: "Amazon Brazil" },
  { value: "amazon.in", label: "Amazon India" },
  { value: "amazon.com", label: "Amazon US" },
];

export default function ProfilePersonalPage() {
  const { profile, token, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: subscription } = useSubscriptionStatus();
  const activePlan = useMemo(
    () => pickBestPlan(subscription?.activePlans || []),
    [subscription],
  );

  // The profile API has no timezone field yet — show the browser's zone read-only.
  const browserTimezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch {
      return "";
    }
  }, []);

  const [formData, setFormData] = useState<UpdateProfileData>({
    username: profile?.username || "",
    firstname: profile?.firstname || "",
    lastname: profile?.lastname || "",
    phone: profile?.phone || "",
    company: profile?.company || "",
    taxId: profile?.taxId || "",
    marketplace: profile?.marketplace || "",
    address: {
      street: profile?.address?.street || "",
      city: profile?.address?.city || "",
      state: profile?.address?.state || "",
      postalCode: profile?.address?.postalCode || "",
      country: profile?.address?.country || "",
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        phone: profile.phone || "",
        company: profile.company || "",
        taxId: profile.taxId || "",
        marketplace: profile.marketplace || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          postalCode: profile.address?.postalCode || "",
          country: profile.address?.country || "",
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
        title: "Success",
        message: response.message || "Avatar uploaded successfully",
        color: "green",
      });

      // window.location.reload();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to upload avatar",
        color: "red",
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
        title: "Success",
        message: response.message || "Avatar deleted successfully",
        color: "green",
      });

      window.location.reload();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete avatar",
        color: "red",
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
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });

      setEditMode(false);
      window.location.reload();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update profile",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        phone: profile.phone || "",
        company: profile.company || "",
        taxId: profile.taxId || "",
        marketplace: profile.marketplace || "",
        address: {
          street: profile.address?.street || "",
          city: profile.address?.city || "",
          state: profile.address?.state || "",
          postalCode: profile.address?.postalCode || "",
          country: profile.address?.country || "",
        },
      }));
    }
  };

  if (loading || !profile) {
    return (
      <MainLayout>
        <Text c="dimmed">Loading profile...</Text>
      </MainLayout>
    );
  }

  const displayName =
    [profile.firstname, profile.lastname].filter(Boolean).join(" ") ||
    profile.username;
  const initials =
    [profile.firstname, profile.lastname]
      .filter(Boolean)
      .map((n) => n!.charAt(0))
      .join("")
      .toUpperCase() || (profile.username || "?").charAt(0).toUpperCase();

  // Inputs stay white (as designed); they are simply read-only until "Edit profile".
  const readOnly = !editMode;

  return (
    <MainLayout>
      <PageHeader
        title="Profile"
        subtitle="Manage your identity, contact details, and account security."
      />

      {/* ── Identity card ───────────────────────────────────── */}
      <AppCard className={classes.identity}>
        <div className={classes.avatarWrap}>
          <Avatar
            src={getAvatarUrl(profile?.avatar)}
            size={72}
            radius={36}
            classNames={{ placeholder: classes.avatarPlaceholder }}
          >
            {initials}
          </Avatar>
          <FileButton onChange={handleAvatarUpload} accept="image/*">
            {(props) => (
              <ActionIcon
                {...props}
                className={classes.cameraBtn}
                variant="filled"
                size="sm"
                radius="xl"
                loading={uploading}
                aria-label="Upload avatar"
              >
                <IconCamera size={14} />
              </ActionIcon>
            )}
          </FileButton>
        </div>

        <div className={classes.identityText}>
          <h2 className={classes.name}>{displayName}</h2>
          <p className={classes.email}>{profile.email}</p>
        </div>

        <div className={classes.identityActions}>
          {activePlan && (
            <span className={classes.planPill}>
              {activePlan.toUpperCase()} PLAN
            </span>
          )}
          {profile.avatar && (
            <Button
              className={appButton("dangerText")}
              leftSection={<IconTrash size={16} />}
              onClick={handleAvatarDelete}
              loading={uploading}
            >
              Remove avatar
            </Button>
          )}
          {editMode ? (
            <Button className={appButton("light")} onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button
              className={appButton("primary")}
              onClick={() => setEditMode(true)}
            >
              Edit profile
            </Button>
          )}
        </div>
      </AppCard>

      {/* ── Personal information ────────────────────────────── */}
      <AppCard className={classes.formCard}>
        <h2 className={classes.formTitle}>Personal information</h2>
        <ProfileTabs active="personal" />

        <div className={classes.formGrid}>
          <TextInput label="Email" value={profile.email} disabled />
          <Select
            label="Primary marketplace"
            placeholder="Select marketplace"
            value={formData.marketplace || null}
            onChange={(value) =>
              setFormData({ ...formData, marketplace: value || "" })
            }
            readOnly={readOnly}
            data={MARKETPLACE_OPTIONS}
          />

          <TextInput
            label="First name"
            placeholder="Enter first name"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
            readOnly={readOnly}
          />
          <TextInput
            label="Last name"
            placeholder="Enter last name"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
            readOnly={readOnly}
          />

          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            readOnly={readOnly}
          />
          <TextInput
            label="Company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            readOnly={readOnly}
          />

          <TextInput
            label="Tax ID / VAT number"
            placeholder="Enter tax ID"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            readOnly={readOnly}
          />
          <TextInput
            label="Timezone"
            value={browserTimezone}
            description="Detected from your browser"
            disabled
          />
        </div>

        <h3 className={classes.sectionTitle}>Address</h3>
        <div className={classes.formGrid}>
          <TextInput
            className={classes.fullWidth}
            label="Street address"
            placeholder="Enter street address"
            value={formData.address?.street}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value },
              })
            }
            readOnly={readOnly}
          />
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
            readOnly={readOnly}
          />
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
            readOnly={readOnly}
          />
          <TextInput
            label="Postal code"
            placeholder="Enter postal code"
            value={formData.address?.postalCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: { ...formData.address, postalCode: e.target.value },
              })
            }
            readOnly={readOnly}
          />
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
            readOnly={readOnly}
          />
        </div>

        <div className={classes.formFooter}>
          <span className={ui.mutedText}>
            Profile changes are saved per workspace.
          </span>
          <Button
            className={appButton("primary")}
            onClick={handleProfileUpdate}
            loading={saving}
            disabled={!editMode}
          >
            Save changes
          </Button>
        </div>
      </AppCard>
    </MainLayout>
  );
}
