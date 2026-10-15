"use client";

import {
  Alert,
  Button,
  Checkbox,
  PasswordInput,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PATH_AUTH } from "../../../routes";
import { api, API_BASE_URL } from "../../../Services/api";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { IconAt, IconInfoCircle, IconLock } from "@tabler/icons-react";
import AuthShell, { authUi } from "../AuthShell";

function LoginPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amazonConnecting, setAmazonConnecting] = useState(false);

  // Amazon SSO round-trip: the provider redirects back here with `code` / `error` params.
  useEffect(() => {
    const code = searchParams.get("code");
    const amzError =
      searchParams.get("error_description") || searchParams.get("error");

    if (amzError) {
      setErrorMessage(amzError);
      searchParams.delete("error");
      searchParams.delete("error_description");
      setSearchParams(searchParams);
    } else if (code && !amazonConnecting) {
      setAmazonConnecting(true);
      window.location.href = `${API_BASE_URL}/api/amazon/callback?code=${encodeURIComponent(code)}`;
    }
  }, [searchParams]);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value: string) =>
        /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Please enter a valid email address",
      password: (value: any) =>
        value && value?.length < 12
          ? "Password must include at least 12 characters"
          : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const resp = await api.post("/api/signin", {
        ...values,
        isRememberMe: rememberMe,
      });

      if (resp.status === 200) {
        // Save email & rememberMe for OTP verification
        localStorage.setItem("otp_email", values.email);
        localStorage.setItem("rememberMe", rememberMe.toString());

        notifications.show({
          title: "Success",
          message: "OTP sent successfully!",
          color: theme.colors.green[4],
          position: "top-right",
        });

        navigate(PATH_AUTH.otpVerify);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Sign in | Runanalytic Invoice</title>
      <meta
        name="description"
        content="Sign in to your RunAnalytic SellerCenter workspace."
      />
      <AuthShell
        eyebrow="Welcome back"
        headline="Sign in to SellerCenter"
        title="Sign in to SellerCenter"
        subtitle="Welcome back"
      >
        <form className={authUi.form} onSubmit={form.onSubmit(handleSubmit)}>
          {errorMessage && (
            <Alert
              variant="light"
              color="red"
              radius="md"
              icon={<IconInfoCircle />}
            >
              {errorMessage}
            </Alert>
          )}

          <TextInput
            label="Email address"
            placeholder="alex@example.com"
            required
            autoComplete="email"
            leftSection={<IconAt size={16} />}
            {...form.getInputProps("email")}
          />

          <div>
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              autoComplete="current-password"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps("password")}
            />
            <div className={authUi.between} style={{ marginTop: 14 }}>
              <Checkbox
                size="xs"
                label="Remember me"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.currentTarget.checked)}
              />
              <Link to={PATH_AUTH.forgetPassword} className={authUi.link}>
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className={authUi.submit}
          >
            Sign in
          </Button>

          <div className={authUi.divider}>OR</div>

          {/* No Google sign-in backend exists yet, so the SSO button is shown disabled. */}
          <Tooltip label="Coming soon" position="bottom">
            <div>
              <Button
                type="button"
                fullWidth
                disabled
                className={`${authUi.submit} ${authUi.sso}`}
              >
                Continue with Google
              </Button>
            </div>
          </Tooltip>

          <p className={authUi.footerText}>
            New to SellerCenter? <Link to={PATH_AUTH.signup}>Create an account</Link>
          </p>
        </form>
      </AuthShell>
    </>
  );
}

export default LoginPage;
