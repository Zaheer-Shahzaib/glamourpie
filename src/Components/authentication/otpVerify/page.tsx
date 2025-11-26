import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import PasswordLayout from "./layout";
import { api } from "../../../Services/api";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../../Context/useAuth";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "../../../routes";
import { fetchUserProfile } from "../../../Services/user-services";

function OTPVerify() {
  const mobile_match = useMediaQuery("(max-width: 425px)");
  const theme = useMantineTheme();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const { profile } = useAuth();
  const navigate = useNavigate();
  const OTP_EXPIRY_SECONDS = 120;
  const { login } = useAuth();
  const form = useForm({
    initialValues: { otp: "" },
    validate: {
      otp: (value: string) =>
        /^\d{6}$/.test(value) ? null : "OTP must be a 6-digit number",
    },
  });

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
      const email =
        localStorage.getItem("signup_email") ||
        localStorage.getItem("otp_email");
      const rememberMe =
        localStorage.getItem("rememberMe") === "true" ? true : false;

      if (!email) {
        setError("Email not found. Please login/signup again.");
        return;
      }

      // Call backend verifyOtp endpoint
      const response = await api.post("/api/verifyOtp", {
        email,
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
    const email =
      localStorage.getItem("signup_email") ||
      localStorage.getItem("otp_email");
    if (!email) {
      setError("Email not found. Please login/signup again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await api.post("/api/resendOtp", { email });
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

  return (
    <>
      <title>OTP Verification</title>
      <PasswordLayout>
        <Title ta='center'>OTP Verification</Title>
        <Text ta='center'>
          Please Enter the 6 digit OTP Code that we sent to your email
        </Text>

        <Surface
          component={Paper}
          className={classes.card}
        >
          {error && (
            <Alert
              variant='light'
              c={theme.colors.red[8]}
              radius='lg'
              icon={<IconInfoCircle />}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleVerify)}>
            <TextInput
              label='Enter OTP'
              placeholder='123456'
              required
              {...form.getInputProps("otp")}
            />

            <Group
              justify='space-between'
              mt='lg'
              className={classes.controls}
            >
              <Button
                variant='subtle'
                onClick={handleResend}
                loading={submitting}
                type='button'
                disabled={timer > 0}
              >
                {timer > 0
                  ? `Resend in ${Math.floor(timer / 60)}:${String(
                      timer % 60
                    ).padStart(2, "0")}`
                  : "Re-Send"}
              </Button>

              <Button
                type='submit'
                // loading={submitting}
                fullWidth={mobile_match}
              >
                Verify OTP
              </Button>
            </Group>
          </form>
        </Surface>
      </PasswordLayout>
    </>
  );
}

export default OTPVerify;
