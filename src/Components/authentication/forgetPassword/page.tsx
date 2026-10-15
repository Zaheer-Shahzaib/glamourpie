"use client";

import React from "react";
import { Alert, Button, TextInput, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAt, IconInfoCircle } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { PATH_AUTH } from "../../../routes/index";
import { api } from "../../../Services/api";
import AuthShell, { authUi } from "../AuthShell";

function ForgetPassword() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value: string) =>
        /^\S+@\S+\.\S+$/.test(value)
          ? null
          : "Please enter a valid email address",
    },
  });

  const handleSubmit = async ({ email }: typeof form.values) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const respo = await api.post("/api/forgot-password", { email });
      if (respo.status === 200) {
        notifications.show({
          title: "Success",
          message: "A reset link has been sent to your email!",
          color: theme.colors.green[4],
          position: "top-right",
        });
      }
      navigate(PATH_AUTH.signin);
    } catch (error: any) {
      const message = error.response?.data?.message;
      setErrorMessage(message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Forgot your password</title>
      <meta
        name="description"
        content="Request a password-reset link for your RunAnalytic account."
      />
      <AuthShell
        eyebrow="Enter your email and we will help you get back in."
        headline="Reset your password"
        title="Reset your password"
        subtitle="Enter your email and we will help you get back in."
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

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className={authUi.submit}
          >
            Send reset link
          </Button>

          <p className={authUi.note}>
            We will send a secure password-reset link to your email.
          </p>

          <Link to={PATH_AUTH.signin} className={authUi.back}>
            ← Back to sign in
          </Link>
        </form>
      </AuthShell>
    </>
  );
}

export default ForgetPassword;
