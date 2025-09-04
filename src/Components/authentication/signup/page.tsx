"use client";

import {
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
import { IconInfoCircle } from "@tabler/icons-react";

function SignupPage() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false); 
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
    },

    validate: {
      username: (value: string) =>
        String(value).trim().length === 0 ? "user name is required" : null,
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      phone: (value: string | number) =>
        String(value).trim().length < 10 ? "Invalid phone number" : null,
      password: (value: string) =>
        value.length < 12 ? "Password must be at least 12 characters" : null,
    },
  });

const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true); 
    try {
      const resp = await api.post("/api/signup", { ...values });
      console.log(resp);
      if (resp.data.otpSent === true) {
        notifications.show({
          title: "Success",
          message: "OTP sent to your provided Email Address!",
          color: theme.colors.green[4],
          position: "top-right",
        });
      }
      navigate(PATH_AUTH.otpVerify);
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
           {errorMessage && (
                <Alert variant="light" c={theme.colors.red[8]} radius="lg" title="" icon={<IconInfoCircle/>}>
                  {errorMessage}
                </Alert>
              )}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={{ base: "md" }}
            >
              <TextInput
                label='Username'
                placeholder='John'
                {...form.getInputProps("username")}
                required
              />
              <TextInput
                label='Email'
                placeholder='john@example.com'
                {...form.getInputProps("email")}
                required
              />
            </Flex>

            <NumberInput
              label='Phone Number'
              placeholder='+921234567890'
              mt='md'
              hideControls
              {...form.getInputProps("phone")}
            />

            <PasswordInput
              label='Password'
              placeholder='Your password'
              mt='md'
              {...form.getInputProps("password")}
              required
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
