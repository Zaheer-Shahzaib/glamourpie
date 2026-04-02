import { api } from "./api";
import { UserProfile, UpdateProfileData, ChangePasswordData, ApiCredentials, ProfileStats } from "../types/profile.types";

/**
 * Fetch user profile
 */
export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const response = await api.get(`/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data?.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  token: string,
  data: UpdateProfileData
): Promise<UserProfile> => {
  const response = await api.put(`/api/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (
  token: string,
  data: ChangePasswordData
): Promise<{ message: string }> => {
  const response = await api.post(`/api/profile/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (
  token: string,
  file: File
): Promise<{ avatar: string; message: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post(`/api/profile/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete avatar
 */
export const deleteAvatar = async (
  token: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/api/profile/avatar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get API credentials
 */
export const getApiCredentials = async (
  token: string
): Promise<ApiCredentials> => {
  const response = await api.get(`/api/profile/credentials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Update API credentials
 */
export const updateApiCredentials = async (
  token: string,
  data: Partial<ApiCredentials>
): Promise<ApiCredentials> => {
  const response = await api.put(`/api/profile/credentials`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get profile statistics
 */
export const getProfileStats = async (
  token: string
): Promise<ProfileStats> => {
  const response = await api.get(`/api/profile/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
