"use client";

import {
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
import { PATH_AUTH, PATH_DASHBOARD } from "../../../routes";
import { api } from "../../../Services/api";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../../Context/useAuth";


const LINK_PROPS: TextProps = {
  className: classes.link,
};

function LoginPage() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { username: "", password: "" },
    validate: {
      username: (value: string) =>
        String(value).trim().length === 0 ? "user name is required" : null,
      password: (value: any) =>
        value && value?.length < 6
          ? "Password must include at least 6 characters"
          : null,
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    try {
      const resp = await api.post("/api/signin", { ...values });
      console.log(resp);
      if (resp.status === 200) {
        login(resp.data.token);
        notifications.show({
          title: "Success",
          message: "Login successfully!",
          color: theme.colors.green[4],
          position: "top-right",
        });
      }
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message;
      notifications.show({
        title: "Error",
        message: message,
        color: theme.colors.red[4],
        position: "top-right",
      });
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
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label='Username'
              placeholder='you@mantine.dev'
              required
              classNames={{ label: classes.label }}
              {...form.getInputProps("username")}
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
              />
              <Text
                component={Link}
                to={PATH_AUTH.passwordReset}
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
