import { API_BASE_URL } from "../Services/api";

export const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;

    if (avatarPath.startsWith('http')) {
        return avatarPath;
    }

    const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${API_BASE_URL}${path}`;
};