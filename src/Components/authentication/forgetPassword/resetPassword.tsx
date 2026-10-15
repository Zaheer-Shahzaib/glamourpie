"use client";

import { Alert, Button, PasswordInput, useMantineTheme } from "@mantine/core";
import { IconInfoCircle, IconLock } from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { PATH_AUTH } from "../../../routes/index";
import { api } from "../../../Services/api";
import PasswordRules from "../../CustomComponent/passwordRules";
import AuthShell, { authUi } from "../AuthShell";

function ResetPassword() {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [SearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const token = SearchParams.get("token");
  const email = SearchParams.get("email");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const form = useForm({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    validate: {
      newPassword: (value: string) =>
        value.length < 12 ? "Password must be at least 12 characters" : null,

      confirmPassword: (
        value: string,
        values: { newPassword: string; confirmPassword: string },
      ) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
  });

  const handleClick = async (values: typeof form.values) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await api.post("/api/reset-password", {
        newPassword: values.newPassword,
        token,
        email,
      });

      notifications.show({
        title: "Success",
        message: "Password has been reset successfully!",
        color: theme.colors.green[4],
        position: "top-right",
      });

      navigate(PATH_AUTH.signin);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again.";
      form.setErrors({
        newPassword: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Password Reset</title>
      <meta
        name="description"
        content="Choose a new password for your RunAnalytic account."
      />
      <AuthShell
        eyebrow="Secure your SellerCenter account"
        headline="Choose a new password"
        title="Choose a new password"
        subtitle="Enter your new password to reset!"
      >
        <form
          className={authUi.form}
          onSubmit={form.onSubmit((values) => handleClick(values))}
        >
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

          <div>
            <PasswordInput
              label="New password"
              placeholder="Enter new password"
              autoComplete="new-password"
              leftSection={<IconLock size={16} />}
              required
              {...form.getInputProps("newPassword")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <PasswordRules
              password={form.values.newPassword}
              focused={passwordFocused}
            />
          </div>

          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className={authUi.submit}
          >
            Reset password
          </Button>

          <Link to={PATH_AUTH.signin} className={authUi.back}>
            ← Back to sign in
          </Link>
        </form>
      </AuthShell>
    </>
  );
}

export default ResetPassword;
