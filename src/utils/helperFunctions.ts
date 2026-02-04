import { BACKEND_URL } from "../Services/api";

export const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return undefined;

    // If avatar already has full URL (starts with http), use it as-is
    if (avatarPath.startsWith('http')) {
        return avatarPath;
    }

    // Construct full URL using backend URL
    // Ensure the path starts with /
    const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${BACKEND_URL}${path}`;
};