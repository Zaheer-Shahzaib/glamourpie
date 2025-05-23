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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./page.module.scss";
import Surface from "../../Surface/Surface";
import { Link, useNavigate } from "react-router-dom";
import SignInLayout from "./layout";
import { PATH_AUTH, PATH_DASHBOARD } from "../../../routes";

const LINK_PROPS: TextProps = {
  className: classes.link,
};

function LoginPage() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: { email: "demo@email.com", password: "Demo@123" },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: any) =>
        value && value?.length < 6
          ? "Password must include at least 6 characters"
          : null,
    },
  });

  return (
    <>
      <>
        <title>Sign in | DesignSparx</title>
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
          <form
            onSubmit={form.onSubmit(() => {
              navigate({ pathname: PATH_DASHBOARD.default });
            })}
          >
            <TextInput
              label='Email'
              placeholder='you@mantine.dev'
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
