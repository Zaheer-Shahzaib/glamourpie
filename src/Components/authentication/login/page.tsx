"use client";

import {
  Alert,
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import { Link, useNavigate } from "react-router-dom";
import SignInLayout from "./layout";
import { PATH_APPS, PATH_AUTH, PATH_DASHBOARD } from "../../../routes";
import { api } from "../../../Services/api";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../../Context/useAuth";
import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";

const LINK_PROPS: TextProps = {
  className: classes.link,
};

function LoginPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();

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
      // rememberMe: (value: boolean) => setRememberMe(value),
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    console.log("Submitting form with values:", values);
    try {
      console.log("Form values:", values, "Remember Me:", rememberMe);
      const resp = await api.post("/api/signin", {
        ...values,
        isRememberMe: rememberMe,
      });
      console.log(resp);
      if (resp.status === 200) {
        login(resp.data.token, rememberMe);
        notifications.show({
          title: "Success",
          message: "Login successfully!",
          color: theme.colors.green[4],
          position: "top-right",
        });
      }
      // navigate(PATH_DASHBOARD.default);
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message;
      setErrorMessage(message || "An error occurred during login.");
    }
  };

  return (
    <>
      <>
        <title>Sign in | Runanalytic Invoice</title>
        <meta
          name='description'
          content='Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!'
        />
      </>
      <SignInLayout>
        <Title ta='center'>Welcome back!</Title>
        <Text ta='center'>Sign in to your account to continue</Text>

        <Surface
          component={Paper}
          className={classes.card}
        >
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
            <TextInput
              label='Email'
              placeholder='example@domain.com'
              required
              classNames={{ label: classes.label }}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label='Password'
              placeholder='Your password'
              required
              mt='md'
              classNames={{ label: classes.label }}
              {...form.getInputProps("password")}
            />
            <Group
              justify='space-between'
              mt='lg'
            >
              <Checkbox
                label='Remember me'
                classNames={{ label: classes.label }}
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.currentTarget.checked)}
              />
              <Text
                component={Link}
                to={PATH_AUTH.forgetPassword}
                size='sm'
                {...LINK_PROPS}
              >
                Forgot password?
              </Text>
            </Group>
            <Button
              fullWidth
              mt='xl'
              type='submit'
            >
              Sign in
            </Button>
          </form>
          <Center mt='md'>
            <Text
              fz='sm'
              ta='center'
              component={Link}
              to={PATH_AUTH.signup}
              {...LINK_PROPS}
            >
              Do not have an account yet? Create account
            </Text>
          </Center>
        </Surface>
      </SignInLayout>
    </>
  );
}

export default LoginPage;
