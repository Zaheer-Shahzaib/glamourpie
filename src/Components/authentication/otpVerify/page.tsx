import React, { useEffect, useState } from "react";
import { Alert, Button, PinInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../Services/api";
import { useAuth } from "../../../Context/useAuth";
import { PATH_AUTH, PATH_DASHBOARD } from "../../../routes";
import AuthShell, { authUi } from "../AuthShell";

function OTPVerify() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const OTP_EXPIRY_SECONDS = 30;
  const { login } = useAuth();
  const form = useForm({
    initialValues: { otp: "" },
    validate: {
      otp: (value: string) =>
        /^\d{6}$/.test(value) ? null : "OTP must be a 6-digit number",
    },
  });

  const email =
    localStorage.getItem("signup_email") || localStorage.getItem("otp_email");

  useEffect(() => {
    const updateTimer = () => {
      const expiry = parseInt(localStorage.getItem("otp_expiry") || "0", 10);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimer(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (values: typeof form.values) => {
    setSubmitting(true);
    setError(null);

    try {
      // Get stored email and rememberMe (signup or login)
      const storedEmail =
        localStorage.getItem("signup_email") ||
        localStorage.getItem("otp_email");
      const rememberMe = localStorage.getItem("rememberMe") === "true";

      if (!storedEmail) {
        setError("Email not found. Please login/signup again.");
        return;
      }

      // Call backend verifyOtp endpoint
      const response = await api.post("/api/verifyOtp", {
        email: storedEmail,
        otp: values.otp,
        isRememberMe: rememberMe,
      });

      if (response.status === 200) {
        // Remove stored email and expiry
        localStorage.removeItem("otp_expiry");
        localStorage.removeItem("signup_email");
        localStorage.removeItem("otp_email");
        localStorage.removeItem("rememberMe");

        // Assign JWT token
        login(response.data.token, rememberMe);

        notifications.show({
          title: "Success",
          message: "OTP verified successfully!",
          color: "green",
          position: "top-right",
        });

        navigate(PATH_DASHBOARD.default);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle resending OTP
  const handleResend = async () => {
    const storedEmail =
      localStorage.getItem("signup_email") || localStorage.getItem("otp_email");
    if (!storedEmail) {
      setError("Email not found. Please login/signup again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/api/resendOtp", { email: storedEmail });
      if (response.status === 200) {
        notifications.show({
          title: "Success",
          message: "OTP resent successfully!",
          color: "green",
          position: "top-right",
        });

        const newExpiry = Date.now() + OTP_EXPIRY_SECONDS * 1000;
        localStorage.setItem("otp_expiry", String(newExpiry));
        setTimer(OTP_EXPIRY_SECONDS);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedTimer = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(
    timer % 60,
  ).padStart(2, "0")}`;

  return (
    <>
      <title>OTP Verification</title>
      <AuthShell
        eyebrow="Secure your SellerCenter account"
        headline="Verify your email"
        title="Verify your email"
        subtitle="Secure your SellerCenter account"
      >
        <form className={authUi.form} onSubmit={form.onSubmit(handleVerify)}>
          {error && (
            <Alert
              variant="light"
              color="red"
              radius="md"
              icon={<IconInfoCircle />}
            >
              {error}
            </Alert>
          )}

          <p className={authUi.footerText} style={{ fontSize: 14 }}>
            We sent a 6-digit code to {email ?? "your email"}
          </p>

          <div className={authUi.pinRow}>
            <PinInput
              length={6}
              type="number"
              oneTimeCode
              size="lg"
              gap={16}
              inputMode="numeric"
              aria-label="One-time code"
              error={Boolean(form.errors.otp)}
              {...form.getInputProps("otp")}
            />
          </div>
          {form.errors.otp && (
            <p className={authUi.note} style={{ color: "var(--ra-color-danger)" }}>
              {form.errors.otp}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            className={authUi.submit}
          >
            Verify code
          </Button>

          {timer > 0 && (
            <p className={authUi.footerText}>
              You can request a new code in {formattedTimer}
            </p>
          )}

          <p className={authUi.footerText}>
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              className={authUi.link}
              onClick={handleResend}
              disabled={submitting || timer > 0}
            >
              Resend code
            </button>
          </p>

          <Link to={PATH_AUTH.signin} className={authUi.mutedLink}>
            ← Back to sign in
          </Link>
        </form>
      </AuthShell>
    </>
  );
}

export default OTPVerify;
