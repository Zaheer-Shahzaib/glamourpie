"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Flex,
  NumberInput,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { PATH_AUTH } from "../../../routes";
import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import SignUpLayout from "./layout";
import { api } from "../../../Services/api";
import { useState } from "react";
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";
import { useAuth } from "../../../Context/useAuth";
import { values } from "lodash";
import PasswordRules from "../../CustomComponent/passwordRules";

function SignupPage() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const [passwordFocused, setPasswordFocused] = useState(false);

  const OTP_EXPIRY_SECONDS = 120;
  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      // phone: "",
      password: "",
    },

    validate: {
      firstname: (value: string) =>
        String(value).trim().length === 0 ? "first name is required" : null,
      lastname: (value: string) =>
        String(value).trim().length === 0 ? "last name is required" : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      // phone: (value: string | number) =>
      //   String(value).trim().length < 10 ? "Invalid phone number" : null,
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
      // Call signup API
      const resp = await api.post("/api/signup", { ...values });
      console.log(resp);
      if (resp.data.otpSent === true) {
        // Store email & remember info for OTP verification
        localStorage.setItem("signup_email", values.email);
        const newExpiry = Date.now() + OTP_EXPIRY_SECONDS * 1000;
        localStorage.setItem("otp_expiry", String(newExpiry));

        notifications.show({
          title: "Success",
          message: "OTP sent to your email address!",
          color: theme.colors.green[4],
          position: "top-right",
        });

        // Redirect to OTP verification page
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
      <>
        <title>Sign up</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components...'
        />
      </>
      <SignUpLayout>
        <Title ta='center'>Welcome!</Title>
        <Text ta='center'>Create your account to continue</Text>
        <Surface
          component={Paper}
          classNames={{ root: classes.card }}
        >
          <ActionIcon
            variant='filled'
            // color="brand"
            size='lg'
            onClick={() => navigate(-1)}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
            }}
            title='Go back'
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
          {errorMessage && (
            <Alert
              variant='light'
              c={theme.colors.red[8]}
              radius='lg'
              title=''
              icon={<IconInfoCircle />}
            >
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={{ base: "md" }}
            >
              <TextInput
                key='firstname'
                label='First Name'
                placeholder='John'
                {...form.getInputProps("firstname")}
                required
              />

              <TextInput
                key='lastname'
                label='Last Name'
                placeholder='Alex'
                {...form.getInputProps("lastname")}
                required
              />
            </Flex>

            <TextInput
              label='Email'
              placeholder='john@example.com'
              {...form.getInputProps("email")}
              required
            />

            {/* <NumberInput
              label='Phone Number'
              placeholder='+921234567890'
              mt='md'
              hideControls
              {...form.getInputProps("phone")}
            /> */}

            <PasswordInput
              label='Password'
              placeholder='Your password'
              mt='md'
              {...form.getInputProps("password")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              required
            />
            <PasswordRules
              password={form.values.password}
              focused={passwordFocused}
            />
            <Button
              fullWidth
              mt='xl'
              type='submit'
              loading={submitting}
            >
              Create account
            </Button>
          </form>

          <Center mt='md'>
            <Text
              size='sm'
              component={Link}
              to={PATH_AUTH.signin}
              className={classes.link}
            >
              Already have an account? Sign in
            </Text>
          </Center>
        </Surface>
      </SignUpLayout>
    </>
  );
}

export default SignupPage;
