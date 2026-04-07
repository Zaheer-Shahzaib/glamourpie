import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/useAuth";
import { PATH_DASHBOARD, PATH_AUTH } from "../../../routes";
import { Center, Loader, Text, Stack } from "@mantine/core";

export default function SsoCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            login(token, true); // true sets persistent login / SSO cookie
            // Allow a brief moment for Context to register before redirecting
            setTimeout(() => {
                navigate(PATH_DASHBOARD.default, { replace: true });
            }, 300);
        } else {
            navigate(`${PATH_AUTH.signin}?error=invalid_token`, { replace: true });
        }
    }, [searchParams, login, navigate]);

    return (
        <Center style={{ height: '100vh' }}>
            <Stack align="center">
                <Loader size="lg" color="blue" />
                <Text size="lg" fw={500}>Completing Amazon Single Sign-On...</Text>
            </Stack>
        </Center>
    );
}
