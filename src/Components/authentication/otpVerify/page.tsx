import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
// import { PATH_AUTH } from "../../../routes/index";
import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
// import { Link } from "react-router-dom";
import PasswordLayout from "./layout";
import { api } from "../../../Services/api";

function OTPVerify() {
  const mobile_match = useMediaQuery("(max-width: 425px)");
  const theme = useMantineTheme();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120);
  const OTP_EXPIRY_SECONDS = 120;

  const form = useForm({
    initialValues: {
      otp: "",
    },
    validate: {
      otp: (value: string) =>
        /^\d{6}$/.test(value) ? null : "OTP must be a 6-digit number",
    },
  });

 useEffect(() => {
  // Try to get expiry from localStorage
  const expiry = localStorage.getItem("otp_expiry");
  let expiryTime = expiry ? parseInt(expiry, 10) : undefined;
  const now = Date.now();

  if (!expiryTime || expiryTime < now) {
    expiryTime = now + OTP_EXPIRY_SECONDS * 1000;
    localStorage.setItem("otp_expiry", String(expiryTime));
  }

  const initialTimer = Math.max(0, Math.floor((expiryTime - now) / 1000));
  setTimer(initialTimer);
  setResendDisabled(initialTimer > 0);

  const interval = setInterval(() => {
    const now = Date.now();
    // Ensure expiryTime is defined and a number
    if (typeof expiryTime === "number") {
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimer(remaining);
      setResendDisabled(remaining > 0);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const handleVerify = async (values: typeof form.values) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/verifyOtp", { otp: values.otp });
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for resending OTP
  const handleResend = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/resendOtp");
      setError("OTP resend successfully!");
      const newExpiry = Date.now() + OTP_EXPIRY_SECONDS * 1000;
      localStorage.setItem("otp_expiry", String(newExpiry));
      setTimer(OTP_EXPIRY_SECONDS);
      setResendDisabled(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>OTP Verification</title>
      <meta
        name='description'
        content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
      />
      <PasswordLayout>
        <Title ta='center'>OTP Verification</Title>
        <Text ta='center'>
          Please Enter the 6 digit OTP Code that we send to your email
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
              title=''
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
                // color='gray'
                onClick={handleResend}
                loading={submitting}
                type='button'
                disabled={resendDisabled}

              >
                {resendDisabled
                  ? `Resend in ${Math.floor(timer / 60)}:${String(
                      timer % 60
                    ).padStart(2, "0")}`
                  : "Re-Send"}
              </Button>
              <Button
                type='submit'
                loading={submitting}
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
