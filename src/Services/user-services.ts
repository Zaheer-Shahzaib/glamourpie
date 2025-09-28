import { api } from "./api";
export const fetchUserProfile = async (token: string) => {
  const response = await api.get(`/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};