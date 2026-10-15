"use client";

import {
  Alert,
  Button,
  PasswordInput,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { PATH_AUTH, PATH_PAGES } from "../../../routes";
import { api } from "../../../Services/api";
import { useState } from "react";
import { IconAt, IconInfoCircle, IconLock } from "@tabler/icons-react";
import PasswordRules from "../../CustomComponent/passwordRules";
import AuthShell, { authUi } from "../AuthShell";

function SignupPage() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const OTP_EXPIRY_SECONDS = 30;

  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },

    validate: {
      firstname: (value: string) =>
        String(value).trim().length === 0 ? "first name is required" : null,
      lastname: (value: string) =>
        String(value).trim().length === 0 ? "last name is required" : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

        if (!value || value.length < 12) {
          return "Password must include at least 12 characters";
        }

        if (!passwordRegex.test(value)) {
          return "Password must include at least one uppercase letter, one numeric character, and one special character";
        }

        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const resp = await api.post("/api/signup", { ...values });
      if (resp.data.otpSent === true) {
        // Store email & expiry for OTP verification
        localStorage.setItem("signup_email", values.email);
        const newExpiry = Date.now() + OTP_EXPIRY_SECONDS * 1000;
        localStorage.setItem("otp_expiry", String(newExpiry));

        notifications.show({
          title: "Success",
          message: "OTP sent to your email address!",
          color: theme.colors.green[4],
          position: "top-right",
        });

        navigate(PATH_AUTH.otpVerify);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Sign up</title>
      <meta
        name="description"
        content="Create your RunAnalytic SellerCenter workspace."
      />
      <AuthShell
        eyebrow="Start with a clear view of your Amazon business"
        headline="Create your SellerCenter workspace"
        title="Create your workspace"
        subtitle="Start with a clear view of your Amazon business"
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

          <div className={authUi.row}>
            <TextInput
              label="First name"
              placeholder="Alex"
              autoComplete="given-name"
              required
              {...form.getInputProps("firstname")}
            />
            <TextInput
              label="Last name"
              placeholder="Morgan"
              autoComplete="family-name"
              required
              {...form.getInputProps("lastname")}
            />
          </div>

          <TextInput
            label="Work email"
            placeholder="alex@example.com"
            autoComplete="email"
            leftSection={<IconAt size={16} />}
            required
            {...form.getInputProps("email")}
          />

          <div>
            <PasswordInput
              label="Password"
              placeholder="Create a password"
              autoComplete="new-password"
              leftSection={<IconLock size={16} />}
              inputWrapperOrder={["label", "input", "description", "error"]}
              description="At least 12 characters with an uppercase letter, a number and a special character."
              required
              {...form.getInputProps("password")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <PasswordRules
              password={form.values.password}
              focused={passwordFocused}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className={authUi.submit}
          >
            Create account
          </Button>

          <p className={authUi.note}>
            By continuing, you agree to our{" "}
            <Link to={PATH_PAGES.terms}>Terms</Link> and{" "}
            <Link to={PATH_PAGES.privacy}>Privacy Policy</Link>.
          </p>

          <p className={authUi.footerText}>
            Already have an account? <Link to={PATH_AUTH.signin}>Sign in</Link>
          </p>
        </form>
      </AuthShell>
    </>
  );
}

export default SignupPage;
